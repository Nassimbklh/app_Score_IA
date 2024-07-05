import pandas as pd
import numpy as np
import os
from datetime import datetime
import pickle
import joblib
import csv

# Charger les données
data = pd.read_csv(r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Données/dataset.csv')
team_dict = pd.read_csv(r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Données/team_dict.csv')
#match = pd.read_csv('Données/predicted_Chelsea_Arsenal_20240628.csv')

# Remplir les valeurs manquantes avec 0 (si nécessaire)
#data.fillna(0, inplace=True)

# Charger les modèles
random_forest = joblib.load(r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Modèle/Random_forest.sav')

with open(r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Modèles/models.pkl', 'rb') as file:
    linear_models = pickle.load(file)

with open(r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Modèles/scalers.pkl', 'rb') as file:
    linear_scalers = pickle.load(file)

team_ids = team_dict.set_index('Team')['ID'].to_dict()

# Sélectionner les fonctionnalités d'apprentissage du modèle
features = ['FTHG', 'FTAG', 'HTGS', 'ATGS', 'HTGC'
            , 'ATGC', 'HTP', 'ATP', 'MW', 'HTFormPts', 'ATFormPts'
            , 'HTWinStreak3', 'HTWinStreak5', 'HTLossStreak3', 'HTLossStreak5'
            , 'ATWinStreak3', 'ATWinStreak5', 'ATLossStreak3', 'ATLossStreak5'
            , 'HTGD', 'ATGD', 'DiffPts', 'DiffFormPts']

# Saisir les équipes
teams = ["Man City", "Arsenal", "Liverpool", "Aston Villa", "Tottenham", 
         "Chelsea", "Newcastle", "Man United", "West Ham", "Crystal Palace", 
         "Brighton", "Bournemouth", "Fulham", "Wolves", "Everton", 
         "Brentford", "Nottm Forrest", "Luton Town", "Burnley", "Sheffield United"]

# Parcours de chaque équipe pour créer les paires de matchs
for i in range(len(teams)):
    home_team = teams[i]
    for j in range(len(teams)):
        if i != j:  # Éviter les matchs d'une équipe contre elle-même
            away_team = teams[j]

            # Filtrer les données pour les équipes spécifiques
            #filtered_data = data.loc[np.where((data['HomeTeam'] == home_team) | (data['AwayTeam'] == away_team))] #data.loc[np.where((data['HomeTeam'] == home_team) & (data['AwayTeam'] == away_team))]
            filtered_data = data.loc[np.where((data['HomeTeam'] == home_team) & (data['AwayTeam'] == away_team) | (data['HomeTeam'] == away_team) & (data['AwayTeam'] == home_team))]
                #home_team_data = data[data['HomeTeam'] == home_team].tail(1)
                #away_team_data = data[data['AwayTeam'] == away_team].tail(1)
                #filtered_data = pd.concat([home_team_data, away_team_data], axis=0)

            if not filtered_data.empty and home_team in filtered_data['HomeTeam'].unique() and away_team in filtered_data['AwayTeam'].unique():

                # Filtrer uniquement les colonnes numériques pour le calcul de la moyenne
                combined_data_numeric = filtered_data[features].mean(axis=0)

                # Créer une DataFrame temporaire pour contenir les valeurs moyennes des caractéristiques / .T transpose la matrice pour obtenir une ligne unique de valeurs moyennes
                combined_data_df = pd.DataFrame(combined_data_numeric).T

                predicted_features = {}
                for feature in features:
                    combined_data_scaled = linear_scalers[feature].transform(combined_data_df.drop(columns=[feature]))
                    predicted_features[feature] = linear_models[feature].predict(combined_data_scaled)[0]

                # Créer un DataFrame avec les résultats
                results = pd.DataFrame({
                    'HomeTeam': [home_team],
                    'AwayTeam': [away_team],
                    'FTHG': [predicted_features['FTHG']],
                    'FTAG': [predicted_features['FTAG']],
                    'FTR': [np.nan],  # La colonne FTR est initialisée avec NaN pour être prédite ensuite
                    'HTGS': [predicted_features['HTGS']],
                    'ATGS': [predicted_features['ATGS']],
                    'HTGC': [predicted_features['HTGC']],
                    'ATGC': [predicted_features['ATGC']],
                    'HTP': [predicted_features['HTP']],
                    'ATP': [predicted_features['ATP']],
                    'MW': [predicted_features['MW']],
                    'HTFormPts': [predicted_features['HTFormPts']],
                    'ATFormPts': [predicted_features['ATFormPts']],
                    'HTWinStreak3': [predicted_features['HTWinStreak3']],
                    'HTWinStreak5': [predicted_features['HTWinStreak5']],
                    'HTLossStreak3': [predicted_features['HTLossStreak3']],
                    'HTLossStreak5': [predicted_features['HTLossStreak5']],
                    'ATWinStreak3': [predicted_features['ATWinStreak3']],
                    'ATWinStreak5': [predicted_features['ATWinStreak5']],
                    'ATLossStreak3': [predicted_features['ATLossStreak3']],
                    'ATLossStreak5': [predicted_features['ATLossStreak5']],
                    'HTGD': [predicted_features['HTGD']],
                    'ATGD': [predicted_features['ATGD']],
                    'DiffPts': [predicted_features['DiffPts']],
                    'DiffFormPts': [predicted_features['DiffFormPts']]
                })

                # Enregistrer les résultats dans un fichier CSV avec date et noms d'équipe
                current_date = datetime.now().strftime("%Y%m%d")

                # Spécifier le chemin où vous souhaitez enregistrer le fichier CSV
                output_path = r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/Prédictions_à_prédire'
                file_name = f'predicted_{home_team}_{away_team}_{current_date}.csv'
                file_path = os.path.join(output_path, file_name)

                results.to_csv(file_path, index=False)
                print(f"Les prédictions du match sont stockées dans 'predicted_{home_team}_{away_team}_{current_date}.csv'")

                def encoding_teams(df):
                    # Convertir les noms d'équipe en IDs en utilisant le dictionnaire team_ids
                    df['HomeTeam'] = df['HomeTeam'].replace(team_ids).astype('int32')
                    df['AwayTeam'] = df['AwayTeam'].replace(team_ids).astype('int32')

                    return df
                
                # Mettre des ids aux équipes
                datatest = encoding_teams(results)

                X_test = datatest[['HomeTeam', 'AwayTeam'] + features]
                y_test = datatest['FTR']

                # Prédire si l'équipe à domicile gagne ou non
                predicted_results = random_forest.predict(X_test)

                # Chemin du fichier CSV pour stocker les résultats
                output_results_path = r'/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/predicted_match_results.csv'

                # Ouvrir le fichier en mode 'a' pour ajouter des lignes sans écraser le contenu existant
                with open(output_results_path, mode='a', newline='') as file:
                    writer = csv.writer(file)
                    
                    # Écrire l'en-tête si le fichier est vide (ou à une autre condition, comme vérifier le contenu)
                    if file.tell() == 0:
                        writer.writerow(['HomeTeam', 'AwayTeam', 'Prediction'])
                    else:
                        writer.writerow([home_team, away_team, predicted_results[0]])   
            else:
                print("Les données pour les équipes spécifiées ne sont pas disponibles dans le dataset.")

                # Chemin du fichier CSV pour stocker les résultats
                output_results_path = r'C:/Users/nassim/Documents/ESGI/4_eme_Années/semestre_2/PA/app_Score_IA/Code Python/predicted_match_results.csv'

                # Ouvrir le fichier en mode 'a' pour ajouter des lignes sans écraser le contenu existant
                with open(output_results_path, mode='a', newline='') as file:
                    writer = csv.writer(file)
                    
                    # Écrire l'en-tête si le fichier est vide (ou à une autre condition, comme vérifier le contenu)
                    if file.tell() == 0:
                        writer.writerow(['HomeTeam', 'AwayTeam', 'Prediction'])
                    else:
                        writer.writerow([home_team, away_team, 'NA'])