// Fonction pour réinitialiser les scripts dynamiques
function unloadScripts() {
    const scripts = document.querySelectorAll('script[data-dynamic="true"]');
    scripts.forEach(script => script.remove()); // Supprime les anciens scripts dynamiques
}

// Fonction pour charger dynamiquement un script JavaScript
function loadScript(scriptUrl, onLoadCallback) {
    // Supprime les anciens scripts
    unloadScripts();

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('data-dynamic', 'true'); // Identifie les scripts dynamiques
    script.onload = () => {
        console.log(`Script chargé : ${scriptUrl}`);
        if (onLoadCallback) onLoadCallback();
    };
    script.onerror = () => {
        console.error(`Erreur lors du chargement du script : ${scriptUrl}`);
    };
    document.body.appendChild(script);
}

// Fonction pour charger dynamiquement une section HTML
function loadSection(url, callback) {
    const contentContainer = document.getElementById('content-container');

    // Vide le conteneur avant de charger la nouvelle section
    contentContainer.innerHTML = '<p>Chargement en cours...</p>';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement de la section : ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // Injecte le contenu HTML dans le conteneur principal
            contentContainer.innerHTML = html;

            // Exécute le callback pour charger les scripts associés
            if (callback) callback();
        })
        .catch(error => {
            console.error('Erreur:', error);
            contentContainer.innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger la section. Veuillez réessayer plus tard.</p>
                </div>`;
        });
}

// Fonction pour charger la vue client
function loadClientView() {
    loadSection('./client-section.html', () => {
        loadScript('./js/views/Client.js', () => {
            if (typeof listClients === 'function') {
                listClients();
                loadUsers(); // Appelle la fonction pour lister les clients
            } else {
                console.error('Erreur : La fonction listClients est introuvable.');
            }
        });
    });
}

// Fonction pour charger la vue article
function loadArticleView() {
    loadSection('./article-section.html', () => {
        loadScript('./js/views/Article.js', () => {
            if (typeof listArticles === 'function') {
                listArticles(); // Appelle la fonction pour lister les articles
            } else {
                console.error('Erreur : La fonction listArticles est introuvable.');
            }
        });
    });
}

// Fonction pour charger la vue dette
function loadDetteView() {
    loadSection('./dette-section.html', () => {
        loadScript('./js/views/Dette.js', () => {
            if (typeof listDettes === 'function') {
                listDettes();
                loadDemandeDette()
                 // Appelle la fonction pour lister les dettes
            } else {
                console.error('Erreur : La fonction listDettes est introuvable.');
            }
        });
    });
}

function loadDemandeDetteView() {
    loadSection('./demandeDette-section.html', () => {
        loadScript('./js/views/DemandeDette.js', () => {
            if (typeof listDemandesDette === 'function') {
                listDemandesDette();
                 // Appelle la fonction pour lister les dettes
            } else {
                console.error('Erreur : La fonction listDettes est introuvable.');
            }
        });
    });
}

// Fonction pour charger la vue paiement
function loadPaiementView() {
    loadSection('./paiement-section.html', () => {
        loadScript('./js/views/Paiement.js', () => {
            if (typeof listPaiements === 'function') {
                listPaiements(); // Appelle la fonction pour lister les paiements
            } else {
                console.error('Erreur : La fonction listPaiements est introuvable.');
            }
        });
    });
}

function loadUserView() {
    loadSection('./user-section.html', () => {
        loadScript('./js/views/User.js', () => {
            if (typeof listUsers === 'function') {
                listUsers(); // Appelle la fonction pour lister les Users
            } else {
                console.error('Erreur : La fonction listUsers est introuvable.');
            }
        });
    });
}

// Ajout d'un événement pour réinitialiser tout au chargement initial
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application prête.');
});function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
        window.location.href = './login.html'; // Redirige vers la page de connexion
    }
}

// Vérification de l'authentification dès le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Vérifie l'authentification de l'utilisateur
    console.log('Application prête.');
});
