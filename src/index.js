import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import _ from 'lodash';

const getEl = el => document.querySelector(el);

const gallery = getEl('.gallery');
const form = getEl('#search-form');
const formBtn = getEl('#search-form button');
const formInput = getEl('#search-form input');
const loading = getEl('.loading');

let pageCounter = 1;
let pagesCount = 1;
let inputValue = '';
let perPage = 40;

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formInput.addEventListener('input', (e) => {
  inputValue = e.target.value;
  if (inputValue.length > 0) {
    formBtn.removeAttribute('disabled');
  } else {
    formBtn.setAttribute('disabled', 'disabled');
  }
});

const getImages = (value) => {
  return axios.get('https://pixabay.com/api/', {
    params: {
      key: '36502958-cdaae05ea9a7c2e9488e66ded',
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pageCounter,
      per_page: perPage,
    },
  });
};



const galleryMarkup = (data) => {
    return data.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => `
    <a href='${largeImageURL}' class='gallery__link'>
      <img class='gallery__image' src='${webformatURL}' alt='${tags}' loading='lazy' />
      <div class='info'>
        <p class='info-item likes'>${likes} ❤️ </p>
        <p class='info-item views'>${views} 👀 </p>
        <p class='info-item comments'>${comments} 💬 </p>
        <p class='info-item downloads'>${downloads} 💻 </p>
      </div>
      </a>
    `).join('');
  };

