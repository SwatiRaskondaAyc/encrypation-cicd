import os
import re
import numpy as np
import pandas as pd
from dateutil import parser
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# from nselib import capital_market




class PUtils:
    @staticmethod
    def get_nse_scrips_df():
        ''' Provides a Data Frame with Scrip Name and their respective Symbols and a list with normalized names of the Scrips'''
        # nse_scrips_df = capital_market.equity_list()
        
        # nse_scrips_df = pd.read_csv(r'data/portf_data/new_portfolio_equity_list.csv')
        nse_scrips_df = pd.read_csv(r'src/main/resources/data/portf_data/new_portfolio_equity_list.csv')
        
        # nse_scrips_df.loc[nse_scrips_df.SYMBOL=='LTFOODS', 'SYMBOL'] = 'LTFOODS'
        # nse_scrips_df.loc[nse_scrips_df.SYMBOL=='WELSPUNLIV', 'SYMBOL'] = 'WELSPUNIND'

        nse_ScripName_list = nse_scrips_df['Name of Company'].apply(PUtils.normalize_ScripNames).to_list()
        
        return nse_scrips_df, nse_ScripName_list

    
    @staticmethod
    def normalize_ScripNames(text, keep_nums=True):
        if keep_nums:
            text = re.sub(r'[^a-zA-Z0-9\s]', '', text) # remove special characters and keep numbers
        else: text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove special characters and numbers
        text = text.lower() # lowering the text
        
        char_to_replace = {'ltd':'','limited':''}
        for key, value in char_to_replace.items():
            # Replace key character with value character in string
            text = text.replace(key, value)
        
        normalized_text = ' '.join(text.split()) # remove whitespace
        return normalized_text


    @staticmethod
    def search_scrip_index_by_similarity(normalized_ScripName, nse_ScripName_list):   
        cos_sim_scores = []
        for scrip_name in nse_ScripName_list:
            
            # Calculate Cosine Similarity
            vectorizer = CountVectorizer().fit_transform([normalized_ScripName, scrip_name])
            vectors = vectorizer.toarray()
            
            cosine_sim = cosine_similarity(vectors)
            cosine_similarity_score = cosine_sim[0][1]
            cos_sim_scores.append(cosine_similarity_score)

        return np.argmax(cos_sim_scores)
    
    @staticmethod
    def parse_date(date_str):
        try:
            return parser.parse(date_str)
        except ValueError:
            return pd.NaT






