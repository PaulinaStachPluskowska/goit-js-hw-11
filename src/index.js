// import axios from "axios";
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as scrollPage from "./js/scrollPage";
import { lightbox } from './js/lightbox';


const searchedPhrase = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let pageNumber = 1;
let numberOfPages = 1;
// const perPage = 40;

searchButton.addEventListener('submit', async event => {
    event.preventDefault();
    gallery.innerHTML = '';
    
    if (searchedPhrase.value == '') {
      return;
    } else {
      numberOfPages = 1;
      await getImages(searchedPhrase.value.trim(), numberOfPages);
    }
  });

async function getImages(searchedPhrase, pageNumber) {
    try {

        const param = new URLSearchParams({
            key: '33195267-1b3b7003c08e911d98c3746fb',
            q: searchedPhrase,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: pageNumber,
            per_page: 40,
        });
        
        const response = await axios
        .get(`https://pixabay.com/api/?${param}`);
        

        const set = response.data.hits;

        set.forEach(image => {
          galleryItem(image);
        });

        lightbox.refresh();
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

        scrollPage.scrollPage();

        if (response.data.totalHits === gallery.childElementCount) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          // console.log(response.data.totalHits);
        }

        
    } catch (error) {
        Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
    }
};

const galleryItem = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    ` <div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /> 
      </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${image.downloads}
          </p>
        </div>
      </div>`
  );
}

window.addEventListener('scroll', () => {
  console.log('scrolled', window.scrollY);
  console.log(window.innerHeight);
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    numberOfPages += 1;
    getImages(searchedPhrase.value.trim(), numberOfPages);
  }
});