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
        <h1 className="text-center mt-4" ><i className="bi bi-clock-history"></i> History</h1>
        <div className="row mt-3">
            {animesHistory.map((anime,index) => 
                <div className=" text-decoration-none col-md-3 col-6 mb-4" key={index} >
                    <div className="shadow card">
                        <img onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} src={anime.gambar} className="card-img-top img-fluid" alt={anime.judul} />
                        <div className="card-body">
                            <h1 onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} className="card-title fs-5">{(anime.judul.split("Judul: ")[1]).length > 18 ? (anime.judul.split("Judul: ")[1]).substring(0,18) + "..." : (anime.judul.split("Judul: ")[1])}</h1>
                            <h6 onClick={() => anime.slugEpisode ? nav(`/anime/${anime.slug}/${anime.slugEpisode}${anime.mirror ? `?mirror=${anime.mirror}` : ""}`) : nav(`/anime/${anime.slug}`)} className={`badge bg-primary ${anime.eps == "" ? "d-none" : ""}`} >{anime.lastEpisode}</h6>
                            <div className="badge bg-danger ms-1" onClick={() => removeHistory(index)} ><i className="bi bi-trash"></i></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
}