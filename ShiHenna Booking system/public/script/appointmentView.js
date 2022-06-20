var db = firebase.firestore();
const timeTable = document.getElementById("timeTable");
const appointmentDiv = document.querySelector('input[type="date"]');
const adminBookID = "SHI_HENNA (Admin book)";
//initialise date to today (valueAsDate getDate is one day off so I added 1to the get getDate())
appointmentDiv.valueAsDate = new Date();
let appointmentDate = appointmentDiv.valueAsDate;

appointmentDiv.addEventListener("change", () => {
    appointmentDate = appointmentDiv.valueAsDate;
    buildTimeSlots();
});

function buildTimeSlots() {
    timeTable.innerHTML = null;
    // build the time slots
    const startTime = new Date(appointmentDate);
    startTime.setHours(9, 00);
    const endTime = new Date(appointmentDate);
    endTime.setHours(20, 00);
    // stores an integer representing the number of minutes per slots
    const slotPeriod = 30;
    const numOfSlots = (endTime - startTime) / 60000 / slotPeriod;

    let timeSlot = addMinutes(startTime, -1 * slotPeriod);
    let appointmentDocRef = db.doc(
        `appointments/${appointmentDate.getFullYear()}/${appointmentDate.getMonth()}/${
            appointmentDate.getDate() + 1
        }`
    );
    appointmentDocRef
        .get()
        .then((doc) => {
            console.log(doc);
            for (let slot = 0; slot < numOfSlots; slot++) {
                timeSlot = addMinutes(timeSlot, slotPeriod);
                let time = timeSlot;
                let timeString =
                    timeSlot.getHours() +
                    ":" +
                    new Intl.NumberFormat("en-IN", {
                        minimumIntegerDigits: 2,
                    }).format(timeSlot.getMinutes());

                let bookedTime = doc.data();
                if (
                    doc.exists &&
                    bookedTime.hasOwnProperty(
                        `${timeSlot.getHours()}:${timeSlot.getMinutes()}`
                    )
                ) {
                    buildBookedItem(
                        bookedTime[
                            `${timeSlot.getHours()}:${timeSlot.getMinutes()}`
                        ],
                        timeString
                    );
                } else {
                    buildAvailableItem(time, timeString);
                }
            }
        })
        .catch((e) => console.log("error:", e));
}

// initialise time
buildTimeSlots();

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function buildAvailableItem(time, timeString) {
    let newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.innerHTML = `<p>${timeString}</p>`;

    // on click
    newItem.onclick = () => bookDateTime(time);

    timeTable.appendChild(newItem);
}
function bookDateTime(time) {
    appointmentDate.setHours(time.getHours(), time.getMinutes(), 00);
    if (confirm(`confirm booking: ${time}`)) {
        let appointmentDocRef = db.doc(
            `appointments/${appointmentDate.getFullYear()}/${appointmentDate.getMonth()}/${
                appointmentDate.getDate() + 1
            }`
        );
        db.runTransaction((transaction) => {
            return transaction.get(appointmentDocRef).then((apntDoc) => {
                apntTime =
                    appointmentDate.getHours() +
                    ":" +
                    appointmentDate.getMinutes();

                if (!apntDoc.exists) {
                    transaction.set(appointmentDocRef, {
                        [apntTime]: adminBookID,
                    });
                    return `appointment for ${appointmentDate} was successful!`;
                }

                // apntDoc exists
                if (apntDoc.data().hasOwnProperty(apntTime)) {
                    return Promise.reject(
                        `appointment for ${appointmentDate} already taken!`
                    );
                } else {
                    transaction.set(
                        appointmentDocRef,
                        {
                            [apntTime]: adminBookID,
                        },
                        { merge: true }
                    );
                    return `appointment for ${appointmentDate} was successful!`;
                }
            });
        })
            .then((apntSuccess) => {
                alert(apntSuccess);
                buildTimeSlots();
            })
            .catch((err) => {
                console.log(err);
                alert(err);
                buildTimeSlots();
            });
    }
}

function buildBookedItem(uid, timeString) {
    let newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.classList.add("booked");
    newItem.innerHTML = `<p>${timeString}</p>`;

    // on click
    newItem.onclick = () => getApntInfo(uid);

    timeTable.appendChild(newItem);
}

function getApntInfo(uid) {
    console.log("checking", uid);
    if (uid != adminBookID) {
        db.doc(`users/${uid}`)
            .get()
            .then((doc) => {
                displayApnt(doc.data());
            })
            .catch((e) => {
                alert("error reading uid: " + e);
            });
    } else {
        alert("booked by admin");
    }
}

function displayApnt(docData) {
    if (
        confirm(`
    name: ${docData.name}
    phone: ${docData.phoneNumber}
    appointment: ${docData.appointment.toDate()}
    communicated: ${docData.communicated}
    design: ${docData.design}
    `)
    ) {
        viewDesign(docData.design);
    }
}

function viewDesign(design) {
    let idString = design.split("/");
    window.open(
        `https://shihennaartist.web.app/${idString[0]}ImgView.html?design=${idString[1]}`,
        "_bank"
    );
}
