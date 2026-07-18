// ==========================================
// GLOBALS: DATABASE HOLDER (LOADED VIA JSON)
// ==========================================
let localServicesDatabase = [];

// Page load hote hi JSON data asynchronously call hoga
document.addEventListener("DOMContentLoaded", () => {
  
  // 👉 YAHAN PARAbsolute Path ADD KAR DIYA HAI TAKI FOLDER KA CODES LAFDA NA HO
  fetch('../data/state-service.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("JSON file  are not load !Please check the Path .");
      }
      return response.json();
    })
    .then(data => {
      localServicesDatabase = data.localServicesDatabase;
      console.log("Database successfully loaded from JSON file.");
      
      // Agar user ne JSON load hone se pehle hi koi state select kar li thi, to data refresh ho jaye
      const stateSelect = document.getElementById('stateSelect').value;
      if (stateSelect) {
        updateCategories();
        filterLocalServices();
      }
    })
    .catch(error => {
      console.error("Error loading local services database:", error);
      
      // Screen par error message dikhane ke liye debug helper
      const grid = document.getElementById('stateServicesGrid');
      if (grid) {
        grid.innerHTML = `<div class="error-msg" style="grid-column: 1/-1; text-align: center; padding: 20px;">
          <p style="color: #e74c3c; font-weight: 600;">⚠️ JSON Database load nahi ho saka! Apne VS Code ke Live Server ko stop karke dobara chalaein.</p>
        </div>`;
      }
    });
});

// ==========================================
// 1. DYNAMIC CATEGORY DROPDOWN GENERATOR (FIXED DASH SPLIT)
// ==========================================
function updateCategories() {
  const stateSelect = document.getElementById('stateSelect').value.toLowerCase().replace(/_/g, '').trim();
  const serviceSelect = document.getElementById('serviceTypeSelect');

  // Reset category options clean
  serviceSelect.innerHTML = '<option value="">-- All Services / Select Category --</option>';

  if (!stateSelect) return;

  // Selected state se matching elements database array se filter karna
  const matches = localServicesDatabase.filter(item => {
    const dbState = item.state.toLowerCase().replace(/_/g, '').trim();
    return dbState === stateSelect;
  });

  if (matches.length > 0) {
    const uniqueKeys = [];
    
    matches.forEach(item => {
      if (!uniqueKeys.includes(item.category)) {
        uniqueKeys.push(item.category);
        
        const optionEl = document.createElement('option');
        optionEl.value = item.category;
        
        // FIX: Ab yeh dash (-) par nahi tootega, sirf Hindi brackets ya vertical bar (|) ko clean karein
        let cleanText = item.title.split('(')[0].split('|')[0].trim();
        optionEl.textContent = cleanText;
        
        serviceSelect.appendChild(optionEl);
      }
    });
  } else {
    // Fallback options agar exact data JSON me nahi hai
    const defaultOptions = [
      { val: "administration", text: "Local Administration (DM/Tehsil/Police)" },
      { val: "certificates", text: "Certificates & Identity (आय/जाति/निवास)" },
      { val: "municipal", text: "Municipal & Utilities (नगर निगम/टैक्स)" },
      { val: "health", text: "Local Healthcare & Emergency" }
    ];

    defaultOptions.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.val;
      optionEl.textContent = opt.text;
      serviceSelect.appendChild(optionEl);
    });
  }
}

// ==========================================
// 2. MAIN FILTER & CARD RENDERER FUNCTION (UPDATED)
// ==========================================
function filterLocalServices() {
  const rawState = document.getElementById('stateSelect').value;
  const selectedState = rawState.toLowerCase().replace(/_/g, '').trim();
  const selectedCategory = document.getElementById('serviceTypeSelect').value.toLowerCase().trim();
  const grid = document.getElementById('stateServicesGrid');

  grid.innerHTML = "";

  if (!selectedState) {
    grid.innerHTML = `<div class="initial-msg"><p style="color: #e74c3c; font-weight: 600;">⚠️ Please select a State to view available services.</p></div>`;
    return;
  }

  // Filter items matching selection
  const matches = localServicesDatabase.filter(item => {
    const dbState = item.state.toLowerCase().replace(/_/g, '').trim();
    const dbCategory = item.category.toLowerCase().trim();
    
    const stateMatch = dbState === selectedState;
    const categoryMatch = selectedCategory ? (dbCategory === selectedCategory) : true;
    
    return stateMatch && categoryMatch;
  });

  // Fallback: Agar kisi state ka specific entry data JSON array me nahi milta
  if (matches.length === 0) {
    const cleanStateName = rawState.replace(/_/g, ' ');
    const formattedState = cleanStateName.charAt(0).toUpperCase() + cleanStateName.slice(1);
    const cleanUrlName = rawState.replace(/_/g, '');
    
    const domainName = cleanUrlName === 'up' ? 'up' : cleanUrlName;
    const fallbackLink = `https://www.${domainName}.gov.in`;

    grid.innerHTML = `  
      <div class="service-card" style="grid-column: 1/-1;">  
        <div class="card-top">  
          <div class="card-icon-box" style="color: #0056b3; background-color: #eef6ff;"><i class="fa-solid fa-globe"></i></div>  
          <span class="card-badge">STATE PORTAL</span>  
        </div>  
        <h4 class="card-title">${formattedState.toUpperCase()} Official Portal</h4>  
        <p class="card-desc">Visit the main official state platform for digital citizen services, notifications, and administrative links.</p>  
        <div class="card-actions">  
          <a href="${fallbackLink}" target="_blank" class="btn-official" style="width:100%; text-align: center; background-color: #0056b3; color: white; padding: 10px; border-radius: 6px; text-decoration: none; display: inline-block;">Visit Official Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>  
        </div>  
      </div>`;  
    return;
  }

  // Display cards if matches found
  matches.forEach(item => {
    grid.innerHTML += createCardHTML(item);
  });
}

// HELPER FUNCTION: HTML CARD BOX TEMPLATE
function createCardHTML(item) {
  return `
    <div class="service-card">
      <div>
        <div class="card-top">
          <div class="card-icon-box" style="color: ${item.color || '#0056b3'}; background-color: #eef6ff;">
            <i class="fa-solid ${item.icon || 'fa-building-columns'}"></i>
          </div>
          <span class="card-badge">${item.badge || 'STATE SERVICE'}</span>
        </div>
        <h4 class="card-title">${item.title}</h4>
        <p class="card-desc">${item.desc}</p>
      </div>
    
      <div class="card-actions">  
        <a href="${item.link}" target="_blank" class="btn-details">View Details</a>  
        <a href="${item.link}" target="_blank" class="btn-official" style="background-color: ${item.color || '#0056b3'}; color: white;">Official Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>  
      </div>  
    </div>`;
}