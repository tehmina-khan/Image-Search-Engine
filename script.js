// grabbing all the elements I need from the page
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const loadMoreButton = document.getElementById("load-more-button");
const resultsSection = document.getElementById("results-section");
const messageSection = document.getElementById("message-section");
const historySection = document.getElementById("history-section");
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const modalCloseButton = document.getElementById("modal-close-button");

// we don't need an api key here anymore - that lives on the
// server side now, inside netlify/functions/search.js
const baseUrl = "/.netlify/functions/search";

// these two keep track of what's currently being searched
// so load more knows what to do
let currentSearchWord = "";
let currentPage = 1;

// runs when the search button (or enter key) is used
async function startNewSearch() {
  const searchWord = searchInput.value.trim();

  if (searchWord === "") {
    showMessage("Please type something to search for.");
    return;
  }

  currentSearchWord = searchWord;
  currentPage = 1;

  addToHistory(searchWord);

  resultsSection.innerHTML = ""; // clear old results
  showMessage("Loading...");

  const images = await getImages(currentSearchWord, currentPage);

  if (images === null) {
    showMessage("Something went wrong. Please try again.");
    return;
  }

  if (images.length === 0) {
    showMessage("No images found. Try a different word.");
    return;
  }

  showMessage("");
  showImages(images);
}

async function loadMoreImages() {
  if (currentSearchWord === "") {
    showMessage("Please search for something first.");
    return;
  }

  currentPage++;
  showMessage("Loading more...");

  const images = await getImages(currentSearchWord, currentPage);

  if (images === null) {
    showMessage("Something went wrong. Please try again.");
    return;
  }

  if (images.length === 0) {
    showMessage("No more images to show.");
    return;
  }

  showMessage("");
  showImages(images); // ths just adds onto whats already there
}

// taks to our netlify function (which talks to unsplash) and
// gets back a lst of photos
async function getImages(searchWord, page) {
  const url = baseUrl + "?query=" + searchWord + "&page=" + page;

  try {
    const response = await fetch(url);

    // if the key is wrong or something on their end breaks,
    // response.ok will be false even though fetch didn't actually "fail"
    if (!response.ok) {
      throw new Error("request failed: " + response.status);
    }

    const data = await response.json();
    return data.results;

  } catch (err) {
    console.log(err);
    // returning null here on purpose so I can tell the difference
    // between "the request failed" and "it worked but found nothing"
    return null;
  }
}

// builds the little cards and drops them into the results grid
function showImages(images) {
  for (let i = 0; i < images.length; i++) {
    const photo = images[i];

    const card = document.createElement("div");
    card.className = "image-card";

    const img = document.createElement("img");
    img.src = photo.urls.small;
    img.alt = photo.alt_description;

    const credit = document.createElement("p");
    credit.className = "photographer-name";
    credit.textContent = "Photo by " + photo.user.name;

    card.appendChild(img);
    card.appendChild(credit);

    // open the biger image in the popup when you click the crd
    card.addEventListener("click", function () {
      openModal(photo.urls.regular);
    });

    resultsSection.appendChild(card);
  }
}

function showMessage(msg) {
  messageSection.textContent = msg;
}

// --- search history stuff (uses localStorage so it sticks around) ---

function getHistory() {
  const saved = localStorage.getItem("searchHistory");
  if (!saved) {
    return [];
  }
  return JSON.parse(saved);
}

function addToHistory(word) {
  let history = getHistory();

  // remove it if its already in there so we dont get duplicates
  history = history.filter(item => item !== word);

  history.unshift(word); // newest one goes first
  history = history.slice(0, 5); // only keep the last 5

  localStorage.setItem("searchHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historySection.innerHTML = "";
  const history = getHistory();

  for (let i = 0; i < history.length; i++) {
    const word = history[i];

    const pill = document.createElement("button");
    pill.textContent = word;
    pill.className = "history-pill";

    pill.addEventListener("click", function () {
      searchInput.value = word;
      startNewSearch();
    });

    historySection.appendChild(pill);
  }
}

// --- image popup stuff ---

function openModal(url) {
  modalImage.src = url;
  imageModal.classList.remove("hidden");
}

function closeModal() {
  imageModal.classList.add("hidden");
  modalImage.src = "";
}

modalCloseButton.addEventListener("click", closeModal);

// clicking the dark background closes it too, but clicking the
// actual image shouldn't (stopPropagation stops it from bubbling
// up to the background click)
imageModal.addEventListener("click", closeModal);
modalImage.addEventListener("click", function (e) {
  e.stopPropagation();
});

// --- main event listeners ---

searchButton.addEventListener("click", startNewSearch);
loadMoreButton.addEventListener("click", loadMoreImages);

// lets you hit enter instead of clicking the button
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    startNewSearch();
  }
});

// show whatever search history we already have saved
renderHistory();
