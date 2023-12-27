import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode ({anime}) {
    const [episode,setEpisode] = useState();
    const [iframe,setIframe] = useState();
    const [nonce,setNonce] = useState();
    const download = ["d360pmp4","d480pmp4","d720pmp4","d1080pmp4","d480pmkv","d720pmkv","d1080pmkv"]
    const slug = useParams().slug

    useEffect(() => {
        getNonce()
        getEpisode()
    },[])

    async function getNonce () {
        const response = await axios.get("https://animepi.aimanfadillah.repl.co/nonce");
        setNonce(response.data);
    }

    async function getIframe (content) {
        const response = await axios.get(`https://animepi.aimanfadillah.repl.co/getIframe?nonce=${nonce}&content=${content}`)
        const inframeSrc =  (new DOMParser().parseFromString(response.data,"text/html")).querySelector("iframe").getAttribute("src");
        setIframe(inframeSrc);
    }

    async function getEpisode () {
        const response = await axios.get(`https://animepi.aimanfadillah.repl.co/episode/${slug}`);
        setEpisode(response.data);
        setIframe(response.data.iframe)
    }

    return <div className="container my-5">
        {episode ? 
        <div className="row justify-content-center">
            <div className="col-md-12 mb-2">
                <h3>{episode.judul}</h3>
            </div>
            <div className="col-md-12"> 
                <div>
                    <iframe allowFullScreen={true} src={iframe} className="rounded shadow" width="100%" height={"500"} ></iframe>
                </div>
            </div>
            <div className="col-md-12 mb-4 mt-2">
                <div>
                    <select onChange={(e) => getIframe(e.target.value)} className="form-select d-inline bg-primary text-light">
                        {episode.mirror.m360p.map((dt,index) => 
                            <option key={index} value={dt.content} >{dt.nama} 360P</option>
                        )}
                        {episode.mirror.m480p.map((dt,index) => 
                            <option key={index} value={dt.content} >{dt.nama} 480p</option>
                        )}
                        {episode.mirror.m720p.map((dt,index) => 
                            <option key={index} value={dt.content} >{dt.nama} 720p</option>
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
                <ul className="list-group">
                    <li className="list-group-item py-1 bg-primary text-light text-center fs-5">Download</li>
                    {download.map((type,index) => 
                        <div  key={index}>
                            {episode.download[type].length > 0 ? 
                                <li className="list-group-item">{type.split("p")[0].replace("d"," ")}P {type.includes("mp4") ? "MP4" : "MKV"} : 
                                    {episode.download[type].map((dt,index) => 
                                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" > {dt.nama}</a>)}
                                </li> 
                            : ""}
                        </div>
                    )}
                </ul>
            </div>
        </div>
        : ""}
    </div>
}