import os
import pandas as pd

# Charger les données
data = pd.read_csv('../dataset.csv')

# Sélectionner les colonnes souhaitées
columns = ['HomeTeam', 'AwayTeam', 'FTHG', 'FTAG', 'FTR', 'HTGS', 'ATGS', 'HTGC', 'ATGC', 'HTP', 'ATP', 'MW',
           'HTFormPts', 'ATFormPts', 'HTWinStreak3', 'HTWinStreak5', 'HTLossStreak3', 'HTLossStreak5',
           'ATWinStreak3', 'ATWinStreak5', 'ATLossStreak3', 'ATLossStreak5', 'HTGD', 'ATGD', 'DiffPts', 'DiffFormPts']

# Filtrer les colonnes souhaitées
data_filtered = data[columns]

# Extraire chaque 15ème ligne
data_test = data_filtered.iloc[::15].copy()

# Sauvegarder le nouveau dataset en tant que fichier CSV
data_test.to_csv('dataset_comparaison1.csv', index=False)