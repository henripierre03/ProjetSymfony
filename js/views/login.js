(() => {
    const API_URL = 'http://localhost:8000/api'; // URL de l'API pour valider la connexion

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Stockez le jeton ou identifiant utilisateur localement
                localStorage.setItem('authToken', data.token);

                // Redirigez vers l'application principale
                window.location.href = './index.html';
            } else {
                const error = await response.json();
                errorDiv.textContent = `Erreur : ${error.message}`;
            }
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            errorDiv.textContent = 'Erreur de connexion. Veuillez réessayer.';
        }
    });

    
})();
