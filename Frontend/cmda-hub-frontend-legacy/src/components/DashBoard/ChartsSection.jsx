// import React from 'react'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts'


// const sampleLineData = [
//   { name: 'Jan', uv: 400, pv: 240 },
//   { name: 'Feb', uv: 300, pv: 139 },
//   { name: 'Mar', uv: 200, pv: 980 },
//   { name: 'Apr', uv: 278, pv: 390 },
//   { name: 'May', uv: 189, pv: 480 },
//   { name: 'Jun', uv: 239, pv: 380 },
//   { name: 'Jul', uv: 349, pv: 430 },
// ]

// const sampleBarData = [
//   { name: 'Page A', uv: 4000, pv: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398 },
//   { name: 'Page C', uv: 2000, pv: 9800 },
//   { name: 'Page D', uv: 2780, pv: 3908 },
//   { name: 'Page E', uv: 1890, pv: 4800 },
// ]

// const ChartsSection = () => {
//   return (
//     <div style={styles.chartsContainer}>
//       {/* Line Chart */}
//       <div style={styles.chartWrapper}>
//         <h3>Monthly Trends</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={sampleLineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
//             <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Bar Chart */}
//       <div style={styles.chartWrapper}>
//         <h3>Page Views</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={sampleBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="pv" fill="#8884d8" />
//             <Bar dataKey="uv" fill="#82ca9d" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//        {/* Line Chart */}
//        <div style={styles.chartWrapper}>
//         <h3>Monthly Trends</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={sampleLineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
//             <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   chartsContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '2rem',
//   },
//   chartWrapper: {
//     flex: '1 1 300px',
//     backgroundColor: '#fff',
//     borderRadius: '6px',
//     padding: '20px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     minWidth: '300px',
//   },
// }

// export default ChartsSection



import React from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Bar, BarChart, PieChart, Pie, Cell 
} from 'recharts'

// Sample Line Chart Data
const sampleLineData = [
  { name: 'Jan', uv: 400, pv: 240 },
  { name: 'Feb', uv: 300, pv: 139 },
  { name: 'Mar', uv: 200, pv: 980 },
  { name: 'Apr', uv: 278, pv: 390 },
  { name: 'May', uv: 189, pv: 480 },
  { name: 'Jun', uv: 239, pv: 380 },
  { name: 'Jul', uv: 349, pv: 430 },
]

// Sample Bar Chart Data
const sampleBarData = [
  { name: 'Page A', uv: 4000, pv: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398 },
  { name: 'Page C', uv: 2000, pv: 9800 },
  { name: 'Page D', uv: 2780, pv: 3908 },
  { name: 'Page E', uv: 1890, pv: 4800 },
]

// Sample Pie Chart Data
const samplePieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50']

const ChartsSection = () => {
  return (
    <div style={styles.chartsContainer}>
      {/* Line Chart */}
      <div style={styles.chartWrapper}>
        <h3>Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sampleLineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div style={styles.chartWrapper}>
        <h3>Page Views</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sampleBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={styles.chartWrapper}>
        <h3>Group Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={samplePieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              dataKey="value"
            >
              {samplePieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Another Line Chart */}
      {/* <div style={styles.chartWrapper}>
        <h3>Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sampleLineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  )
}

const styles = {
  chartsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  chartWrapper: {
    flex: '1 1 300px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    minWidth: '300px',
  },
}

export default ChartsSection
