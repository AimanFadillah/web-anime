import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = 5000;

app.use(cors());

app.get("/",async (req,res) => {
    try{
        const content = JSON.parse(atob("eyJpZCI6MTUwNzc1LCJpIjowLCJxIjoiMzYwcCJ9"));
        const action = "";
        const nonce = "";
        const response = await axios.post(`https://otakudesu.cam/wp-admin/admin-ajax.php`,
            new URLSearchParams({
                ...content,
                nonce:"33f530d984",
                // action:"aa1208d27f29ca340c92c66d1926f13f",
                action:"2a3505c93b0035d3f455df82bf976b84",
            }),
            {headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }}
        );
        return res.json(atob(response.data.data))
    }catch(e){
        return res.json(e);
    }
})

app.get("/anime",async (req,res) => {
    try{ 
        const response = await axios.get("https://neonime.ink/tvshows/");
        const $ = cheerio.load(response.data);
        const data = [];
        $(".items").find("div.item").each((index,element) => {
            data.push({
                gambar:$(element).find(".image > img").attr("data-src"),
                judul:$(element).find(".tt").text(),
                slug:($(element).find("a").attr("href")).split("/")[4],
            })
        });
        res.json(data);
    }catch(e){
        return res.json(e);
    }
})

app.get("/anime/:slug",async (req,res) => {
    try{
        const response = await axios.get(`https://neonime.ink/tvshows/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const episodes = [];
        $(".episodios").find("li").each((index,element) => {
            episodes.push({
                judul:$(element).find(".episodiotitle > a").text(),
                slug:($(element).find(".episodiotitle > a").attr("href")).split("/")[4],
                tanggal:$(element).find(".episodiotitle > span.date").text(),
                eps:($(element).find(".numerando").text()).split("x")[1].trim()
            }); 
        });
        const data = {
            gambar:$(".imagen").find("img").attr("data-src"),
            judul:$(".cover").find("h1").text(),
            episodes
        };
        res.json(data);
    }catch(e){
        return res.json(e);
    }
});

app.get("/episode/:slug",async (req,res) => {
    try{
        const response = await axios.get(`https://neonime.ink/episode/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const iframes = [];
        const downloads = [];
        $(".embed2").find("div").each((index,element) => {
            iframes.push({
                src:$(element).find("p > iframe").attr("data-src"),
                nama:$(element).find(".tit").text(),
            })
        })
        const data = {
            judul:$(".cover").find("h1").text(),
            iframes
        };
        return res.json(data);
    }catch(e){
        return res.json(e);
    }
})

app.listen(port,() => console.log("http://localhost:5000/"));