var db = firebase.firestore();
const filePicker = document.getElementById("fileItem");
const preview = document.querySelector(".preview");
const submitBtn = document.getElementById("submit");
const ID = document.getElementById("ID");
const stateViewer = document.getElementById("stateViewer");

// store the image file
let imageArray = [];

filePicker.addEventListener("change", (event) => {
    const fileList = event.target.files;

    // populate image array
    for (let element = 0; element < fileList.length; element++) {
        const item = fileList[element];

        imageArray.push(item);
        console.log(item.name);
    }

    submitBtn.disabled = false;

    displayImages();
});

function displayImages() {
    // reset the images
    preview.innerHTML = null;

    imageArray.forEach((img) => {
        let image = document.createElement("img");
        image.src = URL.createObjectURL(img);

        image.addEventListener("click", () => {
            if (confirm("Confirm deletion")) {
                imageArray.splice(i, 1);
                if (imageArray.length == 0) {
                    submitBtn.disabled = true;
                }
                displayImages();
            }
        });

        preview.appendChild(image);
    });
}

submitBtn.addEventListener("click", () => {
    if (ID.value.length == 0) {
        alert("ID is empty");
        // stop the method / no upload
        return;
    }

    const timestamp = Date.now();
    let imageArrayRef = [];

    db.collection("casual")
        .add({
            ID: ID.value,
            createdAt: timestamp,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            // add the id reference to the state viewer
            let IDstateView = document.createElement("p");
            IDstateView.innerText = docRef.id;
            stateViewer.appendChild(IDstateView);

            let storageRef = firebase.storage().ref();
            imageArray.forEach((image, i) => {
                let uploadTask = storageRef
                    .child(`images/casual/${docRef.id}/${image.name}`)
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
    // all the documents have been uploaded
    if (imageArrayRef.length == imageArray.length) {
        docReference
            .set(
                {
                    imageRefs: imageArrayRef,
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
