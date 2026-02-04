import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import MembersGrid from "@/pages/MembersGrid";
import Gallery from "@/pages/Gallery";
import Quotes from "@/pages/Quotes";
import AdminPanel from "@/pages/AdminPanel";

function App() {
  return (
    <div className="App">
      <div className="noise-overlay" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/members" element={<MembersGrid />} />
          <Route path="/members/:memberId" element={<MemberProfile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
