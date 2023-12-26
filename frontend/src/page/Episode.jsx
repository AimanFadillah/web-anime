import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode () {
    const [episode,setEpisode] = useState();
    const [iframe,setIframe] = useState();
    const [nonce,setNonce] = useState();
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
            <div className="col-md-12 d-flex align-items-center justify-content-between">
                <h1>{episode.judul}</h1>
                <div>
                    <select onChange={(e) => getIframe(e.target.value)} className="form-select d-inline">
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
            <div className="col-md-12">
                <div>
                    <iframe src={iframe} width="100%" height="500" ></iframe>
                </div>
            </div>
            <h1 className="text-center mt-5" >Download</h1>
            <h6>MP4 360P</h6>
            <div className="d-flex mb-3">
                {episode.download.d360pmp4.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MP4 480P</h6>
            <div className="d-flex mb-3">
                {episode.download.d480pmp4.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MP4 720P</h6>
            <div className="d-flex mb-3">
                {episode.download.d720pmp4.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MP4 1080P</h6>
            <div className="d-flex mb-3">
                {episode.download.d1080pmp4.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MKV 480P</h6>
            <div className="d-flex mb-3">
                {episode.download.d480pmkv.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MKV 720P</h6>
            <div className="d-flex mb-3">
                {episode.download.d720pmkv.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
            <h6>MKV 1080P</h6>
            <div className="d-flex mb-3">
                {episode.download.d1080pmkv.map((dt,index) => 
                    <a target="blank" href={dt.href} key={index} className="me-2 text-decoration-none" >{dt.nama} |</a>
                )}
            </div>
        </div>
        : ""}
    </div>
}