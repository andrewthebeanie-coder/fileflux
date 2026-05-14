import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ConverterPage from "./components/ConverterPage";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert/:conversionId" element={<ConverterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
