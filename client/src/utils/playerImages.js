import { useEffect, useState } from 'react';

const imageCache = new Map();

function wikipediaUrl(playerName) {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName.replaceAll(' ', '_'))}`;
}

function normalizedName(value) {
  return value
    .toLowerCase()
    .replace(/[.'’-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isValidPlayerSummary(summary, playerName) {
  const title = normalizedName(summary?.title || '');
  const requestedName = normalizedName(playerName);
  const description = `${summary?.description || ''} ${summary?.extract || ''}`.toLowerCase();
  const isCricketPage = /cricket|cricketer|batsman|bowler|wicketkeeper|all-rounder/.test(description);
  const isMatchingPage = title === requestedName || title.startsWith(`${requestedName} (`);
  return isCricketPage && isMatchingPage;
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
        const thumbnail = isValidPlayerSummary(summary, player.name)
          ? summary?.thumbnail?.source || summary?.originalimage?.source
          : null;
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

