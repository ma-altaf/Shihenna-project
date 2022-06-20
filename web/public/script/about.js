const textContent = document.querySelectorAll(".aboutPage .contentText");
const title = document.querySelectorAll(".aboutPage .title p");
const titleCover = document.querySelectorAll(".aboutPage .title");
const aboutImages = document.querySelectorAll(".aboutPage #image");
const backBtn = document.querySelector(".aboutPage .aboutView .back");
const anchorTag = document.querySelectorAll(".aboutPage .Anchor");

console.info("Developed by Altaf Agowun");
console.error(
    "warning: the code for this website is not the best, do not take it as an example of how to code!"
);

function aboutEntrance() {
    //back button transition
    gsap.fromTo(
        backBtn,
        {
            opacity: 0,
        },
        {
            opacity: 1,
            duration: 0.5,
            ease: Power1.easeIn,
        }
    );

    // title animation
    gsap.fromTo(
        titleCover[0],
        {
            y: "101%",
        },
        {
            y: 0,
            duration: 1.3,
            ease: Linear.easeNone,
        }
    );
    gsap.fromTo(
        title[0],
        {
            y: "-101%",
        },
        {
            y: 0,
            duration: 1.3,
            ease: Linear.easeNone,
        }
    );

    // about image transition
    gsap.fromTo(
        aboutImages,
        {
            backgroundPositionY: "201%",
            y: "101%",
        },
        {
            backgroundPositionY: 45,
            y: 0,
            duration: 1.2,
            ease: Power1.easeOut,
            delay: 0.2,
        }
    );

    // paragraph transition
    gsap.fromTo(
        textContent,
        {
            y: "20%",
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: Power1.easeIn,
        }
    );
}

anchorTag.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        let target = e.target.href;
        leaveAnimation(target);
    });
});

backBtn.addEventListener("mouseenter", () => {
    cursor.classList.add("grow");
});
backBtn.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
});

// back animatioon and function
function back() {
    leaveAnimation("./index.html");
}

function leaveAnimation(link) {
    // animate leave

    //back button transition
    gsap.fromTo(
        backBtn,
        {
            opacity: 1,
        },
        {
            opacity: 0,
            duration: 0.3,
            ease: Power1.easeIn,
        }
    );

    // title animation
    gsap.fromTo(
        titleCover,
        {
            y: 0,
        },
        {
            y: "101%",
            duration: 1,
            ease: Power1.easeIn,
        }
    );
    gsap.fromTo(
        title,
        {
            y: 0,
        },
        {
            y: "-101%",
            duration: 1,
            ease: Power1.easeIn,
        }
    );

    // about image transition
    gsap.to(aboutImages, {
        y: "101%",
        backgroundPositionY: "201%",
        duration: 1.3,
        ease: Power1.easeOut,
        delay: 0.2,
    });

    // paragraph transition
    gsap.fromTo(
        textContent,
        {
            y: 0,
            opacity: 1,
        },
        {
            y: "20%",
            opacity: 0,
            duration: 0.8,
            ease: Power1.easeIn,
            delay: 0.7,
        }
    );

    setTimeout(() => {
        window.location.href = link;
    }, 1500);
}

//dev: A.Altaf
