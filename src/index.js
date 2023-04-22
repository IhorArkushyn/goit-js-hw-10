import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countriesInfo: document.querySelector('.country-info'),
};


refs.inputEl.addEventListener('input', debounce(fetchByInput, DEBOUNCE_DELAY));


function fetchByInput() {
  const country = refs.inputEl.value.trim();
  if (!country) {
    clearMarkup();
    return;
  }
  return fetchCountries(country).then(renderCountries).catch(showError);
}


function clearMarkup() {
  refs.countriesList.innerHTML = '';
  refs.countriesInfo.innerHTML = '';
}


function showError() {
  clearMarkup();
  Notify.failure('Oops, there is no country with that name');
}


function renderCountries(countriesName) {
  clearMarkup();

  if (countriesName.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countriesName.length >= 2 && countriesName.length <= 10) {
    renderCountryInfo(countriesName);
  } else {
    renderCountryInfo(countriesName);
    renderCountryData(countriesName);
  }
}


function renderCountryInfo(countriesName) {
  const markupCountry = countriesName
    .map(({ name, flags }) => {
      return `<li class = "country-list__item">
                <img src="${flags.svg}" alt="${name.official}" width="60" height="45">
                <span class = "country-list__preview">${name.official}</span>
              </li>`;
    })
    .join('');
  refs.countriesList.innerHTML = markupCountry;
}


function renderCountryData(countriesName) {
  clearMarkup();

  const markupInfo = countriesName
    .map(({ name, flags, capital, population, languages }) => {
      return `
            <div class="country-list__item">
              <img src="${flags.svg}" alt="${name.official}" width="60" height="45">
              <span class = "country-list__name">${name.official}</span>
            </div>
              <p class = "country-info__data"><b>Capital:</b> ${capital}</p>
              <p class = "country-info__data"><b>Population:</b> ${population}</p>
              <p class = "country-info__data"><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  refs.countriesInfo.innerHTML = markupInfo;
}
