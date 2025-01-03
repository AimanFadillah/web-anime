const express = require("express");
const app = express();
const port = 5000;

function setAsset(app,path){
    app.get(path,(req,res) => res.sendFile(__dirname + "/public" + path));
}

setAsset(app,"/assets/index-70c11242.js");
setAsset(app,"/assets/index-bc07d9ae.css");
setAsset(app,"/assets/bootstrap-icons-5b2dd4d4.woff2");
setAsset(app,"/assets/bootstrap-icons-d0346eea.woff");
setAsset(app,"/favicon.ico");
setAsset(app,"/style.css");

app.get("*",(req,res) => {
    return res.sendFile(__dirname + "/index.html")
})

app.listen(port,() => console.log("Serve On"))