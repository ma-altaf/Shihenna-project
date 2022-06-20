const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};
const TemplateMsg = (username, apntDate, design) => {
    let msgStart = `hello ${username}, thank you for placing an appointment for ${apntDate.toLocaleDateString(
        "en-US",
        options
    )} at ${apntDate.getHours()}:${new Intl.NumberFormat("en-IN", {
        minimumIntegerDigits: 2,
    }).format(apntDate.getMinutes())}.\\n`;

    let msgMid = buildDsgnCatMsg(design);

    let msgEnd = "\\nDo not hesitate to ask me about anything";

    return msgStart + msgMid + msgEnd;
};

function buildDsgnCatMsg(design) {
    if (design) {
        switch (design.substring(0, design.indexOf("/"))) {
            case "casual":
                return "";
                break;
            case "bridal":
                return "Let me know when you will be free so we can discuss the design and process you want.\\n";
                break;
            case "others":
                return "Let me know which product you which to personalise with henna patterns.\\n";
                break;
            default:
                // when null/no intention selected
                return "";
                break;
        }
    }
    return "";
}

const listItemUI = (username, phone, appointment, msg, uid, design) => {
    return `<div class="item">
<div class="details">
    <p>NAME: ${username}</p>
    <p>PHONE: ${phone}</p>
    <p>APPOINTMENT: ${appointment}</p>
</div>
<div class="template">
    <textarea
        name="msgTemplate"
        id="msgTemplate"
        cols="80"
        rows="5"
        disabled
    >${msg}
</textarea>
    <div class="options">
    <span>${typeIcon(design)}</span>
        <button id="send" onclick='messageMacro("${msg}","${phone}")'>
            send msg
        </button>
        <button id="close" onclick="setCommunicated('${uid}')">
            close
        </button>
    </div>
</div>
</div>`;
};

function typeIcon(design) {
    if (design) {
        switch (design.substring(0, design.indexOf("/"))) {
            case "casual":
                return "🖌️";
                break;
            case "bridal":
                return "👰";
                break;
            case "others":
                return "🎇";
                break;
            default:
                // when null/no intention selected
                return "";
                break;
        }
    }
    return "";
}

var db = firebase.firestore();
const communicationList = document.getElementById("communicationList");

db.collection("users")
    .where("communicated", "==", false)
    .orderBy("appointment")
    .onSnapshot((Snapshot) => {
        buildCommunicationItem(Snapshot.docs);
    });

function buildCommunicationItem(docs) {
    communicationList.innerHTML = null;
    docs.forEach((doc) => {
        let data = doc.data();
        let span = document.createElement("span");
        span.innerHTML = listItemUI(
            data.name,
            data.phoneNumber,
            data.appointment.toDate(),
            TemplateMsg(data.name, data.appointment.toDate(), data.design),
            doc.id,
            data.design
        );
        communicationList.appendChild(span);
    });
}

function messageMacro(message, phoneNum) {
    // copy message to clipboard
    copyText(message);
    window.open(`https://wa.me/${phoneNum}/`, "_blank");
}

function setCommunicated(uid) {
    db.doc(`users/${uid}`).update({
        communicated: true,
    });
}

function copyText(text) {
    const elem = document.createElement("textarea");
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}
