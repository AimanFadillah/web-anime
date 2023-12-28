import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import Beranda from "./page/Beranda"
import Anime from "./page/Anime";
import Episode from "./page/Episode";

export default function App () {
  const [animes,setAnimes] = useState([]);
  const [anime,setAnime] = useState();
  const [page,setPage] = useState(1);
  const [genres,setGenres] = useState([]);
  const [request,setRequest] = useState("type=ongoing");
  const [hasMore,setHasmore] = useState(true);

  useEffect(() => {
    getAnimes()
    getGenres()
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

  return <BrowserRouter>
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
        />}
      />
      <Route path="/anime/:slug" element={<Anime anime={anime} setAnime={setAnime} />} />
      <Route path="/episode/:slug" element={<Episode anime={anime} />} />
    </Routes>
  </BrowserRouter>
}