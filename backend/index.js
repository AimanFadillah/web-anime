import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = 5000;
const contentType = { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
const configAxios = axios.create({
    headers:{
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    },
})

app.use(cors());

app.get("/genre", async (req, res) => {
    const response = await configAxios.get("https://otakudesu.cloud/genre-list/");
    const $ = cheerio.load(response.data);
    const data = [];
    $(".genres").find("li > a").each((index, element) => {
        data.push({
            judul: $(element).text(),
            slug: ($(element).attr("href")).split("/")[2]
        });
    })
    return res.json(data);
});

app.get("/getIframe", async (req, res) => {
    try {
        // const content = JSON.parse(atob("eyJpZCI6MTUwNzc1LCJpIjowLCJxIjoiMzYwcCJ9"));
        const content = JSON.parse(atob(req.query.content));
        const nonce = req.query.nonce;
        const response = await configAxios.post(`https://otakudesu.cloud/wp-admin/admin-ajax.php`,
            new URLSearchParams({
                ...content,
                nonce,
                action: "2a3505c93b0035d3f455df82bf976b84",
            }),
            contentType
        );
        return res.json(atob(response.data.data))
    } catch (e) {
        return res.json(e);
    }
})

app.get("/nonce", async (req, res) => {
    try {
        const response = await configAxios.post(`https://otakudesu.cloud/wp-admin/admin-ajax.php`,
            new URLSearchParams({ action: "aa1208d27f29ca340c92c66d1926f13f" }),
            contentType
        );
        return res.json(response.data.data)
    } catch (e) {
        return res.json(e);
    }
});

app.get("/info/:judul",async (req,res) => {
    try{
        const response = await configAxios.get("https://myanimelist.net/anime.php",{
            params:{
                cat:"anime",
                q:req.params.judul
            }
        })
        const cheerio_search = cheerio.load(response.data)
        const showLink = cheerio_search(".js-categories-seasonal > table > tbody > tr").eq(1).find(".borderClass").eq(1).find(".title > a").eq(0).attr("href")
        const responseShow = await configAxios.get(showLink)
        const $ = cheerio.load(responseShow.data)
        const characters = [];
        $(".detail-characters-list").eq(0).find("div").each((index,div) => {
            $(div).children("table").each((index,table) => {
                let img_character = $(table).find("a > img").attr("data-src");
                let img_voice = $(table).find("table").find("img").attr("data-src");
                if(!img_character || !img_character){
                    img_character = "https://cdn.myanimelist.net/images/questionmark.gif"
                }else if(img_character.includes("questionmark")){
                    img_character = "https://cdn.myanimelist.net/images/questionmark.gif"
                }else{
                    img_character = img_character.match(/(\/\d+\/\d+\.jpg)/)
                    img_character = img_character ? "https://cdn.myanimelist.net/images/characters" + img_character[1] : null
                }
                if(!img_voice || img_voice.includes("questionmark")){
                    img_voice = "https://cdn.myanimelist.net/images/questionmark.gif"
                }else{
                    img_voice = img_voice.match(/(\/\d+\/\d+\.jpg)/)
                    img_voice = img_voice ? "https://cdn.myanimelist.net/images/voiceactors" + img_voice[1] : null
                }
                characters.push({
                    img:img_character,
                    name:$(table).find("td").eq(1).find("a").text() || null,
                    role:$(table).find("td").eq(1).find("div > small").text() || null,
                    voice_name:$(table).find("table").find("a").text().trim() || null,
                    voice_img:img_voice,
                })
            })
        })
        const data = {
            trailer:$(".video-promotion > a").attr("href"),
            ranked:$("span.numbers.ranked > strong").text(),
            popularity:$("span.numbers.popularity > strong").text(),
            members:$("span.numbers.members > strong").text(),
            characters
        }
        return res.send(data);
    }catch(e){
        return res.json(e);
    }
});

app.get("/anime", async (req, res) => {
    try {
        const query = req.query
        const endpoint = query.type === "ongoing" ?
            `https://otakudesu.cloud/ongoing-anime/page/${query.page || 1}/` : query.genre ?
                `https://otakudesu.cloud/genres/${query.genre}/page/${query.page || 1}/` : query.search ?
                    `https://otakudesu.cloud/?s=${query.search}&post_type=anime` :
                    `https://otakudesu.cloud/complete-anime/page/${query.page || 1}/`
        const response = await configAxios.get(endpoint);
        const $ = cheerio.load(response.data);
        const data = [];
        $(query.genre ? ".page" : query.search ? ".page" : ".venz").find(query.genre ? ".col-md-4" : "ul > li").each((index, element) => {
            data.push({
                gambar: $(element).find(query.genre ? ".col-anime-cover > img" : query.search ? "img" : ".thumbz > img").attr("src"),
                judul: $(element).find(query.genre ? ".col-anime-title" : query.search ? "h2 > a" : "h2.jdlflm").text(),
                slug: ($(element).find(query.genre ? ".col-anime-trailer > a" : query.search ? "h2 > a" : ".thumb > a").attr("href")).split("/")[4],
                eps: ($(element).find(query.genre ? ".col-anime-eps" : ".epz").text()).split(query.genre ? " Eps" : "Episode"),
            })
        });
        res.json(query.search && query.page > 1 ? [] : data);
    } catch (e) {
        return res.json(e);
    }
})

app.get("/anime/:slug", async (req, res) => {
    try {
        const response = await configAxios.get(`https://otakudesu.cloud/anime/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const data = {
            gambar: $(".fotoanime").find("img").attr("src"),
            judul: $(".jdlrx").find("h1").text().trim(),
            nama: $(".infozingle").find("p").eq(0).text(),
            namaJapan: $(".infozingle").find("p").eq(1).text(),
            skor: $(".infozingle").find("p").eq(2).text(),
            produser: $(".infozingle").find("p").eq(3).text(),
            tipe: $(".infozingle").find("p").eq(4).text(),
            status: $(".infozingle").find("p").eq(5).text(),
            totalEpisode: $(".infozingle").find("p").eq(6).text(),
            durasi: $(".infozingle").find("p").eq(7).text(),
            rilis: $(".infozingle").find("p").eq(8).text(),
            studio: $(".infozingle").find("p").eq(9).text(),
            genre: $(".infozingle").find("p").eq(10).text(),
            episodes: [],
            batch: [],
            lengkap: [],
        };
        function getLink(element, type, push = true) {
            const dataLink = {
                judul: $(element).find("span > a").text(),
                slug: ($(element).find("span > a").attr("href")).split("/")[4],
                tanggal: $(element).find("span").eq(1).text(),
            }
            push ? data[type].push(dataLink) : data[type] = dataLink;
        }
        $(".episodelist > ul").find("li").each((index, element) => {
            const href = $(element).find("span > a").attr("href");
            href.includes("episode") ? getLink(element, "episodes", true) : href.includes("batch") ? getLink(element, "batch", true) : getLink(element, "lengkap", true);
        });
        res.json(data);
    } catch (e) {
        return res.json(e);
    }
});

app.get("/episode/:slug", async (req, res) => {
    try {
        const response = await configAxios.get(`https://otakudesu.cloud/episode/${req.params.slug}/`);
        const $ = cheerio.load(response.data);
        const mirror = {
            m360p: [],
            m480p: [],
            m720p: [],
        };
        const download = {
            d360pmp4: [],
            d480pmp4: [],
            d720pmp4: [],
            d1080pmp4: [],
            d480pmkv: [],
            d720pmkv: [],
            d1080pmkv: [],
        }
        function getMirror(kualitas) {
            $(`.${kualitas}`).find("li").each((index, element) => {
                mirror[kualitas].push({
                    nama: $(element).find("a").text(),
                    content: $(element).find("a").attr("data-content")
                })
            })
        }
        function getDownload(type, indexUl, indexli) {
            $(".download").find("ul").eq(indexUl).find("li").eq(indexli).find("a").each((index, element) => {
                download[type].push({
                    nama: $(element).text(),
                    href: $(element).attr("href"),
                })
            });
        }
        getDownload("d360pmp4", 0, 0);
        getDownload("d480pmp4", 0, 1);
        getDownload("d720pmp4", 0, 2);
        getDownload("d1080pmp4", 0, 3);
        getDownload("d480pmkv", 1, 0);
        getDownload("d720pmkv", 1, 1);
        getDownload("d1080pmkv", 1, 2);
        getMirror("m360p")
        getMirror("m480p")
        getMirror("m720p")
        const data = {
            judul: $(".posttl").text(),
            iframe: $(".responsive-embed-stream > iframe").attr("src"),
            mirror,
            download,
        };
        return res.json(data);
    } catch (e) {
        return res.json(e);
    }
})

app.get("/lengkap/:slug", async (req, res) => {
    try {
        const response = await configAxios.get(`https://otakudesu.cloud/lengkap/${req.params.slug}`);
        const $ = cheerio.load(response.data);
        const data = [];
        function getDownload(indexH4, type, indexUl, indexli) {
            $(".download").find("ul").eq(indexUl).find("li").eq(indexli).find("a").each((index, element) => {
                data[indexH4].download[type].push({
                    nama: $(element).text(),
                    href: $(element).attr("href"),
                })
            });
        }
        $(".download").find("h4").each((index, element) => {
            data.push({
                judul: $(element).text(),
                download: {
                    d360pmp4: [],
                    d480pmp4: [],
                    d720pmp4: []
                }
            })
            getDownload(index, "d360pmp4", index, 0);
            getDownload(index, "d480pmp4", index, 1);
            getDownload(index, "d720pmp4", index, 2);
        })
        return res.json(data);
    } catch (e) {
        return res.json(e);
    }
});

app.get("/jadwal", async (req, res) => {
    try {
        const response = await configAxios.get("https://otakudesu.cloud/jadwal-rilis/");
        const $ = cheerio.load(response.data);
        const data = [];
        $(".kgjdwl321").find(".kglist321").each((index, element) => {
            data.push({
                hari: $(element).find("h2").text(),
                anime: []
            })
            $(element).find("ul > li").each((index2, element2) => {
                data[index].anime.push({
                    judul: $(element2).find("a").text(),
                    slug: ($(element2).find("a").attr("href")).split("/")[4]
                })
            });
        });
        return res.json(data);
    } catch (e) {
        return res.json(e);
    }
});

app.get("/", (req, res) => {
    res.send("success")
});

app.listen(port, () => console.log("http://localhost:5000/"));

function customAtob(encodedString) {
    let decodedBinary = atob(encodedString);
    let decodedCharacters = [];
    for (let i = 0; i < decodedBinary.length; i++) {
        decodedCharacters.push(decodedBinary.charCodeAt(i));
    }
    let decodedString = String.fromCharCode.apply(null, decodedCharacters);
    return decodedString;
}

