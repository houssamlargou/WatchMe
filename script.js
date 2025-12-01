const cardsContainer = document.querySelector("#cards-container");
const filterBox = document.querySelector("#filter__genre-container");
const filterWrapper = document.querySelector("#filter");

let allGames = [];

async function loadGames() {
  try {
    const res = await fetch(
      "https://debuggers-games-api.duckdns.org/api/games"
    );
    const data = await res.json();
    allGames = data.results;

    renderCards(allGames.slice(0, 20));
  } catch (err) {
    console.error(err);
  }
}

loadGames();

function renderCards(list) {
  cardsContainer.innerHTML = "";
  list.forEach((g) => {
    const html = `
      <div class="card w-[356px] bg-white bg-gradient-to-b from-[#2C3C49] to-[#576574] flex pl-[20px] flex-col">
        <div class="relative w-[316px] pt-[14px] overflow-hidden">
          <img src="${g.background_image}" alt=""/>
        </div>

        <div class="text-2xl pt-[14px]">${g.name}</div>

        <div class="flex gap-3.5 pt-[10px]">
          <div class="text-[#BBE1FA]">${g.genres?.[0]?.name ?? "Unknown"}</div>
        </div>

        <div class="pt-[43px] flex flex-col justify-between pr-[20px]">
          <div class="flex justify-between">
            <div class="font-inder">Jun 2, 2020</div>
            <div>⭐⭐⭐⭐⭐</div>
          </div>

          <div class="pt-[27px] pb-[20px] flex justify-between items-center">
            <button class="text-sm px-4 py-2.5 bg-gradient-to-b from-[#06BFFF] to-[#2B79FF] rounded-[30px]">
              view details
            </button>

            <button class="px-[10px] py-[5px] bg-[#C09100] flex gap-[3px] rounded-[30px]">
              fav
              <img src="heart.png" class="w-[21px] h-[21px]" alt="" />
            </button>
          </div>
        </div>
      </div>
    `;
    cardsContainer.insertAdjacentHTML("afterbegin", html);
  });
}

document.querySelectorAll(".filter-type").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBox.innerHTML = "";

    if (e.target.closest("#genre-container")) {
      filterColor("#genre");
      createFilterOptions(
        ["Action", "RPG", "Shooter", "Horror", "Simulation"],
        "genre"
      );
    }

    if (e.target.closest("#platform-container")) {
      filterColor("#platform");
      createFilterOptions(["PlayStation", "PC", "Xbox"], "platform");
    }

    if (e.target.closest("#note-container")) {
      filterColor("#note");
      createFilterOptions(
        ["Highest Rated", "Good Rated", "Average", "Low Rated"],
        "note"
      );
    }

    positionFilter();
  });
});

function createFilterOptions(arr, type) {
  arr.forEach((option) => {
    const span = document.createElement("span");
    span.classList.add("btn");
    span.textContent = option;
    filterBox.appendChild(span);

    span.addEventListener("click", () => handleFilter(type, option));
  });
}

function handleFilter(type, option) {
  let filtered = [];

  if (type === "genre") {
    filtered = allGames.filter((g) => g.genres?.[0]?.name === option);
  }

  if (type === "platform") {
    filtered = allGames.filter((g) =>
      g.parent_platforms?.some((p) =>
        p.platform.name.toLowerCase().includes(option.toLowerCase())
      )
    );
  }

  if (type === "note") {
    filtered = [...allGames].sort((a, b) => {
      if (option === "Highest Rated") return b.rating - a.rating;
      if (option === "Good Rated") return b.rating - a.rating;
      if (option === "Average")
        return Math.abs(b.rating - 3) - Math.abs(a.rating - 3);
      if (option === "Low Rated") return a.rating - b.rating;
    });
  }

  renderCards(filtered.slice(0, 20));
}

function filterColor(style) {
  document.querySelector(style).classList.toggle("text-[#1A9FFF]");
  document.querySelector(`${style}-icon`).classList.toggle("fill-[#1A9FFF]");
}

function positionFilter() {
  const content = document
    .querySelector("#filter-content")
    .getBoundingClientRect();
  filterWrapper.classList.add(`top-[${content.height}px]`);
}
