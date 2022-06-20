window.onload = () => {
    const anchors = document.querySelectorAll("a");

    for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];

        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            let target = e.target.href;
            barTransition(target);
        });
    }
};

// bar transition between page (page link to next page)
function barTransition(page) {
    const transition_el = document.querySelectorAll(".bar-transition li");
    const logo = transition_el[2].querySelector(".transitionLogo");
    let t1 = gsap.timeline();
    if (screen.width < 768) {
        t1.to(transition_el[2], {
            height: "100%",
            duration: 1,
            ease: Expo.easeInOut,
        });
    } else {
        t1.to(transition_el, {
            height: "100%",
            stagger: 0.1,
            duration: 0.5,
            ease: Circ.easeOut,
        });
    }

    t1.from(logo, {
        y: "15%",
        opacity: 0,
        duration: 0.2,
        ease: Circ.easeOut,
    }).to(
        logo,
        {
            y: "15%",
            opacity: 0,
            duration: 0.2,
            ease: Circ.easeIn,
        },
        "+=0.2"
    );
    setTimeout(() => {
        window.location.href = page;
    }, 1500);
}
