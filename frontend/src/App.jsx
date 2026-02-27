import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Hammer, Shield } from "lucide-react";
import Container from "./components/Container.jsx";
import HomePage from "./pages/Home.jsx";
import GigsPage from "./pages/Gigs.jsx";
import GigDetailPage from "./pages/GigDetail.jsx";
import AdminPage from "./pages/Admin.jsx";
import AdminInboxPage from "./pages/AdminInbox.jsx";
import NotFoundPage from "./pages/NotFound.jsx";

function TopNav() {
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-slate-950 shadow-soft">
            <Hammer size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-white">Roblox Builds</div>
            <div className="text-xs text-slate-400">Gigs & Projects</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/gigs" className={linkClass}>
            Browse
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            <span className="inline-flex items-center gap-2">
              <Shield size={16} /> Admin
            </span>
          </NavLink>
        </div>
      </Container>
    </div>
  );
}

function Footer() {
  return (
    <div className="border-t border-white/10">
      <Container className="py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-white">Roblox Builds</div>
            <div className="mt-2 text-sm text-slate-400">
              Fiverr-like storefront for your Roblox build gigs. Powered by React + Express + MySQL.
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Contact</div>
            <div className="mt-2 text-sm text-slate-400">
              Add your Discord/email in the gig pages. Inquiries are saved in MySQL.
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Status</div>
            <div className="mt-2 text-sm text-slate-400">Local dev: `http://localhost:5173`</div>
          </div>
        </div>
        <div className="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Roblox Builds</div>
      </Container>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[460px] w-[920px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gigs" element={<GigsPage />} />
        <Route path="/g/:slug" element={<GigDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/inbox" element={<AdminInboxPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

