const auth = firebase.auth();
const db = firebase.firestore();
var authUser;
let userInfo;
let dateNow = new Date();
const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
console.log(designID);

auth.onAuthStateChanged((user) => {
    if (user) {
        authUser = user;
        // check if user already have an appointment
        db.doc(`users/${user.uid}`)
            .get()
            .then((userDoc) => {
                if (userDoc.exists) {
                    userInfo = userDoc.data();
                    if (
                        userInfo.appointment != null &&
                        addMinutes(userInfo.appointment.toDate(), 60) > dateNow
                    ) {
                        setBookedUI(userInfo);
                    } else {
                        bookingState(1);
                    }
                }
            })
            .catch(bookingState(1));
    } else {
        alert("Please accept the privacy policy on the index page.");
        window.open("https://shihennaartist.web.app/", "_blank");
    }
});

const bookingPage = document.querySelector(".bookingPageView");
const backBtn = bookingPage.querySelector(".back");
const title = bookingPage.querySelectorAll(".title h3");
const emailBox = bookingPage.querySelector(
    ".bookingContainer .bookingTable .emailBox"
);
const phoneBox = bookingPage.querySelector(
    ".bookingContainer .bookingTable .phoneBox"
);
const anchorTag = bookingPage.querySelectorAll("a");
const headerText = bookingPage.querySelector(".header p");
const openHoursTable = bookingPage.querySelector(
    ".bookingContainer .openHours"
);
const contactBox = bookingPage.querySelectorAll(".contactBox");
const bookingUI = bookingPage.querySelector(".bookingUI");

// booking states
const bookedUI = bookingUI.querySelector("#booked"); // 0
const userInfoForm = bookingUI.querySelector("#userInfo"); // 1
const datePickerUI = bookingUI.querySelector("#datePicker"); // 2
const timePickerUI = bookingUI.querySelector("#timePicker"); // 3
const confirmationView = bookingUI.querySelector("#confirmation"); // 4
const thankYouView = bookingUI.querySelector("#thankYou"); // 5
const unAvailableView = bookingUI.querySelector("#unAvailable"); // 6

const stateUIs = [
    bookedUI,
    userInfoForm,
    datePickerUI,
    timePickerUI,
    confirmationView,
    thankYouView,
    unAvailableView,
];

const transitionCover = bookingUI.querySelector("#transitionCover");
function bookingState(nextState) {
    let t1 = gsap.timeline();

    t1.to(transitionCover, {
        width: "100%",
        duration: 0.5,
        ease: Circ.easeOut,
    })
        .call(swapState, [nextState], 0.5)
        .to(transitionCover, {
            width: 0,
            left: 0,
            duration: 0.5,
            ease: Circ,
        })
        .to(transitionCover, {
            left: null,
            right: 0,
        });
}

function swapState(nextState) {
    stateUIs.forEach((ui) => (ui.style.display = "none"));

    stateUIs[nextState].style.display = "flex";
}

// resign
function resignAppointment() {
    if (confirm("are you sure you want to remove the appointment 😢")) {
        let batch = db.batch();

        let bookedDate = userInfo.appointment.toDate();
        apntTime = bookedDate.getHours() + ":" + bookedDate.getMinutes();
        let appointmentDocRef = db.doc(
            `appointments/${bookedDate.getFullYear()}/${bookedDate.getMonth()}/${bookedDate.getDate()}`
        );

        batch.update(appointmentDocRef, {
            [apntTime]: firebase.firestore.FieldValue.delete(),
        });

        let userDocRef = db.doc(`users/${authUser.uid}`);
        batch.delete(userDocRef);

        batch
            .commit()
            .then(() => {
                bookingState(1);
            })
            .catch((e) => {
                alert(
                    "Could not remove the appointment.\nAt least 3 hours must elapse from the last time you placed an appointment"
                );
            });
    }
}

// user information form
let customerName;
let customePhoneNumber;

function saveInfo() {
    const userName = userInfoForm.querySelector("#name");
    const userPhoneNumber = userInfoForm.querySelector("#phoneNumber");
    const submitBtn = userInfoForm.querySelector("button");

    submitBtn.disabled = true;

    if (validateForm(userName, userPhoneNumber)) {
        bookingState(2);
    }
    submitBtn.disabled = false;
}

function validateForm(userName, userPhoneNumber) {
    return validateName(userName) && validatePhoneNum(userPhoneNumber);
}

function validateName(userName) {
    if (userName.value.length > 0) {
        customerName = userName.value;
        return true;
    }
    flagField(userName);
    return false;
}

function validatePhoneNum(userPhoneNumber) {
    if (
        userPhoneNumber.value.length == 8 &&
        /5\d+/.test(userPhoneNumber.value) &&
        /^\d+$/.test(userPhoneNumber.value)
    ) {
        customePhoneNumber = userPhoneNumber.value;
        return true;
    }
    flagField(userPhoneNumber);
    return false;
}

function flagField(component) {
    component.classList.add("invalid");
    component.addEventListener("change", () => {
        component.classList.remove("invalid");
    });
}

// date picker

const calender = datePickerUI.querySelector("#calendar");
const monthView = datePickerUI.querySelector("#monthView");
const monthViewText = monthView.querySelector("p");
const monthViewPreviousBtn = monthView.querySelector("#previous");
const monthViewNextBtn = monthView.querySelector("#next");
let appointmentDate = new Date();
// init set the month
setMonthView();

// dispay the month
function setMonthView() {
    monthViewText.textContent = `_ / ${
        appointmentDate.getMonth() + 1
    } / ${appointmentDate.getFullYear()}`;
}

function previousMonth() {
    let firstDate = 0;
    if (
        appointmentDate.getFullYear() <= dateNow.getFullYear() &&
        appointmentDate.getMonth() - 1 <= dateNow.getMonth()
    ) {
        monthViewPreviousBtn.disabled = true;
        firstDate = dateNow.getDate();
    }
    appointmentDate.setMonth(appointmentDate.getMonth() - 1);
    setMonthView();
    populateCalender(
        firstDate,
        appointmentDate.getMonth(),
        appointmentDate.getFullYear()
    );
}

function nextMonth() {
    monthViewPreviousBtn.disabled = false;
    appointmentDate.setMonth(appointmentDate.getMonth() + 1);
    setMonthView();
    populateCalender(
        0,
        appointmentDate.getMonth(),
        appointmentDate.getFullYear()
    );
}

// initial populating of the calender
populateCalender(dateNow.getDate(), dateNow.getMonth(), dateNow.getFullYear());

function populateCalender(startDate, theMonth, theYear) {
    calender.innerHTML = null;
    getLastDate = (m, y) => {
        return new Date(y, m, 0).getDate();
    };

    startDateDay = new Date(theYear, theMonth, startDate).getDay();

    let daysHeader = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    daysHeader.forEach((day) => {
        let dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        calender.appendChild(dayDiv);
    });

    for (
        let emptyCellNum = 0;
        emptyCellNum < startDateDay + 1;
        emptyCellNum++
    ) {
        let emptyDiv = document.createElement("div");
        calender.appendChild(emptyDiv);
    }

    for (
        let dateCellNum = startDate + 1;
        dateCellNum <= getLastDate(theMonth, theYear);
        dateCellNum++
    ) {
        let dateDiv = document.createElement("div");
        dateDiv.textContent = dateCellNum;

        dateDiv.addEventListener("mouseover", () => {
            dateDiv.classList.add("hovered");
        });

        dateDiv.addEventListener("mouseleave", () => {
            dateDiv.classList.remove("hovered");
        });

        dateDiv.addEventListener("click", () => {
            appointmentDate.setDate(dateCellNum);
            setUpTime();
            bookingState(3);
        });

        calender.appendChild(dateDiv);
    }
}

// time picker
const clock = bookingUI.querySelector("#clock");
function setUpTime() {
    clock.innerHTML = null;
    let appointmentDocRef = db.doc(
        `appointments/${appointmentDate.getFullYear()}/${appointmentDate.getMonth()}/${appointmentDate.getDate()}`
    );
    appointmentDocRef
        .get()
        .then((doc) => {
            let bookedTime = doc.data();
            // build the time slots
            const startTime = new Date(appointmentDate);
            startTime.setHours(9, 00);
            const endTime = new Date(appointmentDate);
            endTime.setHours(20, 00);
            // stores an integer representing the number of minutes per slots
            const slotPeriod = 30;
            const numOfSlots = (endTime - startTime) / 60000 / slotPeriod;

            let timeSlot = addMinutes(startTime, -1 * slotPeriod);

            for (let slot = 0; slot < numOfSlots; slot++) {
                timeSlot = addMinutes(timeSlot, slotPeriod);
                let thisTimeSlot = timeSlot;
                let timeSlotString = `${timeSlot.getHours()}:${timeSlot.getMinutes()}`;
                let TimeSlotComponent = document.createElement("button");
                TimeSlotComponent.innerText =
                    timeSlot.getHours() +
                    ":" +
                    new Intl.NumberFormat("en-IN", {
                        minimumIntegerDigits: 2,
                    }).format(timeSlot.getMinutes());

                if (doc.exists && bookedTime.hasOwnProperty(timeSlotString)) {
                    TimeSlotComponent.disabled = true;
                } else {
                    TimeSlotComponent.onclick = () => {
                        appointmentDate.setHours(
                            thisTimeSlot.getHours(),
                            thisTimeSlot.getMinutes(),
                            00
                        );
                        setAppointmentDetails(
                            customerName,
                            customePhoneNumber,
                            appointmentDate
                        );
                        bookingState(4);
                    };
                }

                clock.appendChild(TimeSlotComponent);
            }
        })
        .catch((e) => {
            alert(e.message);
        });
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// build confirmation view
const appointentView = confirmationView.querySelector("#displayAppointment");

const nameView = appointentView.querySelector("#name");
const phoneNumView = appointentView.querySelector("#phoneNum");
const timeView = appointentView.querySelector("#time");
const viewDesignBtn = appointentView.querySelector("#viewDesignBtn");

function setAppointmentDetails(
    customerName,
    customePhoneNumber,
    appointmentDate
) {
    nameView.textContent = `NAME: ${customerName}`;
    phoneNumView.textContent = `PHONE NUMBER: ${customePhoneNumber}`;
    timeView.textContent = `APPOINTMENT: ${appointmentDate}`;
    if (designID != null) {
        viewDesignBtn.innerHTML = `<button class="designBtn" onclick="viewDesign('${designID}')">view design</button>`;
    }
}

function setBookedUI(userInfo) {
    const details = bookedUI.querySelector("#details");

    let nameCmpnt = document.createElement("p");
    nameCmpnt.textContent = "NAME: " + userInfo.name;
    let phoneCmpnt = document.createElement("p");
    phoneCmpnt.textContent = "PHONE NUMBER: " + userInfo.phoneNumber;
    let appointmentCmpnt = document.createElement("p");
    appointmentCmpnt.textContent =
        "APPOINTMENT: " + userInfo.appointment.toDate();

    if (userInfo.design != null) {
        var designCmpnt = document.createElement("button");
        designCmpnt.textContent = "view design";
        designCmpnt.classList.add("designBtn");
        designCmpnt.onclick = () => viewDesign(userInfo.design);
        details.appendChild(designCmpnt);
    }

    details.appendChild(nameCmpnt);
    details.appendChild(phoneCmpnt);
    details.appendChild(appointmentCmpnt);

    bookingState(0);
}

const confirmBtn = confirmationView.querySelector("#confirmBtn");

// set the appointment
function setAppointment() {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "processing";
    let appointmentDocRef = db.doc(
        `appointments/${appointmentDate.getFullYear()}/${appointmentDate.getMonth()}/${appointmentDate.getDate()}`
    );
    db.runTransaction((transaction) => {
        return transaction.get(appointmentDocRef).then((apntDoc) => {
            apntTime =
                appointmentDate.getHours() + ":" + appointmentDate.getMinutes();

            let userInfoUpdate = () => {
                let UserInfoRef = db.doc(`users/${authUser.uid}`);
                transaction.set(UserInfoRef, {
                    name: customerName,
                    phoneNumber: customePhoneNumber,
                    appointment:
                        firebase.firestore.Timestamp.fromDate(appointmentDate),
                    communicated: false,
                    lastActivity: firebase.firestore.Timestamp.now(),
                    design: designID,
                });
            };

            if (!apntDoc.exists) {
                transaction.set(appointmentDocRef, {
                    [apntTime]: authUser.uid,
                });
                userInfoUpdate();
                return `appointment for ${appointmentDate} was successful!`;
            }

            // apntDoc exists
            if (apntDoc.data().hasOwnProperty(apntTime)) {
                return Promise.reject(
                    `appointment for ${appointmentDate} already taken 😢.`
                );
            } else {
                transaction.set(
                    appointmentDocRef,
                    {
                        [apntTime]: authUser.uid,
                    },
                    { merge: true }
                );
                userInfoUpdate();
                return `appointment for ${appointmentDate} was successful!`;
            }
        });
    })
        .then((apntSuccess) => {
            console.log(apntSuccess);
            firebase.analytics().logEvent("bookingUsage");
            bookingState(5);
        })
        .catch((err) => {
            console.log(err.message);
            bookingState(6);

            confirmBtn.disabled = false;
            confirmBtn.textContent = "confirm";
        });
}

anchorTag.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        let target = e.target.href;
        leaveAnimation();
        setTimeout(() => {
            window.location.href = target;
        }, 1050);
    });
});

function copyText(text) {
    const elem = document.createElement("textarea");
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}

// copy email
emailBox.addEventListener("click", () => {
    const email = emailBox.querySelector("p").textContent;
    copyText(email);
    const PrevContent = emailBox.innerHTML;
    emailBox.classList.add("contactBoxClicked");
    emailBox.innerHTML = "COPIED !";
    setTimeout(() => {
        emailBox.classList.remove("contactBoxClicked");
        emailBox.innerHTML = PrevContent;
    }, 1000);
});

// copy phone number
phoneBox.addEventListener("click", () => {
    const phoneNum = phoneBox.querySelector("p").textContent;
    copyText(phoneNum);
    const PrevContent = phoneBox.innerHTML;
    phoneBox.classList.add("contactBoxClicked");
    phoneBox.innerHTML = "COPIED !";
    setTimeout(() => {
        phoneBox.classList.remove("contactBoxClicked");
        phoneBox.innerHTML = PrevContent;
    }, 1000);
});

function bookingEntrance() {
    let t1 = gsap.timeline();

    t1.fromTo(
        title,
        {
            y: "100%",
        },
        {
            y: 0,
            duration: 0.5,
            ease: Power1.easeOut,
            stagger: 0.2,
        }
    )
        .fromTo(
            headerText,
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 0.5,
                ease: Power1.easeOut,
            },
            "-=0.5"
        )
        .fromTo(
            contactBox,
            { y: "25%" },
            {
                y: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.1,
                ease: Power4.easeOut,
            },
            "-=0.5"
        )
        .fromTo(
            bookingUI,
            { y: "25%" },
            {
                y: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.1,
                ease: Power4.easeOut,
            }
        );
}

backBtn.addEventListener("mouseenter", () => {
    cursor.classList.add("grow");
});
backBtn.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
});

// back animation and function
function back() {
    leaveAnimation();
    setTimeout(() => {
        window.history.back();
    }, 1050);
}

function leaveAnimation() {
    let t1 = gsap.timeline();

    t1.to(title, {
        y: "100%",
        duration: 0.5,
        ease: Power1.easeOut,
        stagger: 0.2,
    })
        .to(
            headerText,
            {
                y: "100%",
                duration: 0.5,
                ease: Power1.easeOut,
            },
            "-=0.5"
        )
        .to(
            contactBox,
            {
                y: "25%",
                opacity: 0,
                duration: 0.3,
                stagger: 0.1,
                ease: Power3.easeIn,
            },
            "-=0.5"
        )
        .to(bookingUI, {
            y: "25%",
            opacity: 0,
            duration: 0.3,
            ease: Power3.easeIn,
        });
}

function viewDesign(design) {
    let idString = design.split("/");
    window.open(
        `https://shihennaartist.web.app/${idString[0]}ImgView.html?design=${idString[1]}`,
        "_bank"
    );
}

if (screen.width > 768) {
    VanillaTilt.init(bookingUI);
}
