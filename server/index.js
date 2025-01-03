const express = require("express");
const app = express();
const port = 5000;

function setAsset(path){
    return app.get(path,(req,res) => res.sendFile(__dirname + "/public" + path));
}

setAsset("/assets/index-70c11242.js");
setAsset("/assets/index-bc07d9ae.css");
setAsset("/assets/bootstrap-icons-5b2dd4d4.woff2");
setAsset("/assets/bootstrap-icons-d0346eea.woff");
setAsset("/favicon.ico");
setAsset("/style.css");

app.get("*",(req,res) => {
    return res.sendFile(__dirname + "/index.html")
})

app.listen(port,() => console.log("Serve On"))