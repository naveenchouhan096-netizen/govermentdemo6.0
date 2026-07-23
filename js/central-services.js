/* ==========================================================================
   GLOBAL VARIABLES & CONFIGURATION
   These variables hold data that needs to be accessed by multiple functions.
   ========================================================================== */
let activeCategories = []; // Tracks which checkboxes are ticked
let allServices = []; // Master array holding all the fetched service data
let grid;             // The HTML container where cards will be drawn
let searchInput;      // The search bar input element

// The universal fallback logo for any government site not yet in the dictionary
const defaultGovEmblem = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/512px-Emblem_of_India.svg.png";
// High-Resolution Custom Logos for major Indian Government domains
const customLogos = {
    // ==========================================
    // 1. IDENTITY & CIVIL REGISTRATION
    // ==========================================
    "uidai.gov.in": "https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg",
    "eci.gov.in": "https://upload.wikimedia.org/wikipedia/commons/7/72/Election_Commission_of_India_Logo.svg",
    "voters.eci.gov.in": "https://upload.wikimedia.org/wikipedia/commons/7/72/Election_Commission_of_India_Logo.svg",
    "passportindia.gov.in": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Emblem_of_India.svg",
    "digilocker.gov.in": "https://upload.wikimedia.org/wikipedia/commons/a/a2/DigiLocker_logo.svg",
    "crsorgi.gov.in": "", // Birth & Death Registration

    // ==========================================
    // 2. FINANCE, TAX & BANKING
    // ==========================================
    "incometax.gov.in": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Income_Tax_Department_India_logo.svg/512px-Income_Tax_Department_India_logo.svg.png",
    "gst.gov.in": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Emblem_of_India.svg",
    "epfindia.gov.in": "https://upload.wikimedia.org/wikipedia/en/3/33/Employees%27_Provident_Fund_Organisation_Logo.svg", 
    "esic.gov.in": "", // Employee State Insurance
    "protean-tinpan.com": "", // NSDL PAN Card Services
    "utiitsl.com": "", // UTI PAN Card Services

    // ==========================================
    // 3. TRANSPORT & TRAVEL
    // ==========================================
    "parivahan.gov.in": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ministry_of_Road_Transport_and_Highways.svg",
    "irctc.co.in": "https://upload.wikimedia.org/wikipedia/en/4/45/IRCTC_Logo.svg",
    "indianrailways.gov.in": "https://upload.wikimedia.org/wikipedia/en/8/87/Indian_Railways_logo.svg",

    // ==========================================
    // 4. HEALTH & WELFARE
    // ==========================================
    "cowin.gov.in": "https://upload.wikimedia.org/wikipedia/commons/f/fa/CoWIN_logo.svg",
    "pmjay.gov.in": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Emblem_of_India.svg", // Ayushman Bharat
    "ndhm.gov.in": "", // ABHA Health ID
    "esanjeevani.mohfw.gov.in": "", // Telemedicine

    // ==========================================
    // 5. EDUCATION, SKILLS & JOBS
    // ==========================================
    "scholarships.gov.in": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Emblem_of_India.svg",
    "upsc.gov.in": "", // Union Public Service Commission
    "ssc.gov.in": "", // Staff Selection Commission
    "nta.ac.in": "", // National Testing Agency (JEE/NEET)
    "apprenticeshipindia.gov.in": "", // Skill India

    // ==========================================
    // 6. BUSINESS & COMMERCE
    // ==========================================
    "mca.gov.in": "", // Ministry of Corporate Affairs
    "udyamregistration.gov.in": "", // MSME Registration
    "startupindia.gov.in": "", 

    // ==========================================
    // 7. HOUSING, AGRICULTURE & UTILITIES
    // ==========================================
    "indiapost.gov.in": "https://upload.wikimedia.org/wikipedia/en/2/28/India_Post_Logo.svg",
    "pmkisan.gov.in": "", // PM Kisan Samman Nidhi
    "pmaymis.gov.in": "", // PM Awas Yojana (Housing)
    "mylpg.in": "", // Gas Cylinder Booking

    // ==========================================
    // 8. GRIEVANCE, LAW & GENERAL PORTALS
    // ==========================================
    "pgportal.gov.in": "", // CPGRAMS (Public Grievances)
    "ecourts.gov.in": "", // eCourts Services
    "umang.gov.in": "https://upload.wikimedia.org/wikipedia/commons/2/22/Umang_logo.svg",
    "mygov.in": "https://upload.wikimedia.org/wikipedia/commons/8/8c/MyGov_logo.svg",
    "nic.in": "https://upload.wikimedia.org/wikipedia/commons/9/93/National_Informatics_Centre_logo.svg"
};

// Global Configuration for Category Colors
const categoryColors = {
    "identity & documents": { bg: "#e9f2ff", text: "#1565ff" }, // Blue
    "finance & tax": { bg: "#e6fcf5", text: "#0ca678" },        // Green
    "health & wellness": { bg: "#fff0f6", text: "#d6336c" },    // Pink
    "education & jobs": { bg: "#fff4e6", text: "#f59f00" },     // Orange
    "travel & transport": { bg: "#f3f0ff", text: "#7048e8" },   // Purple
    "housing & utilities": { bg: "#e3fafc", text: "#1098ad" },  // Cyan
    "safety & grievances": { bg: "#ffe3e3", text: "#fa5252" }   // Red
};


// Global Configuration for Category Colors
const categoryColors = {
    "Identity & Documents": { bg: "#e9f2ff", text: "#1565ff" }, // Blue
    "Finance & Tax": { bg: "#e6fcf5", text: "#0ca678" },        // Green
    "Health & Wellness": { bg: "#fff0f6", text: "#d6336c" },    // Pink
    "Education & Jobs": { bg: "#fff4e6", text: "#f59f00" },     // Orange
    "Travel & Transport": { bg: "#f3f0ff", text: "#7048e8" },   // Purple
    "Housing & Utilities": { bg: "#e3fafc", text: "#1098ad" },  // Cyan
    "Safety & Grievances": { bg: "#ffe3e3", text: "#fa5252" }   // Red
};

// Pagination configuration to prevent the browser from freezing on huge lists
const BATCH_SIZE = 12; // Number of cards to load per click
let currentIndex = BATCH_SIZE; // Tracks how many items are currently displayed

// Array of all partitioned JSON data files (Modular Architecture)
const jsonFiles = [
    '../data/central-services/identity-documents.json',
    '../data/central-services/finance-tax.json',
    '../data/central-services/health-wellness.json',
    '../data/central-services/education-jobs.json',
    '../data/central-services/travel-transport.json',
    '../data/central-services/housing-utilities.json',
    '../data/central-services/safety-grievances.json'
];

/* ==========================================================================
   INITIALIZATION (Runs when the HTML is fully loaded)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab essential DOM elements
    grid = document.getElementById('services-grid');
    searchInput = document.getElementById('service-search');
    
    // 2. FETCH ALL DATA FILES CONCURRENTLY
    // Promise.all fetches all JSON files at the exact same time for maximum speed
    Promise.all(jsonFiles.map(file => 
        fetch(file).then(response => {
            if (!response.ok) throw new Error(`Network response was not ok for ${file}`);
            return response.json();
        })
    ))
    .then(dataArrays => {
        // 'dataArrays' is an array of arrays. .flat() merges them into one single master list.
        allServices = dataArrays.flat(); 
        generateFilterCheckboxes();
        // Initial render: draws the first batch of cards
        allServices.sort(() => Math.random() - 0.5);
        renderCards(allServices); 
    })
    .catch(error => {
        console.error('Error loading services data:', error);
        grid.innerHTML = '<p style="text-align:center; color:red; grid-column: 1 / -1;">Failed to load one or more service files. Please check your data folder.</p>';
    });

    // 3. SEARCH FILTERING LOGIC
    // 3. SEARCH FILTERING LOGIC
    // Calls the master combined filter whenever the user types
    searchInput.addEventListener('input', filterAndSearchServices);

    // 4. CLEAR SEARCH LOGIC (The 'X' Icon)
    const clearBtn = document.getElementById('clear-search');

    searchInput.addEventListener('input', () => {
        clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterAndSearchServices(); // <--- Calls the new combined function
        searchInput.focus();
    });

    // 5. KEYBOARD SHORTCUTS
    // Press '/' to instantly focus the search bar
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault(); 
            searchInput.focus();
        }
    });

    // Press 'Escape' to safely close the modal pop-up
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('service-modal');
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Close modal if the user clicks anywhere in the dark background area
    window.onclick = function(event) {
        const serviceModal = document.getElementById('service-modal');
        const filterModal = document.getElementById('filter-modal');
        
        if (event.target == serviceModal) {
            closeModal();
        }
        if (event.target == filterModal) {
            filterModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 5. ADD THE NEW FILTER MODAL BUTTON LOGIC HERE (Right before the scroll-to-top logic):
    const filterModal = document.getElementById('filter-modal');
    
    document.getElementById('open-filter-btn').addEventListener('click', () => {
        filterModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    });

    document.getElementById('close-filter-btn').addEventListener('click', () => {
        filterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    document.getElementById('apply-filters-btn').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        activeCategories = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        filterAndSearchServices(); 
        filterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(cb => cb.checked = false); 
        activeCategories = []; 
        filterAndSearchServices(); 
        filterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 6. SCROLL TO TOP LOGIC
    const topBtn = document.getElementById("scrollToTop");

    // Show the button only after scrolling down 300 pixels
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    };

    // Smoothly glide back to the top when clicked
    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/* ==========================================================================
   RENDER FUNCTION (Builds the UI Cards with Pagination)
   ========================================================================== */
/**
 * @param {Array} servicesToDisplay - The array of service objects to render
 * @param {boolean} isAppending - If true, adds to existing cards. If false, clears the grid first.
 */
function renderCards(servicesToDisplay, isAppending = false) {
    
    // If it's a new search or initial load, wipe the slate clean
    if (!isAppending) {
        grid.innerHTML = '';
        currentIndex = BATCH_SIZE; // Reset index back to 12
    }

    // --- NEW RESULTS COUNTER LOGIC ---
    const resultsCounter = document.getElementById('results-counter');
    if (resultsCounter && !isAppending) {
        // Check if the search box is empty to determine the text phrasing
        if (document.getElementById('service-search').value.trim() === '') {
            resultsCounter.innerHTML = `Showing all <strong>${servicesToDisplay.length}</strong> services`;
        } else {
            resultsCounter.innerHTML = `Found <strong>${servicesToDisplay.length}</strong> matching results`;
        }
    }
    // ---------------------------------

    // EMPTY STATE UI: If the search yielded no results
    if (servicesToDisplay.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;">
                <i class="fa-solid fa-magnifying-glass-minus" style="font-size: 48px; color: #adb5bd; margin-bottom: 15px;"></i>
                <h3 style="color: #343a40; margin-bottom: 10px; font-size: 20px;">No services match your search</h3>
                <p style="color: #6c757d; margin-bottom: 20px;">We couldn't find anything for "<strong>${document.getElementById('service-search').value}</strong>". <br>Try searching for general terms like 'Passport', 'Travel', or 'Tax'.</p>
                <button onclick="document.getElementById('clear-search').click();" class="btn-official" style="border: none; padding: 10px 24px; cursor: pointer;">
                    Clear Search
                </button>
            </div>
        `;
        return; // Stop running the function here
    }

    
    // SLICE THE ARRAY: Get only the items we want to render in this specific batch
    // If appending, start from previous index. If new load, start from 0.
    const startIndex = isAppending ? currentIndex - BATCH_SIZE : 0;
    const currentBatch = servicesToDisplay.slice(startIndex, currentIndex);

       // Build the HTML for each card in the current batch
    currentBatch.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        
        // Map tags to HTML safely
        const tagsHTML = service.tags ? service.tags.map(tag => `<span class="service-tag">${tag}</span>`).join('') : '';

        // Safely match colors
        const safeCategory = service.category ? service.category.trim().toLowerCase() : "";
        const theme = categoryColors[safeCategory] || { bg: "#f4f6f9", text: "#555" };

      // --- OFFLINE/MANUAL LOGO EXTRACTOR LOGIC ---
        let domain = "";
        let logoUrl = "";
        let showBadge = false;
        
        try {
            // Extracts domain and removes 'www.' 
            domain = new URL(service.officialLink).hostname.replace('www.', '');
        } catch (e) {
            domain = ""; 
        }
        
        if (domain) {
            showBadge = true; // We have a valid link, so we will show a badge
            
            // Check if the domain ends with any of our mapped portals
            let matchedKey = Object.keys(customLogos).find(key => domain.endsWith(key));
            
            if (matchedKey) {
                // If found, use the specific department logo
                logoUrl = customLogos[matchedKey];
            } else {
                // If not found, use the gorgeous default Indian Emblem
                logoUrl = defaultGovEmblem; 
            }
        }
        // ----------------------------------------

        // If the category is somehow missing or misspelled, it defaults to gray.
        const theme = categoryColors[service.category] || { bg: "#f4f6f9", text: "#555" };
        // Inject the data into the HTML structure
        card.innerHTML = `
            <!-- The Floating Official Badge with Failsafe -->
            <div class="official-logo-badge" style="display: ${showBadge ? 'block' : 'none'};">
                <img src="${logoUrl}" alt="" class="badge-img" onerror="this.parentElement.style.display='none';">
            </div>

            <div class="card-header">
                <div class="icon-box" style="background-color: ${theme.bg}; color: ${theme.text};">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-category" style="color: ${theme.text};">${service.category}</div>
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

    // HANDLE "LOAD MORE" BUTTON
    let loadMoreBtn = document.getElementById('load-more-btn');
    
    // Create the button if it doesn't exist yet
    if (!loadMoreBtn) {
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'load-more-btn';
        loadMoreBtn.className = 'btn-official'; 
        // Inline styles to center it and force it to span across all grid columns
        loadMoreBtn.style.cssText = 'margin: 30px auto; display: block; grid-column: 1 / -1; width: fit-content; padding: 12px 40px;';
        loadMoreBtn.innerText = 'Load More Services';
        grid.appendChild(loadMoreBtn);
    } else {
        // If it already exists, move it to the very bottom of the grid
        grid.appendChild(loadMoreBtn); 
    }

    // Update the button's click behavior to process the current list (important for filtered searches)
    loadMoreBtn.onclick = () => {
        currentIndex += BATCH_SIZE; // Increase the threshold by 12
        renderCards(servicesToDisplay, true); // true = we are appending, do not clear the grid!
    };

    // Hide the button if we have displayed all available items in the list
    if (currentIndex >= servicesToDisplay.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

/* ==========================================================================
   MODAL FUNCTIONS (Pop-up details handling)
   ========================================================================== */

function openDetails(serviceId) {
    // Look up the exact service data object based on the ID passed from the button click
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return; // Failsafe

    // Safely generate HTML for arrays (Steps and Documents)
    const stepsHTML = (service.stepsToApply && service.stepsToApply.length > 0) 
        ? service.stepsToApply.map(step => `<li>${step}</li>`).join('') 
        : '';
    
    const docsHTML = (service.requiredDocuments && service.requiredDocuments.length > 0) 
        ? service.requiredDocuments.map(doc => `<li>${doc}</li>`).join('') 
        : '';

    // Inject data into the modal body using Conditional Rendering (only shows blocks if data exists)
    document.getElementById('modal-body').innerHTML = `
        <h2 class="modal-title"><i class="${service.icon}" style="color:#1565ff; margin-right:10px;"></i> ${service.title}</h2>
        
        ${service.eligibility ? `
        <div class="modal-section">
            <h4><i class="fa-solid fa-user-check" style="color: #f4a261; margin-right: 8px;"></i> Eligibility</h4>
            <p>${service.eligibility}</p>
        </div>` : ''}

        ${(service.fees && service.fees.details) ? `
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

    // Make the modal visible
    document.getElementById('service-modal').style.display = 'flex';
    
    // Freeze the background page so the user can only scroll within the modal
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    // Hide the modal
    document.getElementById('service-modal').style.display = 'none';
    
    // Un-freeze the background page
    document.body.style.overflow = 'auto'; 
}

// Auto-generates checkboxes based on unique categories in the JSON
function generateFilterCheckboxes() {
    const container = document.getElementById('filter-options-container');
    // Using Set to get only unique categories, then sorting them alphabetically
    const uniqueCategories = [...new Set(allServices.map(s => s.category))].sort();
    
    container.innerHTML = uniqueCategories.map(category => `
        <label class="filter-label">
            <input type="checkbox" value="${category}" class="category-checkbox">
            ${category}
        </label>
    `).join('');
}

function filterAndSearchServices() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredServices = allServices.filter(service => {
        // 1. Check if it matches the Search Bar text
        const matchesSearch = service.title.toLowerCase().includes(searchTerm) || 
                              service.shortDescription.toLowerCase().includes(searchTerm) ||
                              (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        // 2. Check if it matches the Checked Categories (If empty, show all)
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(service.category);
        
        // Only render the card if it passes BOTH tests
        return matchesSearch && matchesCategory;
    });
    
    renderCards(filteredServices);
}