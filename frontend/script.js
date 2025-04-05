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
const deleteBook = document.getElementById("deleteBook");

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
  console.log("url: ", url);

  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let listAllBook = document.createElement("li");
        listAllBook.innerText = `${element.id}: ${element.title} ${element.author} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
        buchliste.appendChild(listAllBook);
      });
    });
});
// if (buchliste.innerText === "") {
//   alert("Für die Suche muss ein Wert angegeben werden");
// }

listAllBook.addEventListener("click", () => {
  buchliste.innerText = "";

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

// function changeBook() {
//   fetch(
//     `/books/${titleInput.value} ${authorInput.value} ${pagesInput.value} ${publisherInput.value} ${yearInput.value}`,
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: title.value,
//         author: author.value,
//         pages: pages.value,
//         publisher: publisher.value,
//         year: year.value,
//         category: category.value,
//       }),
//     }
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       title.innerText = JSON.stringify(data);
//       refreshList();
//     });
//   alert("Erfolgreich geäandert!");
// }

editBook.addEventListener("click", () => {
  alert("Die Bearbeiten-Funktion steht dir bald zur Verfügung. ✨");
});


deleteBook.addEventListener("click", () => {
  const title = titleInput.value;
  const author = authorInput.value;
  const pages = pagesInput.value;
  const publisher = publisherInput.value;
  const year = yearInput.value;
  const category = categorySelect.value;

  if (!title && !author && !pages && !publisher && !year && !category) {
    alert("Bitte mindestens ein Feld ausfüllen, um ein Buch zu löschen!");
    return;
  }

  if (!confirm("Willst du das Buch wirklich löschen?")) {
    return;
  }

  const params = new URLSearchParams({
    ...(title && { title }),
    ...(author && { author }),
    ...(pages && { pages }),
    ...(publisher && { publisher }),
    ...(year && { year }),
    ...(category && { category }),
  });

  fetch(`/books?${params.toString()}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Löschen fehlgeschlagen");
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message || "Buch gelöscht!");
      refreshList();
    })
    .catch((err) => {
      alert("Fehler beim Löschen: " + err.message);
    });
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
  refreshedList = [];
  buchliste.innerHTML = "";
  fetch("/books")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        refreshedList.push(element);
      });
    });
}

// Clear Button Funktion
const clearBtn = document.getElementById("clearList");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    buchliste.innerHTML = "";
  });
}

// WICHTIG!!! Nach jedem Merge die Website im Frontend auf Backend-Port manuell einstellen und von dort aufrufen.
// Mit der Middleware: app.use(express.static(path.join(__dirname, "../frontend"))); starten wir das Frontend stets über das Backand!
// GoLive deaktivieren und in URL-Zeile des Browser nur http://127.0.0.1:5500/ eingeben.
