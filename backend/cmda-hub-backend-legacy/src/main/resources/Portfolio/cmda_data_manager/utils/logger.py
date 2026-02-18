import logging

class LoggingHandler:
    @staticmethod
    def setup_logger():
        logger = logging.getLogger('DataUpdaterLogger')
        logger.setLevel(logging.INFO)
        handler = logging.FileHandler('data_updater.log')
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        logger.addHandler(handler)
        return logger
