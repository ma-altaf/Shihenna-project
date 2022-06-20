var db = firebase.firestore();
const auth = firebase.auth();
var authUser;
auth.onAuthStateChanged((user) => {
    if (user) {
        authUser = user;
    } else {
        alert("please accept the privacy policy on the index page.");
        // TODO: change link to the correct one
        window.open("https://shihennaartist.web.app/", "_blank");
    }
});
const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
const container = document.querySelector(".othersImgView .container");
const footer = document.querySelector(".othersImgView footer");
const bookBtn = document.querySelector(".othersImgView footer #bookBtn");
const backBtn = document.querySelector(".othersImgView .container .back");
const backBtnText = document.querySelector(".back h3");
const pointer = document.querySelector(".cursor");
let images;
let imgContainers;
let firstParagraph;
let imagesRef = [];
let textsRef = [];
let orientationRef = [];

let dataRef = db.collection("others").doc(designID);

// log viewing this product
firebase.analytics().logEvent("view_item", {
    id: designID,
    category: "others",
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
    imgContainers = document.querySelectorAll(".othersImgView .container div");
    images = document.querySelectorAll(".othersImgView .container div img");
    firstParagraph = document.querySelector(".othersImgView .container p");

    images[0].addEventListener("load", () => {
        container.style.display = "grid";
        footer.style.display = "flex";

        gsap.timeline()
            .fromTo(
                images[0],
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: Power0.ease,
                }
            )
            .to(
                firstParagraph,
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: Power0.ease,
                },
                "-=0.2"
            )
            .to(
                backBtnText,
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: Power0.ease,
                    delay: 0.5,
                },
                "-=0.3"
            );

        images.forEach((img) => {
            addOnloadAnimation(img);
        });
    });
}

function addOnloadAnimation(image) {
    image.addEventListener("load", () => {
        gsap.fromTo(
            image,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 0.5,
                ease: Power0.ease,
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
        location.href = `./bookingPage.html?design=others/${designID}`;
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
    }, 550);
}

function leaveAnimation() {
    gsap.to(backBtnText, {
        opacity: 0,
        duration: 0.5,
        ease: Power0.ease,
    });

    gsap.to(firstParagraph, {
        opacity: 0,
        duration: 0.5,
        ease: Power0.ease,
    });

    images.forEach((img, i) => {
        gsap.to(img, {
            opacity: 0,
            duration: 0.5,
            ease: Power0.ease,
        });
    });
}
