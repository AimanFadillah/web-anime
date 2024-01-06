const express = require("express");
const Route = require("./route.js");
const app = express();
const port = 5000;

app.use(express.static("public")) 

app.get("*",(req,res) => {
    return res.sendFile(__dirname + "/index.html")
})

app.listen(port,() => console.log("Serve On"))