import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";

export default function Anime () {
    const [anime,setAnime] = useState();
    const slug = useParams().slug;

    useEffect(() => {
        getAnime();
    },[])

    async function getAnime () {
        const response = await axios.get(`http://localhost:5000/anime/${slug}`);
        setAnime(response.data);
    }

    return <div className="container mt-5">
        {anime ? 
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
            <h4 className="text-center mt-5 mb-3" >Semua Episode</h4>
            <div className="col-md-12 mb-5">
                <ol className="list-group">
                    {anime.episodes.map((episode,index) => 
                        <Link to={`/episode/${episode.slug}`} key={index} className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                            {episode.judul}
                            </div>
                            <span className="badge bg-primary d-none d-md-block rounded-pill">{episode.tanggal}</span>
                        </Link>
                    )}
                </ol>
            </div>
        </div>
        : ""}
    </div>
}