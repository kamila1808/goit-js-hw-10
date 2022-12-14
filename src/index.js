import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const name = inputEl.value.trim();
  if (name === '') {
    onFetchClear();
    return;
  }
  fetchCountries(name)
    .then(country => {
      onFetchClear();
      if (country.length === 1) {
        countryInfoEl.insertAdjacentHTML('beforeend', renderOneCountry(country));
      } else if (country.length >= 10) {
        onFetchSpecific();
      } else {
        countryListEl.insertAdjacentHTML('beforeend', renderCountryList(country));
      }
    })
    .catch(onFetchError);


function onFetchSpecific() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

// от 2х до 10 стран
function renderCountryList(data) {
  return data.map(country => {
    return `<li class="country-list__item">
    <img class="country-list__item-image"src="${country.flags.svg}" alt="Flag" width="35" height="30"></img>
    <h2 class="country-list__item-name">${country.name.official}</h2>
    </li>`
}).join('');
}

// 1 страна
function renderOneCountry(data) {
  return data.map(country => {
    return `<h2 class="country-info__title"><img class="country-info__image" src="${country.flags.svg}" alt="Flag" width="50" height="35"></img>${country.name.official}</h2>
        <p class="country-info__description">Capital:${country.capital}</p>
        <p class="country-info__description">Population:${country.population }</p>
        <p class="country-info__description">Languages:${Object.values(country.languages)}</p>`
}).join('');
}

// чистка страницы
function onFetchClear() {
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
};