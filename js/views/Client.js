(() => {
    const API_URL = 'http://localhost:8000/api'; // URL de votre backend

    // Charger la liste des utilisateurs
    async function loadUsers() {
        const token = localStorage.getItem('authToken'); 
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const users = await response.json();
                const userSelect = document.getElementById('user');

                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.email; // Affichez le nom d'utilisateur
                    userSelect.appendChild(option);
                });
            } else {
                const error = await response.json();
                console.error(`Erreur lors du chargement des utilisateurs : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
        }
    }

    // Fonction pour créer un client
    async function createClient() {
        const token = localStorage.getItem('authToken'); 
        const surname = document.getElementById('surname').value;
        const telephone = document.getElementById('telephone').value;
        const address = document.getElementById('address').value;
        const userId = document.getElementById('user').value; // Récupérer l'utilisateur sélectionné

        try {
            const response = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ surname, telephone, address, userId }) // Inclure l'utilisateur
            });

            if (response.ok) {
                alert('Client créé avec succès !');
                listClients(); // Rafraîchit la liste automatiquement après ajout
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la création du client :', err);
        }
    }

    // Charger la liste des clients
    async function listClients() {
        const token = localStorage.getItem('authToken'); 
        try {
            const response = await fetch(`${API_URL}/clients`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const clients = await response.json();
                const tbody = document.querySelector('#clients-table tbody');
                tbody.innerHTML = '';

                clients.forEach(client => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${client.surname}</td>
                        <td>${client.telephone}</td>
                        <td>${client.address}</td>
                        <td>${client.totalDue || 0}</td>
                        <td>${client.user ? client.user.username : 'Non associé'}</td>
                        <td><button onclick="editClient(${client.id})">Modifier</button></td>
                    `;

                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des clients :', err);
        }
    }

    // Charger les utilisateurs et la liste des clients au chargement de la page
    document.addEventListener('DOMContentLoaded', () => {
        loadUsers(); // Charger les utilisateurs dans le champ select
        listClients(); // Charger la liste des clients
    });

    // Exposer les fonctions nécessaires au scope global
    window.loadUsers = loadUsers;
    window.createClient = createClient;
    window.listClients = listClients;
})();
