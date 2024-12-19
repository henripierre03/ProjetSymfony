(() => {
    const API_URL = 'http://localhost:8000/api';

    // Fonction pour créer une dette
    document.addEventListener('DOMContentLoaded', async () => {
        await loadDemandeDette(); // Charger dynamiquement les articles dans le <select>
        await listDettes();   // Charger la liste des dettes
    });

    async function fetchDemandeDette() {
        const API_URL = 'http://localhost:8000/api/demandes-dette';
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

    async function loadDemandeDette() {
        const token = localStorage.getItem('authToken');
        try {
          const response = await fetch(`${API_URL}/demandes-dette`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            const demandes = await response.json();
            const select = document.getElementById('demande-dette-select');
            select.innerHTML = ''; // Réinitialiser les options
      
            demandes.forEach((demandeDette) => {
              const option = document.createElement('option');
              option.value = demandeDette.id;
              option.textContent = `Client: ${demandeDette.clientId} - Montant: ${demandeDette.montantTotal} FCFA`;
              option.dataset.montantTotal = demandeDette.montantTotal; // Stocker le montantTotal dans un attribut data
              select.appendChild(option);
            });
          } else {
            const error = await response.json();
            alert(`Erreur : ${error.message}`);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des demandes de dette :', err);
        }
      }
      
      async function createDette() {
        const token = localStorage.getItem('authToken');
        const select = document.getElementById('demande-dette-select');
        const selectedOption = select.options[select.selectedIndex];
      
        if (!selectedOption) {
          alert('Veuillez sélectionner une demande de dette.');
          return;
        }
      
        const montantTotal = parseFloat(selectedOption.dataset.montantTotal); // Récupérer le montant total
        const montantRestant = parseFloat(document.getElementById('dette-montant-restant').value);
        const montantVerser = parseFloat(document.getElementById('dette-montant-verser').value || 0);
      
        if (!montantRestant) {
          alert('Veuillez remplir le montant restant.');
          return;
        }
      
        try {
          const response = await fetch(`${API_URL}/dettes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              montantTotal,
              montantRestant,
              montantVerser,
              demandeId: selectedOption.value, // Envoyer l'ID de la demande de dette
            }),
          });
      
          if (response.ok) {
            alert('Dette créée avec succès.');
            await listDettes(); // Recharger la liste des dettes
          } else {
            const error = await response.json();
            alert(`Erreur : ${error.message}`);
          }
        } catch (error) {
          console.error('Erreur lors de la création de la dette :', error);
          alert('Erreur lors de la création de la dette.');
        }
      }
      
      // Charger les demandes de dette et les dettes au chargement de la page
      
    
    

    // Fonction pour charger les dettes
    async function listDettes() {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/dettes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const tbody = document.querySelector('#dettes-table tbody');
                tbody.innerHTML = ''; // Réinitialiser le tableau

                data.forEach((dette) => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${dette.montantTotal}</td>
                        <td>${dette.montantRestant}</td>
                        <td>${dette.montantVerser}</td>
                        <td>
                            <button onclick="deleteDette(${dette.id})">Supprimer</button>
                            <button onclick="editDette(${dette.id})">Modifier</button>
                        </td>
                    `;

                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des dettes :', error);
            alert('Erreur lors du chargement des dettes');
        }
    }

    // Fonction pour supprimer une dette
    async function deleteDette(detteId) {
        try {
            const response = await fetch(`${API_URL}/dette/${detteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });

            if (response.ok) {
                alert('Dette supprimée avec succès');
                listDettes(); // Recharger la liste des dettes
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la dette :', error);
            alert('Erreur lors de la suppression de la dette');
        }
    }

    // Fonction pour modifier une dette (placeholder)
    function editDette(detteId) {
        alert('Fonction de modification à implémenter');
    }

    // Exposer les fonctions nécessaires au scope global
    window.loadDemandeDette = loadDemandeDette;
    window.createDette = createDette;
    window.listDettes = listDettes;
    window.deleteDette = deleteDette;
    window.editDette = editDette;
})();
