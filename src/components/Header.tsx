// src/components/Header.tsx
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-neutral-900 bg-opacity-80 backdrop-blur-md py-4 px-6 shadow-md">
    <h1 className="text-2xl font-bold text-white">Recomendador Multimedia</h1>
    <p className="text-accent-light">Descubre tus próximos libros y películas favoritas</p>
  </header>
);
