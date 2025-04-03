// Textfeld Variablen
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const publisherInput = document.getElementById("puplisher");
const yearInput = document.getElementById("year");
const buchliste = document.getElementById("buchliste");
const categorySelect = document.getElementById("category");

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
  if (titleInput === title) {
    return { buchliste };
  }
  if (authorInput === author) {
    return { buchliste };
  }
  if (pagesInput === pages) {
    return { buchliste };
  }
  if (publisherInput === publisher) {
    return { buchliste };
  }
  if (yearInput === year) {
    return { buchliste };
  }
  if (categorySelect === category) {
    return { buchliste };
  }
});

listAllBook.addEventListener("click", () => {
  return { refreshList };
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

function changeBook() {
  fetch(
    `/books/${titleInput.value} ${authorInput.value} ${pagesInput.value} ${publisherInput.value} ${yearInput.value}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        author: author.value,
        pages: pages.value,
        publisher: publisher.value,
        year: year.value,
        category: category.value,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      title.innerText = JSON.stringify(data);
      refreshList();
    });
  alert("Erfolgreich geäandert!");
}

function deletedBook() {
  fetch(`/books/${bookID(titleInput)}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      titleInput.innerText = JSON.stringify(data);
      refreshList();
    });
  alert("Erfolgreich entfernt!");
}

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
  buchliste.innerHTML = "";
  fetch("/books")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let listAllBook = document.createElement("li");
        listAllBook.innerText = `${element.id}: ${element.title} ${element.author} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
        buchliste.appendChild(listAllBook);
      });
    });
}

// WICHTIG!!! Nach jedem Merge die Website im Frontend auf Backend-Port manuell einstellen und von dort aufrufen.
// Mit der Middleware: app.use(express.static(path.join(__dirname, "../frontend"))); starten wir das Frontend stets über das Backand!
// GoLive deaktivieren und in URL-Zeile des Browser nur http://127.0.0.1:5500/ eingeben.
