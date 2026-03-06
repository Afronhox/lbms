// Protection client
if (!sessionStorage.getItem('userRole')) {
    window.location.href = 'index.html';
}

async function loadBooks() {
    try {
        const response = await fetch('/api/client/books');
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        document.getElementById('booksList').innerHTML = '<div class="alert alert-danger">Erreur chargement</div>';
    }
}

function renderBooks(books) {
    document.getElementById('booksList').innerHTML = books.map(book => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${book.image || 'https://picsum.photos/300/300?random'}" class="card-img-top" style="height: 250px">
                <div class="card-body">
                    <h5>${book.title}</h5>
                    <p>Stock: ${book.stock}</p>
                    <p class="text-success fs-4">$${book.price}</p>
                    ${book.stock > 0 ?
                        `<button class="btn btn-success w-100" onclick="buyBook(${book.id})">Acheter</button>` :
                        `<button class="btn btn-secondary w-100" disabled>Stock épuisé</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

async function buyBook(id) {
    if (confirm('Confirmer l\'achat ?')) {
        const response = await fetch('/api/client/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: id })
        });
        const data = await response.json();
        alert(data.message);
        loadBooks();
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadBooks);
