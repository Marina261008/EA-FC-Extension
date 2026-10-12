import React, { useState } from 'react';
import { X, Sparkles, Trophy, Plus, Shield } from 'lucide-react';
import { POPULAR_CLUBS } from '../../mockData';

export default function NewCareerModal({ isOpen, onClose, onSaveCareer }) {
  if (!isOpen) return null;

  const [gameVersion, setGameVersion] = useState('EA FC26');
  const [managerName, setManagerName] = useState('Nuevo Mánager');
  const [nationality, setNationality] = useState('🇪🇸 España');
  const [selectedClub, setSelectedClub] = useState(POPULAR_CLUBS[0]);
  const [customClub, setCustomClub] = useState('');
  const [customLeague, setCustomLeague] = useState('');
  const [customLogo, setCustomLogo] = useState('');
  const [isCustomClub, setIsCustomClub] = useState(false);
  const [budget, setBudget] = useState(40000000);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

  const handleSubmit = (e) => {
    e.preventDefault();

    const club = isCustomClub ? (customClub || 'Mi Club') : selectedClub.name;
    const league = isCustomClub ? (customLeague || 'Liga Personalizada') : selectedClub.league;
    const clubLogo = isCustomClub ? customLogo : selectedClub.logo;

    const period = gameVersion === 'EA FC26' ? '2025/26' : '2026/27';
    const startDate = gameVersion === 'EA FC26' ? '01 jul 2025' : '01 jul 2026';

    const newCareer = {
      id: `career-${Date.now()}`,
      gameVersion,
      manager: {
        name: managerName,
        avatar,
        nationality,
        age: 38,
        club,
        clubLogo,
        league,
        startDate,
        currentDate: startDate,
        wage: "50.000 €/sem",
        reputation: "4.0 / 5.0",
        bio: `Inicio del proyecto deportivo con el ${club} en ${gameVersion}.`
      },
      seasons: [
        {
          id: `season-1-${Date.now()}`,
          name: "Temporada 1",
          period,
          status: "En curso",
          budget: {
            transfer: Number(budget),
            wageWeekly: Math.round(Number(budget) * 0.01),
            initialTransfer: Number(budget)
          },
          stats: {
            position: "—",
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0
          },
          transfersIn: [],
          transfersOut: [],
          objectives: [
            {
              id: `obj-init-1`,
              title: "Clasificación Europea",
              description: `Terminar en posiciones europeas en ${league}.`,
              category: "Éxito nacional",
              priority: "Alta",
              deadline: "Final de temporada",
              completed: false
            }
          ],
          rules: [
            {
              id: `rule-init-1`,
              text: "Modo carrera realista: no gastar más de lo ingresado en ventas.",
              strict: true
            }
          ],
          squad: [
            {
              id: `sq-init-1`,
              name: "Capitán del Club",
              position: "MC",
              category: "MED",
              number: 10,
              age: 26,
              country: "España",
              flag: "🇪🇸",
              rating: 80,
              potential: 83,
              value: "25 M €",
              wage: "45.000 €/sem",
              contract: "2029",
              matches: 0,
              goals: 0,
              assists: 0,
              cleanSheets: 0,
              yellowCards: 0,
              redCards: 0,
              avgRating: 0.0,
              status: "Titular",
              morale: "Excelente"
            }
          ],
          matches: [],
          standings: [
            { pos: 1, team: club, pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0, dg: 0, pts: 0, zone: "champions", isUser: true },
            { pos: 2, team: "Rival Directo", pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0, dg: 0, pts: 0, zone: "champions" }
          ],
          youthAcademy: [],
          moments: [
            {
              id: `mom-init-1`,
              title: `Presentación en el ${club}`,
              date: startDate,
              type: "Institucional",
              badge: "Firma de Contrato",
              description: `${managerName} es presentado oficialmente ante la afición y la prensa.`,
              mediaUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
            }
          ]
        }
      ]
    };

    onSaveCareer(newCareer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1c273a]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff87] to-cyan-400 flex items-center justify-center text-[#090d14]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Crear Nuevo Modo Carrera</h2>
            <p className="text-xs text-slate-400">Configura tu club, mánager y versión del juego (EA FC 26 o 27)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Game Version Toggle */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Versión del Juego</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGameVersion('EA FC26')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                  gameVersion === 'EA FC26'
                    ? 'bg-[#00ff87] text-[#090d14] border-[#00ff87] shadow-lg shadow-[#00ff87]/20'
                    : 'bg-[#151f30] text-slate-300 border-[#23334d]'
                }`}
              >
                <span>EA Sports FC 26</span>
              </button>

              <button
                type="button"
                onClick={() => setGameVersion('EA FC27')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                  gameVersion === 'EA FC27'
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                    : 'bg-[#151f30] text-slate-300 border-[#23334d]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>EA Sports FC 27</span>
              </button>
            </div>
          </div>

          {/* Manager Name & Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nombre del Entrenador</label>
              <input
                type="text"
                required
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="Carlos Corberán, Tu Nombre..."
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nacionalidad</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
                placeholder="🇪🇸 España, 🇦🇷 Argentina..."
              />
            </div>
          </div>

          {/* Club Selector: Predefined vs Custom */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Seleccionar Club</label>
              <button
                type="button"
                onClick={() => setIsCustomClub(!isCustomClub)}
                className="text-emerald-400 font-bold hover:underline"
              >
                {isCustomClub ? 'Elegir club popular' : 'Escribir club personalizado'}
              </button>
            </div>

            {isCustomClub ? (
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre de tu club (ej. Real Betis, Boca Juniors...)"
                  value={customClub}
                  onChange={(e) => setCustomClub(e.target.value)}
                  className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Liga / Competición (ej. LALIGA, Premier League...)"
                  value={customLeague}
                  onChange={(e) => setCustomLeague(e.target.value)}
                  className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-[#141d2c] rounded-xl border border-[#23334d]">
                {POPULAR_CLUBS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedClub(c)}
                    className={`p-2 rounded-lg text-left flex items-center gap-2 border transition-all ${
                      selectedClub.name === c.name
                        ? 'bg-[#00ff87]/15 border-[#00ff87] text-[#00ff87]'
                        : 'bg-[#182335] border-transparent text-slate-300 hover:bg-[#1e2c44]'
                    }`}
                  >
                    <img src={c.logo} alt="" className="w-4 h-4 object-contain shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span className="truncate text-xs font-semibold">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Presupuesto Inicial de Fichajes (€)</label>
            <input
              type="number"
              step="1000000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
            />
            <p className="text-[10px] text-slate-500 mt-1">{(budget / 1000000).toFixed(0)} Millones de Euros disponibles</p>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Foto o Avatar del Entrenador (URL)</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1c273a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#162030] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold shadow-lg shadow-[#00ff87]/20 transition-all"
            >
              Iniciar Carrera
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
