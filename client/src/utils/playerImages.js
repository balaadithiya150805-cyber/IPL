import { useEffect, useState } from 'react';

const imageCache = new Map();

function wikipediaUrl(playerName) {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName.replaceAll(' ', '_'))}`;
}

export function usePlayerImage(player) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!player?.name) {
      setImageUrl(null);
      return undefined;
    }

    const cached = imageCache.get(player.name);
    if (cached) {
      setImageUrl(cached);
      return undefined;
    }

    setImageUrl(null);
    fetch(wikipediaUrl(player.name))
      .then((response) => response.ok ? response.json() : null)
      .then((summary) => {
        const thumbnail = summary?.thumbnail?.source || summary?.originalimage?.source;
        if (!cancelled && thumbnail) {
          imageCache.set(player.name, thumbnail);
          setImageUrl(thumbnail);
        }
      })
      .catch(() => {
        if (!cancelled) setImageUrl(null);
      });

    return () => { cancelled = true; };
  }, [player?.name]);

  return imageUrl;
}

