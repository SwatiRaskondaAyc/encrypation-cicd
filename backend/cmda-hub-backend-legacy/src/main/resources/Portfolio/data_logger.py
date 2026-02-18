import logging
import os
from datetime import datetime

# Set up the logs directory
logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(logs_dir, exist_ok=True)

# Create a log file with a timestamp
timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
log_filename = os.path.join(logs_dir, f'{timestamp}.log')

# Configure the logger directly
logger = logging.getLogger('main_logger')
logger.setLevel(logging.INFO)

# Check if handlers are already set up to avoid duplicates
if not logger.handlers:
    # Set up a file handler with our timestamped log file
    file_handler = logging.FileHandler(log_filename)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(file_handler)

# Configure Flask's 'werkzeug' logger to show logs only in the terminal
flask_logger = logging.getLogger('werkzeug')
flask_logger.setLevel(logging.INFO)
flask_logger.propagate = False
