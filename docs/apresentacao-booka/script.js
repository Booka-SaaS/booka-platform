// Apresentacao local: nao importar no frontend e nao publicar em producao.
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const counter = document.querySelector('#counter');
const progressBar = document.querySelector('#progressBar');

let current = 0;

function renderSlide() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === current);
  });

  counter.textContent = `${current + 1} / ${slides.length}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

function nextSlide() {
  if (current < slides.length - 1) {
    current += 1;
    renderSlide();
  }
}

function previousSlide() {
  if (current > 0) {
    current -= 1;
    renderSlide();
  }
}

prevBtn.addEventListener('click', previousSlide);
nextBtn.addEventListener('click', nextSlide);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') previousSlide();
});

renderSlide();
