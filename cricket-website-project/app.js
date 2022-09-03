const navBtn = document.querySelector(".nav-btn");
const nav = document.querySelector("ul");
const year = document.querySelector(".year");
navBtn.addEventListener("click",() => {
    nav.classList.toggle("toggle");
});
year.innerText = new Date().getFullYear();