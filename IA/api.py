from flask import Flask, request, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)


@app.route('/api', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/post', methods=['POST'])
def post_message():
    data = request.get_json()  # Récupère les données JSON de la requête POST
    print(data)  # Affiche les données dans la console
    print(data.get("selectedTeam1")) 
    print(data.get("selectedTeam2"))
    return jsonify(data)  # Renvoie les mêmes données en réponse


if __name__ == '__main__':
    app.run(debug=True)