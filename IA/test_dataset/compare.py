import pandas as pd

# Charger les fichiers CSV
predicted_df = pd.read_csv('dataset_test_with_predictions.csv')
actual_df = pd.read_csv('dataset_comparaison1.csv')

# S'assurer que les deux fichiers ont les mêmes colonnes d'équipe et de résultat final (FTR)
predicted_df = predicted_df[['HomeTeam', 'AwayTeam', 'FTR']]
actual_df = actual_df[['HomeTeam', 'AwayTeam', 'FTR']]

# Initialiser une liste pour stocker les résultats de comparaison ligne par ligne
comparison_results = []

# Comparer les résultats ligne par ligne
for index, row in predicted_df.iterrows():
    home_team_pred = row['HomeTeam']
    away_team_pred = row['AwayTeam']
    ftr_pred = row['FTR']

    home_team_actual = actual_df.at[index, 'HomeTeam']
    away_team_actual = actual_df.at[index, 'AwayTeam']
    ftr_actual = actual_df.at[index, 'FTR']

    # Vérifier si les équipes et les résultats correspondent
    if (home_team_pred == home_team_actual) and (away_team_pred == away_team_actual) and (ftr_pred == ftr_actual):
        comparison_results.append(1)  # Correct prediction
    else:
        comparison_results.append(0)  # Incorrect prediction

# Calculer l'accuracy
accuracy = sum(comparison_results) / len(comparison_results)

# Ajouter les résultats de comparaison au DataFrame des prédictions
predicted_df['Correct'] = comparison_results

# Sauvegarder les résultats de comparaison dans un nouveau fichier CSV
predicted_df.to_csv('dataset_test_comparison.csv', index=False)

print(f"Accuracy: {accuracy * 100:.2f}%")
print("Les résultats de la comparaison ont été sauvegardés dans 'dataset_test_comparison.csv'")
