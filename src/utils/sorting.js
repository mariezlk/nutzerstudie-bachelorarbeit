import { haversineDistance } from './distance';

// Schritt 1 (für BEIDE Versionen identisch): Textmatch-Filter
// Ein Ort gilt als Treffer, wenn der Name den eingegebenen Text
// als Präfix oder Teilstring enthält (case-insensitive).
export function filterByText(places, query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  return places.filter((place) => place.name.toLowerCase().includes(q));
}

// Schritt 2, Version "popularity"
export function sortByPopularity(places) {
  return [...places].sort((a, b) => b.importance - a.importance);
}

// Schritt 2, Version "distance" (zum festen Ausgangspunkt)
export function sortByDistance(places, origin) {
  return [...places]
    .map((place) => ({
      ...place,
      _distance: haversineDistance(
        origin.lat,
        origin.lon,
        place.lat,
        place.lon
      ),
    }))
    .sort((a, b) => a._distance - b._distance);
}

// Kombinierte Funktion: wählt je nach condition ('popularity' | 'distance') passende Sortierung
export function getSortedSuggestions(places, query, condition, origin) {
  const matches = filterByText(places, query);
  if (condition === 'distance') {
    return sortByDistance(matches, origin);
  }
  return sortByPopularity(matches);
}
