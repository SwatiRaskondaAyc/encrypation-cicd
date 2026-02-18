import os
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import json
import re
from dateutil import parser
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity



class DashPlot:
        
    @staticmethod
    def get_nse_scrips_df(nse_scrips_df):
        ''' Provides a Data Frame with Scrip Name and their respective Symbols and a list with normalized names of the Scrips'''
        # nse_scrips_df = capital_market.equity_list()
        # nse_scrips_df = pd.read_csv(r'data/new_portfolio_equity_list.csv')
        nse_scrips_df.loc[nse_scrips_df.Symbol=='LTFOODS', 'Symbol'] = 'DAAWAT'
        # nse_scrips_df.loc[nse_scrips_df.Symbol=='WELSPUNLIV', 'Symbol'] = 'WELSPUNIND'

        nse_ScripName_list = nse_scrips_df['Name of Company'].apply(DashPlot.normalize_ScripNames).to_list()

        return nse_ScripName_list


    @staticmethod
    def normalize_ScripNames(text, keep_nums=True):
        if keep_nums:
            text = re.sub(r'[^a-zA-Z0-9\s]', '', text) # remove special characters and keep numbers
        else: text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove special characters and numbers
        text = text.lower() # lowering the text

        char_to_replace = {'ltd':'','limited':'','eng':'','engineering':''}
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
    def create_data_for_plot(portfolio_result_df):

        portfolio_result_df.reset_index(inplace=True)

        nse_scrip_list = pd.read_csv("data/nse_sector_list.csv")
        nse_scrip_list.drop(columns='Unnamed: 0',inplace=True)

        # Normalize the scrip names in both DataFrames
        nse_scrip_list['Normalized_ScripName'] = nse_scrip_list['Name of Company'].apply(DashPlot.normalize_ScripNames)
        portfolio_result_df['Normalized_ScripName'] = portfolio_result_df['Scrip'].apply(DashPlot.normalize_ScripNames)

        # Create a dictionary mapping from normalized name to symbol
        name_to_symbol = dict(zip(nse_scrip_list['Normalized_ScripName'], nse_scrip_list['Symbol']))

        # Map the normalized scrip names to symbols
        portfolio_result_df['Symbol'] = portfolio_result_df['Normalized_ScripName'].map(name_to_symbol)

        # Check for any missing symbols
        missing_symbols = portfolio_result_df[portfolio_result_df['Symbol'].isna()]

        if not missing_symbols.empty:
            print("These scrips could not be matched:")
            # print(missing_symbols[['Scrip', 'Normalized_ScripName']])

        # Vectorizer for NSE scrip names
        vectorizer = CountVectorizer().fit(nse_scrip_list['Normalized_ScripName'])
        nse_vectors = vectorizer.transform(nse_scrip_list['Normalized_ScripName']).toarray()


        def search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer):   
            vector = vectorizer.transform([normalized_ScripName]).toarray()
            cos_sim_scores = cosine_similarity(vector, nse_vectors)[0]
            return np.argmax(cos_sim_scores), np.max(cos_sim_scores)


        # Map the normalized scrip names to symbols
        portfolio_result_df['Symbol'] = portfolio_result_df['Normalized_ScripName'].map(name_to_symbol)

        # Check for any missing symbols
        missing_symbols = portfolio_result_df[portfolio_result_df['Symbol'].isna()]

        # For unmatched symbols, use cosine similarity
        for i, row in missing_symbols.iterrows():
            normalized_ScripName = row['Normalized_ScripName']
            scrip_index, similarity_score = search_scrip_index_by_similarity(normalized_ScripName, nse_vectors, vectorizer)
            
            if similarity_score > 0.8:  # Threshold to consider a valid match
                matched_symbol = nse_scrip_list.iloc[scrip_index]['Symbol']
                portfolio_result_df.at[i, 'Symbol'] = matched_symbol

        # Check again for any missing symbols after applying cosine similarity
        missing_symbols = portfolio_result_df[portfolio_result_df['Symbol'].isna()]

        if not missing_symbols.empty:
            print("These scrips could not be matched after applying cosine similarity:")
            # print(missing_symbols[['Scrip', 'Normalized_ScripName']])


        portfolio_result_df['Symbol'].fillna('IREDA',inplace=True)



        # Create a dictionary mapping from symbol to sector
        symbol_to_sector = dict(zip(nse_scrip_list['Symbol'], nse_scrip_list['Sector']))


        # Add the Sector column to portfolio_result_df
        portfolio_result_df['Sector'] = portfolio_result_df['Symbol'].map(symbol_to_sector)

        # Check for any missing sectors
        missing_sectors = portfolio_result_df[portfolio_result_df['Sector'].isna()]

        if not missing_sectors.empty:
            print("These symbols could not be matched to any sector:")
            # print(missing_sectors[['Symbol', 'Scrip']])



        symbol_to_industry = dict(zip(nse_scrip_list['Symbol'], nse_scrip_list['Industry']))


        # Add the Sector column to portfolio_result_df
        portfolio_result_df['Industry'] = portfolio_result_df['Symbol'].map(symbol_to_industry)

        # Check for any missing sectors
        missing_industry = portfolio_result_df[portfolio_result_df['Industry'].isna()]

        if not missing_industry.empty:
            print("These symbols could not be matched to any industry:")
            # print(missing_industry[['Symbol', 'Scrip']])

        portfolio_result_df['Sector'].fillna('Other',inplace=True)
        portfolio_result_df['Industry'].fillna('Other',inplace=True)


        return portfolio_result_df







    
