const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const { error } = require("console");
const { title } = require("process");
const { publicDecrypt } = require("crypto");

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
app.get("/search/books", (req, res) => {
    try {
        let {title, author, pages, publisher, year, category} = req.query;

        // Wenn kein Suchparameter angegeben ist:
        if (!title && !author && !pages && !publisher && !year && !category) {
          return res.status(400).json({message: "Bitte mindestens ein Suchkriterium angeben! Danke :-)"})
        }

        let books = readData();

        // Suche nach mehreren Kategorien
        let categoryList = [];
        if (category) {
          categoryList = Array.isArray(category) ? category : [category.toLowerCase()];
        }

        // flexible Suche
        books = books.filter(book => {
          const matchesCategory =
            categoryList.length === 0 ||
            categoryList.includes(book.category.toLowerCase());

          const matchesFields =
            (!year || book.year.toString().includes(year)) &&
            (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
            (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
            (!pages || book.pages.toString() === pages) &&
            (!publisher || book.publisher.toLowerCase().includes(publisher.toLowerCase())) &&
            matchesCategory;
              
          const globalQuery = q ? q.toLowerCase() : "";

          const matchesGlobal =
            !q ||
            book.title.toLowerCase().includes(globalQuery) ||
            book.author.toLowerCase().includes(globalQuery) ||
            book.publisher.toLowerCase().includes(globalQuery) ||
            book.year.toString().includes(globalQuery) ||
            book.pages.toString().includes(globalQuery) ||
            book.category.toLowerCase().includes(globalQuery);

          return matchesFields && matchesGlobal;
        });

        if(books.length === 0) {
            return res.status(404).json({message: "Keine Bücher gefunden"})
        }
        
        res.status(200).json(books);
    }

    catch (err) {
        res.status(500).json({error: `Eintrag nicht gefunden ${err}`});
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

    // Auf Duplikate prüfen
    const duplicate = books.find(book => 
        book.title.toLowerCase() === title.toLowerCase() &&
        book.author.toLowerCase() === author.toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({error: "Dieses Buch existiert bereits!"});
    }
    // ID generieren (die höchste ID wird ermittelt. Wenn keine existieren, wird "1" vergeben)
    const newId = books.length > 0 ? Math.max(...books.map(book => book.id)) +1:1;
    const newBook = {
        id: newId,
        title,
        author,
        pages,
        publisher,
        year,
        category,
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
app.delete("/books", (req, res) => {
  try {
    let books = readData();
    let { title, author, pages, publisher, year, category } = req.query;
    // Prüfung, ob ID übergeben wurde. Wenn nicht, dann bleibt ID = null
    const id = req.params.id ? parseInt(req.params.id) : null;

    // Löschung über ID
    if (id) {
      // neue Liste "filteredID" wird erstellt und alle IDs, die nicht der gesuchten entsprechen, werden hier eingefügt.
      const filteredID = books.filter(book => book.id !== id);
      if (books.length === filteredID.length) {
        return res.status(404).json({message: "Keine passende ID gefunden!"});
      }

      // ersetze die alte Liste mit der neuen:
      writeData(filteredID);
      return res.status(200).json({message:`Buch mit ID ${id} gelöscht.`});
    }
    
    // Löschung über Parameter
    const filteredBooks = books.filter(book => {
        return !(
            (!year || book.year.toString().includes(year)) &&
            (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
            (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
            (!pages || book.pages.toString() === pages) &&
            (!publisher || book.publisher.toLowerCase().includes(publisher.toLowerCase())) &&
            (!category || book.category.toLowerCase().includes(category.toLowerCase()))
        );
    });
    
    // Wenn kein passendes Buch gefunden
    if (books.length === filteredBooks.length) {
        return res.status(404).json({message: "Kein passendes Buch gefunden!"});
    }

    writeData(filteredBooks);
    res.status(200).json({ message: "Buch gelöscht", deletedCount: books.length - filteredBooks.length});
  } 
  catch (err) {
    res.status(500).json({ error: `Fehler beim Löschen des Buchs: ${err.message}` });
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

// PUT /books: Einzelne Daten überschreiben
app.put("/books", (req, res) => {
    try {
        let {title, author, pages, publisher, year, category} = req.query;
        let books = readData();

        // Suche nach den Büchern, die den Kriterien entsprechen
        let updatedBooks = [];
        books = books.map(book => {
            if (
                (!year || book.year.toString().includes(year)) &&
                (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
                (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
                (!pages || book.pages.toString() == pages) &&
                (!publisher || book.publisher.toLowerCase().includes(publisher.toLowerCase())) &&
                (!category || book.category.toLowerCase().includes(category.toLowerCase()))
            ) {
                let updatedBook = { ...book, ...req.body};
                updatedBooks.push(updatedBook);
                return updatedBook
            }
            return book;
        });
    
        if(updatedBooks === 0) {
            return res.status(404).json({message: "Kein passendes Buch gefunden!"})
        }

        writeData(books);
        res.status(200).json({ message: "Buch aktualisiert", updatedBooks});
    } 
    catch (err) {
    res.status(500).json({ error: `Fehler beim Aktualisieren des Buchs: ${err.message}` });
    }
});

app.listen(5500, () => {
  console.log("Der Server läuft nun auf Port 5500...");
});
