import React from 'react';

export const RecommendationCard: React.FC<{
  title: string;
  imageUrl?: string;
  description?: string;
  link: string;
}> = ({ title, imageUrl, description, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener"
    className="
      block overflow-hidden rounded-2xl shadow-card
      bg-neutral-900 border border-neutral-700
      hover:shadow-lg hover:border-accent transition
      transform hover:-translate-y-1
    "
  >
    {imageUrl && (
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h3 className="text-xl font-semibold text-accent-light">{title}</h3>
      {description && (
        <p className="mt-2 text-neutral-300 line-clamp-3">{description}</p>
      )}
    </div>
  </a>
);
