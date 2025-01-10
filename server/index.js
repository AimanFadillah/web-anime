const express = require("express");
const app = express();
const port = 5000;

app.get("/assets/index.1737473a.js",(req,res) => res.sendFile(__dirname + "/public" + "/assets/index.1737473a.js"));
app.get("/assets/index.b578a10d.css",(req,res) => res.sendFile(__dirname + "/public" + "/assets/index.b578a10d.css"));
app.get("/assets/bootstrap-icons.5b2dd4d4.woff2",(req,res) => res.sendFile(__dirname + "/public" + "/assets/bootstrap-icons.5b2dd4d4.woff2"));
app.get("/assets/bootstrap-icons.d0346eea.woff",(req,res) => res.sendFile(__dirname + "/public" + "/assets/bootstrap-icons.d0346eea.woff"));
app.get("/favicon.ico",(req,res) => res.sendFile(__dirname + "/public" + "/favicon.ico"));
app.get("/style.css",(req,res) => res.sendFile(__dirname + "/public" + "/style.css"));

app.get("*",(req,res) => {
    return res.sendFile(__dirname + "/index_123.html")
})

app.listen(port,() => console.log("Serve On"))