const slideshowTexts = document.querySelectorAll(".slideshowText");
let currentSlide = 1;

function showNextSlide() {
  slideshowTexts[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slideshowTexts.length;
  slideshowTexts[currentSlide].classList.add("active");
}

setInterval(showNextSlide, 1000);