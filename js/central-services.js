// Make this variable global so our modal functions can access it
let allServices = []; 
let grid;
let searchInput;

// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    grid = document.getElementById('services-grid');
    searchInput = document.getElementById('service-search');

    // Search Keyboard Shortcut
    // Pressing '/' will automatically focus the search bar
    document.addEventListener('keydown', (e) => {
        // Check if the key pressed is '/' AND the user isn't already typing in an input field
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault(); // Stops the '/' character from actually being typed into the box
            searchInput.focus();
        }
    });
    
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

    // Upgraded "No Results" UI
    if (servicesToDisplay.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;">
                <i class="fa-solid fa-magnifying-glass-minus" style="font-size: 48px; color: #adb5bd; margin-bottom: 15px;"></i>
                <h3 style="color: #343a40; margin-bottom: 10px; font-size: 20px;">No services match your search</h3>
                <p style="color: #6c757d; margin-bottom: 20px;">We couldn't find anything for "<strong>${document.getElementById('service-search').value}</strong>". <br>Try searching for general terms like 'Passport', 'Travel', or 'Tax'.</p>
                <button onclick="document.getElementById('service-search').value=''; document.getElementById('service-search').dispatchEvent(new Event('input'));" class="btn-official" style="border: none; padding: 10px 24px; cursor: pointer;">
                    Clear Search
                </button>
            </div>
        `;
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

// 4. MODAL FUNCTIONS
function openDetails(serviceId) {
    // Find the exact service the user clicked on
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;

    // Safely build HTML for lists (checks if array exists and has items)
    const stepsHTML = (service.stepsToApply && service.stepsToApply.length > 0) 
        ? service.stepsToApply.map(step => `<li>${step}</li>`).join('') 
        : '';
    
    const docsHTML = (service.requiredDocuments && service.requiredDocuments.length > 0) 
        ? service.requiredDocuments.map(doc => `<li>${doc}</li>`).join('') 
        : '';

    // Inject data using conditional rendering (Empty State Handling)
    document.getElementById('modal-body').innerHTML = `
        <h2 class="modal-title"><i class="${service.icon}" style="color:#1565ff; margin-right:10px;"></i> ${service.title}</h2>
        
        ${service.eligibility ? `
        <div class="modal-section">
            <h4><i class="fa-solid fa-user-check" style="color: #f4a261; margin-right: 8px;"></i> Eligibility</h4>
            <p>${service.eligibility}</p>
        </div>` : ''}

       ${service.fees ? `
       <div class="modal-section">
    <h4><i class="fa-solid fa-money-bill-wave" style="color: #2a9d8f; margin-right: 8px;"></i> Fees</h4>
    <p>${service.fees.details}</p>
        </div>` : ''}

        ${docsHTML ? `
        <div class="modal-section">
            <h4><i class="fa-regular fa-folder-open" style="color: #1565ff; margin-right: 8px;"></i> Required Documents</h4>
            <ul>${docsHTML}</ul>
        </div>` : ''}

        ${stepsHTML ? `
        <div class="modal-section">
            <h4><i class="fa-solid fa-list-ol" style="color: #9d4edd; margin-right: 8px;"></i> Steps to Apply</h4>
            <ol>${stepsHTML}</ol>
        </div>` : ''}
        

        <div style="text-align:center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eef2f7;">
            <p style="font-size: 13px; color: #2a9d8f; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <i class="fa-solid fa-shield-halved"></i> Verified Government Portal
            </p>
            <a href="${service.officialLink}" target="_blank" class="btn-official" style="display:inline-block; padding: 14px 30px; width: 100%; max-width: 350px; font-size: 16px;">
                Proceed to Official Website <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left: 8px; font-size: 14px;"></i>
            </a>
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