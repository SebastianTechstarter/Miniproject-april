const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();
const path = require("path");
const { error } = require("console");

app.use(express.json());
app.use(express.static(path.join(__dirname, "./frontend")));

// Hilfsfunktionen
function readData() {
    const data = fs.readFileSync("daten.json", "utf-8");
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync("daten.json", JSON.stringify(data, null, 2));
}

// GET /books
app.get("/books", (req, res) => {
    try {
        let books = readData();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({error: `Eintrag nicht gefunden ${err}`});
    }
});

// POST /books
app.post("/books", (req, res) => {
    try {
        let books = readData(); //bestehende Bücher laden
        const { title, author, pages, publisher, year, category } = req.body;

        // Prüfung, ob die notwendigen Felder gefüllt sind
        if (!title || !author || !pages || !publisher || !year || !category) {
            return res.status(400).json({error: "Eingaben unvollständig. Bitte alle Felder füllen!"});
        }

        // ID generieren
        const newBook = {
            id: books.length ? books[books.length -1].id + 1 : 1,
            title: title,
            author: author,
            pages: pages,
            publisher: publisher,
            year: year,
            category: category
        };

        books.push(newBook);
        writeData(books);

        res.status(201).json({ message: "Buch hinzugefügt", book: newBook});
    } 
    catch(err) {
        res.status(500).json({error: `Fehler beim Speichern des Buches: ${err.message}`});
    }
});

app.listen(5500, () => {
    console.log("Der Server läuft nun auf Port 5500...")
});