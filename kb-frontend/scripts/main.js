console.log("link Script läuft");
const apiUrl = "http://localhost:3000/";
// const apiUrl = "http://apigateway.awslambda.amazonaws.com/";
const apiUrl = "http://cmsdevop.s3-website.eu-central-1.amazonaws.com";

const container = document.getElementById('link-container');
const tbody = document.getElementById('link-tbody');
let list;

function getLinks() {
    tbody.innerHTML = '';
    let source = document.getElementById('link-item-template').innerHTML;
    let template = Handlebars.compile(source);
    fetch(apiUrl + "links")
        .then(response => response.json())
        .then(data => {
            let links = data.links;
            links.forEach((link, index) => {
                link.index = index + 1;
                link.thumbnail = apiUrl + link.thumbnail;
                const html = template(link);
                tbody.innerHTML += html;
            });

            // Enable tooltips after updating the content
            $('[data-toggle="tooltip"]').tooltip();

            // Add event listeners for thumbnail preview modal
            const thumbnailAnchors = document.querySelectorAll('[data-toggle="tooltip"]');
            thumbnailAnchors.forEach(anchor => {
                anchor.addEventListener('click', (event) => {
                    event.preventDefault();
                    const thumbnail = event.currentTarget.getAttribute('data-thumbnail');
                    // displaymodal(apiUrl + thumbnail);
                });
            });
        });
}

// // Fetch categories and populate the dropdown
// fetch(apiUrl + "categories")
//     .then(response => response.json())
//     .then(data => {
//         const categoryDropdown = document.getElementById('category-dropdown');

//         // Clear existing options
//         categoryDropdown.innerHTML = "";

//         // Add each category as an option
//         data.categories.forEach(category => {
//             const option = document.createElement('option');
//             option.value = category;
//             option.text = category;
//             categoryDropdown.appendChild(option);
//         });
//     })
//     .catch(error => console.error("Error fetching categories:", error));


// Function to display the thumbnail modal
function displayThumbnailModal(thumbnailUrl) {
    const modal = new bootstrap.Modal(document.getElementById('thumbnailModal'), {});
    const thumbnailImage = document.getElementById('thumbnailImage');

    // Set the source of the image in the modal to the clicked thumbnail URL
    thumbnailImage.src = thumbnailUrl;

    // Show the modal
    modal.show();

    // Add an event listener for the modal close button
    const closeButton = document.getElementById('thumbnailModalClose');
    closeButton.addEventListener('click', () => {
        // Hide the modal when the close button is clicked
        modal.hide();
    });
}
function closeModal() {
    $('#progessDialog').on('shown.bs.modal', function (e) {
        $("#progessDialog").modal("hide");
    });
}


function sendLink() {
    // Value vom input auslesen und an die API via POST senden
    const input = document.getElementById('link-item');
    const dropdown = document.getElementById('categorySelect');
    let link = input.value.trim();
    let category = dropdown.value;

    // Check if "Alle" is selected (case-insensitive)
    if (category === 'Kategorie auswählen:') {
        const domainError = "Please select a valid category.";
        displayCustomPopup(domainError);
        //alert('Please select a valid category.'); // Display an error message
        return false; // Stop further processing
    }

    // Check if the link has a protocol (http:// or https://)
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        // If not, add 'http://' as the default protocol
        link = 'http://' + link;
    }

    // Validate the link using a regex pattern
    // const urlPattern = /^(ftp|http[s]?):\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    const urlPattern = /^(ftp|http[s]?):\/\/(?:www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
    if (urlPattern.test(link)) {
        // The input is a valid hyperlink
        console.log("Valid hyperlink:", link);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "link": link, "category": category })
        };

        fetch(apiUrl + "link", options)
            .then(response => {
                if (response.ok) {
                    console.log("Response: ", response);
                    getLinks();
                } else {
                    console.log("Error: ", response.statusText);
                    // alert(response.statusText); // ist abgeschaltet -- Internal Server Error Message nur im backend 
            // Nachricht wenn die Domain nicht registriert ist bzw. ungültig ist.
            const domainError = "Invalid domain. Please enter a valid domain.";
            displayCustomPopup(domainError);
            // alert(domainError1);
                }
            });
            

    } else {
        // The input is not a valid hyperlink
        const domainError = "Invalid domain. Please enter a valid domain.";
        //alert(domainError);
        // Alternatively, you can use a custom pop-up/modal for a better user experience
        displayCustomPopup(domainError);
    }
}

// Add these functions to JavaScript file or in a script tag in HTML head
function displayCustomPopup(message) {
    const customPopup = document.getElementById('customPopup');
    const customPopupMessage = document.getElementById('customPopupMessage');

    customPopupMessage.textContent = message;
    customPopup.style.display = 'block';
}

function closeCustomPopup() {
    const customPopup = document.getElementById('customPopup');
    customPopup.style.display = 'none';
}


function deleteLink(id) {
    console.log("Delete Link ", id);
    const options = {
        method: "DELETE"
    }
    fetch(apiUrl + 'link/' + id, options)
        .then(response => {
            getLinks();
            console.log("DELETE Response", response);
        })
}

function updateLinkItem(link, thumbnail, id) {
    console.log("Update Link ", id);
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "link": link, "thumbnail": thumbnail }) // Include the thumbnail in the body
    }

    fetch(apiUrl + 'link/' + id, options)
        .then(response => {
            console.log("PATCH Response", response);
            getLinks();
        })
}


// function editLink(id) {
//     fetch(apiUrl + 'link/' + id)
//         .then(response => response.json())
//         .then(item => {
//             console.log("ITEM", item.link[0])
//             let itemData = item.link[0];
//             const myModal = new bootstrap.Modal('#myModal', {});
//             const iteminput = document.getElementById('item');
//             const thumbnailInput = document.getElementById('thumbnail');
//             const thumbnailFileInput = document.getElementById('thumbnail-file'); // Add this line for file input
//             const closebutton = document.getElementById('dialog-close');
//             const savebutton = document.getElementById('dialog-save');

//             closebutton.onclick = () => myModal.hide();
//             savebutton.onclick = () => {
//                 myModal.hide();
//                 updateLinkItem(iteminput.value, thumbnailInput.value, id); // Pass the thumbnail URL as well
//             }

//             iteminput.value = itemData.link;
//             thumbnailInput.value = itemData.thumbnail; // Set the thumbnail input value

//             myModal.show();

//             // Handle thumbnail file upload
//             thumbnailFileInput.addEventListener('change', (event) => {
//                 const file = event.target.files[0];
//                 if (file) {
//                     const reader = new FileReader();
//                     reader.onload = (e) => {
//                         thumbnailInput.value = e.target.result;
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             });
//         });
// }

// New function to handle thumbnail upload
function uploadThumbnail(file) {
    console.log('Uploading thumbnail...');
    const formData = new FormData();
    formData.append('thumbnail', file);

    const options = {
        method: 'POST',
        body: formData,
    };

    return fetch(apiUrl + 'uploadThumbnail', options)
        .then(response => {
            console.log('Thumbnail upload response status:', response.status);
            if (!response.ok) {
                throw new Error('Thumbnail upload failed. Server responded with ' + response.status + ' ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Thumbnail upload successful. Received data:', data);
            if (!data.thumbnailUrl) {
                throw new Error('Thumbnail URL not received from the server');
            }
            return data.thumbnailUrl;
        })
        .catch(error => {
            console.error('Error uploading thumbnail:', error);
            throw error; // Re-throw the error for further handling if needed
        });
}

function editLink(id) {
    fetch(apiUrl + 'link/' + id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch link data. Server responded with ' + response.status + ' ' + response.statusText);
            }
            return response.json();
        })
        .then(item => {
            console.log("ITEM", item.link[0]);
            let itemData = item.link[0];
            const myModal = new bootstrap.Modal('#myModal', {});
            const iteminput = document.getElementById('item');
            const thumbnailInput = document.getElementById('thumbnail');
            const thumbnailFileInput = document.getElementById('thumbnail-file');
            const closebutton = document.getElementById('dialog-close');
            const savebutton = document.getElementById('dialog-save');

            closebutton.onclick = () => myModal.hide();
            savebutton.onclick = () => {
                myModal.hide();
                updateLinkItem(iteminput.value, thumbnailInput.value, id);
            }

            // Set initial values
            iteminput.value = itemData.link;
            thumbnailInput.value = itemData.thumbnail;

            myModal.show();

            // Handle thumbnail file upload
            thumbnailFileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    uploadThumbnail(file)
                        .then(thumbnailUrl => {
                            thumbnailInput.value = thumbnailUrl;
                        })
                        .catch(error => {
                            console.error('Error uploading thumbnail:', error);
                            // Handle error appropriately, e.g., show an error message to the user
                        });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching link data:', error);
            // Handle error appropriately, e.g., show an error message to the user
        });
}


// function uploadThumbnail() {
//     const thumbnailInput = document.getElementById('thumbnail-file');
//     const thumbnail = thumbnailInput.files[0];
  
//     if (!thumbnail) {
//       displayStatusMessage('Please select a thumbnail.');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('thumbnail', thumbnail);
  
//     fetch('/thumbnails', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.text())
//     .then(message => {
//       displayStatusMessage(message);
//       thumbnailInput.value = ''; // Clear the thumbnail input
//     })
//     .catch(error => {
//       console.error('Error uploading thumbnail:', error);
//       displayStatusMessage('Error uploading thumbnail. Please try again.');
//     });
//   }
  

// function updateLinkItem(link, id) {
//     console.log("Update Link ", id);
//     const options = {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ "link": link })
//     }
//     fetch(apiUrl + 'link/' + id, options)
//         .then(response => {
//             console.log("PATCH Response", response);
//             getLinks();
//         })
// }


// function editLink(id) {
//     fetch(apiUrl + 'link/' + id)
//         .then(response => response.json())
//         .then(item => {
//             console.log("ITEM", item.link[0])
//             let itemData = item.link[0];
//             const myModal = new bootstrap.Modal('#myModal', {});
//             const iteminput = document.getElementById('item');
//             const closebutton = document.getElementById('dialog-close');
//             const savebutton = document.getElementById('dialog-save');
//             closebutton.onclick = () => myModal.hide();
//             savebutton.onclick = () => {
//                 myModal.hide();
//                 updateLinkItem(iteminput.value, id);
//             }
//             iteminput.value = itemData.link;
//             myModal.show();
//         });
// }


getLinks();








