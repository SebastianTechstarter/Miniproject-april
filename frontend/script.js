// Textfeld Variablen
const inputSpace = document.getElementById("inputSpace");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const publisher = document.getElementById("publisher");
const year = document.getElementById("year");
const category = document.getElementById("category");
const title = document.getElementById("title");

// Button Variablen
const saveBook = document.getElementById("saveBook");
const deleteBook = document.getElementById("delete");
const searchBook = document.getElementById("searchBook");
const listAllBook = document.getElementById("listAll");

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

//listAllBook.addEventListener("click", () => {
//  fetch("/books")
//})

//searchBook.addEventListener("click", () => {
// fetch("/books" + title.value);
//});

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
  else
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
});

deleteBook.addEventListener("click", () => {
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
});

// Eingabe Funktionen
//methodSelect.addEventListener("inputSpace", () => {
//  if (methodSelect.value == "search") {
//    idInput.style.display = "none";
//  }});

// Browser Aktionen
window.onload = () => {
  refreshList();
};

function refreshList() {
  fetch("/books")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let newListItem = document.createElement("li");
        newListItem.innerText = `${element.id}: ${element.author} ${element.title} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
        liste.appendChild(newListItem);
      });
    });
}

//suchen auflisten speichern ändern löschen
// WICHTIG!!! Nach jedem Merge die Website im Frontend auf Backend-Port manuell einstellen und von dort aus aufrufen.
// Mit der Middleware: app.use(express.static(path.join(__dirname, "../frontend"))); starten wir das Frontend stets über das Backand!
