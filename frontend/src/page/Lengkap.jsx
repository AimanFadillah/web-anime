import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function Lengkap ({anime,setAnime,endpoint}) {
    const [lengkap,setLengkap] = useState();
    const slug = useParams().slug;
    const slugAnime = useParams().anime;
    const download = ["d360pmp4","d480pmp4","d720pmp4"]
    
    useEffect(() => {
        getLengkap()
        if(!anime.gambar) getAnime();
    },[]);

    async function getLengkap () {
        const response = await axios.get(`${endpoint}/lengkap/${slug}`)
        setLengkap(response.data);
    }

    async function getAnime () {
        const response = await axios.get(`${endpoint}/anime/${slugAnime}`);
        setAnime(response.data);
    }

    function filterJudul (text = "") {
        if(text.includes("Batch")){
            if(text.includes("Episode")){
                text = text.split("(Episode")[1];
                text = text?.replace("Subtitle Indonesia","");
                text = "Episode (" + text.trim()
            }else{
                text = "Batch"
            }
        }else if(text.includes("Episode")){
            text = text.split("Episode")[1];
            text = text?.replace("Subtitle Indonesia","");
            text = "Episode " + text.trim()
        }
        return text;
    }

    return <div className="container my-3">
        {lengkap ? 
        <div className="row justify-content-center">
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
            {lengkap.map((dt,index) => 
                <div className={`${dt.judul.includes("Episode") ? "col-md-6" : "col-md-7"}  mt-3`} key={index}>
                    <ul className="list-group shadow" >
                        <li className="list-group-item py-1 bg-primary text-light text-center w-100 fs-6">{filterJudul(dt.judul)}</li>
                        {download.map((type,index) => 
                            <li className={`list-group-item ${dt.download[type].length > 0 ? "" : "d-none"}`} key={index}>
                                <div >{type.split("p")[0].replace("d"," ")}P {type.includes("mp4") ? "MP4" : "MKV"} : 
                                    {dt.download[type].map((dt,index) => 
                                    <a target="blank" href={dt.href} key={index} className="badge bg-primary ms-1 text-decoration-none" >{dt.nama}</a>)}
                                </div> 
                            </li>
                        )}
                    </ul>
                    {/* <ul className="list-group">
                        <li className="list-group-item py-1 bg-primary text-light text-center fs-5">Download</li>
                        {download.map((type,index) => 
                            <li className={`list-group-item ${episode.download[type].length > 0 ? "" : "d-none"}`} key={index}>
                                <div >{type.split("p")[0].replace("d"," ")}P {type.includes("mp4") ? "MP4" : "MKV"} : 
                                    {episode.download[type].map((dt,index) => 
                                    <a target="blank" href={dt.href} key={index} className="badge bg-primary ms-1 text-decoration-none" >{dt.nama}</a>)}
                                </div> 
                            </li>
                        )}
                    </ul> */}
                </div>
            )}
        </div>
        :  <div className="row my-3">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div>
}