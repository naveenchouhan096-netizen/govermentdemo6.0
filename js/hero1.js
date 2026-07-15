// ================================
// HERO 1 JAVASCRIPT
// ================================


// Floating cards animation

const floatingCards = document.querySelectorAll(".floating-card");

floatingCards.forEach((card, index) => {

    card.style.animationDelay = `${index * 0.3}s`;

});



// Search functionality

const searchInput = document.querySelector(".hero-search input");
const searchBtn = document.querySelector(".search-btn");


if(searchBtn){

    searchBtn.addEventListener("click",()=>{

        let value = searchInput.value.trim();

        if(value !== ""){
            console.log("Searching for:", value);
        }
        else{
            alert("Please enter service name");
        }

    });

}



// Popular service links

const popularLinks = document.querySelectorAll(".popular-link");


popularLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        searchInput.value = link.innerText;

    });

});



// Dashboard hover effect

const dashboard = document.querySelector(".dashboard-card");


if(dashboard){

    dashboard.addEventListener("mouseenter",()=>{

        dashboard.style.transform="translateY(-10px)";

    });


    dashboard.addEventListener("mouseleave",()=>{

        dashboard.style.transform="translateY(0)";

    });

}