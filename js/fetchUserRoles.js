async function fetchUserRoles() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const userData = await response.json();
            return userData.roles;
        } else {
            console.error('Erreur lors de la récupération des rôles utilisateur');
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des rôles utilisateur :', error);
        return [];
    }
}

async function renderMenu() {
    console.log('djdjd');
    const roles = await fetchUserRoles();

    const sidebar = document.querySelector('.sidebar ul');
    sidebar.innerHTML = ''; // Efface les menus existants

    if (roles.includes('ROLE_ADMIN')) {
        sidebar.innerHTML += `<li><a href="#" onclick="loadClientView()">Client</a></li>`;
        sidebar.innerHTML += `<li><a href="#" onclick="loadUserView()">User</a></li>`;
    }

    if (roles.includes('ROLE_USER') || roles.includes('ROLE_ADMIN')) {
        sidebar.innerHTML += `<li><a href="#" onclick="loadArticleView()">Article</a></li>`;
        sidebar.innerHTML += `<li><a href="#" onclick="loadDetteView()">Dette</a></li>`;
        sidebar.innerHTML += `<li><a href="#" onclick="loadPaiementView()">Paiement</a></li>`;
        sidebar.innerHTML += `<li><a href="#" onclick="loadDemandeDetteView()">Demande Dette</a></li>`;
    }

}

// Appeler le rendu du menu après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});
