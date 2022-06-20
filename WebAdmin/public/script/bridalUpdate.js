var db = firebase.firestore();
const body = document.querySelector("body");
// get th document reference
let docReference;

function build() {
    db.collection("bridal")
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

    imageTag.src = doc.data()["imageRefs"][0];

    imageTag.addEventListener("click", () => {
        location.href = `./updateBridalView.html?design=${doc.id}`;
    });

    let id = document.createElement("p");
    id.textContent = doc.id;
    divContainer.appendChild(id);
    divContainer.appendChild(imageTag);

    body.appendChild(divContainer);
}
