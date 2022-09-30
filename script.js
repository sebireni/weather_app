async function loadEvent() {
  const renderHtml = () => {
    return `
      <img id='cityBG' src='clouds_bg.jpg' />
      <div id='inpWrapper'>
          <input name='cityChooser' id='cityChooser' type='text' list='filteredList' placeholder='Choose your city!' />
          <datalist id='filteredList'>
          </datalist>
      </div>
      <div class='outputWrapper'>
          <div id='tempWrapper'>
              <span id='temperatureE'></span>
          </div>
          <div id='skyWrapper'>
              <span id='skyConditionE'></span>
              <span id='skyConditionIconE'><img id='condIcon' src=''/></span>
          </div>
          <div id='humidityWrapper'>
              <span id='humidityE'></span>
          </div>
      </div>
      <div hidden id='spinner'></div>
    `;
  };

  const rootElement = document.querySelector('#root');
  rootElement.insertAdjacentHTML('beforeend', renderHtml());

  const spinner = document.getElementById('spinner');
  const cityInput = document.querySelector('#cityChooser');

  const KEY = '7874ced20d8548e4ab5195616212206';
  const AUTH = '563492ad6f91700001000001b756c258bfb449658e3f81544e8b08df';

  const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${KEY}&q=`;
  const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=`;

  const autoComplete = (event) => {
    const searchValue = event.target.value;
    const listElement = document.querySelector('#filteredList');

    if (searchValue.length > 3) {
      fetch(`${searchUrl}${searchValue}`)
        .then((response) => response.json())
        .then((cities) => {
          listElement.innerHTML = ``;
          cities.map((city) => {
            listElement.insertAdjacentHTML(
              'beforeend',
              `
                <option>${city.name}</option>
              `
            );
          });
        })
        .catch((err) => console.warn('Fetch Error :-S', err));
    }
  };

  const handleSpinner = () => {
    const isHidden = spinner.hasAttribute('hidden');
    if (isHidden) {
      spinner.removeAttribute('hidden');
    } else {
      spinner.setAttribute('hidden', '');
    }
  };

  const showImage = (locationName) => {
    fetch(`https://api.pexels.com/v1/search?query=${locationName}%20city`, {
      headers: {
        Authorization: AUTH,
      },
    })
      .then((response) => response.json())
      .then((photoData) =>
        document
          .querySelector('#cityBG')
          .setAttribute('src', photoData.photos[0].src.portrait)
      );
  };

  const showTemperature = (temp_c, condition) => {
    document.querySelector('#temperatureE').innerHTML = `${temp_c} °C`;
    document.querySelector('#skyConditionE').innerHTML = condition.text;
  };

  const showCondition = (condition) => {
    document.getElementById('condIcon').setAttribute('class', 'visible');
    document.getElementById('condIcon').setAttribute('src', condition.icon);
  };

  const showHumidity = (humidity) => {
    document.querySelector('#humidityE').innerHTML = `humidity: ${humidity} %`;
  };

  const showAllCityData = (data) => {
    const {
      location: { name },
      current: { temp_c, condition, humidity },
    } = data;

    showImage(name);
    handleSpinner();
    showTemperature(temp_c, condition);
    showCondition(condition);
    showHumidity(humidity);
  };

  const updateCityValue = (event) => {
    const searchValue = event.target.value;
    handleSpinner();

    fetch(`${currentUrl}${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => showAllCityData(data), 1000);
      })
      .catch((err) => console.warn('Fetch Error :-S', err));
  };

  cityInput.addEventListener('input', autoComplete);
  cityInput.addEventListener('change', updateCityValue);
}

window.addEventListener('load', loadEvent);
