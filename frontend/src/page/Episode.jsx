import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode () {
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
        const response = await axios.get("http://localhost:5000/nonce");
        setNonce(response.data);
    }

    async function getIframe (content) {
        const response = await axios.get(`http://localhost:5000/getIframe?nonce=${nonce}&content=${content}`)
        const inframeSrc =  (new DOMParser().parseFromString(response.data,"text/html")).querySelector("iframe").getAttribute("src");
        setIframe(inframeSrc);
    }

    async function getEpisode () {
        const response = await axios.get(`http://localhost:5000/episode/${slug}`);
        setEpisode(response.data);
        setIframe(response.data.iframe)
    }

    return <div className="container my-5">
        {episode ? 
        <div className="row">
            <div className="col-md-12 mb-2">
                <h3>{episode.judul}</h3>
            </div>
            <div className="col-md-12"> 
                <div>
                    <iframe allowFullScreen={true} src={iframe} className="rounded shadow" width="100%" height={"500"} ></iframe>
                </div>
            </div>
            <div className="col-md-3">
                <div>
                    <select onChange={(e) => getIframe(e.target.value)} className="form-select d-inline bg-success text-white">
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
            <h1 className="text-center mt-5" >Download</h1>
            {download.map((type,index) => 
                <div className="col-md-12 p-2" key={index}>
                {episode.download[type].length > 0 ? 
                    <>
                        <h6>{type.split("p")[0].replace("d"," ")}P {type.includes("mp4") ? "MP4" : "MKV"}</h6>
                        <div className="d-flex mb-3">
                            {episode.download[type].map((dt,index) => 
                                <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >    {dt.nama}</a>
                                )}
                        </div>
                     </>
                    : ""}
                </div>
            )}
        </div>
        : ""}
    </div>
}