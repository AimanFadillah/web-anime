import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";

export default function Anime ({anime,setAnime,endpoint}) {
    const slug = useParams().anime;

    useEffect(() => {
        !anime.gambar ? getAnime() : "";
    },[])

    async function getAnime () {
        const response = await axios.get(`${endpoint}/anime/${slug}`);
        setAnime(response.data);
    }

    function filterEpisode (text) {
        let episode = text.replace("Subtitle Indonesia","")
        episode = episode.replace("(End)","")
        episode = (episode.trim().split(" ")).slice(-2).join(" ");
        return episode;
    }

    return <div className="container mt-5">
        {anime.gambar ? 
        <div className="row justify-content-center">
            <div className="col-md-3 mb-4 col-8 ">
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
            <div className="col-md-12 mb-5 mt-4">
                <ol className={`list-group mb-3 ${anime.lengkap.length > 0 ? "" : "d-none"} shadow`}>
                    <li className={`list-group-item py-1 bg-primary text-light text-center fs-6`}>Download</li>
                    {anime.lengkap.map((lengkap) => 
                    <Link to={`/lengkap/${slug}/${lengkap.slug}`} className={`list-group-item d-flex justify-content-between align-items-start`}>
                        <div className="ms-2 me-auto">
                            {"Episode" + lengkap.judul.split("Episode")[1]}
                        </div>
                        <span className="badge bg-primary rounded-pill">{lengkap.tanggal}</span>
                    </Link>
                    )}
                </ol>
                <ol className="list-group shadow"> 
                    <li className="list-group-item py-1 bg-primary text-light text-center fs-6">Semua Episode</li>
                    {anime.episodes.map((episode,index) => 
                        <Link onClick={() => episode.click = true} to={`/anime/${slug}/${episode.slug}`} key={index} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className={`ms-2 me-auto ${episode.click ? "text-secondary" : ""}`}>
                                {filterEpisode(episode.judul)}
                            </div>
                            <span className="badge bg-primary rounded-pill">{episode.tanggal}</span>
                        </Link>
                    )}
                </ol>
            </div>
        </div>
        : <div className="row my-3 justify-content-center ">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div>
}
