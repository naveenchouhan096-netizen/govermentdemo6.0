// Make this variable global so our modal functions can access it
let allServices = []; 
let grid;
let searchInput;

// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    grid = document.getElementById('services-grid');
    searchInput = document.getElementById('service-search');
    
    // 1. FETCH THE DATA
    fetch('../data/central-services.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allServices = data; 
            renderCards(allServices); 
        })
        .catch(error => {
            console.error('Error loading services data:', error);
            grid.innerHTML = '<p style="text-align:center; color:red;">Failed to load services. Please check your JSON file.</p>';
        });

    // 3. SEARCH FILTERING
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        const filteredServices = allServices.filter(service => 
            service.title.toLowerCase().includes(searchTerm) || 
            service.shortDescription.toLowerCase().includes(searchTerm) ||
            (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
        
        renderCards(filteredServices);
    });

    // Close modal if user clicks outside of the white box
    window.onclick = function(event) {
        const modal = document.getElementById('service-modal');
        if (event.target == modal) {
            closeModal();
        }
    }
});

// 2. RENDER THE CARDS
function renderCards(servicesToDisplay) {
    grid.innerHTML = '';

    if (servicesToDisplay.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No services found matching your search.</p>';
        return;
    }

    servicesToDisplay.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        const tagsHTML = service.tags ? service.tags.map(tag => `<span class="service-tag">${tag}</span>`).join('') : '';

        card.innerHTML = `
            <div class="card-header">
                <div class="icon-box"><i class="${service.icon}"></i></div>
                <div class="service-category">${service.category}</div>
            </div>
            <h3 class="service-title">${service.title}</h3>
            <div class="tags-container">
                ${tagsHTML}
            </div>
            <p class="service-desc">${service.shortDescription}</p>
            
            <div class="card-actions">
                <button class="btn-details" onclick="openDetails('${service.id}')">View Details</button>
                <a href="${service.officialLink}" target="_blank" class="btn-official">Official Site <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:12px;"></i></a>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 4. MODAL FUNCTIONS (Must be outside DOMContentLoaded to work with onclick)
function openDetails(serviceId) {
    // Find the exact service the user clicked on
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;

    // Build the HTML for the steps (mapping array to list items)
    const stepsHTML = service.stepsToApply.map(step => `<li>${step}</li>`).join('');
    
    // Build the HTML for the documents
    const docsHTML = service.requiredDocuments.map(doc => `<li>${doc}</li>`).join('');

    // Inject all the data into the modal body
    document.getElementById('modal-body').innerHTML = `
        <h2 class="modal-title"><i class="${service.icon}" style="color:#1565ff; margin-right:10px;"></i> ${service.title}</h2>
        
        <div class="modal-section">
            <h4>Eligibility</h4>
            <p>${service.eligibility}</p>
        </div>

        <div class="modal-section">
            <h4>Fees</h4>
            <p>${service.fees}</p>
        </div>

        <div class="modal-section">
            <h4>Required Documents</h4>
            <ul>${docsHTML}</ul>
        </div>

        <div class="modal-section">
            <h4>Steps to Apply</h4>
            <ol>${stepsHTML}</ol>
        </div>
        
        <div style="text-align:center; margin-top: 30px;">
             <a href="${service.officialLink}" target="_blank" class="btn-official" style="display:inline-block; padding: 12px 30px;">Proceed to Official Website</a>
        </div>
    `;

    // Show the modal
    document.getElementById('service-modal').style.display = 'flex';
    
    // Prevent the background page from scrolling while modal is open
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('service-modal').style.display = 'none';
    
    // Allow the background page to scroll again
    document.body.style.overflow = 'auto'; 
}