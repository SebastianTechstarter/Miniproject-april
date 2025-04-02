// Textfeld Variablen
const inputSpace = document.getElementById("inputSpace");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const publisher = document.getElementById("publisher");
const year = document.getElementById("year");
const category = document.getElementById("category");

// Button Variablen
const saveBook = document.getElementById("save");
const deleteBook = document.getElementById("delete");
const searchBook = document.getElementById("search");
const listAllBook = document.getElementById("listAll");

// Button Funktionen
saveBook.addEventListener("click", () => {
  if (methodSelect.value == "create") {
    createbooks();
  } else if (methodSelect.value == "change") {
    changebooks();
  } else if (methodSelect.value == "delete") {
    deletebooks();
  }
});

// Eingabe Funktionen
methodSelect.addEventListener("change", () => {
  if (methodSelect.value == "create") {
    idInput.style.display = "none";
  } else if (methodSelect.value == "change") {
    idInput.style.display = "block";
  } else if (methodSelect.value == "delete") {
    idInput.style.display = "block";
  }
});

// Browser Aktionen
window.onload = () => {
  refreshList();
};

function refreshList() {
  listAllBook.innerHTML = "";
  fetch("http://localhost:5500/books")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let newListItem = document.createElement("li");
        newListItem.innerText = `${element.id}: ${element.author} ${element.title} ${element.pages} ${element.publisher} ${element.year} ${element.category}`;
        liste.appendChild(newListItem);
      });
    });
}
