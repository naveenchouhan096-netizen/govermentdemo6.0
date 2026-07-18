const cards = document.querySelectorAll(".service-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        cards.forEach(item => item.classList.remove("active"));

        card.classList.add("active");

    });

});