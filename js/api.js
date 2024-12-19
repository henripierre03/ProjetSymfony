// api.js - Gestion des appels API dynamiques pour toutes les ressources (Client, User, Dette, etc.)

const API_BASE_URL = 'http://localhost:8000/api'; // L'URL de votre serveur

// Fonction générique pour effectuer des requêtes sur n'importe quelle ressource
async function apiRequest(resource, method = 'GET', id = null, body = null) {
    let url = `${API_BASE_URL}/${resource}`;

    // Si un `id` est fourni, on construit l'URL pour les ressources individuelles
    if (id) {
        url = `${url}/${id}`;
    }

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        return { error: error.message };
    }
}

// Fonction générique pour créer une ressource
async function create(resource, data) {
    return await apiRequest(resource, 'POST', null, data);
}

// Fonction générique pour obtenir toutes les ressources
async function getAll(resource) {
    return await apiRequest(resource, 'GET');
}


// Fonction générique pour obtenir une seule ressource par son ID
async function getOne(resource, id) {
    return await apiRequest(resource, 'GET', id);
}

// Fonction générique pour mettre à jour une ressource par son ID
async function update(resource, id, data) {
    return await apiRequest(resource, 'PUT', id, data);
}

// Fonction générique pour supprimer une ressource par son ID
async function deleteResource(resource, id) {
    return await apiRequest(resource, 'DELETE', id);
}

// Export des fonctions
export {
    create,
    getAll,
    getOne,
    update,
    deleteResource
};
