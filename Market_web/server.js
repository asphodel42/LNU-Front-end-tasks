const express = require("express");
const path = require("path");
const app = express();
const host = "localhost";
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Handle API requests for products
app.get("/api/products", (req, res) => {
  const products = require("./data/products.json");
  res.json(products);
});

// Serve the main HTML file for all routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port http://${host}:${PORT}`);
});
