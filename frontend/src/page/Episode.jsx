import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode ({anime,setAnime}) {
    const [episode,setEpisode] = useState();
    const [iframe,setIframe] = useState();
    const [mirror,setMirror] = useState();
    const [nonce,setNonce] = useState();
    const [slug,setSlug] = useState(useParams().episode);
    const [loading,setLoading] = useState(false);
    const download = ["d360pmp4","d480pmp4","d720pmp4","d1080pmp4","d480pmkv","d720pmkv","d1080pmkv"]
    const slugAnime = useParams().anime;
    const iframeHeight = window.innerWidth <= 450 ? "500" : "500";

    useEffect(() => {
        getNonce()
        getEpisode()
        if(!anime.gambar){getAnime()}
    },[slug])

    function setHistory (lastEpisode) {
        if(!anime.gambar) return false;
        let historys = JSON.parse(localStorage.getItem("anime")) || [];
        const history = {
            gambar:anime.gambar,
            judul:anime.nama,
            slug:slugAnime,
            lastEpisode,
        }
        const checkData = historys.find((ht) => ht.slug == history.slug);
        if(checkData){
            const index = historys.findIndex((ht) => ht.slug == history.slug);
            historys.splice(index,1);  
        }
        if(historys.length >= 20) historys.pop()
        historys = [history,...historys];
        localStorage.setItem("anime",JSON.stringify(historys))
    }

    async function getAnime () {
        const response = await axios.get(`https://animepi.aimanfadillah.repl.co/anime/${slugAnime}`);
        setAnime(response.data);
    }

    async function getNonce () {
        const response = await axios.get("https://animepi.aimanfadillah.repl.co/nonce");
        setNonce(response.data);
    }

    async function getIframe (content) {
        setMirror(content);
        const response = await axios.get(`https://animepi.aimanfadillah.repl.co/getIframe?nonce=${nonce}&content=${content}`)
        const inframeSrc =  (new DOMParser().parseFromString(response.data,"text/html")).querySelector("iframe").getAttribute("src");
        setIframe(inframeSrc);
        setLoading(false);
    }

    async function getEpisode () {
        const response = await axios.get(`https://animepi.aimanfadillah.repl.co/episode/${slug}`);
        if(iframe && mirror){
            const option = document.querySelector(".selectMirror").options[document.querySelector(".selectMirror").selectedIndex];
            const nama =  (option.innerHTML).split(" ")[0];
            const kulitas = ((option.innerHTML).split(" ").pop()).replace("P","p")
            const newMirror = response.data.mirror[`m${kulitas}`].find((dt) => dt.nama.trim() === nama);
            if(newMirror) {
                getIframe(newMirror.content)
            }else{ 
                document.querySelector(`.mirror`).setAttribute("selected","true")
                document.querySelector(`.mirror`).removeAttribute("selected");
                setIframe(response.data.iframe)
                setMirror();
            }
        }else{
            setIframe(response.data.iframe)
        }
        setEpisode(response.data);
        setHistory((response.data.judul.split("Episode ")[1]).substring(0,2))
        setLoading(false);
    }

    return <div className="container my-5">
        {episode && anime.gambar ? 
        <div className="row justify-content-center">
            <div className="col-md-12 mb-2">
                <h3>{episode.judul}</h3>
            </div>
            <div className="col-md-12"> 
                {!loading ? 
                <div>
                    <iframe allowFullScreen={true} src={iframe} className="rounded shadow" width="100%" height={iframeHeight} ></iframe>
                </div>
                : <div className="d-flex justify-content-center align-items-center " style={{ height:"500px" }} >
                    <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
                </div>
                }
            </div>
            <div className="col-md-6 mt-2 pe-md-1">
                <div data-bs-theme="dark" >
                    <select defaultValue={mirror} onChange={(e) => {
                        setLoading(true),
                        getIframe(e.target.value)
                    }} className="selectMirror border-0 shadow form-select d-inline bg-primary text-light">
                        {episode.mirror.m360p.map((dt,index) => 
                            <option key={index} className="mirror" value={dt.content} >{dt.nama} 360P</option>
                        )}
                        {episode.mirror.m480p.map((dt,index) => 
                            <option key={index} className="mirror" value={dt.content} >{dt.nama} 480p</option>
                        )}
                        {episode.mirror.m720p.map((dt,index) => 
                            <option key={index} className="mirror" value={dt.content} >{dt.nama} 720p</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="col-md-6 mt-2 mb-4 ps-md-1">
                <div data-bs-theme="dark" >
                    <select onChange={(e) => {
                        setLoading(true),
                        setSlug(e.target.value)
                        history.replaceState(undefined,undefined,`/anime/${slugAnime}/${e.target.value}`)    
                    }} defaultValue={slug} className="border-0 shadow form-select d-inline bg-primary text-light">
                        {anime.episodes.map((episode,index) => 
                            <option key={index} value={episode.slug} >Episode {anime.episodes.length - index}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="col-md-3 mb-4 col-8">
                <div className="">
                    <img src={anime.gambar} className="img-fluid rounded w-100 shadow" alt={anime.judul}/>
                </div>
            </div>
            <div className="col-md-9"> 
                    <ul className="list-group">
                        <li className="list-group-item">{anime.nama}</li>
                        <li className="list-group-item">{anime.namaJapan}</li>
                        <li className="list-group-item">{anime.skor}</li>
                        <li className="list-group-item">{anime.produser}</li>
                        <li className="list-group-item">{anime.tipe}</li>
                        <li className="list-group-item">{anime.status}</li>
                        <li className="list-group-item">{anime.totalEpisode}</li>
                        <li className="list-group-item">{anime.durasi}</li>
                        <li className="list-group-item">{anime.rilis}</li>
                        <li className="list-group-item">{anime.studio}</li>
                        <li className="list-group-item">{anime.genre}</li>
                    </ul>
            </div>
            <div className="col-md-12 mt-3">
                <ul className="list-group shadow">
                    <li className="list-group-item py-1 bg-primary text-light text-center fs-5">Download</li>
                    {download.map((type,index) => 
                        <li className={`list-group-item ${episode.download[type].length > 0 ? "" : "d-none"}`} key={index}>
                            <div >{type.split("p")[0].replace("d"," ")}P {type.includes("mp4") ? "MP4" : "MKV"} : 
                                {episode.download[type].map((dt,index) => 
                                <a target="blank" href={dt.href} key={index} className="badge bg-primary ms-1 text-decoration-none" >{dt.nama}</a>)}
                            </div> 
                        </li>
                    )}
                </ul>
            </div>
        </div>
        : <div className="row my-3">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div>
}