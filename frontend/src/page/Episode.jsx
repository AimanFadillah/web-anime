import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function Episode () {
    const [episode,setEpisode] = useState();
    const [iframe,setIframe] = useState();
    const slug = useParams().slug

    useEffect(() => {
        getEpisode()
    },[])

    async function getEpisode () {
        const response = await axios.get(`http://localhost:5000/episode/${slug}`);
        setEpisode(response.data);
        setIframe(response.data.iframes[0].src)
    }

    return <div className="container my-5">
        {episode ? 
        <div className="row">
            <div className="col-md-12 d-flex align-items-center justify-content-between">
                <h1>{episode.judul}</h1>
                <div>
                    <select defaultValue={iframe} onChange={(e) => setIframe(e.target.value)} className="form-select d-inline">
                        {episode.iframes.map((dt,index) => 
                            <option key={index} value={dt.src} >{dt.nama}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="col-md-12">
                <div>
                    <iframe src={iframe} width="100%" height="500" ></iframe>
                </div>
            </div>
        </div>
        : ""}
    </div>
}