// Einmalig lokal ausführen (node fetch-places.js), NICHT im React-Frontend verwenden.
// Baut aus mehreren Suchbegriffen eine places.json im Schema deiner App.

import fs from 'fs';

const SEARCH_TERMS = ['Hauptstraße', 'Schulstraße', 'Bahnhofstraße']; // anpassen
const VIEWBOX = '10.84,51.13,15.15,54.51'; // grober Berlin/Brandenburg-Ausschnitt, anpassen
const USER_AGENT = 'Bachelorarbeit-Nutzerstudie/1.0 (marie.zielke@telekom.de)';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchTerm(term) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    term
  )}&format=json&countrycodes=de&viewbox=${VIEWBOX}&bounded=1&limit=20`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim-Fehler für "${term}": ${res.status}`);
  }

  return res.json();
}

async function main() {
  const allPlaces = [];
  let idCounter = 1;

  for (const term of SEARCH_TERMS) {
    console.log(`Suche: ${term}`);
    const results = await searchTerm(term);

    for (const r of results) {
      allPlaces.push({
        id: `p${idCounter++}`,
        name: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        importance: r.importance ?? 0,
      });
    }

    await sleep(1100); // Nominatim erlaubt max. 1 Request/Sekunde
  }

  fs.writeFileSync('places.json', JSON.stringify(allPlaces, null, 2));
  console.log(`${allPlaces.length} Orte gespeichert in places.json`);
}

main().catch(console.error);