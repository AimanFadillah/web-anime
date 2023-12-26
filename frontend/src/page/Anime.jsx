import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

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
        <div className="row">
            <h3>{anime.judul}</h3>
            <div className="col-md-5">
                <div className="">
                    <img src={anime.gambar} className="img-fluid" alt="..."/>
                </div>
            </div>
            <ul className="mt-3">
                {anime.episodes.map((episode,index) => 
                    <li key={index} >
                        <a href={`/episode/${episode.slug}`} >{episode.judul}</a>
                    </li>
                )}
            </ul>
        </div>
        : ""}
    </div>
}