// src/components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-neutral-900 bg-opacity-80 backdrop-blur-md py-4 px-6 mt-10 text-center">
    <p className="text-neutral-400">
      © {new Date().getFullYear()} Recomendador. Todos los derechos reservados.
    </p>
  </footer>
);
