import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Charger les données
data = pd.read_csv('dataset.csv')

# Sélectionner les fonctionnalités
features = ['FTHG', 'FTAG', 'HTGS', 'ATGS', 'HTGC'
            , 'ATGC', 'HTP', 'ATP', 'MW', 'HTFormPts', 'ATFormPts'
            , 'HTWinStreak3', 'HTWinStreak5', 'HTLossStreak3', 'HTLossStreak5'
            , 'ATWinStreak3', 'ATWinStreak5', 'ATLossStreak3', 'ATLossStreak5'
            , 'HTGD', 'ATGD', 'DiffPts', 'DiffFormPts']

# Remplir les valeurs manquantes avec 0 (si nécessaire)
data.fillna(0, inplace=True)

# Initialiser les modèles de régression linéaire
models = {feature: LinearRegression() for feature in features}
scalers = {feature: StandardScaler() for feature in features}

# Entraîner un modèle pour chaque fonctionnalité
for feature in features:
    X = data[features]
    y = data[feature]

    # Supprimer la fonctionnalité actuelle de X
    X = X.drop(columns=[feature])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    #normaliser
    X_train_scaled = scalers[feature].fit_transform(X_train)
    X_test_scaled = scalers[feature].transform(X_test)

    models[feature].fit(X_train_scaled, y_train)

    y_pred = models[feature].predict(X_test_scaled)
    mse = np.mean((y_pred - y_test) ** 2)
    print(f"MSE pour {feature}: {mse}")

# Prédire les fonctionnalités pour un match spécifique
home_team = input("Enter the Home Team: ")
away_team = input("Enter the Away Team: ")

# Filtrer les données pour les équipes spécifiques
home_team_data = data[data['HomeTeam'] == home_team].tail(1)
away_team_data = data[data['AwayTeam'] == away_team].tail(1)

if not home_team_data.empty and not away_team_data.empty:
    # Utiliser les données de la dernière rencontre pour faire des prédictions
    combined_data = pd.concat([home_team_data, away_team_data], axis=0)

    # Filtrer uniquement les colonnes numériques pour le calcul de la moyenne
    combined_data_numeric = combined_data[features].mean(axis=0)

    # Créer une DataFrame temporaire pour contenir les valeurs moyennes des caractéristiques / .T transpose la matrice pour obtenir une ligne unique de valeurs moyennes
    combined_data_df = pd.DataFrame(combined_data_numeric).T

    predicted_features = {}
    for feature in features:
        combined_data_scaled = scalers[feature].transform(combined_data_df.drop(columns=[feature]))
        predicted_features[feature] = models[feature].predict(combined_data_scaled)[0]

    # Créer un DataFrame avec les résultats
    results = pd.DataFrame({
        'HomeTeam': [home_team],
        'AwayTeam': [away_team],
        'FTHG': [predicted_features['FTHG']],
        'FTAG': [predicted_features['FTAG']],
        'FTR': [np.nan],  # La colonne FTR est initialisée avec NaN
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

    # Enregistrer les résultats dans un fichier CSV
    results.to_csv('predicted_match_features.csv', index=False)
    print("Predicted features saved to 'predicted_match_features.csv'")
else:
    print("Les données pour les équipes spécifiées ne sont pas disponibles dans le dataset.")
#mse = mean squared error