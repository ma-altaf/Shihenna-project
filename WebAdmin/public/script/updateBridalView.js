var db = firebase.firestore();
let storageRef = firebase.storage().ref();

const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
const contentViewBox = document.querySelector(".contentViewBox");
const newImgPreview = document.querySelector(".newImgPreview");
const filePicker = document.getElementById("fileItem");
const componentBtn = document.getElementById("addComponent");
const previewComponentImg = document.getElementById("preview");
const content = document.getElementById("content");

// store the image texts already in the doc and to be added
let imageTxtArray = [];
// store the image orientations already in the doc and to be added
let imageOrientationArray = [];

const docRef = db.collection("bridal").doc(designID);

function populateContentViewer() {
    docRef
        .get()
        .then((listing) => {
            let docData = listing.data();
            docData["imageRefs"].forEach((imgRef, i) => {
                let imageTag = document.createElement("img");
                let imgText = document.createElement("textarea");
                let listingBox = document.createElement("span");

                // populate image
                imageTag.src = imgRef;

                // populate text
                let text = docData["textRefs"][i];
                // add the document image texts
                imageTxtArray.push(text);
                imgText.value = text;

                // populate orientation
                let orientation = docData["orientationRefs"][i];
                let orientationBtn = document.createElement("button");
                // add the document image orientations
                imageOrientationArray.push(orientation);
                orientationBtn.innerText = imageOrientationArray[i];

                orientationBtn.onclick = () => {
                    imageOrientationArray[i] =
                        imageOrientationArray[i] == "landscape"
                            ? "portrait"
                            : "landscape";
                    orientationBtn.innerText = imageOrientationArray[i];
                };

                imageTag.addEventListener("click", () => {
                    if (confirm("delete image")) {
                        // update the image orientations and image texts
                        imageOrientationArray.splice(i, 1);
                        imageTxtArray.splice(i, 1);

                        docRef
                            .update({
                                imageRefs:
                                    firebase.firestore.FieldValue.arrayRemove(
                                        imgRef
                                    ),
                                textRefs: imageTxtArray,
                                orientationRefs: imageOrientationArray,
                            })
                            .then(() => {
                                firebase
                                    .storage()
                                    .refFromURL(imgRef)
                                    .delete()
                                    .then(() => {
                                        alert("image deleted");
                                        location.reload();
                                    })
                                    .catch((e) => {
                                        console.log("error storage:", e);
                                    });
                            })
                            .catch((e) => {
                                alert("error:", e);
                            });
                    }
                });

                listingBox.appendChild(imageTag);
                listingBox.appendChild(orientationBtn);
                listingBox.appendChild(imgText);
                contentViewBox.appendChild(listingBox);
            });
        })
        .catch((e) => {
            alert("error getting content!", e);
        });
}

function updateTexts() {
    let updatedTexts = [];
    const textAreas = contentViewBox.querySelectorAll("span textarea");

    // populate texts
    textAreas.forEach((text) => {
        updatedTexts.push(text.value);
    });

    docRef
        .update({
            textRefs: updatedTexts,
        })
        .then(() => {
            alert("texts updated!");
        })
        .catch((e) => {
            console.log("error: " + e);
        });
}

function deleteDoc() {
    if (confirm("confirm deleting design!")) {
        // Create a reference to the file to delete
        let designRef = storageRef.child(`images/bridal/${designID}`);

        // Delete the files
        designRef
            .listAll()
            .then((list) => {
                list.items.forEach((image) => {
                    storageRef.child(image.fullPath).delete();
                });
                // delete firestore doc
                docRef
                    .delete()
                    .then(() => {
                        alert("Document successfully deleted!");
                        window.history.back();
                    })
                    .catch((error) => {
                        alert("Error removing document: ", error);
                        console.error("Error removing document: ", error);
                    });
            })
            .catch((error) => {
                alert("storage error:", error);
                console.log("storage error:", error);
            });
    }
}

let fileList;
let imageArray = [];

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
    console.log(imageOrientationArray);

    componentText.value = "";
    fileList = "";
    previewComponentImg.src = "";

    componentBtn.disabled = true;
    displayContent();
});

function addImg() {
    alert("wait while images are being updated.");
    let imageRefsArray = [];

    imageArray.forEach((image, i) => {
        let uploadTask = storageRef
            .child(`images/bridal/${docRef.id}/${image.name}`)
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
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    imageRefsArray[i] = downloadURL;
                    if (imageRefsArray.length == imageArray.length) {
                        updateFirestore(imageRefsArray);
                    }
                });
                console.log(`image${i} uploaded!`);
                imageProgress.innerText = `${imageProgress.innerText.substring(
                    0,
                    stateViewer.innerHTML.lastIndexOf("=") + 1
                )} uploaded!`;
            }
        );
    });
}

function updateFirestore(imageRefsArray) {
    docRef
        .update({
            imageRefs: firebase.firestore.FieldValue.arrayUnion(
                ...imageRefsArray
            ),
            textRefs: imageTxtArray,
            orientationRefs: imageOrientationArray,
        })
        .then(() => {
            alert("images sucessfully added!");
            location.reload();
        })
        .catch((e) => {
            console.log("adding image error: " + e);
        });
}

function displayContent() {
    content.innerHTML = null;
    // use to modify index to get the correct data to show
    const docCounter = contentViewBox.querySelectorAll("span").length;

    imageArray.forEach((img, i) => {
        let image = document.createElement("img");
        image.src = URL.createObjectURL(img);

        let text = document.createElement("p");
        console.log(imageTxtArray[i + docCounter]);
        text.innerText = imageTxtArray[i + docCounter];

        image.addEventListener("click", () => {
            if (confirm("Confirm deletion")) {
                imageArray.splice(i, 1);
                imageTxtArray.splice(i + docCounter, 1);
                imageOrientationArray.splice(i + docCounter, 1);
                displayContent();
            }
        });

        // display contents
        content.appendChild(image);
        content.appendChild(text);
    });
}

function updateOrientations() {
    docRef
        .update({
            orientationRefs: imageOrientationArray,
        })
        .then(() => {
            alert("Orientations updated!");
        })
        .catch((e) => {
            console.log("error: " + e);
        });
}
