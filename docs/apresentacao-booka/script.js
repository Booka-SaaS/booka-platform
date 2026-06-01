// Apresentação local: não importar no frontend e não publicar no deploy.
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const counter = document.querySelector('#counter');
const progressBar = document.querySelector('#progressBar');

let currentSlide = 0;

function updatePresentation() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  counter.textContent = `${currentSlide + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === slides.length - 1;
}

function goToNextSlide() {
  if (currentSlide < slides.length - 1) {
    currentSlide += 1;
    updatePresentation();
  }
}

function goToPreviousSlide() {
  if (currentSlide > 0) {
    currentSlide -= 1;
    updatePresentation();
  }
}

prevBtn.addEventListener('click', goToPreviousSlide);
nextBtn.addEventListener('click', goToNextSlide);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    goToNextSlide();
  }

  if (event.key === 'ArrowLeft') {
    goToPreviousSlide();
  }
});

updatePresentation();
