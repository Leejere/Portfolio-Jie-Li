var button = document.getElementsByClassName("email");
var j;

for (j = 0; j < button.length; j++) {
  coll[j].addEventListener("click", function() {
    this.classList.toggle("active");
    var emailBox = document.getElementById('emailBox');
    if (emailBox.style.display === "block") {
        emailBox.style.display = "none";
    } else {
        emailBox.style.display = "block";
    }
  });
}