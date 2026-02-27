import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";

export default function NotFoundPage() {
  return (
    <Container className="py-16">
      <div className="card p-8">
        <div className="text-2xl font-extrabold text-white">Page not found</div>
        <div className="mt-2 text-sm text-slate-400">That link doesn’t exist.</div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button as={Link} to="/gigs">
            Browse gigs
          </Button>
          <Button as={Link} to="/" variant="secondary">
            Home
          </Button>
        </div>
      </div>
    </Container>
  );
}

