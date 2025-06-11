import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhotoboothProvider } from "./contexts/PhotoboothContext";
import Home from "./pages/Home";
import Photobooth from "./pages/Photobooth";
import PhotoboothGrid from "./pages/PhotoboothGrid";
import JaehyunEvent from "./features/specialEvents/components/JaehyunEvent";

function App() {
  return (
    <PhotoboothProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photobooth" element={<Photobooth />} />
          <Route path="/photobooth-grid" element={<PhotoboothGrid />} />
          <Route path="/special-event/jaehyun" element={<JaehyunEvent />} />
        </Routes>
      </BrowserRouter>
    </PhotoboothProvider>
  );
}

export default App;
