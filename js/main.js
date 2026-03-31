const header = document.getElementById("header");

let lastState = false;

window.addEventListener("scroll", () => {
    const isScrolled = window.scrollY > 50;

    if (isScrolled !== lastState) {
        header.classList.toggle("scrolled", isScrolled);
        lastState = isScrolled;
    }
});