document.querySelector("#fileUpload").addEventListener("change", function() {
    const fileName = this.files[0].name;
    document.querySelector(".file-upload-label").innerText = `Selected File: ${fileName}`;
});



function openPopup() {
  document.getElementById("subscribePopup").style.display = "block";
}

function closePopup() {
  document.getElementById("subscribePopup").style.display = "none";
}



