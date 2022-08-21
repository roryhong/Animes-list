const itemContainer = document.querySelector(".container");
const darkMode = document.querySelector(".dark-mode");
const arrangementMode = document.querySelector(".arrangement-Mode");
const input = document.querySelector("input");
const paginator = document.querySelector(".pagination");

let animes = [];
let findAnimes = [];
let mode = "card";
let anime_per_page = 12;
let nowPage = 1;

fetch("https://api.jikan.moe/v4/recommendations/anime")
    .then(res => res.json())
    .then((res) => {
        animes.push(...res.data);
        renderPaginator(animes.length);
        changeMode();
    })
    .catch((err) => console.log(err));

function cardMode(data) {
    let cards = "";
    data.map((item) => {
        cards += `
      <div class="card" style="width: 20rem;">
      <a href="${item.entry[0].url}" target="_blank">
        <div>
          <img src="${item.entry[0].images.jpg.image_url}" alt="...">
        </div>
      </a>
      <div class="card-body">
        <p class="card-text">${item.entry[0].title}</p>
      </div>
    </div> 
    `;
    });
    itemContainer.innerHTML = cards;
}

function listMode(data) {
    let list = "";
    data.map((item) => {
        list += `
     <div class="list">
      <a href="${item.entry[0].url}" target="_blank">
        <div>
          <img src="${item.entry[0].images.jpg.image_url}" alt="...">
        </div>
      </a>
      <div class="list-body">
        <a href="${item.entry[0].url}" target="_blank">
          <p class="list-text">${item.entry[0].title}</p>
        </a>
      </div>
    </div> 
    `;
    });
    itemContainer.innerHTML = list;
}

//依照card or list mode改變呈現方式
function changeMode(mode) {
    if (mode === "list") {
        listMode(perPage(nowPage));
    } else {
        cardMode(perPage(nowPage));
    }
}

//依照淺色深色模式改變背景、文字或圖示顏色
function modeChangeColor() {
    const icon = document.querySelector(".dark-mode i");
    const title = document.querySelector(".title");
    const favorite = document.querySelector(".favorite");
    const input = document.querySelector("input");
    const mode = document.querySelector(".arrangement-Mode");
    const listText = document.querySelectorAll(".list div p");

    if (icon.classList.contains("fa-moon")) {
        icon.classList.add("fa-sun");
        icon.classList.remove("fa-moon");
        darkMode.style = "background-color: #F0F0F0; border:none;";
        document.body.style = "background-color: #3C3C3C;";
        title.style = "color: #AAAAAA;";
        favorite.style = "color: #AAAAAA;";
        input.style = "border: 1px solid #AAAAAA;";
        mode.style = "color: #AAAAAA;";
        listText.forEach((item) => {
            item.style = "color: #E0E0E0";
        });
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        darkMode.style = "background-color: #272727;";
        document.body.style = "background-color: white;";
        title.style = "color: #3c3c3c;";
        favorite.style = "color: #3c3c3c;";
        input.style = "border: 1px solid #272727;";
        mode.style = "color: #3c3c3c;";
        listText.forEach((item) => {
            item.style = "color: #3c3c3c;";
        });
    }
}

//深色模式下卡片模式文字顏色
function changeListModeTextColor() {
    const listText = document.querySelectorAll(".list div p");
    const icon = document.querySelector(".dark-mode i");
    const listIcon = document.querySelector(".arrangement-Mode .list-mode i");

    if (
        icon.classList.contains("fa-sun") &&
        listIcon.classList.contains("active")
    ) {
        listText.forEach((item) => {
            item.style = "color: #E0E0E0";
        });
    }
}

function search() {
    let keyword = input.value.trim().toLowerCase();
    findAnimes = animes.filter((item) => {
        return item.entry[0].title.toLowerCase().includes(keyword);
    });
    //在搜尋到東西並點擊其他頁數時，突然搜尋但又刪除搜尋結果的情況下，必須回到所有動畫的第一頁
    if (findAnimes.length !== 0 && nowPage !== 1) {
        nowPage = 1;
        renderPaginator(animes.length);
    }
    if (findAnimes.length === 0) {
        alert("查無資料");
        input.value = "";
        changeMode(mode);
        changeListModeTextColor();
        renderPaginator(animes.length);
    } else {
        changeMode(mode);
        changeListModeTextColor();
        renderPaginator(findAnimes.length);
    }
}

//讓分頁出現9部
function perPage(page) {
    const data = findAnimes.length ? findAnimes : animes;
    const startIndex = (page - 1) * anime_per_page;
    return data.slice(startIndex, startIndex + anime_per_page);
}

//按照數量產生分頁
function renderPaginator(amount) {
    const pageAmount = Math.ceil(amount / anime_per_page);
    let paginatorHTML = "";
    for (let page = 1; page <= pageAmount; page++) {
        paginatorHTML += `
       <li class="pagination-item" aria-current="page">
        <a href="#" class="pagination-link" data-page="${page}">${page}</a>
       </li>
    `;
    }
    paginator.innerHTML = paginatorHTML;
}

function scrollHandler() {
    const goToTop = document.querySelector(".to-the-top");
    const bottom = window.scrollY + window.innerHeight;
    if (bottom >= 2000) {
        goToTop.style = "opacity: 1;";
    } else {
        goToTop.style = "opacity:0;";
    }
}

//card or list mode 切換顏色
arrangementMode.addEventListener("click", function modeIconClick(e) {
    const cardIcon = document.querySelector(".arrangement-Mode .card-mode i");
    const listIcon = document.querySelector(".arrangement-Mode .list-mode i");

    if (e.target.matches(".fa-bars")) {
        changeMode("list");
        mode = "list";
        e.target.classList.add("active");
        cardIcon.classList.remove("active");
        changeListModeTextColor();
    } else if (e.target.matches(".fa-grip-horizontal")) {
        changeMode("card");
        mode = "card";
        e.target.classList.add("active");
        listIcon.classList.remove("active");
    }
});
//頁數改變時
paginator.addEventListener("click", function paginationChange(e) {
    const paginationItem = document.querySelectorAll(".pagination-item");
    if (!e.target.classList.contains("pagination-link")) return;
    nowPage = Number(e.target.dataset.page);

    //分頁點擊時改變顏色
    paginationItem.forEach((item) => {
        if (item === e.target.parentElement) {
            return (item.style = "background-color: gray;");
        } else {
            return (item.style = "background-color: #00aeae;");
        }
    });

    changeMode(mode);
    changeListModeTextColor();
});

//深色模式改變顏色
darkMode.addEventListener("click", modeChangeColor);
//搜尋
input.addEventListener("keyup", search);
window.addEventListener("scroll", scrollHandler);