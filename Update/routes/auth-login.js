// auth-login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                // Stockage des infos utiles pour la session
                sessionStorage.setItem('userRole', data.role);
                sessionStorage.setItem('username', username);

                // Redirection selon le rôle renvoyé par le serveur
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'client.html';
                }
            } else {
                alert(data.message || 'Identifiants incorrects');
                document.getElementById('password').value = '';
            }
        } catch (error) {
            console.error("Erreur de login:", error);
            alert('❌ Serveur indisponible. Vérifiez que votre backend est lancé.');
        }
    });
});