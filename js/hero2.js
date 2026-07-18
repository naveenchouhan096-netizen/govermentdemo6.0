const featureBoxes = document.querySelectorAll(".feature-box");

featureBoxes.forEach((box) => {

    box.addEventListener("mouseenter", () => {

        box.style.transform = "translateX(12px)";

    });

    box.addEventListener("mouseleave", () => {

        box.style.transform = "translateX(0)";

    });

});

// Scroll Reveal

const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".hero2-left,.hero2-right").forEach((el)=>{

    el.classList.add("hidden");

    observer.observe(el);

});