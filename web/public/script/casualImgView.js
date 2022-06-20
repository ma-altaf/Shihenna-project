var db = firebase.firestore();
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
const backBtn = document.querySelector(".back");
const backBtnText = document.querySelector(".back h3");
const linkContainer = document.querySelector(".container .link");
const container = document.querySelector(".container");
const imagesView = document.querySelector(".container .imagesView");
const IDContainer = document.getElementById("IDLabel");
const IDLabel = document.querySelector("#IDLabel p");
let images;
let linkItems;
const bookBtn = document.querySelector(".bookBtn");

const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
let ID;
let imagesRef = [];

let dataRef = db.collection("casual").doc(designID);

// log viewing this product
firebase.analytics().logEvent("view_item", {
    id: designID,
    category: "casual",
});

var getOptions = {
    source: "cache",
};

dataRef
    .get(getOptions)
    .then((doc) => {
        populateData(doc.data());
    })
    .catch((error) => {
        dataRef.get().then((doc) => {
            populateData(doc.data());
        });
    });

function populateData(data) {
    ID = data["ID"];
    data["imageRefs"].forEach((image) => {
        imagesRef.push(image);
    });
    setUp();
}

function setUp() {
    IDLabel.textContent = ID;

    imagesRef.forEach((img, i) => {
        let imageTag = document.createElement("img");
        let imageLink = document.createElement("div");

        imageLink.classList.add("item");

        imageLink.addEventListener("click", () => {
            removeSelected();
            imageLink.classList.add("selected");

            imageTag.scrollIntoView();
        });

        imageTag.src = img;

        imagesView.appendChild(imageTag);
        linkContainer.appendChild(imageLink);

        if (i == 0) {
            imageLink.click();
        }
    });

    entranceAnimation();
}

function entranceAnimation() {
    linkItems = document.querySelectorAll(".container .link .item");
    images = document.querySelectorAll(".container .imagesView img");

    images[0].addEventListener("load", () => {
        gsap.timeline()
            .fromTo(
                imagesView,
                {
                    x: "-100%",
                },
                {
                    x: 0,
                    duration: 0.7,
                    ease: Power1.ease,
                }
            )
            .fromTo(
                images[0],
                {
                    x: "100%",
                },
                {
                    x: 0,
                    duration: 0.7,
                    ease: Power1.ease,
                },
                "-=0.7"
            )
            .to(imagesView, {
                height: "90vh",
                duration: 0.7,
                ease: Power1.ease,
            })
            .fromTo(
                linkItems,
                {
                    x: "-200%",
                },
                {
                    x: 0,
                    duration: 0.5,
                    ease: Power1.easeOut,
                    stagger: 0.1,
                }
            )
            .to(IDContainer, {
                x: 0,
                duration: 0.7,
                ease: Power0.ease,
            });

        gsap.fromTo(
            backBtnText,
            {
                x: "200%",
            },
            {
                x: 0,
                duration: 0.7,
                ease: Power1.easeOut,
                delay: 2.1,
            }
        );

        gsap.to(bookBtn, {
            y: 0,
            duration: 1.5,
            ease: Power1.ease,
            delay: 1,
        });
    });
}

function removeSelected() {
    const link = document.querySelectorAll(".container .link div");

    link.forEach((li) => {
        li.classList.remove("selected");
    });
}

backBtnText.addEventListener("mouseenter", () => {
    cursor.classList.add("grow");
});
backBtnText.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
});

// back animatioon and function
function back() {
    leaveAnimation(true);
    setTimeout(() => {
        window.history.back();
    }, 2100);
}

bookBtn.addEventListener("click", () => {
    leaveAnimation(false);
    setTimeout(() => {
        location.href = `./bookingPage.html?design=casual/${designID}`;
    }, 2100);
});

function leaveAnimation(back) {
    gsap.fromTo(
        backBtnText,
        {
            x: 0,
        },
        {
            x: "200%",
            duration: 0.5,
            ease: Power1.easeOut,
        }
    );

    gsap.to(bookBtn, {
        y: "50vh",
        duration: 0.5,
        ease: Power1.ease,
    });

    gsap.timeline()
        .fromTo(
            linkItems,
            {
                x: 0,
            },
            {
                x: "-200%",
                duration: 0.3,
                ease: Power1.easeOut,
                stagger: 0.1,
            }
        )
        .to(IDContainer, {
            x: "200%",
            duration: 0.7,
            ease: Power0.ease,
        })
        .fromTo(
            images,
            {
                x: 0,
            },
            {
                x: back ? "-100%" : "100%",
                duration: 0.7,
                ease: Power0.ease,
            }
        )
        .fromTo(
            imagesView,
            {
                x: 0,
            },
            {
                x: back ? "100%" : "-100%",
                duration: 0.7,
                ease: Power0.ease,
            },
            "-=0.7"
        );
}
