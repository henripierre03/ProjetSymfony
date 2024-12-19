async function logout() {
    const token = localStorage.getItem('authToken');
    console.log(token);
    if (token) {
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('authToken');  // Supprimer le token du stockage local
                window.location.href = './login.html';  // Rediriger vers la page de connexion
            } else {
                const error = await response.json();
                alert(`Erreur de déconnexion : ${error.message}`);
            }
        } catch (err) {
            console.error('Erreur lors de la déconnexion :', err);
        }
    }
}