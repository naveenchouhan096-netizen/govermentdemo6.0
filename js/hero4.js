// ===========================================
// HERO 4 JAVASCRIPT
// ===========================================


// ==============================
// Counter Animation
// ==============================

const counters = document.querySelectorAll(".counter");

const startCounter = () => {

    counters.forEach(counter => {

        const target = +counter.dataset.target;
        let count = 0;

        const speed = Math.max(10, target / 80);

        const updateCounter = () => {

            count += speed;

            if (count < target) {

                counter.innerText = Math.floor(count);

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target + "+";

            }

        };

        updateCounter();

    });

};


// ==============================
// Run Counter Once on Scroll
// ==============================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            startCounter();

            observer.disconnect();

        }

    });

}, {
    threshold: 0.4
});

const heroSection = document.querySelector(".hero4");

if (heroSection) {

    observer.observe(heroSection);

}


// ==============================
// Search Button
// ==============================

const searchBtn = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const value = searchInput.value.trim();

        if (value === "") {

            alert("Please enter a government service.");

            searchInput.focus();

            return;

        }

        alert(`Searching for "${value}"`);

    });

}


// Press Enter

if (searchInput) {

    searchInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            searchBtn.click();

        }

    });

}


// ==============================
// Service Pills Active Effect
// ==============================

const servicePills = document.querySelectorAll(".service-pill");

servicePills.forEach((pill) => {

    pill.addEventListener("click", () => {

        servicePills.forEach(item => {

            item.classList.remove("active");

        });

        pill.classList.add("active");

    });

});


// ==============================
// Status Card Hover Animation
// ==============================

const statusCards = document.querySelectorAll(".status-card");

statusCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px) scale(1.03)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


// ==============================
// Floating Dashboard Animation
// ==============================

const dashboard = document.querySelector(".hero4-dashboard");

if (dashboard) {

    let position = 0;
    let direction = 1;

    setInterval(() => {

        position += direction * 0.4;

        if (position >= 8) direction = -1;
        if (position <= -8) direction = 1;

        dashboard.style.transform = `translateY(${position}px)`;

    }, 40);

}


// ==============================
// Reveal Animation
// ==============================

const revealElements = document.querySelectorAll(

    ".hero4-content, .hero4-dashboard"

);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.25
});

revealElements.forEach((el) => {

    el.classList.add("hidden");

    revealObserver.observe(el);

});