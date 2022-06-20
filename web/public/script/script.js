// cursor
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", moveCursor);

function moveCursor(e) {
    let x = e.clientX;
    let y = e.clientY;

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
}

// onclick animation
document.addEventListener("click", () => {
    cursor.classList.add("click");
    setTimeout(() => {
        cursor.classList.remove("click");
    }, 200);
});

// loading animation
gsap.timeline()
    .fromTo(
        ".loadingGifInner",
        {
            scaleY: 0,
            y: "250%",
        },
        {
            y: "100%",
            scaleY: 1,
            duration: 2,
            ease: Expo.easeIn,
        }
    )
    .to(".loadingGifInner", {
        y: "-101%",
        duration: 1.5,
        ease: Expo.easeOut,
    })
    .repeat(Infinity);

window.addEventListener("load", () => {
    document.querySelector(".loader").remove();
});
