// services/sportsEventService.js
import axios from 'axios';

// Ici, vous pouvez importer une bibliothèque pour effectuer des requêtes HTTP, comme axios
// import axios from 'axios';

export const getSportsEvents = async () => {
    // Ici, vous pouvez effectuer une requête HTTP pour récupérer les données des événements sportifs
    // const response = await axios.get('URL_DE_VOTRE_API');

    // Pour l'instant, nous allons utiliser des données en dur
    const response = await axios.get('/sportsEvents.json');

    // Retournez les données de la réponse
    return response.data;
};