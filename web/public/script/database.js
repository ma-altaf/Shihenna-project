var db = firebase.firestore();

const NumImgPerPage = 4;
const navBtn = document.querySelectorAll(".pageNav");
const nextBtn = document.getElementById("next");
const previousBtn = document.getElementById("previous");
let lastVisible = Number(sessionStorage.getItem("lastVisible")) || null;
let firstVisible = Number(sessionStorage.getItem("firstVisible")) || null;

// get intial set of docs
function getCategoryName() {
    switch (activeCategory) {
        case 0:
            return "casual";
        case 1:
            return "bridal";
        case 2:
            return "others";
        default:
            console.log("category error");
            break;
    }
}

categoryText.forEach((text, i) => {
    text.addEventListener("click", () => {
        activeCategory = i;
        // reset the page number
        sessionStorage.setItem("page", 0);

        categoryChangeAnimation();
    });
});

function categoryChangeAnimation() {
    previousBtn.style.display = "none";
    nextBtn.style.display = "block";
    // get first page content
    db.collection(getCategoryName())
        .orderBy("createdAt", "desc")
        .limit(NumImgPerPage)
        .get()
        .then((documentSnapshots) => {
            setTimeout(() => {
                images.forEach((image) => {
                    image.onload = function () {
                        enterCategoryAnimation(image);
                        image.onload = null;
                    };
                });
                if (documentSnapshots.docs.length != 0) {
                    populateImg(documentSnapshots.docs);
                }
            }, 955);
        })
        .catch((e) => {
            console.log("error: " + e);
        });
}

// when loading the page
initialImageAnimation();

function initialImageAnimation() {
    if (Number(sessionStorage.getItem("page")) == 0) {
        previousBtn.style.display = "none";
        // get first page content
        db.collection(getCategoryName())
            .orderBy("createdAt", "desc")
            .limit(NumImgPerPage)
            .get()
            .then((documentSnapshots) => {
                setTimeout(() => {
                    images.forEach((image) => {
                        image.onload = function () {
                            enterImageAnimation(image);
                            image.onload = null;
                        };
                    });
                    if (documentSnapshots.docs.length != 0) {
                        populateImg(documentSnapshots.docs);
                    }
                }, 2200);
            })
            .catch((e) => {
                console.log("error: " + e);
            });
    } else {
        db.collection(getCategoryName())
            .orderBy("createdAt", "desc")
            .startAt(firstVisible)
            .limit(NumImgPerPage)
            .get()
            .then((documentSnapshots) => {
                setTimeout(() => {
                    images.forEach((image) => {
                        image.onload = function () {
                            enterImageAnimation(image);
                            image.onload = null;
                        };
                    });
                    populateImg(documentSnapshots.docs);
                }, 2200);
            })
            .catch((e) => {
                console.log("error: " + e);
            });
    }
}

nextBtn.addEventListener("click", () => {
    next();
    previousBtn.style.display = "block";
});

previousBtn.addEventListener("click", () => {
    previous();
    nextBtn.style.display = "block";
});

function previous() {
    db.collection(getCategoryName())
        .orderBy("createdAt", "desc")
        .endBefore(firstVisible)
        .limitToLast(NumImgPerPage)
        .get()
        .then((documentSnapshots) => {
            window.scrollTo(0, 0);
            populateImg(documentSnapshots.docs);
            sessionStorage.setItem("page", --activePageNum);
        })
        .catch(() => {
            previousBtn.style.display = "none";
        });
}

function next() {
    db.collection(getCategoryName())
        .orderBy("createdAt", "desc")
        .startAfter(lastVisible)
        .limit(NumImgPerPage)
        .get()
        .then((documentSnapshots) => {
            window.scrollTo(0, 0);
            populateImg(documentSnapshots.docs);
            sessionStorage.setItem("page", ++activePageNum);
        })
        .catch(() => {
            nextBtn.style.display = "none";
        });
}

function populateImg(docs) {
    if (docs.length != 0) {
        // remove the previous image
        images.forEach((img) => {
            img.style.display = "none";
        });
    }

    lastVisible = docs[docs.length - 1].data()["createdAt"];
    firstVisible = docs[0].data()["createdAt"];

    sessionStorage.setItem("lastVisible", lastVisible);
    sessionStorage.setItem("firstVisible", firstVisible);
    docs.forEach((doc, i) => {
        images[NumImgPerPage * activeCategory + i].style.display = "block";
        images[NumImgPerPage * activeCategory + i].src = "";
        images[NumImgPerPage * activeCategory + i].src =
            doc.data()["imageRefs"][0];
        images[NumImgPerPage * activeCategory + i].addEventListener(
            "click",
            () => {
                setTimeout(() => {
                    view(doc.id);
                }, 3000);
            }
        );
    });
}

// call the type of larger image view
function view(docID) {
    switch (activeCategory) {
        case 0:
            location.href = `./casualImgView.html?design=${docID}`;
            break;
        case 1:
            location.href = `./bridalImgView.html?design=${docID}`;
            break;
        case 2:
            location.href = `./othersImgView.html?design=${docID}`;
            break;
        default:
            location.href = "./gallery.html";
            break;
    }
}

// when entering gallery page animation for the images
function enterImageAnimation(image) {
    switch (activeCategory) {
        case 0:
            imageOutView(image, "left", 0);
            imageInView(image);
            break;
        case 1:
            imageOutView(image, "down", 0);
            imageInView(image);
            break;
        case 2:
            imageInView(image);
            gsap.fromTo(
                image,
                {
                    scale: 0.3,
                    opacity: 0,
                    duration: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    ease: Power1.easeInOut,
                }
            );
            break;
        default:
            console.log("enter page warning");
            break;
    }
}

// get aimation for entering the next category
function enterCategoryAnimation(image) {
    switch (activeCategory) {
        case 0:
            imageOutView(image, "down", 0);
            imageInView(image);
            break;
        case 1:
            imageOutView(image, "up", 0);
            imageInView(image);
            break;
        case 2:
            gsap.fromTo(
                image,
                {
                    x: 0,
                    y: 0,
                    scale: 0.3,
                    opacity: 0,
                    duration: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: Power1.easeInOut,
                }
            );
            imageInView(image);
            break;
        default:
            console.log("warning");
            break;
    }
}

// animate the images in view
function imageInView(image) {
    // images
    gsap.to(image, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: Power1.easeInOut,
    });
}

function imageOutView(image, direction, duration) {
    if (direction == "up" || direction == "down") {
        // images
        gsap.to(image, {
            x: 0,
            y: direction == "up" ? "-101%" : "101%",
            duration: duration,
            ease: Power1.easeInOut,
        });
    } else if (direction == "left" || direction == "right") {
        // images
        gsap.to(image, {
            y: 0,
            x: direction == "right" ? "101%" : "-101%",
            duration: duration,
            ease: Power1.easeInOut,
        });
    } else {
        console.log("unkown direction: " + direction);
    }
}
