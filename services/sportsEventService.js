// services/sportsEventService.js
import axios from 'axios';

// Ici, vous pouvez importer une bibliothèque pour effectuer des requêtes HTTP, comme axios
// import axios from 'axios';
export const getTeams = async () => {
    const response = await axios.get('/teams.json');
    return response.data; 
};

export const getSportsEvents = async () => {
    // Ici, vous pouvez effectuer une requête HTTP pour récupérer les données des événements sportifs
    // const response = await axios.get('URL_DE_VOTRE_API');

    // Pour l'instant, nous allons utiliser des données en dur
    const response = await axios.get('/sportsEvents.json');

    // Retournez les données de la réponse
    return response.data;
};

export const sendPrediction = async (data) => {
    // Ici, vous pouvez effectuer une requête HTTP pour envoyer les prédictions
    try{


        const response = await axios.post(`${API_HOST}/api/post`, data, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
        return response.data;
    }
    catch(error){
        console.log(error);
    }
};
