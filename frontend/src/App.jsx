import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import Beranda from "./page/Beranda"
import Anime from "./page/Anime";
import Episode from "./page/Episode";

export default function App () {
  const [animes,setAnimes] = useState([]);
  const [page,setPage] = useState(1);
  const [genres,setGenres] = useState([]);
  const [request,setRequest] = useState("type=ongoing");

  useEffect(() => {
    getAnimes()
    getGenres()
  },[]);

  async function getAnimes (reset = false,query = request) {
    const response = await axios.get(`http://localhost:5000/anime?page=${!reset ? page : 1}&${query}`); 
    setAnimes(!reset ? [...animes,...response.data] : response.data);
    setPage(!reset ? page + 1 : 2);
  }

  async function getGenres () {
    const response = await axios.get("http://localhost:5000/genre");
    setGenres(response.data);
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={
      <Beranda animes={animes} setAnimes={setAnimes} getAnimes={getAnimes} genres={genres} request={request} setRequest={setRequest} />}
      />
      <Route path="/anime/:slug" element={<Anime />} />
      <Route path="/episode/:slug" element={<Episode />} />
    </Routes>
  </BrowserRouter>
}