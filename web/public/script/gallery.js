const auth = firebase.auth();
var authUser;
auth.onAuthStateChanged((user) => {
    if (user) {
        authUser = user;
    } else {
        alert("Please accept the privacy policy on the index page.");
        window.open("https://shihennaartist.web.app/", "_blank");
    }
});
const casualBlock = document.querySelector(".galleryPage .gallery .casual");
const bridalBlock = document.querySelector(".galleryPage .gallery .bridal");
const othersBlock = document.querySelector(".galleryPage .gallery .others");
const title = document.querySelectorAll(".galleryPage .title h3");
const images = document.querySelectorAll(".galleryPage .gallery .image img");
const categoryText = document.querySelectorAll(".galleryPage .category li");
const categoryUnderline = document.querySelectorAll(
    ".galleryPage .category li div"
);
const backBtn = document.querySelector(".galleryPage .title .back");
const pointer = document.querySelector(".cursor");
let activeCategory = parseInt(sessionStorage.getItem("category") || 0);
let activePageNum = parseInt(sessionStorage.getItem("page") || 0);

displayCategory();

function GalleryEntrance() {
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
            ease: Power1.easeOut,
            stagger: 0.2,
        }
    );

    // categories
    gsap.timeline()
        .fromTo(
            categoryText,
            {
                y: "200%",
            },
            {
                y: 0,
                duration: 0.5,
                ease: Power1.easeOut,
                stagger: 0.1,
                delay: 0.5,
            }
        )
        .fromTo(
            categoryUnderline,
            {
                x: "-101%",
            },
            {
                x: 0,
                duration: 0.3,
                ease: Power1.easeIn,
                stagger: 0.1,
            }
        )
        .call(
            // set the default category
            categoryUnderlineStateAnimation
        );
}

// when leaving gallery animation for the images
function leaveImageAnimation() {
    switch (activeCategory) {
        case 0:
            imagesOutView("right", 0.5);
            break;
        case 1:
            imagesOutView("down", 0.5);
            break;
        case 2:
            gsap.to(images, {
                scale: 0.3,
                opacity: 0,
                duration: 0.5,
                ease: Power1.easeOut,
            });
            break;
        default:
            console.log("leave page warning");
            break;
    }
}

// add the onclick event to the categories
categoryText.forEach((text, i) => {
    text.addEventListener("click", () => {
        if (i != activeCategory) {
            leaveCategoryAnimation();
            activeCategory = i;
            sessionStorage.setItem("category", i);

            categoryUnderlineStateAnimation();

            setTimeout(() => {
                displayCategory();
            }, 950);
        }
    });
});

// animate the undeline in category
function categoryUnderlineStateAnimation() {
    categoryUnderline.forEach((_, n) => {
        gsap.to(categoryUnderline[n], {
            x: activeCategory == n ? 0 : "-101%",
            duration: 0.3,
            ease: Power1.easeIn,
        });
    });
}

// set display none/grid for the correct category in view
function displayCategory() {
    categoryText.forEach((_, i) => {
        let active = i == activeCategory;
        switch (i) {
            case 0:
                //casual
                casualBlock.style.display = active ? "grid" : "none";
                break;
            case 1:
                bridalBlock.style.display = active ? "grid" : "none";
                break;
            case 2:
                othersBlock.style.display = active ? "grid" : "none";
                break;

            default:
                console.log("unkown category");
                break;
        }
    });
}

// get the animations for leaving the current category
function leaveCategoryAnimation() {
    switch (activeCategory) {
        case 0:
            imagesOutView("down", 0.5);
            break;
        case 1:
            imagesOutView("up", 0.5);
            break;
        case 2:
            gsap.timeline()
                .to(images, {
                    scale: 0.3,
                    opacity: 0,
                    duration: 0.5,
                    ease: Power1.easeOut,
                })
                .to(images, {
                    scale: 1,
                    opacity: 1,
                    duration: 0,
                    delay: 1,
                });

            break;
        default:
            console.log("warning");
            break;
    }
}

// image action and mouse over transformation
images.forEach((img) => {
    img.addEventListener("mouseover", () => {
        cursor.classList.add("viewCursor");
        cursor.innerHTML = "➾";
    });
    img.addEventListener("click", () => {
        cursor.classList.add("viewCursor");
        cursor.innerHTML = "➔";
        imageViewTansition();
    });
    img.addEventListener("mouseleave", () => {
        cursor.classList.remove("viewCursor");
        cursor.innerHTML = "";
    });
});

//going into imageView page transition animation
function imageViewTansition() {
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

    // categories
    gsap.timeline()
        .to(categoryUnderline, {
            x: "101%",
            duration: 0.3,
            ease: Power1.easeIn,
            stagger: 0.1,
            delay: 0.5,
        })
        .fromTo(
            categoryText,
            {
                y: 0,
            },
            {
                y: "200%",
                duration: 0.5,
                ease: Power1.easeIn,
                stagger: 0.1,
            }
        )
        .call(leaveImageAnimation);
}

// back button mouse animation
backBtn.addEventListener("mouseover", () => pointer.classList.add("grow"));
backBtn.addEventListener("mouseleave", () => pointer.classList.remove("grow"));

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

    // categories
    gsap.timeline()
        .to(categoryUnderline, {
            x: "101%",
            duration: 0.3,
            ease: Power1.easeIn,
            stagger: 0.1,
            delay: 0.5,
        })
        .fromTo(
            categoryText,
            {
                y: 0,
            },
            {
                y: "200%",
                duration: 0.5,
                ease: Power1.easeIn,
                stagger: 0.1,
            }
        )
        .call(leaveImageAnimation);

    setTimeout(() => {
        window.history.back();
    }, 2500);
}

// animate the images out of view in the direction
function imagesOutView(direction, duration) {
    if (direction == "up" || direction == "down") {
        // images
        gsap.to(images, {
            x: 0,
            y: direction == "up" ? "-101%" : "101%",
            duration: duration,
            ease: Power1.easeInOut,
            stagger: 0.1,
        });
    } else if (direction == "left" || direction == "right") {
        // images
        gsap.to(images, {
            y: 0,
            x: direction == "right" ? "101%" : "-101%",
            duration: duration,
            ease: Power1.easeInOut,
            stagger: 0.1,
        });
    } else {
        console.log("unkown direction: " + direction);
    }
}
