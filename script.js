const resultNav = document.querySelector("#resultsNav");
const favoritesNav = document.querySelector("#favoritesNav");
const loader = document.querySelector(".loader");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");

//api key and url
const count = 10;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  if (page === "favorites") {
    resultNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  } else {
    resultNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMElements(page) {
  const currentArray =
    page === "results" ? resultArray : Object.values(favorites);
  currentArray.forEach((result) => {
    //favorite button
    const favBtn = document.createElement("button");
    favBtn.classList.add("add-favorite");
    if (page === "results") {
      favBtn.textContent = "🤍️";
      favBtn.onclick = function () {
        saveFavorite(result.url);
      };
    } else {
      favBtn.textContent = "❤️️";
      favBtn.onclick = function () {
        removeFavorite(result.url);
      };
    }

    //date strong
    const textDate = document.createElement("strong");
    textDate.textContent = result.date;

    //copyright text
    const copyright = document.createElement("span");
    copyright.textContent = result.copyright;

    //text muted
    const textMuted = document.createElement("small");
    textMuted.classList.add("text-muted");

    textMuted.append(textDate, copyright);

    //card footer
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    cardFooter.append(textMuted, favBtn);

    //card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;

    //card body
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    //card footer
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    cardBody.append(cardTitle, cardText, cardFooter);

    //image
    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.loading = "lazy";
    image.setAttribute("src", result.hdurl);
    image.setAttribute("alt", result.title);

    //image link
    const imageLink = document.createElement("a");
    imageLink.setAttribute("href", result.hdurl);
    imageLink.setAttribute("title", "View Full Image");
    imageLink.setAttribute("target", "_blank");

    imageLink.appendChild(image);

    //card
    const card = document.createElement("div");
    card.classList.add("card");

    card.append(imageLink, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  if (localStorage.getItem("nasaFavs")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavs"));
  }
  imagesContainer.textContent = "";
  createDOMElements(page);
  showContent();
}

async function getData() {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
}

function saveFavorite(url) {
  resultArray.forEach((item) => {
    if (item.url.includes(url) && !favorites[url]) {
      favorites[url] = item;
      saveConfirmed.textContent = "Added!";
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem("nasaFavs", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(url) {
  if (favorites[url]) {
    delete favorites[url];
    saveConfirmed.textContent = "Removed!";
    saveConfirmed.hidden = false;
    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);
    localStorage.setItem("nasaFavs", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

getData();
