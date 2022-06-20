var db = firebase.firestore();
let storageRef = firebase.storage().ref();

const params = new URLSearchParams(document.location.search.substring(1));
const designID = params.get("design");
const preview = document.querySelector(".preview");
const filePicker = document.getElementById("fileItem");
const imgViewer = document.getElementById("imgViewer");
const stateViewer = document.getElementById("stateViewer");

let docRef = db.collection("casual").doc(designID);

function populateImgViewer() {
    docRef
        .get()
        .then((doc) => {
            doc.data()["imageRefs"].forEach((imgRef, i) => {
                let imageTag = document.createElement("img");
                imageTag.src = imgRef;

                imageTag.addEventListener("click", () => {
                    if (confirm("delete image")) {
                        docRef
                            .update({
                                imageRefs:
                                    firebase.firestore.FieldValue.arrayRemove(
                                        imgRef
                                    ),
                            })
                            .then(() => {
                                firebase
                                    .storage()
                                    .refFromURL(imgRef)
                                    .delete()
                                    .then(() => {
                                        alert("image deleted");
                                        imgViewer.removeChild(imageTag);
                                    })
                                    .catch((e) => {
                                        alert("error storage:", e);
                                    });
                            })
                            .catch((e) => {
                                alert("error:", e);
                            });
                    }
                });

                imgViewer.appendChild(imageTag);
            });
        })
        .catch((e) => {
            console.log(e);
        });
}

// store the new images file to be added
let newImagesArray = [];

filePicker.addEventListener("change", (event) => {
    const fileList = event.target.files;

    // populate image array
    for (let element = 0; element < fileList.length; element++) {
        const item = fileList[element];

        newImagesArray.push(item);
        console.log(item.name);
    }

    displayImages();
});

function displayImages() {
    // reset the images
    preview.innerHTML = null;

    newImagesArray.forEach((img, i) => {
        var image = document.createElement("img");
        image.src = URL.createObjectURL(img);

        // add on click deletion
        image.addEventListener("click", () => {
            if (confirm("Confirm deletion")) {
                newImagesArray.splice(i, 1);
                displayImages();
            }
        });

        preview.appendChild(image);
    });
}

function submitImages() {
    let imageArrayRef = [];

    if (confirm("add image")) {
        newImagesArray.forEach((image, i) => {
            let uploadTask = firebase
                .storage()
                .ref()
                .child(`images/casual/${designID}/${image.name}`)
                .put(image);

            let imageProgress = document.createElement("p");
            imageProgress.innerText = `image${i} = `;
            stateViewer.appendChild(imageProgress);

            uploadTask.on(
                "state_changed",
                function uploading(snapshot) {
                    imageProgress.innerText = `${
                        imageProgress.innerText.lastIndexOf("=") + 1
                    } ${Math.floor(
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
                    uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then((downloadURL) => {
                            imageArrayRef[i] = downloadURL;
                            firestoreImgUpdate(imageArrayRef);
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
}

function firestoreImgUpdate(imageArrayRef) {
    if (imageArrayRef.length == newImagesArray.length) {
        docRef
            .update({
                imageRefs: firebase.firestore.FieldValue.arrayUnion(
                    ...imageArrayRef
                ),
            })
            .then(() => {
                alert("images uploaded!");
            })
            .catch((e) => {
                alert("error:", e);
            });
    }
}

// update the ID of the document
function updateID() {
    const IDVal = document.getElementById("newID");
    if (IDVal.value.length != 0) {
        docRef
            .update({
                ID: IDVal.value,
            })
            .then(() => {
                alert("ID changed!");
            })
            .catch((e) => {
                alert("error updating ID", e);
            });
    } else {
        alert("wrong ID:", IDVal.value);
    }
}

// delete the the document completely
function deleteDoc() {
    if (confirm("confirm deleting design!")) {
        // Create a reference to the file to delete
        let designRef = storageRef.child(`images/casual/${designID}`);

        // Delete the file
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
                        setTimeout(() => {
                            window.history.back();
                        }, 300);
                    })
                    .catch((error) => {
                        alert("Error removing document: ", error);
                    });
            })
            .catch((error) => {
                alert("error getting list:", error);
            });
    }
}
