// ==========================================
// GLOBALS: DATABASE HOLDER (LOADED VIA JSON)
// ==========================================
let localServicesDatabase = [];

// Page load hote hi JSON data asynchronously call hoga
document.addEventListener("DOMContentLoaded", () => {
  fetch('../data/state-service.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("JSON file are not load !Please check the Path .");
      }
      return response.json();
    })
    .then(data => {
      localServicesDatabase = data.localServicesDatabase;
      console.log("Database successfully loaded from JSON file.");

      // 1. Dropdown elements ko select karein
      const stateSelectEl = document.getElementById('stateSelect');
      const serviceTypeSelectEl = document.getElementById('serviceTypeSelect');

      // 2. Default par value set karein
      if (stateSelectEl) stateSelectEl.value = 'all';
      if (serviceTypeSelectEl) serviceTypeSelectEl.value = ''; // -- All Services --

      // 3. Categories populate karein aur data display karein
      updateCategories();
      filterLocalServices();
    })
    .catch(error => {
      console.error("Error loading local services database:", error);
      const grid = document.getElementById('stateServicesGrid');
      if (grid) {
        grid.innerHTML = `<div class="error-msg" style="grid-column: 1/-1; text-align: center; padding: 20px;">
          <p style="color: #e74c3c; font-weight: 600;">⚠️ JSON Database load nahi ho saka! Apne VS Code ke Live Server ko stop karke dobara chalaein.</p>
        </div>`;
      }
    });
});

// ==========================================
// 1. DYNAMIC CATEGORY DROPDOWN GENERATOR
// ==========================================
function updateCategories() {
  const stateSelect = document.getElementById('stateSelect').value.toLowerCase().replace(/_/g, '').trim();
  const serviceSelect = document.getElementById('serviceTypeSelect');

  // Purani categories ko clear karke default text banaye rakhein
  serviceSelect.innerHTML = '<option value="">-- All Services / Select Category --</option>';

  if (!stateSelect) return;

  // Agar "All States" select hua hai, to default filter dropdown options populate karein
  if (stateSelect === 'all') {
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
    return;
  }

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
        let cleanText = item.title.split('(')[0].split('|')[0].trim();
        optionEl.textContent = cleanText;
        serviceSelect.appendChild(optionEl);
      }
    });
  } else {
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
// 2. MAIN FILTER & CARD RENDERER FUNCTION
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

  const matches = localServicesDatabase.filter(item => {
    const dbState = item.state.toLowerCase().replace(/_/g, '').trim();
    const dbCategory = item.category.toLowerCase().trim();

    // Fix logic: Agar state 'all' hai aur category khali hai, to true return karein (saare services dikhane ke liye)
    const isStateMatch = (selectedState === 'all' || dbState === selectedState);
    const isCategoryMatch = (selectedCategory === '' || dbCategory === selectedCategory);

    return isStateMatch && isCategoryMatch;
  });

  if (matches.length === 0) {
    const cleanStateName = rawState.replace(/_/g, ' ');
    const formattedState = cleanStateName.charAt(0).toUpperCase() + cleanStateName.slice(1);
    const cleanUrlName = rawState.replace(/_/g, '');
    const fallbackLink = `https://www.${cleanUrlName === 'up' ? 'up' : cleanUrlName}.gov.in`;

    grid.innerHTML = `  
      <div class="service-card" style="grid-column: 1/-1;">  
        <div class="card-top">  
          <div class="card-icon-box" style="color: #0056b3; background-color: #eef6ff;"><i class="fa-solid fa-globe"></i></div>  
          <span class="card-badge">STATE PORTAL</span>  
        </div>  
        <h4 class="card-title">${selectedState === 'all' ? 'All States Official Portals' : formattedState.toUpperCase() + ' Official Portal'}</h4>  
        <p class="card-desc">Visit the official platform for digital citizen services, notifications, and administrative links.</p>  
        <div class="card-actions">  
          <a href="${selectedState === 'all' ? 'https://www.india.gov.in' : fallbackLink}" target="_blank" class="btn-official" style="width:100%; text-align: center; background-color: #0056b3; color: white; padding: 10px; border-radius: 6px; text-decoration: none; display: inline-block;">Visit Official Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>  
        </div>  
      </div>`;  
    return;
  }

  matches.forEach(item => {
    grid.innerHTML += createCardHTML(item);
  });
}

// HELPER FUNCTION: HTML CARD BOX TEMPLATE
function createCardHTML(item) {
  const safeTitle = (item.title || "").replace(/'/g, "\\'");
  const safeDesc = (item.desc || "").replace(/'/g, "\\'");
  const safeEligibility = (item.eligibility || "").replace(/'/g, "\\'");
  const safeFees = (item.fees || "").replace(/'/g, "\\'");
  const safeDocs = (item.documents || "").replace(/'/g, "\\'");
  const safeSteps = (item.steps || "").replace(/'/g, "\\'");

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
        <button type="button" onclick="showDetails('${safeTitle}', '${safeDesc}', '${safeEligibility}', '${safeFees}', '${safeDocs}', '${safeSteps}')" class="btn-details" style="background: transparent; border: none; cursor: pointer;">View Details</button>  
        <a href="${item.link}" target="_blank" class="btn-official" style="background-color: ${item.color || '#0056b3'}; color: white;">Official Site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>  
      </div>  
    </div>`;
}

// PREMIUM STRUCTURAL CONTENT MODAL ENGINE (WITH AUTODETECT WEBSITE LOGIC)
function showDetails(title, description, eligibility, fees, documents, steps) {
    document.getElementById('modalTitle').innerText = title;

    let finalEligibility = eligibility;
    let finalFees = fees;
    let finalDocs = documents;
    let finalSteps = steps;

    if (title.includes("Sewa Setu")) {
        finalEligibility = "Any permanent resident citizen of Assam.";
        finalFees = "Varies from ₹10 to ₹30 depending upon specific citizen certificate.";
        finalDocs = "[Aadhaar Redacted], Active Mobile Number, Address Proof, Passport size photo";
        finalSteps = "1. Click 'Official Site' to open Sewa Setu.<br>2. Click on Login/Register.<br>3. Fill out required data fields.<br>4. Upload certificates and complete submission.";
    } 
    else if (title.includes("EODB")) {
        finalEligibility = "Entrepreneurs, Business Owners, and Startups operating in the state.";
        finalFees = "Statutory Government Licensing fees applicable based on business category.";
        finalDocs = "Business PAN Card, Partnership Deed/MoA, Land Ownership/Lease papers, Trade Identification";
        finalSteps = "1. Open the Single Window Agency portal.<br>2. Register a new investor profile.<br>3. Apply for Clearances/NOCs.<br>4. Pay fees online and track status.";
    }
    else if (title.includes("Basundhara")) {
        finalEligibility = "Land owners and citizens needing revenue services in the state.";
        finalFees = "Nominal land mutation and record update charges.";
        finalDocs = "Old Land Revenue Receipts, Jamabandi Copy, Legal Heir Certificate (if applicable)";
        finalSteps = "1. Navigate to the Basundhara Portal.<br>2. Choose Land Mutation / Partition option.<br>3. Enter Dag/Patta numbers carefully.<br>4. Upload land records and submit form.";
    }
    else if (title.includes("Sadbhavana")) {
        finalEligibility = "Citizens with pending files or grievances in the state Secretariat.";
        finalFees = "Completely Free of Cost.";
        finalDocs = "Previous Application Ref Number, Copy of pending grievance letter, Identity Proof";
        finalSteps = "1. Open Sadbhavana web desk.<br>2. Enter your tracking number or old file number.<br>3. Describe the current status or grievance.<br>4. Submit to state cell for processing.";
    }

    if(!finalEligibility) finalEligibility = "Any resident citizen matching the specific state department criteria.";
    if(!finalFees) finalFees = "Free of Cost / Nominal Online Portal Charges.";
    if(!finalDocs) finalDocs = "Identity Proof (Identity Card, Voter Card), Address Proof / Resident Certificate, Passport size photograph";
    if(!finalSteps) finalSteps = "1. Click on 'Official Site' to open the state dashboard.<br>2. Complete register/login procedures.<br>3. Fill out the application form fields accurately.<br>4. Upload needed files & submit.";

    let bodyLayout = `
        <div class="modal-section-title"><i class="fa-solid fa-user-shield"></i> Eligibility</div>
        <p class="modal-section-desc">${finalEligibility}</p>
        
        <div class="modal-section-title"><i class="fa-solid fa-indian-rupee-sign"></i> Fees</div>
        <p class="modal-section-desc">${finalFees}</p>
        
        <div class="modal-section-title"><i class="fa-solid fa-folder-open"></i> Required Documents</div>
        <ul class="modal-list">
            ${finalDocs.includes('<li>') ? finalDocs : finalDocs.split(',').map(doc => `<li>${doc.trim()}</li>`).join('')}
        </ul>
        
        <div class="modal-section-title"><i class="fa-solid fa-list-check"></i> Steps to Apply</div>
        <p class="modal-section-desc">${finalSteps}</p>
    `;

    document.getElementById('modalBody').innerHTML = bodyLayout;
    document.getElementById('detailsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
