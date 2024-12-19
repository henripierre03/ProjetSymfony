(() => {
    const API_URL = 'http://localhost:8000/api'; // Remplacez par l'URL de votre backend

    // Fonction pour créer un article
    async function createArticle() {
        const token = localStorage.getItem('authToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        if (decodedToken.exp < currentTime) {
            // Si le token est expiré, rediriger vers la page de connexion
            window.location.href = './login.html';
            return;
        }



        const libelle = document.getElementById('libelle').value;
        const prix = document.getElementById('prix').value;
        const qteStock = document.getElementById('qteStock').value;

        try {
            const response = await fetch(`${API_URL}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ libelle, prix, qteStock })
            });

            if (response.ok) {
                alert('Article créé avec succès !');
                listArticles(); // Rafraîchit la liste automatiquement après ajout
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la création de l\'article :', err);
        }
    }

    // Fonction pour lister les articles
    async function listArticles() {
        const token = localStorage.getItem('authToken');
        
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes

        if (decodedToken.exp < currentTime) {
            // Si le token est expiré, rediriger vers la page de connexion
            window.location.href = './login.html';
            return;
        }
        try {
            const response = await fetch(`${API_URL}/articles`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const articles = await response.json();
                const tbody = document.querySelector('#articles-table tbody');
                tbody.innerHTML = '';

                articles.forEach(article => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${article.libelle}</td>
                        <td>${article.prix}</td>
                        <td>${article.qteStock}</td>
                        <td><button onclick="editArticle(${article.id})">Modifier</button></td>
                        <td><button onclick="deleteArticle(${article.id})">Supprimer</button></td>
                    `;

                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des articles :', err);
        }
    }

    // Fonction pour éditer un article
    async function editArticle(articleId) {
        const newLibelle = prompt("Entrez le nouveau nom de l'article :", "");
        const newPrix = prompt("Entrez le nouveau prix :", "");
        const newQteStock = prompt("Entrez la nouvelle quantité en stock :", "");

        if (!newLibelle || !newPrix || !newQteStock) {
            alert("Tous les champs sont requis !");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/articles/${articleId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ libelle: newLibelle, prix: newPrix, qteStock: newQteStock })
            });

            if (response.ok) {
                alert("Article modifié avec succès !");
                listArticles(); // Rafraîchit la liste automatiquement après modification
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la modification de l\'article :', err);
        }
    }

    // Fonction pour supprimer un article
    async function deleteArticle(articleId) {
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
        if (confirmation) {
            try {
                const response = await fetch(`${API_URL}/articles/${articleId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert("Article supprimé avec succès !");
                    listArticles(); // Rafraîchit la liste automatiquement après suppression
                } else {
                    const error = await response.json();
                    alert(`Erreur : ${error.message}`);
                }
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'article :', err);
            }
        }
    }

    // Charger la liste des articles automatiquement lors du chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
        listArticles();
    });

    // Exposer les fonctions nécessaires au scope global
    window.createArticle = createArticle;
    window.listArticles = listArticles;
    window.editArticle = editArticle;
    window.deleteArticle = deleteArticle;
})();
