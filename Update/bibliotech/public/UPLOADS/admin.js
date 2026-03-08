// admin.js (Côté Client)

const bookForm = document.getElementById('bookForm');
const booksList = document.getElementById('adminBooksList');
const submitBtn = bookForm.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = bookForm.querySelector('h2');

// --- 1. CHARGEMENT DES LIVRES ---
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        
        booksList.innerHTML = books.map(book => `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img src="${book.image || 'https://via.placeholder.com/150'}" 
                         class="card-img-top" alt="${book.title}" 
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${book.title}</h5>
                        <p class="card-text">
                            <strong>Prix:</strong> ${book.price} €<br>
                            <strong>Stock:</strong> ${book.stock} unités
                        </p>
                        <div class="d-flex gap-2">
                            <button onclick="editBook(${book.id})" class="btn btn-sm btn-warning w-100">Modifier</button>
                            <button onclick="deleteBook(${book.id})" class="btn btn-sm btn-danger w-100">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Erreur lors du chargement:", error);
    }
}

// --- 2. ENVOI DU FORMULAIRE (AJOUT / MODIF) ---
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('bookId').value;
    const formData = new FormData();
    
    // Ajout des données au FormData
    formData.append('id', id);
    formData.append('title', document.getElementById('title').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);
    
    const fileInput = document.getElementById('image');
    if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
    }

    const url = id ? '/api/update' : '/api/add';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert(id ? "Livre mis à jour !" : "Livre ajouté !");
            cancelEdit(); // Réinitialise le formulaire et l'interface
            loadBooks();
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi:", error);
    }
});

// --- 3. SUPPRESSION ---
async function deleteBook(id) {
    if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
        try {
            const response = await fetch(`/api/delete/${id}`, { method: 'DELETE' });
            if (response.ok) loadBooks();
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    }
}

// --- 4. MODE ÉDITION (Pré-remplissage) ---
async function editBook(id) {
    try {
        const response = await fetch(`/api/book/${id}`);
        const book = await response.json();

        // Remplir les champs
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('price').value = book.price;
        document.getElementById('stock').value = book.stock;

        // Changer l'interface
        formTitle.textContent = "Modifier le livre";
        submitBtn.textContent = "Mettre à jour";
        submitBtn.className = "btn btn-warning";
        cancelBtn.style.display = "inline-block";
        
        // Remonter en haut de page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error("Erreur récupération livre:", error);
    }
}

// --- 5. ANNULATION / RESET ---
function cancelEdit() {
    bookForm.reset();
    document.getElementById('bookId').value = "";
    formTitle.textContent = "📝 Gestion Livres";
    submitBtn.textContent = "Ajouter Livre";
    submitBtn.className = "btn btn-primary";
    cancelBtn.style.display = "none";
}

// --- 6. DÉCONNEXION ---
function logout() {
    // Logique de déconnexion (ex: supprimer token ou session)
    window.location.href = "login.html"; 
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    cancelEdit(); // Cache le bouton annuler au départ
    loadBooks();
});

