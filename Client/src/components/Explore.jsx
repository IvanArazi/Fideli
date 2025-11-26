import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";

export default function Explore() {
  const API_URL = import.meta.env.VITE_API_URL;
  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY; // requerido para geocodificar
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let canceled = false;

    const ensureLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) return resolve(window.L);
        // CDN ya inyectado en index.html; esperar a que esté
        const interval = setInterval(() => {
          if (window.L) {
            clearInterval(interval);
            resolve(window.L);
          }
        }, 50);
      });
    };

    const load = async () => {
      try {
        const L = await ensureLeaflet();
        if (canceled) return;

        mapObjRef.current = L.map(mapRef.current, {
          center: [-34.6037, -58.3816], // CABA por defecto
          zoom: 12,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapObjRef.current);

        const res = await fetch(`${API_URL}/api/brands/approved`);
        const brands = await res.json();

        const cacheKey = "geoCache_v1";
        const geoCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");

        const geocode = async (text) => {
          const key = text.trim().toLowerCase();
          if (geoCache[key]) return geoCache[key];
          if (!GEOAPIFY_KEY) throw new Error("Sin token de geocodificación");
          const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&limit=1&lang=es&apiKey=${GEOAPIFY_KEY}`;
          const r = await fetch(url);
          if (!r.ok) throw new Error("Geocoding error");
          const g = await r.json();
          const feat = Array.isArray(g.features) ? g.features[0] : null;
          if (!feat) throw new Error("Dirección no encontrada");
          const [lng, lat] = feat.geometry?.coordinates || [];
          if (typeof lat !== 'number' || typeof lng !== 'number') throw new Error("Coordenadas inválidas");
          const data = { lat, lng, formatted: feat.properties?.formatted };
          geoCache[key] = data;
          localStorage.setItem(cacheKey, JSON.stringify(geoCache));
          return data;
        };

        const markers = [];
        for (const b of Array.isArray(brands) ? brands : []) {
          const hasLocations = Array.isArray(b.locations) && b.locations.length > 0;
          if (hasLocations) {
            for (const loc of b.locations) {
              try {
                const lat = Number(loc.lat), lng = Number(loc.lng);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
                const img = b.profileImage ? `${API_URL}${b.profileImage}` : "/default-profile.png";
                const html = `
                  <div class="brand-popup">
                    <img src="${img}" alt="${b.name}" />
                    <div>
                      <strong>${b.name}</strong>
                      <button class="goto-btn" data-id="${b._id}">Ver comercio</button>
                    </div>
                  </div>`;
                const m = L.marker([lat, lng], {
                  icon: L.divIcon({
                    className: "brand-marker",
                    html: `<div class="brand-marker-img" style="background-image:url('${img}')"></div>`,
                    iconSize: [44, 44],
                    iconAnchor: [22, 44],
                  }),
                })
                  .addTo(mapObjRef.current)
                  .bindPopup(html);
                m.on("popupopen", () => {
                  const btn = document.querySelector(".leaflet-popup .goto-btn");
                  if (btn) btn.onclick = () => navigate(`/brand/${b._id}`);
                });
                markers.push(m);
                markersRef.current.push(m);
              } catch {}
            }
            continue;
          }
          // Fallback: geocodificar direcciones de texto si no hay locations persistidas
          const addresses = (Array.isArray(b.addresses)
            ? b.addresses
            : b.address
            ? [b.address]
            : [])
            .map(a => (a || "").trim())
            .filter(Boolean);
          for (const addr of addresses) {
            try {
              const { lat, lng } = await geocode(addr);
              const img = b.profileImage ? `${API_URL}${b.profileImage}` : "/default-profile.png";
              const html = `
                <div class="brand-popup">
                  <img src="${img}" alt="${b.name}" />
                  <div>
                    <strong>${b.name}</strong>
                    <button class="goto-btn" data-id="${b._id}">Ver comercio</button>
                  </div>
                </div>`;
              const m = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: "brand-marker",
                  html: `<div class="brand-marker-img" style="background-image:url('${img}')"></div>`,
                  iconSize: [44, 44],
                  iconAnchor: [22, 44],
                }),
              })
                .addTo(mapObjRef.current)
                .bindPopup(html);
              m.on("popupopen", () => {
                const btn = document.querySelector(".leaflet-popup .goto-btn");
                if (btn) btn.onclick = () => navigate(`/brand/${b._id}`);
              });
              markers.push(m);
              markersRef.current.push(m);
            } catch (_) {
              // ignorar direcciones inválidas
            }
          }
        }

        if (markers.length) {
          const group = L.featureGroup(markers);
          mapObjRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
        }
      } catch (e) {
        if (GEOAPIFY_KEY) setError("No se pudo cargar el mapa o geocodificar direcciones");
        else setError("Falta configurar VITE_GEOAPIFY_KEY para geocodificar");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();
    return () => {
      canceled = true;
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  // Actualización periódica para reflejar altas/bajas/ediciones
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        if (!mapObjRef.current) return;
        const res = await fetch(`${API_URL}/api/brands/approved`);
        const brands = await res.json();
        // limpiar marcadores anteriores
        if (markersRef.current?.length) {
          for (const m of markersRef.current) {
            try { mapObjRef.current.removeLayer(m); } catch {}
          }
          markersRef.current = [];
        }
        const L = window.L;
        const newMarkers = [];
        for (const b of Array.isArray(brands) ? brands : []) {
          const locs = Array.isArray(b.locations) ? b.locations : [];
          for (const loc of locs) {
            const lat = Number(loc.lat), lng = Number(loc.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
            const img = b.profileImage ? `${API_URL}${b.profileImage}` : "/default-profile.png";
            const html = `<div class=\"brand-popup\"><img src=\"${img}\" alt=\"${b.name}\" /><div><strong>${b.name}</strong><button class=\"goto-btn\" data-id=\"${b._id}\">Ver comercio</button></div></div>`;
            const m = L.marker([lat, lng], { icon: L.divIcon({ className: 'brand-marker', html: `<div class=\"brand-marker-img\" style=\"background-image:url('${img}')\"></div>`, iconSize: [44,44], iconAnchor:[22,44] })})
              .addTo(mapObjRef.current)
              .bindPopup(html);
            m.on('popupopen', () => {
              const btn = document.querySelector('.leaflet-popup .goto-btn');
              if (btn) btn.onclick = () => navigate(`/brand/${b._id}`);
            });
            newMarkers.push(m);
          }
        }
        markersRef.current = newMarkers;
      } catch {}
    }, 30000); // cada 30s
    return () => clearInterval(id);
  }, [API_URL, navigate]);

  return (
    <div className="explore-map-page">
      <div className="map-header">
        <h2>Explorar Comercios</h2>
        {error && <span className="map-error">{error}</span>}
      </div>
      <div ref={mapRef} id="explore-map" aria-label="Mapa de comercios" />
      {loading && <div className="map-loading">Cargando mapa…</div>}
    </div>
  );
}
