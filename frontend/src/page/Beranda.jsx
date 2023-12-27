import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Beranda ({animes,setAnimes,getAnimes,genres,request,setRequest}) {

    return <div className="container mt-4">
        <div className="row mb-3">
            <div className="col-md-3">
                <select defaultValue={request} onChange={(e) => {
                    setRequest(e.target.value);
                    getAnimes(true,e.target.value);
                }} className="form-select" aria-label="Default select example">
                    <option value="type=ongoing" >Ongoing</option>
                    <option value="type=complete">Complete</option>
                    {genres.map((genre,index) => 
                        <option key={index} value={`genre=${genre.slug}`}>{genre.judul}</option>
                    )}
                </select>
            </div>
        </div>
        <InfiniteScroll 
            className="row"
            hasMore={true}
            next={getAnimes}
            dataLength={animes.length}
        >
            {animes.map((anime,index) => 
            <Link to={`/anime/${anime.slug}`} className=" text-decoration-none col-md-3 col-6 mb-4" key={index} >
                <div className="shadow card">
                    <img src={anime.gambar} className="card-img-top img-fluid" alt={anime.judul} />
                    <div className="card-body">
                        <h1 className="card-title fs-5">{anime.judul.length > 20 ? anime.judul.substring(0,20) + "..." : anime.judul}</h1>
                    </div>
                </div>
            </Link>
            )}
        </InfiniteScroll>
    </div>
}
