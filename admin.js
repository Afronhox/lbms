// Protection admin
if (sessionStorage.getItem('userRole') !== 'admin') {
    window.location.href = 'client.html';
}

let editingId = null;

async function loadBooks() {
    try {
        const response = await fetch('/api/admin/books');
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        document.getElementById('adminBooksList').innerHTML = '<div class="alert alert-danger">Erreur</div>';
    }
}

function renderBooks(books) {
    document.getElementById('adminBooksList').innerHTML = books.map(book => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${book.image || 'https://picsum.photos/300/300?random'}" class="card-img-top" style="height: 200px">
                <div class="card-body">
                    <h5>${book.title}</h5>
                    <p>Prix: $${book.price} | Stock: ${book.stock}</p>
                    <div class="btn-group w-100">
                        <button class="btn btn-warning" onclick="editBook(${book.id})">Modifier</button>
                        <button class="btn btn-danger" onclick="deleteBook(${book.id})">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (editingId) formData.append('id', editingId);
    
    const endpoint = editingId ? '/api/admin/update' : '/api/admin/add';
    const response = await fetch(endpoint, { method: 'POST', body: formData });
    const data = await response.json();
    
    alert(data.message);
    if (data.success) {
        e.target.reset();
        editingId = null;
        document.querySelector('#bookForm button[type="submit"]').textContent = 'Ajouter';
        loadBooks();
    }
});

async function editBook(id) {
    const response = await fetch(`/api/admin/book/${id}`);
    const book = await response.json();
    document.getElementById('title').value = book.title;
    document.getElementById('price').value = book.price;
    document.getElementById('stock').value = book.stock;
    editingId = id;
    document.querySelector('#bookForm button[type="submit"]').textContent = 'Modifier';
}

async function deleteBook(id) {
    if (confirm('Supprimer ?')) {
        const response = await fetch(`/api/admin/delete/${id}`, { method: 'DELETE' });
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
