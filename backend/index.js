import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = 5000;
const contentType = {headers: {"Content-Type": "application/x-www-form-urlencoded"}}

app.use(cors());

app.get("/getIframe",async (req,res) => {
    try{
        // const content = JSON.parse(atob("eyJpZCI6MTUwNzc1LCJpIjowLCJxIjoiMzYwcCJ9"));
        const content = JSON.parse(atob(req.query.content));
        const nonce = req.query.nonce;
        const response = await axios.post(`https://otakudesu.cam/wp-admin/admin-ajax.php`,
            new URLSearchParams({
                ...content,
                nonce:"33f530d984",
                action:"2a3505c93b0035d3f455df82bf976b84",
            }),
            contentType
        );
        return res.json(atob(response.data.data))
    }catch(e){
        return res.json(e);
    }
})

app.get("/nonce",async (req,res) => {
    try{
        const response = await axios.post(`https://otakudesu.cam/wp-admin/admin-ajax.php`,
            new URLSearchParams({action:"aa1208d27f29ca340c92c66d1926f13f"}),
            contentType
        );
        return res.json(response.data.data)
    }catch(e){
        return res.json(e);
    }
});

app.get("/anime",async (req,res) => {
    try{ 
        const response = await axios.get("https://otakudesu.cam/ongoing-anime/");
        const $ = cheerio.load(response.data);
        const data = [];
        $(".venz").find("ul > li").each((index,element) => {
            data.push({
                gambar:$(element).find(".thumbz > img").attr("src"),
                judul:$(element).find("h2.jdlflm").text(),
                slug:($(element).find(".thumb > a").attr("href")).split("/")[4],
            })
        });
        res.json(data);
    }catch(e){
        return res.json(e);
    }
})

app.get("/anime/:slug",async (req,res) => {
    try{
        const response = await axios.get(`https://otakudesu.cam/anime/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const episodes = [];
        $(".episodelist > ul").find("li").each((index,element) => {
            episodes.push({
                judul:$(element).find("span > a").text(),
                slug:($(element).find("span > a").attr("href")).split("/")[4],
                tanggal:$(element).find("span").eq(1).text(),
            }); 
        });
        const data = {
            gambar:$(".fotoanime").find("img").attr("src"),
            judul:$(".jdlrx").find("h1").text().trim(),
            episodes
        };
        res.json(data);
    }catch(e){
        return res.json(e);
    }
});

app.get("/episode/:slug",async (req,res) => {
    try{
        const response = await axios.get(`https://otakudesu.cam/episode/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const mirror = {
            m360p:[],
            m480p:[],
            m720p:[],
        };
        const download = {
            d360pmp4:[],
            d480pmp4:[],
            d720pmp4:[],
            d1080pmp4:[],
            d480pmkv:[],
            d720pmkv:[],
            d1080pmkv:[],
        }
        function getMirror (kualitas) {
            $(`.${kualitas}`).find("li").each((index,element) => {
                mirror[kualitas].push({
                    nama:$(element).find("a").text(),
                    content:$(element).find("a").attr("data-content")
                })
            })
        }
        function getDownload (type,indexUl,indexli) {
            $(".download").find("ul").eq(indexUl).find("li").eq(indexli).find("a").each((index,element) => {
                download[type].push({
                    nama:$(element).text(),
                    href:$(element).attr("href"),
                })
            });
        }
        getDownload("d360pmp4",0,0);
        getDownload("d480pmp4",0,1);
        getDownload("d720pmp4",0,2);
        getDownload("d1080pmp4",0,3);
        getDownload("d480pmkv",1,0);
        getDownload("d720pmkv",1,1);
        getDownload("d1080pmkv",1,2);
        getMirror("m360p")
        getMirror("m480p")
        getMirror("m720p")
        const data = {
            judul:$(".posttl").text(),
            iframe:$(".responsive-embed-stream > iframe").attr("src"),
            mirror,
            download,
        };
        return res.json(data);
    }catch(e){
        return res.json(e);
    }
})



app.listen(port,() => console.log("http://localhost:5000/"));