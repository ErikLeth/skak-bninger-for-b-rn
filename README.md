# ♟️ SkakEventyret

Et sjovt læringsspil på dansk for børn: lær de **5 bedste første træk** for både **hvid og sort** i de **10 mest populære skakåbninger**.

## Sådan kommer du i gang

1. Vælg om du spiller **hvid ⚪** eller **sort ⚫**.
2. Vælg en af de 10 åbninger.
3. Se først de 5 træk blive gennemgået ("👀 Se trækkene"), eller gå direkte til "🎮 Spil selv".
4. Spil selv ved at klikke på en brik og derefter det felt, den skal hen på. Brug 💡 Hint hvis du sidder fast.
5. Optjen op til ⭐⭐⭐ pr. åbning og farve — din fremgang gemmes automatisk i browseren.

## Upload til Netlify

1. Log ind på [netlify.com](https://netlify.com) og vælg **"Add new site" → "Import from Git"** og vælg dette repo — eller vælg "Deploy manually" og træk mappen ind.
2. Færdig! Netlify viser en offentlig adresse, når siden er live.

## Filer

- `index.html` — startsiden (det eneste Netlify behøver at kende)
- `style.css` — udseende
- `chess.js` — lille skakmotor (lovlige træk, slag, rokade)
- `openings.js` — data for de 10 åbninger + børnevenlige forklaringer på dansk
- `game.js` — spillogik, stjerner, lyd og konfetti

Ingen eksterne afhængigheder — virker offline og med det samme på Netlify.
