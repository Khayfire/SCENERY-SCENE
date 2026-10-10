import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* key restarts the fade animation on every route change */}
      <main key={pathname} className="container page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}