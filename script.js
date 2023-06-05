'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal'); // Array of all the buttons
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// EVENT HANDLERS

// TASK: SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('current scroll coords', window.pageXOffset, window.pageYOffset);

  // TOPIC: old school way of scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // TOPIC: new way of scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

// TOPIC: EVENT DELEGATION -> adding the event handler to the parent element rather adding it to all the elements using the forEach loop
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    //Matching Stratergy - here checking for the anchor tag's class
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

// TASK: TAB SWITCHING

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // (parent element) checks for the button which got clicked
  console.log(clicked);

  //guard clause
  if (!clicked) return; // (clicked = null) -> handles error if a whitespace other than button clicked

  //Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content tab
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// TASK: HOVER EFFECT IN NAVIGATION BAR

const nav = document.querySelector('.nav');
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // checks for the hovered link elements
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link'); // all child elements
    const logo = e.target.closest('.nav').querySelector('img'); // the logo element

    siblings.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "arguments" into handler function
nav.addEventListener('mouseover', handleHover.bind(0.5)); // if we want to pass more than one argument than we can pass object
nav.addEventListener('mouseout', handleHover.bind(1));

// TASK: STICKY NAVIGATION BAR

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const entry = entries[0]; // to take the first entry

  if (entry.isIntersecting === false) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

// TASK: REVEALING ELEMENTS ON SCROLL

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const entry = entries[0];

  // guard clause
  if (!entry.isIntersecting) return; // check in console -> entry.isIntersecting: false

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); // for better performance
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// TASK: LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //remove the lazy-img class once the high quality image gets loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const loadOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};
const imageObserver = new IntersectionObserver(loadImg, loadOptions);
imgTargets.forEach(img => imageObserver.observe(img));

// TASK: SLIDING COMPONENT
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
let currSlide = 0;
const maxSlide = slides.length - 1;
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
// slider.style.overflow = 'visible';
const dotContainer = document.querySelector('.dots');

// makes them look side by side
slides.forEach((slide, index) => {
  slide.style.transform = `translateX(${100 * index}%)`;
});

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDots(0);

const goToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${100 * (index - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDots(currSlide);
};

// EVENT HANDLERS
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
});
