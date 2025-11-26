import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/AddressAutocomplete.css";

export default function AddressAutocomplete({
  value,
  onChange,
  onPick,
  placeholder = "Dirección",
  required = false,
  country = "AR",
  label,
}) {
  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
  const [q, setQ] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const boxRef = useRef(null);

  useEffect(() => setQ(value || ""), [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const debouncedFetch = useMemo(() => {
    let t;
    return (query) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        if (!GEOAPIFY_KEY) return; // sin token, no se busca
        const trimmed = (query || "").trim();
        if (trimmed.length < 3) { setItems([]); return; }
        setLoading(true); setErr("");
        try {
          const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(trimmed)}&limit=6&lang=es&filter=countrycode:${country.toLowerCase()}&apiKey=${GEOAPIFY_KEY}`;
          const r = await fetch(url);
          if (!r.ok) throw new Error("geocoding error");
          const data = await r.json();
          const features = Array.isArray(data.features) ? data.features : [];
          const feats = features.map(f => ({
            id: f.properties.place_id || f.properties.datasource?.raw?.osm_id || `${f.properties.lat},${f.properties.lon}`,
            text: f.properties.formatted,
            lat: f.properties.lat ?? f.geometry?.coordinates?.[1],
            lng: f.properties.lon ?? f.geometry?.coordinates?.[0],
            placeId: f.properties.place_id,
          }));
          setItems(feats);
          setOpen(true);
        } catch (e) {
          setErr("No se pudo autocompletar");
          setItems([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    };
  }, [GEOAPIFY_KEY, country]);

  const handleInput = (e) => {
    const v = e.target.value;
    setQ(v);
    onChange && onChange(v);
    debouncedFetch(v);
  };

  const pick = (text, meta) => {
    onChange && onChange(text);
    setQ(text);
    setOpen(false);
    if (onPick) {
      onPick({
        formattedAddress: text,
        lat: meta?.lat,
        lng: meta?.lng,
        provider: 'geoapify',
        placeId: meta?.placeId || meta?.id || '',
      });
    }
  };

  const noToken = !GEOAPIFY_KEY;

  return (
    <div className="addr-autocomplete" ref={boxRef}>
      {label && <label className="addr-label">{label}</label>}
      <input
        value={q}
        onChange={handleInput}
        placeholder={placeholder}
        required={required}
        onFocus={() => { if (!noToken) setOpen(true); }}
      />
      {noToken && (
        <div className="addr-hint">Configurá VITE_GEOAPIFY_KEY para autocompletar</div>
      )}
      {open && items.length > 0 && (
        <ul className="addr-menu" role="listbox">
          {items.map(it => (
            <li key={it.id} role="option" onClick={() => pick(it.text, it)}>{it.text}</li>
          ))}
        </ul>
      )}
      {loading && <div className="addr-loading">Buscando…</div>}
      {err && <div className="addr-error">{err}</div>}
    </div>
  );
}
