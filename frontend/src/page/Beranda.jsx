import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState, useRef } from "react";

export default function Beranda ({animes,getAnimes,genres,animeList,request,setRequest,setAnime,hasMore,search,setSearch,showSearch,setShowSearch,mode,setMode,isAnimesNull,setAnimeInfo,axiosToken,setAxiosToken}) {
    const [filteredAnimes, setFilteredAnimes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setAnime({});
        setAnimeInfo({});
        return () => {
            if(axiosToken){
                axiosToken.cancel("Request dibatalkan karena berpindah halaman.");
                setAxiosToken(false)
            }
        };
    },[])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim().length > 0) {
            const filtered = animeList.filter(anime =>
                anime.judul.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 10);
            setFilteredAnimes(filtered);
            setShowDropdown(true);
        } else {
            setFilteredAnimes([]);
            setShowDropdown(false);
        }
    };

    const handleSelectAnime = (slug) => {
        setShowDropdown(false);
        setSearch("");
        navigate(`/anime/${slug}`);
    };

    return <div className="container mt-5">
        <div className="row mb-3">
            <div className="col-md-3 col-5">
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
            <div className="col-md-3 col-6 p-0">
                <div onClick={() => setShowSearch(!showSearch)} className="btn btn-primary d-md-none  " ><i className="bi bi-search"></i></div>
                <Link to={"/history"} className="ms-1 btn btn-primary" ><i className="bi bi-clock-history"></i></Link>
                <div onClick={() => mode === "light" ? setMode("dark") : setMode("light")} className="ms-1 btn btn-primary" >
                    {mode === "light" ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}
                </div>
                <Link to={"/jadwal"} className="ms-1 btn btn-primary" ><i className="bi bi-calendar"></i></Link>
            </div>
            <div className={`${showSearch ? "" : "d-none"} col-md-3 offset-md-3 co-12 mt-md-0 mt-2`} ref={searchRef}>
                <div className="position-relative">
                    <div className="input-group">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            className="form-control"
                            placeholder="Cari Anime"
                            autoComplete="off"
                        />
                        <button className="btn btn-primary" onClick={() => setSearch("")}>
                            <i className={search ? "bi bi-x-lg" : "bi bi-search"}></i>
                        </button>
                    </div>
                    {showDropdown && filteredAnimes.length > 0 && (
                        <div className="search-dropdown">
                            {filteredAnimes.map((anime, index) => (
                                <div
                                    key={index}
                                    className="search-dropdown-item"
                                    onClick={() => handleSelectAnime(anime.slug)}
                                >
                                    <i className="bi bi-search me-2"></i>
                                    {anime.judul}
                                </div>
                            ))}
                        </div>
                    )}
                    {showDropdown && search.trim().length > 0 && filteredAnimes.length === 0 && (
                        <div className="search-dropdown">
                            <div className="search-dropdown-item text-muted">
                                Anime tidak ditemukan
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
       
        <InfiniteScroll 
            className="row placeholder-glow"
            hasMore={hasMore}
            next={getAnimes}
            dataLength={animes.length}
            loader={
                <div className="row my-3 mx-0">
                    <div className="col-md-12 d-flex justify-content-center mt-3">
                        <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
                    </div>
                </div>
            }
            endMessage={
                <div className={`row my-3 mx-0`}>
                    <div className="col-md-12 d-flex justify-content-center mt-3">
                        <h5 className={`${request.split("type=")[1] === "ongoing" ? "" : "d-none"}`} >Anime {request.split("type=")} sudah habis </h5>
                    </div>
                </div>
            }
            >
            {animes.map((anime,index) => 
                <Link to={`/anime/${anime.slug}`} className=" text-decoration-none col-md-3 col-6 mb-4" key={index} >
                    <div className="shadow card" style={{ aspectRatio: 3 / 4 }} >
                        <img src={anime.gambar} className="card-img-top img-fluid" style={{ objectFit:"cover",height:"100%" }} alt={anime.judul} />
                        <div className="card-body">
                            <h1 className="card-title fs-5">{anime.judul.length > 18 ? anime.judul.substring(0,18) + "..." : anime.judul}</h1>
                            <h6 className={`badge bg-primary ${anime.eps == "" ? "d-none" : ""}`} >Episode {anime.eps}</h6>
                        </div>
                    </div>
                </Link>
            )}
            {isAnimesNull == true ?
                <div className={`row my-3 mx-0`}>
                    <div className="col-12 d-flex justify-content-center mt-3 text-center">
                        <h5>Maaf, anime yang anda cari tidak tersedia.</h5>
                    </div>
                </div>
                : animes.length > 0 || Array(20).fill(0).map((_,index) => 
                    <div className="text-decoration-none col-md-3 col-6 mb-4" key={index} >
                        <div className="shadow card" style={{ aspectRatio: 3 / 4 }} >
                            <div className="card-img-top img-fluid placeholder" style={{ height:"100%" }} ></div>
                            <div className="card-body">
                                <h5 className="card-title"><span className="placeholder col-8" ></span></h5>
                                <h5 className="card-title"><span className="placeholder col-5" ></span></h5>
                            </div>
                        </div>
                    </div>
                )
            }
        </InfiniteScroll>
    </div>
}
