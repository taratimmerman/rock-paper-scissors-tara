document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded!");
  const message = document.getElementById("message");
  if (message) {
    message.textContent = "Hello World!";
  }
});
