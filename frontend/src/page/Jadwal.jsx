import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Jadwal ({jadwal,setAnime}) {

    useEffect(() => {
        setAnime({});
    },[]);

    return <div className="container">
        <h1 className="my-4 text-center" ><i className="bi bi-calendar"></i> Jadwal Anime</h1>
        {jadwal.length != 0 ? 
        <div className="row">
            {jadwal.map((dt,index) => 
            <div className="col-md-4 col-12 mb-4" key={index}>
                <ul className="list-group shadow">
                    <li className="list-group-item active text-center" >{dt.hari}</li>
                    {dt.anime.map((anime,index) => 
                        <Link key={index} to={`/anime/${anime.slug}`} className="list-group-item">
                            {anime.judul}
                        </Link>
                    )}
                </ul>
            </div>
            )}
        </div>
        : <div className="row my-3">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div>
}