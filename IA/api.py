from flask import Flask, request, jsonify
from flask_cors import CORS
from Prediction import prediction




app = Flask(__name__)
CORS(app)


@app.route('/api', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/post', methods=['POST'])
def post_message():
    data = request.get_json()  # Récupère les données JSON de la requête POST
    team1 = data.get("selectedTeam1")
    team2 = data.get("selectedTeam2")
    result = prediction(team1, team2)
    print(result)
    return jsonify({"result": result})  # Renvoie les mêmes données en réponse


if __name__ == '__main__':
    app.run(debug=True)
    