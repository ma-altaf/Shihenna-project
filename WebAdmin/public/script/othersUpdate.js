let db = firebase.firestore();
const body = document.querySelector("body");
// get th document reference
let docReference;

function build() {
    db.collection("others")
        .orderBy("createdAt", "desc")
        .get()
        .then((docRef) => {
            docRef.docs.forEach((doc) => {
                buildImg(doc);
            });
        });
}

function buildImg(doc) {
    let divContainer = document.createElement("div");
    let imageTag = document.createElement("img");

    img = doc.data()["imageRefs"][0];
    imageTag.src = img;

    imageTag.addEventListener("click", () => {
        location.href = `./updateOthersView.html?design=${doc.id}`;
    });

    let id = document.createElement("p");
    id.textContent = doc.id;
    divContainer.appendChild(id);
    divContainer.appendChild(imageTag);

    body.appendChild(divContainer);
}
