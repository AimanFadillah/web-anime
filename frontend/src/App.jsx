import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import Beranda from "./page/Beranda"
import Anime from "./page/Anime";
import Episode from "./page/Episode";

export default function App () {
  const [animes,setAnimes] = useState([]);

  useEffect(() => {
    getAnimes()
  },[]);

  async function getAnimes () {
      const response = await axios.get("http://localhost:5000/anime");
      setAnimes([...animes,...response.data]);
  }

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Beranda animes={animes} setAnimes={setAnimes} />} />
      <Route path="/anime" element={<Beranda animes={animes} setAnimes={setAnimes} />} />
      <Route path="/anime/:slug" element={<Anime />} />
      <Route path="/episode/:slug" element={<Episode />} />
    </Routes>
  </BrowserRouter>
}