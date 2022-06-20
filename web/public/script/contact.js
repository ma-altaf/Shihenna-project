const backBtn = document.querySelector(".contactPage .title .back");
const title = document.querySelectorAll(".contactPage .title h3");
const socialTextCover = document.querySelectorAll(".contactPage .socialLink");
const socialText = document.querySelectorAll(".contactPage .socialLink .text");
const socialLink = document.querySelectorAll(
    ".contactPage .socialLinksBlock .socialLink"
);
const socialLinkCover = document.querySelectorAll(
    ".contactPage .socialLinksBlock .socialLink .linkCover"
);
const socialLinkContent = document.querySelectorAll(
    ".contactPage .socialLinksBlock .socialLink .linkCover p"
);

// back button mouse animation
backBtn.addEventListener("mouseover", () => cursor.classList.add("grow"));
backBtn.addEventListener("mouseleave", () => cursor.classList.remove("grow"));

function contactEntrance() {
    // landing animations
    // title and back arrow
    gsap.fromTo(
        title,
        {
            y: "101%",
        },
        {
            y: 0,
            duration: 0.5,
            ease: Power1.easeIn,
            stagger: 0.2,
        }
    );
    // social links text transition
    gsap.fromTo(
        socialTextCover,
        {
            y: "101%",
        },
        {
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: Power0.easeIn,
            delay: 0.5,
        }
    );
    gsap.fromTo(
        socialText,
        {
            y: "-101%",
        },
        {
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: Power0.easeIn,
            delay: 0.5,
        }
    );
}

socialLink.forEach((link, i) => {
    // move cover down
    gsap.from(socialLinkCover, {
        y: "50%",
    });
    // move content up
    gsap.from(socialLinkContent, {
        y: "-102%",
    });

    // hover animation
    link.addEventListener("mouseover", () => {
        // cover animation
        gsap.to(socialLinkCover[i], {
            y: 0,
            duration: 0.5,
            ease: Power1.easeNone,
        });
        // text animation
        gsap.to(socialLinkContent[i], {
            y: 0,
            duration: 0.5,
            ease: Power1.easeNone,
        });
    });
    // mouse leave animation
    link.addEventListener("mouseleave", () => {
        // cover animation
        gsap.to(socialLinkCover[i], {
            y: "50%",
            duration: 0.5,
            ease: Power1.easeNone,
        });
        // text animation
        gsap.to(socialLinkContent[i], {
            y: "-102",
            duration: 0.5,
            ease: Power1.easeNone,
        });
    });
});

// copy email
function copyEmail() {
    if (window.screen.width > 768) {
        const emailBox = document.getElementById("email");
        const email = emailBox.textContent;
        copyText(email);
        const PrevContent = emailBox.innerHTML;
        emailBox.innerHTML = "EMAIL COPIED!";
        setTimeout(() => {
            emailBox.innerHTML = PrevContent;
        }, 1000);
    }
}

function copyText(text) {
    const elem = document.createElement("textarea");
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}

// back animation
function back() {
    // title and back arrow
    gsap.fromTo(
        title,
        {
            y: 0,
        },
        {
            y: "101%",
            duration: 0.5,
            ease: Power1.easeIn,
            stagger: 0.2,
        }
    );

    // social links text transition
    gsap.fromTo(
        socialTextCover,
        {
            y: 0,
        },
        {
            y: "101%",
            stagger: 0.1,
            duration: 1,
            ease: Power0.easeIn,
            delay: 0.5,
        }
    );
    gsap.fromTo(
        socialText,
        {
            y: 0,
        },
        {
            y: "-101%",
            stagger: 0.1,
            duration: 1,
            ease: Power0.easeIn,
            delay: 0.5,
        }
    );

    setTimeout(() => {
        window.history.back();
    }, 1600);
}
