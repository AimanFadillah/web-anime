import {BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import Beranda from "./page/Beranda"
import Anime from "./page/Anime";
import Episode from "./page/Episode";
import History from "./page/History";
import Lengkap from "./page/Lengkap";
import Jadwal from "./page/Jadwal";

export default function App () {
  const [animes,setAnimes] = useState([]);
  const [anime,setAnime] = useState({}); 
  const [animeInfo,setAnimeInfo] = useState({});
  const [page,setPage] = useState(1);
  const [genres,setGenres] = useState([]);
  const [request,setRequest] = useState("type=ongoing");
  const [hasMore,setHasmore] = useState(true);
  const [search,setSearch] = useState("");
  const [showSearch,setShowSearch] = useState(window.innerWidth >= 768 ? true : false)
  const [mode,setMode] = useState(localStorage.getItem("mode") || "light")
  const [jadwal,setJadwal] = useState([]);
  const [isAnimesNull,setIsAnimesNull] = useState(false);
  const [axiosToken,setAxiosToken] = useState(false);
  const endpoint = "https://test.infind.my.id";
  // const endpoint = "http://localhost:5000";

  useEffect(() => {
    localStorage.setItem("mode",mode);
    document.body.setAttribute("data-bs-theme",mode);
  },[mode]);

  useEffect(() => {
    getAnimes()
    getGenres()
    getJadwal()
  },[]); 

  async function getAnimes (reset = false,query = request) {
    reset ? setAnimes([]) : "";
    const response = await axios.get(`${endpoint}/anime?page=${!reset ? page : 1}&${query}`);
    const newPage = !reset ? page + 1 : 2;    
    setAnimes(!reset ? [...animes,...response.data] : response.data);
    setPage(newPage);
    if(response.data.length > 0){
      setHasmore(true)
      setIsAnimesNull(false)
    }else{
      if(newPage <= 2){
        setIsAnimesNull(true)
      }
      setHasmore(false);
    }
  }

  async function getGenres () {
    const response = await axios.get(`${endpoint}/genre`);
    setGenres(response.data);
  }

  async function getJadwal () {
    const response = await axios.get(`${endpoint}/jadwal`);
    setJadwal(response.data);
  }


  return <BrowserRouter > 
    <Routes>
      <Route path="/" element={
        <Beranda 
          animes={animes} 
          setAnimes={setAnimes} 
          getAnimes={getAnimes} 
          genres={genres} 
          request={request} 
          setRequest={setRequest}
          setAnime={setAnime}
          hasMore={hasMore}
          search={search}
          setSearch={setSearch}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          mode={mode}
          setMode={setMode}
          isAnimesNull={isAnimesNull}
          setAnimeInfo={setAnimeInfo}
          axiosToken={axiosToken}
          setAxiosToken={setAxiosToken}
        />}
      />
      <Route path="/anime/:anime" element={<Anime 
        anime={anime}
        setAnime={setAnime}
        endpoint={endpoint}
        animeInfo={animeInfo}
        setAnimeInfo={setAnimeInfo}  
        setAxiosToken={setAxiosToken}
      />} />
      <Route path="/anime/:anime/:episode" element={<Episode anime={anime} setAnime={setAnime} endpoint={endpoint} />} />
      <Route path="/lengkap/:anime/:slug" element={<Lengkap anime={anime} setAnime={setAnime} endpoint={endpoint} />}  />
      <Route path="/history" element={<History setAnime={setAnime} />} />
      <Route path="/jadwal" element={<Jadwal jadwal={jadwal} setAnime={setAnime} />} />
    </Routes>
  </BrowserRouter>
}
