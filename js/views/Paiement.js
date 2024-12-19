(() => {
    const API_URL = 'http://localhost:8000/api';

    // Charger les dettes au chargement de la page
    document.addEventListener('DOMContentLoaded', async () => {
        await loadDettesDropdown(); // Charger la liste des dettes dans le dropdown
        await listPaiements();     // Charger la liste des paiements
    });

    // Fonction pour récupérer les dettes depuis l'API
    async function fetchDettes() {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_URL}/dettes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                return await response.json(); // Retourne la liste des dettes
            } else {
                const error = await response.json();
                console.error('Erreur API Dettes :', error.message);
                alert('Erreur lors de la récupération des dettes.');
            }
        } catch (error) {
            console.error('Erreur réseau pour fetchDettes :', error);
            alert('Erreur réseau pour la récupération des dettes.');
        }

        return [];
    }

    // Fonction pour charger les dettes dans un dropdown
    async function loadDettesDropdown() {
        const dettes = await fetchDettes();
        console.log("dettes", dettes);

        const detteDropdown = document.getElementById('paiement-dette-id');
        detteDropdown.innerHTML = ''; // Réinitialiser le contenu du dropdown

        // Ajouter une option par défaut
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionnez une dette';
        detteDropdown.appendChild(defaultOption);

        // Ajouter les dettes comme options dans le dropdown
        dettes.forEach(dette => {
            const option = document.createElement('option');
            option.value = dette.id;
            option.textContent = `Dette ID: ${dette.id} - Montant Restant: ${dette.montantRestant} FCFA`;
            detteDropdown.appendChild(option);
        });
    }

    // Fonction pour créer un paiement
    async function createPaiement() {
        const token = localStorage.getItem('authToken');
        const date = document.getElementById('paiement-date').value;
        const montantPayer = document.getElementById('paiement-montant-payer').value;
        const detteId = document.getElementById('paiement-dette-id').value;

        if (!montantPayer || !detteId) {
            alert('Veuillez remplir les champs obligatoires');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/paiements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: date || null,
                    montantPayer: parseFloat(montantPayer),
                    detteId: parseInt(detteId),
                }),
            });

            if (response.ok) {
                alert('Paiement créé avec succès');
                await listPaiements(); // Recharger la liste des paiements
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la création du paiement :', error);
            alert('Erreur lors de la création du paiement');
        }
    }

    // Fonction pour charger les paiements
    async function listPaiements() {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/paiements`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const paiements = await response.json();
                const tbody = document.querySelector('#paiements-table tbody');
                tbody.innerHTML = ''; // Réinitialiser le tableau

                paiements.forEach(paiement => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${paiement.date || 'N/A'}</td>
                        <td>${paiement.montantPayer}</td>
                        <td>${paiement.detteId || 'N/A'}</td>
                        <td>
                            <button onclick="deletePaiement(${paiement.id})">Supprimer</button>
                            <button onclick="editPaiement(${paiement.id})">Modifier</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paiements :', error);
            alert('Erreur lors du chargement des paiements');
        }
    }

    // Exposer les fonctions nécessaires au scope global
    window.createPaiement = createPaiement;
    window.listPaiements = listPaiements;
})();
