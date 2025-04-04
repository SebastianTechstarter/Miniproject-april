// Textfeld Variablen
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const publisherInput = document.getElementById("publisher");
const yearInput = document.getElementById("year");
const buchliste = document.getElementById("buchliste");
const categorySelect = document.getElementById("category");
//Aktuelle Liste
let refreshedList = [];

// Button Variablen
const searchBook = document.getElementById("searchBook");
const listAllBook = document.getElementById("listAllBook");
const saveBook = document.getElementById("saveBook");
const editBook = document.getElementById("editBook");
const deleteBook = document.getElementById("delete");

//Light-Dark Modus
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("modeSwitch");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});

// Button Funktionen
searchBook.addEventListener("click", () => {
  buchliste.innerText = "";
  let url = "/search/books";
  if (titleInput.value) {
    url += "?title=" + titleInput.value;
  }
  if (authorInput.value) {
    url += "?author=" + authorInput.value;
  }
  if (pagesInput.value) {
    url += "?pages=" + pagesInput.value;
  }
  if (publisherInput.value) {
    url += "?publisher=" + publisherInput.value;
  }
  if (yearInput.value) {
    url += "?year=" + yearInput.value;
  }
  if (categorySelect.value) {
    url += "?category=" + categorySelect.value;
  }
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      buchliste.innerText = data;
      buchliste.appendChild(searchBook);
    });
});
// if (buchliste.innerText === "") {
//   alert("Für die Suche muss ein Wert angegeben werden");
// }

listAllBook.addEventListener("click", () => {
  refreshedList.forEach((element) => {
    let listAllBook = document.createElement("li");
    listAllBook.innerText = `${element.id}: ${element.title} ${element.author} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
    buchliste.appendChild(listAllBook);
  });
});

saveBook.addEventListener("click", () => {
  if (title.value < 1) alert("Name muss mind. 1 Buchstaben beinhalten!");
  else if (author.value < 1) alert("Name muss mind. 1 Buchstaben beinhalten!");
  else if (pages.value < 2)
    alert("Seitenanzahl muss mind. 2 Zahlen beinhalten!");
  else if (publisher.value < 1)
    alert("Name muss mind. 1 Buchstaben beinhalten!");
  else if (year.value < 4)
    alert("Jahresangabe muss mind. 4 Zahlen beinhalten!");
  else if (category.value < 1)
    alert("Name muss mind. 1 Buchstaben beinhalten!");
  else {
    console.log("Hallo Dennis");
    fetch("/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        author: author.value,
        pages: pages.value,
        publisher: publisher.value,
        year: year.value,
        category: category.value,
      }),
    });
    alert("Erfolgreich gespeichert!");
    refreshList();
  }
});

// Browser Aktionen
window.onload = () => {
  refreshList();
};

function refreshList() {
  buchliste.innerHTML = "";
  fetch("/books")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        refreshedList.push(element);
        console.log(refreshedList);
        // let listAllBook = document.createElement("li");
        // listAllBook.innerText = `${element.id}: ${element.title} ${element.author} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
        // buchliste.appendChild(listAllBook);
      });
    });
}
