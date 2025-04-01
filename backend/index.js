const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "./frontend")));

// GET 