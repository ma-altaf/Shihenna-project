gsap.registerPlugin(ScrollTrigger);
const title = gsap.utils.toArray(".testimonies .subTitle h3");

let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".testimonies",
        start: "30 bottom",
        end: "none",
    },
});

// hide the text before it is reached
gsap.to(title, {
    y: 35,
    duration: 0,
});

tl.fromTo(
    ".underline",
    {
        scaleX: 0,
    },
    {
        scaleX: 1,
        duration: 0.55,
        ease: Circ.easeOut,
    }
).to(
    title,
    {
        y: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: Circ.easeOut,
    },
    "-=0.3"
);

const testimonySects = document.querySelectorAll(".testimonySections");

testimonySects.forEach((section, i) => {
    const image = section.querySelector(".Testimonyimage");
    const nameSect = section.querySelector(".nameSection");
    const name = nameSect.querySelectorAll(".name");
    const comment = section.querySelector(".comment");
    // break line into words
    comment.innerHTML = comment.textContent.replace(
        /\W*\w+\W*\s/g,
        "<span class='word'><p>$&&nbsp;</p></span>"
    );
    const words = comment.querySelectorAll(".word p");

    name.forEach((n, i) => {
        gsap.to(n, {
            x: i % 2 == 0 ? "-35%" : "35%",
            scrollTrigger: {
                trigger: nameSect,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });
    });
    // text reveal
    gsap.timeline({
        scrollTrigger: {
            trigger: image,
            start: "top 70%",
        },
    })
        // image reveal
        .fromTo(
            image,
            {
                width: 0,
            },
            {
                width: screen.width > 768 ? "30vw" : "60vw",
                duration: 0.7,
                ease: Circ.easeInOut,
            }
        )
        .fromTo(
            comment,
            {
                x: i % 2 == 0 ? "-50%" : "50%",
                scaleX: 0,
            },
            {
                x: 0,
                scaleX: 1,
                duration: 0.7,
                ease: Expo,
            }
        )
        .fromTo(
            words,
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 0.25,
                stagger: 0.05,
                ease: Circ.easeOut,
            }
        );

    // scroll text motion
    gsap.to(comment, {
        y: "-60%",
        scrollTrigger: {
            trigger: comment,
            start: "top bottom",
            scrub: 0.5,
        },
    });
});
