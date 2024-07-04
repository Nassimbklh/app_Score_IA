
import pandas as pd

# Chargement des données depuis un fichier CSV
data = pd.read_csv('dataset.csv')

# Sélection des noms des colonnes numériques
noms_colonnes_numeriques = data.select_dtypes(include=['number']).columns

print( noms_colonnes_numeriques.tolist())