import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import LabelEncoder

def prediction(team1, team2):
        
    team_dict = pd.read_csv('team_dict.csv')
    model = joblib.load('Random_forest.sav')
    match = pd.read_csv('predicted_match_features.csv')
    # Dictionnaire des IDs d'équipe
    team_ids = team_dict.set_index('Team')['ID'].to_dict()

    def preprocess_data(df, labelencoded=False):
        # Convertir les noms d'équipe en IDs en utilisant le dictionnaire team_ids
        df['HomeTeam'] = df['HomeTeam'].replace(team_ids).astype('int32')
        df['AwayTeam'] = df['AwayTeam'].replace(team_ids).astype('int32')

        if not labelencoded:
            le = LabelEncoder()
            le.classes_ = np.array(['NH', 'H'])
            df['FTR'] = le.transform(df['FTR'])
        return df

    # Prétraiter les données
    datatest = preprocess_data(match, labelencoded=True)


    features = ['HomeTeam', 'AwayTeam', 'FTHG', 'FTAG', 'HTGS', 'ATGS', 'HTGC'
                , 'ATGC', 'HTP', 'ATP', 'MW', 'HTFormPts', 'ATFormPts'
                , 'HTWinStreak3', 'HTWinStreak5', 'HTLossStreak3', 'HTLossStreak5'
                , 'ATWinStreak3', 'ATWinStreak5', 'ATLossStreak3', 'ATLossStreak5'
                , 'HTGD', 'ATGD', 'DiffPts', 'DiffFormPts']


    X_test = match[features]
    y_test = match['FTR']
    #print(match['FTR'])

    predicted_results = model.predict(X_test)
    # Afficher le nom des équipes prédites et le résultat de la prédiction
    # for i, (home_team_id, away_team_id, prediction) in enumerate(zip(X_test['HomeTeam'], X_test['AwayTeam'], predicted_results)):
    #     home_team_name = list(team_ids.keys())[list(team_ids.values()).index(home_team_id)]
    #     away_team_name = list(team_ids.keys())[list(team_ids.values()).index(away_team_id)]
        
    #     # Afficher le nom des équipes prédites et le résultat de la prédiction
    #     print(f"Match: {home_team_name} vs {away_team_name}, Prediction: {prediction}")

    return 1 if predicted_results[0] == 1 else 0
