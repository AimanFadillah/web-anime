const express = require("express");
const app = express();
const port = 5000;

app.get("/assets/index-70c11242.js",(req,res) => res.sendFile(__dirname + "/public" + "/assets/index-70c11242.js"));
app.get("/assets/index-bc07d9ae.css",(req,res) => res.sendFile(__dirname + "/public" + "/assets/index-bc07d9ae.css"));
app.get("/assets/bootstrap-icons-5b2dd4d4.woff2",(req,res) => res.sendFile(__dirname + "/public" + "/assets/bootstrap-icons-5b2dd4d4.woff2"));
app.get("/assets/bootstrap-icons-d0346eea.woff",(req,res) => res.sendFile(__dirname + "/public" + "/assets/bootstrap-icons-d0346eea.woff"));
app.get("/favicon.ico",(req,res) => res.sendFile(__dirname + "/public" + "/favicon.ico"));
app.get("/style.css",(req,res) => res.sendFile(__dirname + "/public" + "/style.css"));

app.get("*",(req,res) => {
    return res.sendFile(__dirname + "/index.html")
})

app.listen(port,() => console.log("Serve On"))