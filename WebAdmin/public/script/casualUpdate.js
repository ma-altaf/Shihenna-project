var db = firebase.firestore();
const body = document.querySelector("body");
// get the document reference
let docReference;

function build() {
    db.collection("casual")
        .orderBy("createdAt", "desc")
        .get()
        .then((docRef) => {
            docRef.docs.forEach((doc) => {
                buildImg(doc);
            });
        });
}

// currently only the id is displayed
function buildImg(doc) {
    let divContainer = document.createElement("div");
    let imageTag = document.createElement("img");

    img = doc.data()["imageRefs"][0];
    imageTag.src = img;

    imageTag.addEventListener("click", () => {
        location.href = `./updateCasualView.html?design=${doc.id}`;
    });

    let id = document.createElement("p");
    id.textContent = doc.data()["ID"] + " - " + doc.id;
    divContainer.appendChild(id);
    divContainer.appendChild(imageTag);

    body.appendChild(divContainer);
}
