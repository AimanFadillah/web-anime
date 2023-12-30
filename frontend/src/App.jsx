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
  const [page,setPage] = useState(1);
  const [genres,setGenres] = useState([]);
  const [request,setRequest] = useState("type=ongoing");
  const [hasMore,setHasmore] = useState(true);
  const [search,setSearch] = useState("");
  const [showSearch,setShowSearch] = useState(window.innerWidth >= 768 ? true : false)
  const [mode,setMode] = useState(localStorage.getItem("mode") || "light")
  const [jadwal,setJadwal] = useState([]);

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
    const response = await axios.get(`https://animepi.aimanfadillah.repl.co/anime?page=${!reset ? page : 1}&${query}`);
    response.data.length > 0 ? setHasmore(true) : setHasmore(false);
    setAnimes(!reset ? [...animes,...response.data] : response.data);
    setPage(!reset ? page + 1 : 2);
  }

  async function getGenres () {
    const response = await axios.get("https://animepi.aimanfadillah.repl.co/genre");
    setGenres(response.data);
  }

  async function getJadwal () {
    const response = await axios.get("https://animepi.aimanfadillah.repl.co/jadwal");
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
        />}
      />
      <Route path="/anime/:anime" element={<Anime anime={anime} setAnime={setAnime} />} />
      <Route path="/anime/:anime/:episode" element={<Episode anime={anime} setAnime={setAnime} />} />
      <Route path="/lengkap/:anime/:slug" element={<Lengkap anime={anime} setAnime={setAnime} />}  />
      <Route path="/history" element={<History setAnime={setAnime} />} />
      <Route path="/jadwal" element={<Jadwal jadwal={jadwal} setAnime={setAnime} />} />
    </Routes>
  </BrowserRouter>
}