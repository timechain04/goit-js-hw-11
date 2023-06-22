import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import _ from 'lodash'

const getEl = el => document.querySelector(el);

const gallery = getEl('.gallery');
const form = getEl('#search-form');
const formBtn = getEl('#search-form button');
const formInput = getEl('#search-form input');
const loading = getEl('.loading');

let pageCount = 1;
let pageCounter = 1;
let inputValue = '';
let perPage = 40;

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsDelay: 250,
})