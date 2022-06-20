function IndexEntrance() {
    // nav logo skew box
    gsap.timeline()
        .to(".logo .coverPlaceholder .cover", {
            x: "100%",
            duration: 0.7,
            ease: Power1.easeIn,
        })
        .to(".logo h4", { opacity: 1, x: 5, duration: 0 })
        .to(".logo .coverPlaceholder .cover", {
            x: "201%",
            duration: 0.7,
            ease: Power1.easeOut,
        })
        .to(
            ".logo h4",
            { x: 0, duration: 0.3, ease: Linear.easeNone },
            "-=0.5"
        );

    // nav links
    gsap.utils.toArray("nav .nav-links li").forEach((li, i) => {
        gsap.fromTo(
            li,
            {
                opacity: 0,
                y: "-100%",
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: 0.8 - 0.2 * i,
                ease: Power1.easeIn,
            }
        );
    });

    // nav burger
    gsap.utils.toArray("nav .burger div").forEach((div, i) => {
        gsap.fromTo(
            div,
            {
                x: "-150%",
            },
            {
                x: 0,
                duration: 0.4,
                delay: 0.2 * i,
                ease: Power1.easeIn,
            }
        );
    });

    // into paragraph
    gsap.utils.toArray(".introPara .h2Placeholder").forEach((div) => {
        gsap.fromTo(
            div,
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 0.7,
                ease: Power1.easeIn,
                delay: 1,
            }
        );
    });
    gsap.utils.toArray(".introPara h2").forEach((div) => {
        gsap.fromTo(
            div,
            {
                y: "-100%",
            },
            {
                y: 0,
                duration: 0.7,
                ease: Power1.easeIn,
                delay: 1,
            }
        );
    });

    // CTA animation
    gsap.timeline().fromTo(
        ".introPara .cta",
        {
            y: 10,
            opacity: 0,
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: Power1.easeIn,
            delay: 1.2,
        }
    );

    // profile pic
    gsap.fromTo(
        ".founder .cover",
        {
            x: 0,
        },
        {
            x: "100%",
            duration: 1,
            ease: Circ.easeNone,
            delay: 1.8,
        }
    );

    // scroll logo entrance
    gsap.timeline()
        .fromTo(
            ".scrollerBox",
            {
                y: "9vh",
                height: "9vh",
                // accent color
                backgroundColor: "rgb(226, 149, 120)",
            },
            {
                y: 0,
                duration: 0.5,
                ease: Power1.easeIn,
                delay: 2.2,
            }
        )
        .to(
            ".scrollerBox",
            { height: 26, duration: 0.4, ease: Power1.easeIn },
            "-=0.3"
        )
        .to(".scrollerBox", {
            backgroundColor: "#f5f5f0",
            duration: 0.3,
            ease: Power1.easeIn,
        })
        // repeating scroll
        .to(".scrollerBox .scollerContent", {
            y: -46,
            duration: 1.5,
            ease: Power1.easeInOut,
            repeat: Infinity,
            repeatDelay: 0.5,
        });
}
