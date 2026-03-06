document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (username.length < 3) {
            alert('Nom d\'utilisateur trop court (min 3 caractères)');
            return;
        }
        
        if (password.length < 6) {
            alert('Mot de passe trop court (min 6 caractères)');
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
                alert('✅ Compte créé ! Vous pouvez maintenant vous connecter.');
                window.location.href = 'index.html';
            } else {
                alert('❌ ' + data.message);
            }
        } catch (error) {
            alert('❌ Erreur serveur. Vérifiez le backend.');
        }
    });
});
