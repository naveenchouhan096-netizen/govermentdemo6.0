// Global variable for JSON data
let localServicesDatabase = [];

// Fetch JSON Data
document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/database.json')
    .then(response => response.json())
    .then(data => {
      localServicesDatabase = data.localServicesDatabase;
    })
    .catch(error => console.error("Error loading JSON:", error));
});

// Filter Services according to State + Category
function filterLocalServices() {
  const selectedState = document.getElementById('stateSelect').value;
  const selectedCategory = document.getElementById('serviceTypeSelect').value;
  const grid = document.getElementById('stateServicesGrid');

  grid.innerHTML = "";

  if (!selectedState || !selectedCategory) {
    grid.innerHTML = `
      <p style="color: #e74c3c; grid-column: 1/-1; text-align: center; padding: 20px; font-weight: 600;">
        ⚠️ Please select both State and Service Category.
      </p>`;
    return;
  }

  // Matching algorithm (Only State and Category)
  const matches = localServicesDatabase.filter(item => 
    item.state === selectedState && 
    item.category === selectedCategory
  );

  if (matches.length === 0) {
    grid.innerHTML = `
      <p style="color: #555; grid-column: 1/-1; text-align: center; padding: 20px;">
        No active portal mapped for this combination currently.
      </p>`;
    return;
  }

  // Render cards
  matches.forEach(item => {
    grid.innerHTML += `
      <div class="card" onclick="window.open('${item.link}', '_blank')" style="background-color: ${item.color};">
        <div class="card-icon"><i class="fa-solid ${item.icon}"></i></div>
        <div class="card-info">
          <h4>${item.title}</h4>
          <p class="tag"><i class="fa-solid fa-location-dot"></i> ${item.state.toUpperCase()}</p>
          <p>${item.desc}</p>
        </div>
      </div>`;
  });
}