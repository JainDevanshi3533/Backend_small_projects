
function copyToClipboard() {
    /* Get the text from the input field */
    var text = document.getElementById("main-text").innerText;
    
    /* Use the Clipboard API to copy the text */
    navigator.clipboard.writeText(text)
        .then(function() {
            alert("Text copied to clipboard");
        })
        .catch(function(error) {
            console.error("Unable to copy text to clipboard:", error);
        });
}