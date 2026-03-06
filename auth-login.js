document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Remplissez tous les champs');
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
                sessionStorage.setItem('userRole', data.role);
                window.location.href = data.role === 'admin' ? 'admin.html' : 'client.html';
            } else {
                alert(data.message);
                document.getElementById('password').value = '';
            }
        } catch (error) {
            alert('❌ Serveur indisponible. Vérifiez que "npm run dev" tourne.');
        }
    });
});
