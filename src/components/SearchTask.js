import { useState, useRef, useCallback } from 'react';
import { TextInput, Button } from '@mantine/core';
import { haversineDistance } from '../utils/distance';

const LOCATIONIQ_KEY = 'pk.ac3136f711de1f35b7bf4fa2079f2f57'; //locationiq.com API-Key

// origin: { lat, lon } – fester Ausgangspunkt (z. B. Hochschule)
// condition: 'popularity' | 'distance'
// places: Array der geladenen Orte
// onComplete: Callback, der die gemessene Zeit + Metadaten übergibt
export default function SearchTask({ origin, condition, taskLabel, onComplete }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const startTimeRef = useRef(null); // Zeitpunkt des ersten Tastendrucks
  const keystrokeCountRef = useRef(0);
  const debounceRef = useRef(null);
  const latestQueryRef = useRef('');

  const fetchSuggestions = useCallback(
    async (text) => {
      if (text.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      // WICHTIG: /search statt /autocomplete verwenden – nur /search liefert
      // das explizite "importance"-Feld in der Antwort mit zurück.
      const url = new URL('https://api.locationiq.com/v1/search');
      url.searchParams.set('key', LOCATIONIQ_KEY);
      url.searchParams.set('q', text);
      url.searchParams.set('format', 'json');
      url.searchParams.set('countrycodes', 'de');
      url.searchParams.set('limit', '10');
      url.searchParams.set('dedupe', '1');
      // Grober Bereich um den Ausgangspunkt, um Ergebnisse sinnvoll einzugrenzen
      url.searchParams.set(
        'viewbox',
        `${origin.lon - 0.5},${origin.lat + 0.5},${origin.lon + 0.5},${origin.lat - 0.5}`
      );

      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();

      // Stale Responses ignorieren (falls Nutzer inzwischen weitergetippt hat)
      if (text !== latestQueryRef.current) return;

      const places = data.map((r) => ({
        id: r.place_id,
        name: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        importance: parseFloat(r.importance ?? 0),
      }));

      const sorted =
        condition === 'distance'
          ? [...places].sort(
              (a, b) =>
                haversineDistance(origin.lat, origin.lon, a.lat, a.lon) -
                haversineDistance(origin.lat, origin.lon, b.lat, b.lon)
            )
          : [...places].sort((a, b) => b.importance - a.importance);

      setSuggestions(sorted);
    },
    [condition, origin]
  );

  function handleChange(e) {
    const value = e.target.value;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    keystrokeCountRef.current += 1;

    setQuery(value);
    latestQueryRef.current = value;

    // Debounce: erst 300ms nach letztem Tastendruck anfragen
    // (schont Rate-Limit und vermeidet Anfragen bei jedem einzelnen Buchstaben)
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  }

  function handleSelect(place) {
    const elapsedMs = performance.now() - startTimeRef.current;
    setQuery(place.name);
    setSuggestions([]);
    onComplete({
      taskLabel,
      condition,
      selectedPlaceName: place.name,
      elapsedMs: Math.round(elapsedMs),
      keystrokes: keystrokeCountRef.current,
      candidateCount: suggestions.length,
    });
  }

  return (
    <>
      <TextInput
        w="100%"
        h={50}
        value={query}
        onChange={handleChange}
        placeholder="Musterstraße 1a, 12345 Musterstadt, Musterland"
        name="destination-search"
        inputMode="text"
        type='search'
        autoComplete="off"
        data-lpignore="true"       
        data-1p-ignore="true"       
        data-form-type="other" 
        styles={{
          input: {
            borderRadius: 0,
          },
        }}
      />

      {suggestions.length > 0 && (
        <ul key={query} style={{ width: "100%", listStyle: 'none', padding: 0, marginTop:"-30px" }}>
          {suggestions.slice(0, 8).map((place) => (
            <li key={place.id}>
              <Button
                w="100%"
                h={50}
                variant='default'
                onClick={() => handleSelect(place)}
                styles={{
                  root: {
                    borderRadius: 0,
                  },
                  inner: {
                    justifyContent: "flex-start",
                  },
                }}
              >
                {place.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
