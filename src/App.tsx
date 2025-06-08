import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { MovieSearch } from './views/MovieSearch';
import { BookSearch } from './views/BookSearch';
import { HistoryView } from './components/HistoryView';
import { FirebaseStatus } from './components/FirebaseStatus';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Fondo con gradiente animado y efectos */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10"></div>
        
        {/* Efectos de fondo adicionales */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
          <Header />
        <main className="flex-grow py-4 sm:py-6 px-4 text-neutral-light relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />            <Route path="/peliculas" element={
              <div>
                <Dashboard />
                <div className="mt-4 sm:mt-8">
                  <MovieSearch />
                </div>
              </div>
            } />
            <Route path="/libros" element={
              <div>
                <Dashboard />
                <div className="mt-4 sm:mt-8">
                  <BookSearch />
                </div>
              </div>
            } />
            <Route path="/historial" element={
              <div>
                <Dashboard />
                <div className="mt-4 sm:mt-8">
                  <HistoryView />
                </div>
              </div>
            } />
            <Route path="*" element={<Dashboard />} />
          </Routes>        </main>
        <Footer />
        
        {/* Firebase Status Monitor - Solo en desarrollo */}
        <FirebaseStatus />
      </div>
    </Router>
  );
}
