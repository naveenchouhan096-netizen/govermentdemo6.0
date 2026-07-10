<<<<<<< HEAD
// =====================================
// Hero Timeline
// =====================================

const tl = gsap.timeline();

// Badge
tl.from(".badge", {
    y: -40,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out"
})

// Heading
.from(".hero-left h1", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
}, "-=0.3")

// Description
.from(".description", {
    y: 40,
    opacity: 0,
    duration: 0.8
}, "-=0.5")

// Search Box
.from(".search-box", {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
}, "-=0.3")

// Popular Tags
.from(".popular a", {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
}, "-=0.3")

// Buttons
.from(".buttons button", {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.6
}, "-=0.2")

// Right Side
.from(".hero-right", {
    x: 100,
    opacity: 0,
    duration: 1
}, "-=1");



// =====================================
// Floating Cards Entry
// =====================================

tl.fromTo(".card",
{
    scale:0,
    opacity:0
},
{
    scale:1,
    opacity:1,
    stagger:0.2,
    duration:1,
    ease:"back.out(1.7)"
});

// =====================================
// Infinite Floating Animation
// =====================================

gsap.to(".card1",{

    y:-20,

    duration:2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});

gsap.to(".card2",{

    y:18,

    duration:2.6,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});

gsap.to(".card3",{

    y:-15,

    duration:2.2,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});

gsap.to(".card4",{

    y:20,

    duration:2.8,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});

gsap.to(".card5",{

    y:-18,

    duration:2.4,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});



// =====================================
// Background Circles
// =====================================

gsap.to(".one",{

    scale:1.1,

    duration:4,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"
});

gsap.to(".two",{

    x:20,

    duration:5,

    repeat:-1,

    yoyo:true
});

gsap.to(".three",{

    y:-20,

    duration:4,

    repeat:-1,

    yoyo:true
});



// =====================================
// Mouse Parallax
// =====================================

document.addEventListener("mousemove",(e)=>{

    let x=(window.innerWidth/2-e.clientX)/40;

    let y=(window.innerHeight/2-e.clientY)/40;

    gsap.to(".hero-right",{

        x:x,

        y:y,

        duration:1,

        ease:"power2.out"
    });

});



// =====================================
// Button Hover Animation
// =====================================

document.querySelectorAll("button").forEach((btn)=>{

btn.addEventListener("mouseenter",()=>{

gsap.to(btn,{

scale:1.08,

duration:.3

})

})

btn.addEventListener("mouseleave",()=>{

gsap.to(btn,{

scale:1,

duration:.3

})

})

})



// =====================================
// Search Box Pulse
// =====================================

gsap.to(".search-box",{

boxShadow:"0px 25px 60px rgba(21,101,255,.20)",

repeat:-1,

yoyo:true,

duration:2
=======
// Mobile Hamburger Animation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  
  // Icon Change Effect (Bars to Cross Icon)
  const icon = hamburger.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
>>>>>>> 165f92da1abb1c3a4555d3d7c2a2f86f1e05f8fd
});