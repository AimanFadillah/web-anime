const express = require("express");
const path = require("path");

const app = express();
const port = 4000;

// Melayani file statis dari folder "public"
app.use(express.static(path.join(__dirname, "public")));

// Rute wildcard untuk menangani semua permintaan dan mengarahkan ke index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
