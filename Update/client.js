document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

// 1. Fonction pour récupérer et afficher les livres
async function loadBooks() {
    const booksList = document.getElementById('booksList');
    
    try {
        const response = await fetch('/api/client/books');
        const books = await response.json();

        if (books.length === 0) {
            booksList.innerHTML = '<div class="col-12 text-center"><p class="lead">Aucun livre disponible pour le moment. 📚</p></div>';
            return;
        }

        booksList.innerHTML = books.map(book => `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card h-100">
                    <img src="${book.image || 'https://via.placeholder.com/300x400?text=Pas+d+image'}" 
                         class="card-img-top" alt="${book.title}" 
                         style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${book.title}</h5>
                        <p class="card-text text-primary fs-4 fw-bold">${book.price} $</p>
                        <p class="card-text small text-muted">Stock disponible : <strong>${book.stock}</strong></p>
                        <button onclick="buyBook(${book.id})" class="btn btn-primary mt-auto w-100">
                            🛒 Acheter maintenant
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Erreur de chargement:", error);
        booksList.innerHTML = '<p class="text-danger text-center">Impossible de charger le catalogue.</p>';
    }
}

// 2. Fonction pour gérer l'achat
async function buyBook(bookId) {
    try {
        const response = await fetch('/api/client/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId })
        });

        const result = await response.json();

        if (result.success) {
            alert("✅ " + result.message);
            loadBooks(); // Rafraîchir la liste pour mettre à jour le stock
        } else {
            alert("❌ " + result.message);
        }
    } catch (error) {
        alert("Erreur lors de la connexion au serveur.");
    }
}

// 3. Fonction de déconnexion
function logout() {
    // Logique de déconnexion (ex: supprimer le token ou redirection)
    window.location.href = 'index.html';
}