const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();
const path = require("path");
const { error } = require("console");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Hilfsfunktionen
function readData() {
  const data = fs.readFileSync("daten.json", "utf-8");
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync("daten.json", JSON.stringify(data, null, 2));
}

// GET /books: Suche nach einem bestimmten Buch
app.get("/books", (req, res) => {
  try {
    let books = readData();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: `Eintrag nicht gefunden ${err}` });
  }
});

// POST /books: Neue Bücher hinzufügen
app.post("/books", (req, res) => {
  try {
    let books = readData(); //bestehende Bücher laden
    const { title, author, pages, publisher, year, category } = req.body;

    // Prüfung, ob die notwendigen Felder gefüllt sind
    if (!title || !author || !pages || !publisher || !year || !category) {
      return res
        .status(400)
        .json({ error: "Eingaben unvollständig. Bitte alle Felder füllen!" });
    }

    // ID generieren
    const newBook = {
      id: books.length ? books[books.length - 1].id + 1 : 1,
      title: title,
      author: author,
      pages: pages,
      publisher: publisher,
      year: year,
      category: category,
    };

    books.push(newBook);
    writeData(books);

    res.status(201).json({ message: "Buch hinzugefügt", book: newBook });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Fehler beim Speichern des Buches: ${err.message}` });
  }
});

// DELETE /books: Buch löschen
app.delete("/books/:id", (req, res) => {
  try {
    let books = readData();
    // ID aus der URL in eine verrechenbare Zahl umwandeln:
    const bookId = parseInt(req.params.id);

    // Existiert das Buch?
    const bookIndex = books.findIndex((book) => book.id === bookId);
    // Wenn das Buch nicht existiert, wird die Position "-1" ausgegeben
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Buch nicht gefunden!" });
    }
    const deletedBook = books.splice(bookIndex, 1)[0];

    writeData(books);
    res.status(200).json({ message: "Buch gelöscht", book: deletedBook });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Fehler beim Löschen des Buchs: ${err.message}` });
  }
});

// GET /books: Alle Bücher zurückgeben
app.get("/books", (req, res) => {
  try {
    let books = readData(); // Bücher aus daten.json lesen

    if (books.length === 0) {
      return res.status(200).json({ message: "Keine Bücher vorhanden." });
    }

    res.status(200).json(books);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Fehler beim Laden der Bücher: ${err.message}` });
  }
});

// PUT /books/:id: Einzelne Daten überschreiben
app.put("books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    let books = readData();

    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex === -1) {
      return res
        .status(404)
        .json({ error: "Dieses Buch existiert nicht in der Liste" });
    }

    // Felder aus dem req.body werden überschrieben:
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    writeData(books);
    res.status(200).json({
      message: "Buch aktualisiert",
      book: books[bookIndex],
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Fehler beim Aktualisieren des Buchs: ${err.message}` });
  }
});

app.listen(5500, () => {
  console.log("Der Server läuft nun auf Port 5500...");
});
