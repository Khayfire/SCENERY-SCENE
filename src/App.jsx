import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Portfolio from "./pages/Portfolio";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Admin from "./admin/Admin";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="booking" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
        <Route path="admin" element={<Admin />} />
        <Route element={<MainLayout />}></Route>
      </Route>
    </Routes>
  );
}