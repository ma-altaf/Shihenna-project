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

const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
const container = document.querySelector(".bridalImgView .container");
const footer = document.querySelector(".bridalImgView footer");
const bookBtn = document.querySelector(".bridalImgView footer #bookBtn");
const backBtn = document.querySelector(".bridalImgView .container .back");
const backBtnText = document.querySelector(".back h3");
const pointer = document.querySelector(".cursor");
let images;
let imgContainers;
let firstParagraph;
let imagesRef = [];
let textsRef = [];
let orientationRef = [];

let dataRef = db.collection("bridal").doc(designID);

// log viewing this product
firebase.analytics().logEvent("view_item", {
    id: designID,
    category: "bridal",
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
    data["imageRefs"].forEach((image) => {
        imagesRef.push(image);
    });

    data["orientationRefs"].forEach((orientation) => {
        orientationRef.push(orientation);
    });

    data["textRefs"].forEach((text) => {
        textsRef.push(text);
    });
    setUp();
}

function setUp() {
    container.style.display = "none";
    footer.style.display = "none";
    imagesRef.forEach((img, i) => {
        let imageTag = document.createElement("img");
        let imageText = document.createElement("p");
        let imgContainer = document.createElement("div");

        imageTag.src = img;
        imageText.innerHTML = textsRef[i];
        imgContainer.appendChild(imageTag);

        if (i == 0) {
            if (orientationRef[i] == "landscape") {
                imgContainer.style.gridColumnStart = 1;
                imgContainer.style.gridColumnEnd = 3;
                imageText.style.gridColumnStart = 1;
                imageText.style.gridColumnEnd = 3;
            }
            container.appendChild(imgContainer);
            container.appendChild(imageText);
        } else {
            if (orientationRef[i] == "landscape") {
                imgContainer.style.gridColumnStart = 1;
                imgContainer.style.gridColumnEnd = 3;
            }

            if (textsRef[i] != "") {
                imgContainer.appendChild(imageText);
            }

            imageTag.addEventListener("mouseenter", () => {
                imageText.style.transform = "translateY(0%)";
            });
            imageTag.addEventListener("mouseleave", () => {
                imageText.style.transform = "translateY(100%)";
            });
            container.appendChild(imgContainer);
        }
    });

    entranceAnimation();
}

function entranceAnimation() {
    imgContainers = document.querySelectorAll(".bridalImgView .container div");
    images = document.querySelectorAll(".bridalImgView .container div img");
    firstParagraph = document.querySelector(".bridalImgView .container p");

    images[0].addEventListener("load", () => {
        container.style.display = "grid";
        footer.style.display = "flex";

        gsap.fromTo(
            images[0],
            {
                y: "-100%",
            },
            {
                y: 0,
                duration: 1,
                ease: Power0.ease,
            }
        );

        images.forEach((img, i) => {
            addOnloadAnimation(img, imgContainers[i]);
        });

        gsap.timeline()
            .fromTo(
                backBtnText,
                {
                    y: "200%",
                },
                {
                    y: 0,
                    duration: 1,
                    ease: Power0.ease,
                    delay: 1.1,
                }
            )
            .to(firstParagraph, {
                opacity: 1,
                duration: 1,
                ease: Power0.ease,
            });
    });
}

function addOnloadAnimation(image) {
    image.addEventListener("load", () => {
        gsap.fromTo(
            image,
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 1,
                ease: Linear.easeNone,
            }
        );
    });
}

bookBtn.addEventListener("click", () => {
    bookBtn.style.display = "none";
    gsap.timeline()
        .to(footer, {
            position: "fixed",
            height: "100vh",
            duration: 0.7,
            ease: Circ.easeOut,
        })
        .to(footer, {
            backgroundColor: "#f5f5f0",
            duration: 0.5,
            ease: Power1.easeOut,
        });

    setTimeout(() => {
        location.href = `./bookingPage.html?design=bridal/${designID}`;
    }, 1200);
});

// back button mouse animation
backBtnText.addEventListener("mouseover", () => pointer.classList.add("grow"));
backBtnText.addEventListener("mouseleave", () =>
    pointer.classList.remove("grow")
);

function back() {
    leaveAnimation();

    setTimeout(() => {
        window.history.back();
    }, 1000);
}

function leaveAnimation() {
    gsap.fromTo(
        backBtnText,
        {
            y: 0,
        },
        {
            y: "200%",
            duration: 1,
            ease: Power0.ease,
        }
    );

    gsap.to(firstParagraph, {
        opacity: 0,
        duration: 1,
        ease: Power0.ease,
    });

    images.forEach((img, i) => {
        gsap.fromTo(
            img,
            {
                y: 0,
            },
            {
                y: "-100%",
                duration: 1,
                ease: Power0.ease,
            }
        );
        gsap.fromTo(
            imgContainers[i],
            {
                y: 0,
            },
            {
                y: "100%",
                duration: 1,
                ease: Power0.ease,
            }
        );
    });
}
