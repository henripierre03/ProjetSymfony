(() => {
    const API_URL = 'http://localhost:8000/api';

    // Fonction pour créer un utilisateur
    async function createUser() {
        const token = localStorage.getItem('authToken'); 
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const roleSelect = document.getElementById('user-role');
        const roles = Array.from(roleSelect.selectedOptions).map(option => option.value);
        // const isActive = document.getElementById('user-isActive').checked;

        if (!email || !password) {
            alert('Email et mot de passe sont obligatoires');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    role: roles
                }),
            });

            if (response.ok) {
                alert('Utilisateur créé avec succès');
                listUsers(); // Recharger la liste des utilisateurs
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l’utilisateur :', error);
            alert('Erreur lors de la création de l’utilisateur');
        }
    }

    // Fonction pour afficher tous les utilisateurs
    async function listUsers() {
        const token = localStorage.getItem('authToken'); 
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const users = await response.json();
                const tbody = document.querySelector('#users-table tbody');
                tbody.innerHTML = ''; // Réinitialiser le tableau

                users.forEach((user) => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        
                        <td>
                            <button onclick="deleteUser(${user.id})">Supprimer</button>
                            <button onclick="editUser(${user.id})">Modifier</button>
                        </td>
                    `;

                    tbody.appendChild(row);
                });
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.error}`);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs :', error);
            alert('Erreur lors du chargement des utilisateurs');
        }
    }

    // Fonction pour supprimer un utilisateur
    async function deleteUser(userId) {
        const token = localStorage.getItem('authToken'); 
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Utilisateur supprimé avec succès');
                listUsers(); // Recharger la liste des utilisateurs
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l’utilisateur :', error);
            alert('Erreur lors de la suppression de l’utilisateur');
        }
    }

    // Fonction pour modifier un utilisateur
    async function editUser(userId) {
        const newEmail = prompt('Entrez le nouvel email :', '');
        const newRole = prompt('Entrez le nouveau rôle :', '');
        const newIsActive = confirm('L’utilisateur est-il actif ?');

        if (!newEmail && !newRole) {
            alert('Aucune modification n’a été apportée');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail || null,
                    role: newRole || null,
                    isActive: newIsActive,
                }),
            });

            if (response.ok) {
                alert('Utilisateur modifié avec succès');
                listUsers(); // Recharger la liste des utilisateurs
            } else {
                const error = await response.json();
                alert(`Erreur : ${error.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la modification de l’utilisateur :', error);
            alert('Erreur lors de la modification de l’utilisateur');
        }
    }

    // Charger les utilisateurs au chargement de la page
    document.addEventListener('DOMContentLoaded', listUsers);

    // Exposer les fonctions nécessaires au scope global
    window.createUser = createUser;
    window.listUsers = listUsers;
    window.deleteUser = deleteUser;
    window.editUser = editUser;
})();
