import pandas as pd

df = pd.read_csv('dataset.csv')

#23/12/02 en 23/12/2002
#def corriger_date(date):
def corriger_date(date):
    if len(date) == 8:
        return date[:6] + '20' + date[6:]
    return date

df['Date'] = df['Date'].apply(corriger_date)

df.to_csv('dataset.csv', index=False)


