import pandas as pd
import numpy as np
import plotly.figure_factory as ff
import plotly.graph_objects as go
import json
import random
import torch
import torch.nn as nn
import torch.optim as optim

# Define global helper functions
def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False

def calculate_historical_volatility(prices, window=7):
    returns = prices.pct_change().dropna()
    volatility = returns.rolling(window=window).std() * np.sqrt(252)
    return volatility.dropna()

def predict_volatility_json(json_path):
    class NeuralNetwork(nn.Module):
        def __init__(self, inputs, outputs):
            super(NeuralNetwork, self).__init__()
            self.layer = nn.Linear(inputs, 100)
            self.layer2 = nn.Linear(100, outputs)
            self.relu = nn.ReLU()

        def forward(self, x):
            x = self.layer(x)
            x = self.relu(x)
            x = self.layer2(x)
            return x

    class Normalize:
        def __init__(self):
            self.minx = None
            self.maxx = None

        def normalize(self, x):
            x = np.array(x)
            self.minx = min(x)
            self.maxx = max(x)
            return (x - self.minx) / (self.maxx - self.minx)

        def denormalize(self, x):
            return x * (self.maxx - self.minx) + self.minx

    def BuildTrainTest(vol):
        window = 100
        output = 30
        inputs, outputs = [], []
        for i in range(window, len(vol) - output + 1):
            inp_ = vol[i - window:i]
            out_ = vol[i:i + output]
            inputs.append(inp_)
            outputs.append(out_)
        IN = [torch.tensor(i, dtype=torch.float32) for i in inputs]
        OUT = [torch.tensor(i, dtype=torch.float32) for i in outputs]
        TEST = [torch.tensor(vol[-window:], dtype=torch.float32)]
        return torch.stack(IN), torch.stack(OUT), torch.stack(TEST)

    set_seed(42)
    historical_volatility = calculate_historical_volatility(data['Close'])
    normal = Normalize()
    nVol = normal.normalize(historical_volatility.values)

    TIN, TOUT, TTEST = BuildTrainTest(nVol)
    model = NeuralNetwork(100, 30)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    for _ in range(500):
        output = model(TIN)
        loss = criterion(output, TOUT)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    with torch.no_grad():
        testout = model(TTEST)

    nvolatility = testout.numpy()[0]
    predicted_volatility = normal.denormalize(nvolatility)
    return predicted_volatility

def volatility_distribution_with_prediction(data):
    set_seed(42)
    data['Volatility'] = calculate_historical_volatility(data['Close'])
    
    # Remove NaN or inf values from the 'Volatility' column
    data = data.replace([np.inf, -np.inf], np.nan).dropna(subset=['Volatility'])
    
    predicted_volatility = predict_volatility_json(data)

    hist_data = [data['Volatility']]
    group_labels = ['Historical Volatility']
    
    # Ensure the hist_data is clean
    hist_data = [hist[~np.isnan(hist)] for hist in hist_data]
    
    fig = ff.create_distplot(hist_data, group_labels, bin_size=0.01, show_rug=False)
    fig.update_traces(marker_color='lightgreen', line_color='red', selector=dict(type='scatter'))

    fig.add_trace(go.Scatter(
        x=predicted_volatility[:5],
        y=[0] * 5,
        mode='markers+text',
        marker=dict(color='orange', size=10),
        text=[f'P{i + 1}' for i in range(5)],
        textposition='bottom center',
        name='Predicted Volatility'
    ))

    latest_volatility = data['Volatility'].iloc[-1]
    fig.add_shape(type="line", x0=latest_volatility, y0=0, x1=latest_volatility, y1=max(fig['data'][1]['y']),
                  line=dict(color="blue", width=3, dash="dash"))
    fig.add_annotation(x=latest_volatility, y=0, xref='x', yref='y',
                       text=f'Latest<br>Volatility<br>{latest_volatility.round(2)}', showarrow=False, font=dict(color='blue'))

    fig.update_layout(
        font=dict(family='Arial', size=12, color='black'),
        xaxis=dict(title='Volatility', tickfont=dict(size=17)),
        yaxis=dict(title='Density', tickfont=dict(size=17)),
        template='plotly_white',
        title='Volatility with Predictions'
    )

    comment = f"The latest volatility is {latest_volatility:.2f}."
    return {"scatter_data": fig.to_dict()['data'], "layout": fig.to_dict()['layout'], "comment": comment}


if __name__ == "__main__":
    import sys
    
    json_path = sys.argv[1]
    data = pd.read_json(json_path)
    result = volatility_distribution_with_prediction(data)
    
    # Convert ndarray to list for JSON serialization
    def convert_ndarray_to_list(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {k: convert_ndarray_to_list(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_ndarray_to_list(i) for i in obj]
        return obj

    result = convert_ndarray_to_list(result)
    print(json.dumps(result))
