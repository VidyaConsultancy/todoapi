const btn = document.getElementById("menu-toggle");
btn.addEventListener("click", function (e) {
  const menu = document.getElementsByClassName("main-navbar");
  menu[0].classList.toggle("open");
});
