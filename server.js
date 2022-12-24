const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/home", (req, res) => {
  res.send("응답합다!");
});
