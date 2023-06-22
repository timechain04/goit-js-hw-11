import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import _ from 'lodash';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

formInput.addEventListener('input', (evt) => {
  inputValue = evt.target.value;
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

form.addEventListener('submit', evt => {
  evt.preventDefault();
  gallery.innerHTML = '';
  pageCounter = 1;
  getImages(inputValue)
    .then(res => {
        const { hits, totalHits } = res.data;
        pagesCount = Math.ceil(totalHits / perPage);
        if (hits.length === 0) {
          gallery.innerHTML = '';
          return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        Notify.success(`Hooray! We found ${totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', galleryMarkup(hits));
        lightBox.refresh();
      },
    )
    .catch(error => console.log(error));
});

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

  const loadMoreImg = () => {
    pageCounter++;
    getImages(inputValue).then(res => {
        const { hits } = res.data;
        loading.classList.add('show');
        gallery.insertAdjacentHTML('beforeend', galleryMarkup(hits));
        lightBox.refresh();
        loading.classList.remove('show');
        if (pagesCount === pageCounter) {
         return Notify.failure(`We're sorry, but you've reached the end of search results.`);
        }
    });
  };

  window.addEventListener('scroll', _.debounce(() => {
    let ViewportHeight = document.querySelector('body').clientHeight;
    let position = ViewportHeight - window.scrollY;
    if (position - window.innerHeight <= ViewportHeight + 0.10 && pageCounter < pagesCount) {
        loadMoreImg(pageCounter)
    }
  }, 300));