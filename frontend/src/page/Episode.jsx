import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode ({anime,setAnime,endpoint}) {
    const [episode,setEpisode] = useState();
    const [iframe,setIframe] = useState();
    const [mirror,setMirror] = useState();
    const [nonce,setNonce] = useState();
    const [slug,setSlug] = useState(useParams().episode);
    const [loading,setLoading] = useState(false);
    const download = ["d360pmp4","d480pmp4","d720pmp4","d1080pmp4","d480pmkv","d720pmkv","d1080pmkv"]
    const slugAnime = useParams().anime;

    useEffect(() => {
        if(!anime.gambar){getAnime()}
        getEpisode()
    },[slug])

    function setHistory (lastEpisode,content = mirror) {
        const {nama,kulitas} = getOption();
        if(!anime.gambar) return false;
        let historys = JSON.parse(localStorage.getItem("anime")) || [];
        const history = {
            gambar:anime.gambar,
            judul:anime.nama,
            slug:slugAnime,
            slugEpisode:slug,
            lastEpisode,
        }
        if(content && nama && kulitas) history.mirror = `${nama}_${kulitas}`
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
        const response = await axios.get(`${endpoint}/anime/${slugAnime}`);
        setAnime(response.data);
    }

    async function getNonce ()   {
        const response = await axios.get(`${endpoint}/nonce`);
        setNonce(response.data);
        return response.data
    }

    async function getIframe (content) {
        setMirror(content);
        let customnonce;
        if(!nonce) customnonce = await getNonce();
        const response = await axios.get(`${endpoint}/getIframe?nonce=${nonce || customnonce}&content=${content}`)
        const inframeSrc =  (new DOMParser().parseFromString(response.data,"text/html")).querySelector("iframe").getAttribute("src");
        setIframe(inframeSrc);
        setLoading(false);
    }

    async function getEpisode () {
        const response = await axios.get(`${endpoint}/episode/${slug}`);
        if(iframe && mirror){
            const {nama,kulitas} = getOption();
            const newMirror = getMirror(response,kulitas,nama);
            if(newMirror) {
                getIframe(newMirror.content)
            }else{ 
                removeSelected()
                setIframe(response.data.iframe)
                setMirror();
            }
        }else if(new URL(window.location.href).searchParams.get("mirror")){
            const paramsMirror = (new URL(window.location.href).searchParams.get("mirror")).trim();
            const nama = paramsMirror.split("_")[0];
            const kulitas = paramsMirror.split("_")[1];
            const newMirror = getMirror(response,kulitas,nama);
            if(newMirror){
                getIframe(newMirror.content)
            }else {
                setIframe(response.data.iframe)
            }
        }else{
            setIframe(response.data.iframe)
        }
        setEpisode(response.data);
        anime.gambar ? 
        setHistory(filterEpisode(response.data.judul)) : undefined
        setLoading(false);
    }

    function getMirror(response,kulitas,nama){
        const newMirror = response.data.mirror[`m${kulitas}`] ? response.data.mirror[`m${kulitas}`].find((dt) => dt.nama.trim() === nama) : undefined;
        return newMirror;
    }
    
    function getOption(){
        try{
            const option = document.querySelector(".selectMirror").options[document.querySelector(".selectMirror").selectedIndex];
            const nama =  (option.innerHTML).split(" ")[0];
            const kulitas = ((option.innerHTML).split(" ").pop()).replace("P","p")
            return {nama,kulitas}
        }catch(e){
            return {nama:undefined,kulitas:undefined}
        }
    }

    function removeSelected () {
        document.querySelector(`.mirror`).setAttribute("selected","true")
        document.querySelector(`.mirror`).removeAttribute("selected");
    }

    function filterEpisode (text) {
        let episode = text.replace("Subtitle Indonesia","")
        episode = episode.replace("(End)","")
        episode = (episode.trim().split(" ")).slice(-2).join(" ");
        return episode;
    }

    return <div className="container my-5">
        {episode && anime.gambar ? 
        <div className="row justify-content-center">
            <div className="col-md-12 mb-2">
                <h3>{episode.judul}</h3>
            </div>
            <div className="col-md-12"> 
                {!loading ? 
                <div className="container-iframe" style={{ backgroundColor:"#000" }} >
                    <iframe allowFullScreen={true} src={iframe} className="rounded shadow iframe" width="100%"></iframe>
                </div>
                : <div className="d-flex justify-content-center align-items-center container-iframe" style={{ backgroundColor:"#000" }} >
                    <div className="iframe d-flex justify-content-center align-items-center">
                        <div className="spinner-border" style={{ width:"3rem",height:"3rem" }} role="status"></div>
                    </div>
                </div>
                }
            </div>
            <div className="col-md-6 mt-2 pe-md-1">
                <div data-bs-theme="dark" >
                    <select defaultValue={mirror} onChange={(e) => {
                        setLoading(true);
                        getIframe(e.target.value);
                        const {nama,kulitas} = getOption();
                        setHistory(filterEpisode(episode.judul),e.target.value) ;
                        history.replaceState(undefined,undefined,`/anime/${slugAnime}/${slug}?mirror=${nama}_${kulitas}`)    
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
                        const paramsMirror = new URL(window.location.href).searchParams.get("mirror");
                        history.replaceState(undefined,undefined,`/anime/${slugAnime}/${e.target.value}${paramsMirror ? `?mirror=${paramsMirror}` : ""}`)    
                    }} defaultValue={slug} className="border-0 shadow form-select d-inline bg-primary text-light">
                        {anime.episodes.map((episode,index) => 
                            <option key={index} value={episode.slug} >
                                {filterEpisode(episode.judul)}
                            </option>
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