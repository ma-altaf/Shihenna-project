const scrollTop = document.querySelector(
    ".indexPage .footer .bottomLogo #scrollTop"
);
// bottom greeting message
const greeting = document.querySelector(".indexPage .footer .greeting");
const greetingText = greeting.querySelector("h3");
const openHoursTable = greeting.querySelector("table");
const greetingTableRow = greeting.querySelectorAll("tr");
const locationBox = document.querySelector(".indexPage .footer .locationBox");
const phoneBox = document.querySelector(".indexPage .footer .phoneBox");
// const ;
let dayText, enhancingWord;

// go to top
scrollTop.addEventListener("click", () => {
    window.scrollTo(0, 0);
});

function bgChanger() {
    let pageHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    if (this.scrollY > pageHeight - window.innerHeight / 3) {
        document.body.classList.add("footerBg");
        cursor.classList.add("grow");
    } else {
        document.body.classList.remove("footerBg");
        cursor.classList.remove("grow");
    }
}

window.addEventListener("scroll", bgChanger);

function setGreeting() {
    let dayNum = new Date().getDay();
    // overwrite for sunday
    dayNum = dayNum == 0 ? 7 : dayNum;
    greetingTableRow[dayNum - 1].classList.add("highlightedText");

    switch (Math.floor(Math.random() * 3)) {
        case 0:
            enhancingWord = "a great";
            break;
        case 1:
            enhancingWord = "a happy";
        default:
            enhancingWord = "a splendid";
            break;
    }

    switch (dayNum) {
        case 7:
            dayText = "Sunday";
            break;
        case 1:
            dayText = "Monday";
            break;
        case 2:
            dayText = "Tuesday";
            break;
        case 3:
            dayText = "Wednesday";
            break;
        case 4:
            dayText = "Thursday";
            break;
        case 5:
            dayText = "Friday";
            break;
        case 6:
            dayText = "Saturday";
            break;
        default:
            dayText = "day";
            break;
    }

    greetingText.innerHTML = "Have " + enhancingWord + " " + dayText;
}

setGreeting();

openHoursTable.addEventListener("mouseover", () => {
    cursor.classList.add("cursorActive");
    cursor.innerHTML = '<span class="material-icons">schedule</span>';
});

openHoursTable.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursorActive");
    cursor.innerHTML = null;
});

openHoursTable.addEventListener("click", () => {
    barTransition("./bookingPage.html");
});

locationBox.addEventListener("mouseover", () => {
    cursor.classList.add("cursorActive");
    cursor.innerHTML = '<span class="material-icons">place</span>';
});

locationBox.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursorActive");
    cursor.innerHTML = null;
});

locationBox.addEventListener("click", () => {
    //TODO: get link to map
    window.open("https://www.google.com/maps/", "_blank");
});

phoneBox.addEventListener("mouseover", () => {
    cursor.classList.add("cursorActive");
    cursor.innerHTML = '<span class="material-icons">person</span>';
});

phoneBox.addEventListener("mouseleave", () => {
    cursor.classList.remove("cursorActive");
    cursor.innerHTML = null;
});

phoneBox.addEventListener("click", () => {
    barTransition("./contact.html");
});
