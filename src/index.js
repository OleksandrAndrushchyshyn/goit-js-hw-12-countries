import './sass/main.scss';
import { debounce } from 'lodash';
import { error, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
defaultModules.set(PNotifyMobile, {});
const inputCountry = document.querySelector('#name-input');
const listCountries = document.querySelector('#countries');
const debouncedInput = debounce(onInputCountry, 500);
inputCountry.addEventListener('keydown', debouncedInput);
function onInputCountry() {
  listCountries.innerHTML = '';
  if (inputCountry.value !== '') {
    fetch(`https://restcountries.eu/rest/v2/name/${inputCountry.value}`)
      .then(response => {
        if (response.status === 404) {
          return [];
        }
        return response.json();
      })
      .then(countries => {
        if (countries.length === 0) {
          incorrectlyEnteredCountry(countries);
          return;
        }
        if (countries.length === 1) {
          displayOneCountry(countries);
          return;
        }
        if (countries.length <= 10) {
          displayCountries(countries);
          return;
        }
        error(`We found ${countries.length} countries. Please enter a more specific query!`);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
function incorrectlyEnteredCountry(countries) {
  let li = document.createElement('li');
  li.textContent = 'Tакой страны не ненайдено!';
  listCountries.append(li);
}
function displayCountries(countries) {
  const items = countries.map(function (country) {
    let li = document.createElement('li');
    li.textContent = country.name;
    return li;
  });
  listCountries.append(...items);
}
function displayOneCountry(countries) {
  const country = countries[0];
  let li = document.createElement('li');
  li.innerHTML = `<p class="county">${country.name}</p>
  <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages:</p>
    <ul class="serv-list list">
        ${country.languages.map(lang => `<li>${lang.name}</li>`).join()}
    </ul>
    <img class="img" src="${country.flag}" alt="flag">`;
  listCountries.append(li);
}
