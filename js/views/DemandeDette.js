(() => {
    const API_URL = 'http://localhost:8000/api'; // URL de votre API backend

    document.addEventListener('DOMContentLoaded', async () => {
        await loadArticles(); // Charger dynamiquement les articles dans le <select>
        await listDemandesDette();   // Charger la liste des dettes
    });
    // Fonction pour récupérer la liste des clients
    async function fetchClients() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(`${API_URL}/clients`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                return await response.json(); // Retourne la liste des clients
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des clients :', err);
        }

        return [];
    }


    async function fetchArticles() {
        const API_URL = 'http://localhost:8000/api/articles';
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json(); // Retourne la liste des articles
            } else {
                const error = await response.json();
                console.error('Erreur API Articles :', error.message);
                alert('Erreur lors de la récupération des articles.');
            }
        } catch (error) {
            console.error('Erreur réseau pour fetchArticles :', error);
            alert('Erreur réseau pour la récupération des articles.');
        }

        return [];
    }

    async function loadArticles() {
        const articles = await fetchArticles();
        console.log("articles", articles);

        const articleSelectContainer = document.getElementById('article-select');
        
        // Réinitialiser le conteneur pour éviter les doublons
        articleSelectContainer.innerHTML = '';

        // Ajouter dynamiquement les cases à cocher pour chaque article
        articles.forEach(article => {
            const div = document.createElement('div');
            div.classList.add('checkbox-item');
            
            // Créer l'input checkbox
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `article-${article.id}`;
            input.value = article.id;
            input.dataset.price = article.price; // Ajouter le prix de l'article dans un attribut data

            // Créer le label pour l'article
            const label = document.createElement('label');
            label.setAttribute('for', input.id);
            label.innerText = `${article.libelle} - ${article.price} FCFA`;

            // Ajouter l'input et le label à la div
            div.appendChild(input);
            div.appendChild(label);

            // Ajouter la div au conteneur
            articleSelectContainer.appendChild(div);

            // Ajouter un événement pour recalculer le montant total quand un article est sélectionné/désélectionné
            input.addEventListener('change', updateMontantTotal);
        });
    }

    // Fonction pour créer une demande de dette
    async function createDemandeDette() {
        const token = localStorage.getItem('authToken');
        const selectedArticles = document.getElementById('article-select').querySelectorAll('input[type="checkbox"]:checked');
        const date = document.getElementById('date').value;
        const etat = document.getElementById('etat').value;

        if (!clientId || !montantTotal || !date) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        let montantTotal = 0;
    
        // Parcours des articles sélectionnés pour calculer le montant total
        selectedArticles.forEach(checkbox => {
            const articleMontant = parseFloat(checkbox.getAttribute('data-montant')) || 0; // Récupérer le montant de chaque article
            montantTotal += articleMontant; // Ajout du montant de l'article à `montantTotal`
        });

        try {
            const response = await fetch(`${API_URL}/demandes-dette`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({montantTotal: parseFloat(montantTotal), date, etat: Boolean(etat) })
            });

            if (response.ok) {
                alert('Demande de dette créée avec succès !');
                listDemandesDette(); // Rafraîchir la liste des demandes de dette
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la création de la demande de dette :', err);
        }
    }

    // Fonction pour lister les demandes de dette
    async function listDemandesDette() {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_URL}/demandes-dette`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const demandes = await response.json();
                const tbody = document.querySelector('#demandes-dette-table tbody');
                tbody.innerHTML = '';

                demandes.forEach(demande => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${demande.client.surname}</td>
                        <td>${demande.montantTotal}</td>
                        <td>${demande.date}</td>
                        <td>${demande.etat ? 'Réglée' : 'Non réglée'}</td>
                        <td>
                            <button onclick="editDemandeDette(${demande.id})">Modifier</button>
                            <button onclick="deleteDemandeDette(${demande.id})">Supprimer</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des demandes de dette :', err);
        }
    }

    // Fonction pour supprimer une demande de dette
    async function deleteDemandeDette(detteId) {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/demandes-dette/${detteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Demande de dette supprimée avec succès !');
                listDemandesDette(); // Rafraîchir la liste des demandes de dette
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la suppression de la demande de dette :', err);
        }
    }

    // Fonction pour éditer une demande de dette
    async function editDemandeDette(detteId) {
        const newMontantTotal = prompt("Entrez le nouveau montant total :", "");
        const newEtat = prompt("Entrez l'état (0 pour non réglée, 1 pour réglée) :", "");

        if (!newMontantTotal || newEtat === null) {
            alert("Tous les champs sont requis !");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/demandes-dette/${detteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ montantTotal: parseFloat(newMontantTotal), etat: Boolean(newEtat) })
            });

            if (response.ok) {
                alert("Demande de dette modifiée avec succès !");
                listDemandesDette(); // Rafraîchir la liste après modification
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la modification de la demande de dette :', err);
        }
    }

    // Charger les clients dans le select lors du chargement de la page
    document.addEventListener('DOMContentLoaded', async () => {
        const clients = await fetchClients();
        const clientSelect = document.getElementById('client-select');

        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.surname;
            clientSelect.appendChild(option);
        });

        listDemandesDette(); // Charger la liste des demandes de dette
    });

    // Exposer les fonctions nécessaires au scope global
    window.createDemandeDette = createDemandeDette;
    window.listDemandesDette = listDemandesDette;
    window.deleteDemandeDette = deleteDemandeDette;
    window.editDemandeDette = editDemandeDette;
    window.loadArticles = loadArticles;
})();
