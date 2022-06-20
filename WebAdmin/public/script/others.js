let db = firebase.firestore();
const filePicker = document.getElementById("fileItem");
const previewComponentImg = document.getElementById("preview");
const submitBtn = document.getElementById("submit");
const componentBtn = document.getElementById("addComponent");
const componentText = document.getElementById("componentText");
const content = document.getElementById("content");
const stateViewer = document.getElementById("stateViewer");
let fileList;

let imageArray = [];
let imageTxtArray = [];
let imageOrientationArray = [];

filePicker.addEventListener("change", (event) => {
    fileList = event.target.files;

    previewComponentImg.src = URL.createObjectURL(fileList[0]);

    componentBtn.disabled = false;
});

componentBtn.addEventListener("click", () => {
    // populate image text array
    imageTxtArray.push(componentText.value || "");

    // populate image array
    imageArray.push(fileList[0]);

    const orientationRBS = document.querySelectorAll(
        'input[name="orientation"]'
    );
    let selectedValue = orientationRBS[0];

    for (const orientation of orientationRBS) {
        if (orientation.checked) {
            selectedValue = orientation.value;
            break;
        }
    }

    // populate image orientation array
    imageOrientationArray.push(selectedValue);

    componentText.value = "";
    fileList = "";
    previewComponentImg.src = "";

    componentBtn.disabled = true;
    submitBtn.disabled = false;
    displayContent();
});

function displayContent() {
    content.innerHTML = null;

    imageArray.forEach((img, i) => {
        let image = document.createElement("img");
        image.src = URL.createObjectURL(img);

        let orientationText = document.createElement("button");
        orientationText.innerText = imageOrientationArray[i];
        orientationText.onclick = () => {
            imageOrientationArray[i] =
                imageOrientationArray[i] == "landscape"
                    ? "portrait"
                    : "landscape";
            orientationText.innerText = imageOrientationArray[i];
        };

        let text = document.createElement("p");
        text.innerText = imageTxtArray[i];

        image.addEventListener("click", () => {
            if (confirm("Confirm deletion")) {
                imageArray.splice(i, 1);
                imageTxtArray.splice(i, 1);
                imageOrientationArray.splice(i, 1);
                if (imageArray.length == 0) {
                    submitBtn.disabled = true;
                }
                displayContent();
            }
        });

        // display contents
        content.appendChild(image);
        content.appendChild(orientationText);
        content.appendChild(text);
    });
}

submitBtn.addEventListener("click", () => {
    const timestamp = Date.now();
    let imageArrayRef = [];

    db.collection("others")
        .add({
            createdAt: timestamp,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            let IDText = document.createElement("p");
            IDText.innerText = docRef.id;

            stateViewer.appendChild(IDText);

            let storageRef = firebase.storage().ref();
            imageArray.forEach((image, i) => {
                let uploadTask = storageRef
                    .child(`images/others/${docRef.id}/${image.name}`)
                    .put(image);

                let imageProgress = document.createElement("p");
                imageProgress.innerText = `image${i} = `;
                stateViewer.appendChild(imageProgress);

                uploadTask.on(
                    "state_changed",
                    function uploading(snapshot) {
                        imageProgress.innerText = `${imageProgress.innerText.substring(
                            0,
                            imageProgress.innerHTML.lastIndexOf("=") + 1
                        )} ${Math.floor(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                                100
                        )} %`;
                    },

                    function error(error) {
                        console.log(error);
                        imageProgress.innerText = `${imageProgress.innerText.substring(
                            0,
                            stateViewer.innerHTML.lastIndexOf("=") + 1
                        )} ${error}`;
                    },

                    function complete() {
                        uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then((downloadURL) => {
                                imageArrayRef[i] = downloadURL;
                                completionState(imageArrayRef, docRef);
                            });
                        console.log(`image${i} uploaded!`);
                        imageProgress.innerText = `${imageProgress.innerText.substring(
                            0,
                            stateViewer.innerHTML.lastIndexOf("=") + 1
                        )} uploaded!`;
                    }
                );
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
});

function completionState(imageArrayRef, docReference) {
    if (imageArrayRef.length == imageArray.length) {
        docReference
            .set(
                {
                    textRefs: imageTxtArray,
                    imageRefs: imageArrayRef,
                    orientationRefs: imageOrientationArray,
                },
                { merge: true }
            )
            .then(() => {
                stateViewer.innerText = "complete!";
                setTimeout(() => {
                    location.reload();
                }, 1000);
            })
            .catch((e) => {
                console.log("docRef error " + e);
            });
    } else {
        console.log(`progress: ${imageArrayRef.length}/${imageArray.length}`);
    }
}
