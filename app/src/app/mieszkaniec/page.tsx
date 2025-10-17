"use client";
import { useState } from "react";

type Inputs = {
  m3: number;
  cenaM3: number;
  miasto: string;
  Tzimna: number;
  Tzadana: number;
};

export default function Mieszkaniec() {
  const [inp, setInp] = useState<Inputs>({
    m3: 3,
    cenaM3: 35,
    miasto: "Kraków",
    Tzimna: 8,
    Tzadana: 55,
  });

  const [wynik, setWynik] = useState<{ koszt: number; straty: number } | null>(null);

  const policz = () => {
    const koszt = round(inp.m3 * inp.cenaM3, 2);
    const straty = round(koszt * 0.1, 2);
    setWynik({ koszt, straty });
  };

  const onChange = (name: keyof Inputs, value: string) => {
    const parsed = name === "miasto" ? value : Number(value.replace(",", "."));
    setInp((p) => ({ ...p, [name]: parsed }));
  };

  const miastoPresets: Record<string, number> = {
    "Kraków": 8, "Warszawa": 7, "Gdańsk": 9, "Wrocław": 8, "Poznań": 8,
  };

  const applyMiasto = (m: string) => {
    onChange("miasto", m);
    setInp((p) => ({ ...p, Tzimna: miastoPresets[m] ?? p.Tzimna }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Panel mieszkańca – kalkulator CWU</h1>
        <p className="text-sm text-gray-500 mt-1">MVP: policz koszt podgrzania CWU z rachunku.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-medium">Wejścia</h2>

            <label className="block text-sm mb-1">Miasto (presety Tzimnej)</label>
            <select
              className="w-full rounded-xl border p-2 mb-3"
              value={inp.miasto}
              onChange={(e) => applyMiasto(e.target.value)}
            >
              {Object.keys(miastoPresets).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Zużycie CWU [m³/mies.]</label>
                <input
                  type="number" step="0.01"
                  className="w-full rounded-xl border p-2"
                  value={inp.m3}
                  onChange={(e) => onChange("m3", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Cena podgrzania 1 m³ [zł/m³]</label>
                <input
                  type="number" step="0.01"
                  className="w-full rounded-xl border p-2"
                  value={inp.cenaM3}
                  onChange={(e) => onChange("cenaM3", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-sm mb-1">Tzimna [°C]</label>
                <input
                  type="number" step="1"
                  className="w-full rounded-xl border p-2"
                  value={inp.Tzimna}
                  onChange={(e) => onChange("Tzimna", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tzadana CWU [°C]</label>
                <input
                  type="number" step="1"
                  className="w-full rounded-xl border p-2"
                  value={inp.Tzadana}
                  onChange={(e) => onChange("Tzadana", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={policz}
              className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Oblicz
            </button>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-medium">Wynik</h2>
            {!wynik ? (
              <p className="text-sm text-gray-500">Uzupełnij dane i kliknij „Oblicz”.</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between border-b py-1">
                  <span>Koszt podgrzania</span>
                  <span className="font-semibold">{wynik.koszt.toFixed(2)} zł / mies.</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>Szac. straty (placeholder)</span>
                  <span className="font-semibold">{wynik.straty.toFixed(2)} zł / mies.</span>
                </div>
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-amber-800 text-sm">
                  <b>Wskazówka:</b> obniżenie Tzadanej do 50 °C i perlator 6 l/min
                  zwykle dają ~5–15% oszczędności.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function round(v: number, d = 2) {
  const p = Math.pow(10, d);
  return Math.round(v * p) / p;
}
