// URL des Google Apps Script Web-App-Deployments (siehe separates Skript)
// Ersetze dies durch deine eigene Webhook-URL.
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbxijqJwcUsWybdPpdBoPLN3rwLV1NYEfMj-NYD87bh9KDaTYwoKb6s6c7IdSgDD4cCnzQ/exec';

export async function submitResults({payload, setStep}) {
  try {
    setStep("loading")
    await fetch(ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' }, // vermeidet CORS-Preflight bei Apps Script
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.error('Fehler beim Übermitteln der Ergebnisse:', err);
    return false;
  }
}
