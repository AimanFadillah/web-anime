import { Link } from "react-router-dom";


export default function Beranda ({animes,setAnimes}) {
    

    return <div className="container mt-4">
        <h1>Daftar Anime</h1>
        <div className="row">
            {animes.map((anime,index) => 
            <Link to={`/anime/${anime.slug}`} className="text-decoration-none col-md-3 mb-4" key={index} >
                <div className="card">
                    <img src={anime.gambar} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{anime.judul.length > 20 ? anime.judul.substring(0,20) + "..." : anime.judul.length}</h5>
                    </div>
                </div>
            </Link>
            )}
        </div>
    </div>
}
