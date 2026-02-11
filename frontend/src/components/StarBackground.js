import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const StarBackground = () => {
  const { isDark } = useTheme();
  const [stars, setStars] = useState([]);
  const [cursorStars, setCursorStars] = useState([]);

  useEffect(() => {
    if (!isDark) {
      setStars([]);
      return;
    }

    // Créer des étoiles fixes
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 4
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Gérer les étoiles au curseur
    const handleMouseMove = (e) => {
      if (!isDark) return;

      const star = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };

      setCursorStars(prev => [...prev.slice(-5), star]);

      // Supprimer l'étoile après l'animation
      setTimeout(() => {
        setCursorStars(prev => prev.filter(s => s.id !== star.id));
      }, 500);
    };

    if (isDark) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark]);

  if (!isDark) return null;

  return (
    <>
      {/* Étoiles fixes */}
      {stars.map(star => (
        <div
          key={star.id}
          className={`star star-${star.size}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}

      {/* Étoiles au curseur */}
      {cursorStars.map(star => (
        <div
          key={star.id}
          className="cursor-star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </>
  );
};

export default StarBackground;
