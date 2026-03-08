// auth-register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validation basique côté client
        if (password.length < 6) {
            alert('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                alert('Compte créé avec succès ! Connectez-vous.');
                window.location.href = 'index.html'; // Redirection vers connexion
            } else {
                alert(data.message || "Erreur lors de l'inscription");
            }
        } catch (error) {
            console.error("Erreur:", error);
            alert('❌ Erreur de connexion au serveur.');
        }
    });
});