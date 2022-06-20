const auth = firebase.auth();
const userAgreementUI =
    '<div id="usageAgreement"><p>This webpage uses firebase and its services such as cloud firestore, authentication and hosting. <br /> Anonymous authentication is used to secure the data hence by clicking "agree" you agree to be signed in anonymously</p><button id="agreeBtn" onclick="signinAnonymously()">Agree</button></div>';
const userUI = document.querySelector(".userUI");
let agreeBtn;
var currentUser;

// display the agreement only if the user has not signed in already
auth.onAuthStateChanged((user) => {
    if (user) {
        userUI.style.display = "none";
    } else {
        userUI.innerHTML = userAgreementUI;
        agreeBtn = userUI.querySelector("button");
    }
});

// agree button function
function signinAnonymously() {
    agreeBtn.disabled = true;
    auth.signInAnonymously().catch((error) => {
        alert("sign in could not be carried out:", error.message);
        agreeBtn.disabled = false;
    });
}

// trigger the landing animation
window.addEventListener("load", () => {
    IndexEntrance();
    setGreeting();
});

// mobile burger animation
function navSlide() {
    const nav = document.querySelector(".nav-links");
    const burgerBars = document.querySelector(".burger");

    nav.classList.toggle("nav-active");
    burgerBars.classList.toggle("burger-active");
}

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
        cursor.classList.add("grow");
    });
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("grow");
    });
});

function scroller() {
    window.scrollBy({
        top: 500,
        behavior: "smooth",
    });
}

gsap.registerPlugin(ScrollTrigger);

// profile pic parallax
gsap.fromTo(
    ".image",
    {
        y: 0,
        x: 0,
    },
    {
        scrollTrigger: {
            scrub: true,
        },
        y: "100%",
        x: "100%",
    }
);

// gallery parallax in index
gsap.utils.toArray(".gallery section").forEach((section, i) => {
    const bg = section.querySelector(".bg");

    //set background image
    bg.style.backgroundImage = `url(./images/image${i + 1}.jpg)`;

    // scrolling parallax effect
    bg.style.backgroundPosition = `50% ${innerHeight / 2}px`;
    gsap.to(bg, {
        scrollTrigger: {
            trigger: section,
            scrub: true,
        },
        ease: Linear.easeNone,
        backgroundPosition: `50% ${-innerHeight / 2}px`,
    });
});

// view more entrance transition
gsap.fromTo(
    ".viewMore",
    {
        y: "5rem",
    },
    {
        y: 0,
        scrollTrigger: {
            trigger: ".viewMoreSection",
            scrub: 0.5,
            start: "90% bottom",
            end: "bottom 85%",
        },
    }
);
