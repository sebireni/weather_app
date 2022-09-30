async function loadEvent() {
  const rootElement = document.querySelector("#root");

  let searchUrl =
    "https://api.weatherapi.com/v1/search.json?key=7874ced20d8548e4ab5195616212206&q=";
  let currentUrl =
    "https://api.weatherapi.com/v1/current.json?key=7874ced20d8548e4ab5195616212206&q=";
  let iconUrl = "";

  rootElement.insertAdjacentHTML(
    "beforeend",
    `
        <img id="cityBG" src="clouds_bg.jpg"></img>
        <div id="inpWrapper">
            <input name="cityChooser" id="cityChooser" type="text" list="filteredList" placeholder="Choose your city!"></input>
            <datalist id="filteredList">
            </datalist>
        </div>
        <div class="outputWrapper">
            <div id="tempWrapper">
                <span id="temperatureE"></span>
            </div>
            <div id="skyWrapper">
                <span id="skyConditionE"></span>
                <span id="skyConditionIconE"><img id="condIcon" src=""/></span>
            </div>
            <div id="humidityWrapper">
                <span id="humidityE"></span>
            </div>
        </div>
        <div hidden id="spinner"></div>
    `
  );

  let spinner = document.getElementById("spinner");

  function autoComplete(event) {
    let input = event.target.value;
    let listE = document.querySelector("#filteredList");

    if (input.length > 3) {
      listE.innerHTML = ``;

      fetch(searchUrl + input)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (let i = 0; i < data.length; i++) {
            listE.insertAdjacentHTML(
              "beforeend",
              `
                <option>${data[i].name}</option>
              `
            );
          }
        })
        .catch(function (err) {
          console.log("Fetch Error :-S", err);
        });
    } else {
      listE.innerHTML = ``;
    }
  }

  let cityInput = document.querySelector("#cityChooser");

  cityInput.addEventListener("input", autoComplete);

  function updateCityValue(event) {
    spinner.removeAttribute("hidden");

    let input = event.target.value;

    fetch(currentUrl + input)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        function output() {
          fetch(
            "https://api.pexels.com/v1/search?query=" +
              data.location.name +
              "%20city",
            {
              headers: {
                Authorization:
                  "563492ad6f91700001000001b756c258bfb449658e3f81544e8b08df",
              },
            }
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (photoData) {
              document
                .querySelector("#cityBG")
                .setAttribute("src", photoData.photos[0].src.portrait);
            });
          spinner.setAttribute("hidden", "");
          document.querySelector("#temperatureE").innerHTML =
            data.current.temp_c + " °C";
          document.querySelector("#skyConditionE").innerHTML =
            data.current.condition.text;
          iconUrl = data.current.condition.icon;
          document.getElementById("condIcon").setAttribute("class", "visible");
          document.getElementById("condIcon").setAttribute("src", iconUrl);
          document.querySelector("#humidityE").innerHTML =
            "humidity:  " + data.current.humidity + "%";
        }
        setTimeout(output, 1000);
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  cityInput.addEventListener("change", updateCityValue);
}

window.addEventListener("load", loadEvent);
