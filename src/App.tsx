import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MovieSearch } from './views/MovieSearch';
import { BookSearch } from './views/BookSearch';
import { HistoryView } from './components/HistoryView';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-accent-dark">
      <Header />
      <Router>
        <nav className="flex justify-center gap-6 mt-6">
          <Link
            to="/peliculas"
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition"
          >
            Películas
          </Link>
          <Link
            to="/libros"
            className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-dark transition"
          >
            Libros
          </Link>
          <Link
            to="/historial"
            className="px-4 py-2 rounded-xl bg-neutral-700 text-white hover:bg-neutral-600 transition"
          >
            Historial
          </Link>
        </nav>
        <main className="flex-grow py-10 px-4 text-neutral-light">
          <Routes>
            <Route path="/peliculas" element={<MovieSearch />} />
            <Route path="/libros" element={<BookSearch />} />
            <Route path="/historial" element={<HistoryView />} />
            <Route path="*" element={<MovieSearch />} />
          </Routes>
        </main>
      </Router>
      <Footer />
    </div>
  );
}
