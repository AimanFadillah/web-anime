import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function History ({setAnime}) {
    const [animesHistory,setAnimesHistory] = useState(JSON.parse(localStorage.getItem("anime")) || []);
    const nav = useNavigate();

    useEffect(() => {
        setAnime({});
    },[]);

    function removeHistory (index) {
        const newHistorys = animesHistory;
        newHistorys.splice(index,1);
        setAnimesHistory([...newHistorys]);
        localStorage.setItem("anime",JSON.stringify(newHistorys));
    }


    return <div className="container">
        <div className="row mt-4 align-items-center">
            <div className="col-md-12 mb-3 d-flex justify-content-between align-items-center">
                <nav aria-label="breadcrumb" className="mb-0">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <Link to="/">Beranda</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            History
                        </li>
                    </ol>
                </nav>
                <h4 className="mb-0"><i className="bi bi-clock-history"></i> History</h4>
            </div>
        </div>
        <div className="row">
            {animesHistory.map((anime,index) =>
                <div className="text-decoration-none col-md-3 col-6 mb-4" key={index}>
                    <div className="anime-card" style={{ aspectRatio:"3/4", borderRadius:"0.5rem", overflow:"hidden", position:"relative" }}>
                        <img onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} src={anime.gambar} className="w-100 h-100" style={{ objectFit:"cover", display:"block", cursor:"pointer" }} alt={anime.judul} />
                        <div onClick={() => removeHistory(index)} style={{ position:"absolute", top:"0.5rem", right:"0.5rem", cursor:"pointer", background:"#dc3545", borderRadius:"0.5rem", padding:"0.4rem 0.6rem", lineHeight:1, boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
                            <i className="bi bi-trash-fill text-white" style={{fontSize:"0.95rem"}}></i>
                        </div>
                        <div className="anime-card-overlay">
                            <h6 onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} className={`badge bg-primary mb-1 ${anime.lastEpisode ? "" : "d-none"}`} style={{cursor:"pointer"}}>{anime.lastEpisode}</h6>
                            <p onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} className="anime-card-title" style={{cursor:"pointer"}}>{anime.judul.split("Judul: ")[1] || anime.judul}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
}