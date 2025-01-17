import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

export default function Anime ({anime,setAnime,endpoint,animeInfo,setAnimeInfo,setAxiosToken}) {
    const slug = useParams().anime;
    const [statusInfo,setStatusInfo] = useState(false)
    const [showInfo,setShowInfo] = useState(true)
    const { ref, inView } = useInView({
        threshold: 0.1, 
    });

    useEffect(() => {
        !anime.gambar ? getAnime() : "";
    },[])

    useEffect(() => {
        if(inView && anime && !animeInfo.ranked){
            setStatusInfo(true)
            getAnimeInfo(anime)
        }
    },[inView])

    async function getAnime () {
        const response = await axios.get(`${endpoint}/anime/${slug}`);
        setAnime(response.data);
    }

    async function getAnimeInfo(data) {
        if(!statusInfo){
            try {
                const cancelTokenSource = axios.CancelToken.source();
                setAxiosToken(cancelTokenSource)
                const name = data.nama.split("Judul: ")[1]
                const response = await axios.get(`${endpoint}/info/${name}`,{ 
                    cancelToken:cancelTokenSource.token
                });
                if(response.data.ranked){
                    setAnimeInfo(response.data)
                }else{
                    setShowInfo(false)
                }
            }catch(error){
                axios.isCancel(error)
            }
        }
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
            <div className="col-md-12 mt-4">
                <ol className={`list-group mb-3 ${anime.lengkap.length > 0 ? "" : "d-none"} shadow`}>
                    <li className={`list-group-item py-1 bg-primary text-light text-center fs-6`}>Download</li>
                    {anime.lengkap.map((lengkap,index) => 
                    <Link key={index} to={`/lengkap/${slug}/${lengkap.slug}`} className={`list-group-item d-flex justify-content-between align-items-start`}>
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
            {!showInfo || anime.status.includes("complete") || 
            <div ref={ref} className="col-md-12 mt-4 mb-5">
                {animeInfo.ranked ? 
                    <>
                    <div className="row m-0 ">
                        <div className="rounded-start border col-4 p-3 pb-2">
                            <h6 className="fs-6" >Ranked <span className="fw-bold" >{animeInfo.ranked}</span></h6>
                        </div>
                        <div className="border-top border-bottom col-4 p-3 pb-2">
                            <h6 className="fs-6" >Popularity  <span className="fw-bold" >{animeInfo.popularity}</span></h6>
                        </div>
                        <div className="rounded-end border col-4 p-3 pb-2">
                            <h6 className="fs-6" >Members <span className="fw-bold" >{animeInfo.members}</span></h6>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4 rounded shadow border p-2">
                        <div className="container-iframe" >
                            <iframe allowFullScreen={true} src={animeInfo.trailer} style={{ borderRadius:0 }} className="rounded iframe" width="100%"></iframe>
                        </div>
                    </div>
                    <h3 className="text-center mt-3" >Character & Role</h3>
                    <div className="row mt-4">
                        {animeInfo.characters.map((character,index) => 
                        <div className="text-decoration-none col-md-3 col-6 mb-4" key={index} >
                            <div className="shadow card" style={{ aspectRatio: 3 / 4 }} >
                                <img src={character.img} className="card-img-top img-fluid" style={{ objectFit:"cover",height:"100%" }} alt={character.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{character.name}</h5>
                                    <h6 className={`badge bg-primary`} >{character.role}</h6>
                                </div>
                                
                            </div>
                        </div>
                        )}
                    </div>
                    </>
                    : 
                    <>
                    <div className="row m-0 placeholder-glow ">
                        <div className="rounded-start border col-4 p-3 pb-2">
                            <h6 className="fs-6" >
                                <span className="placeholder col-3" ></span> <span className="placeholder col-8" ></span>
                            </h6>
                        </div>
                        <div className="border-top border-bottom col-4 p-3 pb-2">
                            <h6 className="fs-6" >
                                <span className="placeholder col-3" ></span> <span className="placeholder col-8" ></span>
                            </h6>
                        </div>
                        <div className="rounded-end border col-4 p-3 pb-2">
                            <h6 className="fs-6" >
                                <span className="placeholder col-3" ></span> <span className="placeholder col-8" ></span>
                            </h6>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4 rounded shadow border p-2 placeholder-glow">
                        <div className="container-iframe rounded" >
                            <div allowFullScreen={true} className="placeholder rounded iframe" width="100%"></div>
                        </div>
                    </div>
                    <h3 className="text-center mt-3" >Character & Role</h3>
                    <div className="row mt-4 placeholder-glow">
                        {[1,1,1,1,1,1,1,1].map((_,index) => 
                            <div className="text-decoration-none col-md-3 col-6 mb-4" key={index} >
                                <div className="shadow card" style={{ aspectRatio: 3 / 4 }} >
                                    <div className="card-img-top img-fluid placeholder" style={{ height:"100%" }} ></div>
                                    <div className="card-body">
                                        <h5 className="card-title"><span className="placeholder col-8" ></span></h5>
                                        <h5 className="card-title"><span className="placeholder col-5" ></span></h5>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    </>
                }
            </div> 
            }
        </div>
        : <div className="row my-3 justify-content-center ">
            <div className="col-md-12 d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" style={{width:"3rem",height:"3rem"}} role="status"></div>
            </div>
        </div>}
    </div>
}
