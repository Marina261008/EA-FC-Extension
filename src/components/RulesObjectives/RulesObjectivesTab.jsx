import React, { useState } from 'react';
import { 
  Plus, 
  CheckSquare, 
  ShieldCheck, 
  Circle, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';

export default function RulesObjectivesTab({
  season,
  onToggleObjective,
  onAddObjective,
  onDeleteObjective,
  onAddRule,
  onDeleteRule
}) {
  const objectives = season.objectives || [];
  const rules = season.rules || [];

  const [newObjTitle, setNewObjTitle] = useState('');
  const [newObjDesc, setNewObjDesc] = useState('');
  const [newObjCategory, setNewObjCategory] = useState('Éxito nacional');
  const [newObjPriority, setNewObjPriority] = useState('Alta');
  const [showAddObj, setShowAddObj] = useState(false);

  const [newRuleText, setNewRuleText] = useState('');
  const [showAddRule, setShowAddRule] = useState(false);

  const completedCount = objectives.filter(o => o.completed).length;
  const progressPercent = objectives.length > 0 ? Math.round((completedCount / objectives.length) * 100) : 0;

  const rulePresets = [
    "Tope salarial estricto: ningún jugador puede cobrar más de 100.000 €/semana.",
    "Realismo de ventas: si llega un grande de Europa con oferta millonaria, aceptar.",
    "Regla de Cantera: promocionar y dar minutos a 2 canteranos por temporada.",
    "Sin reintentos: jugar todos los partidos sin reiniciar bajo ningún concepto.",
    "Fichajes limitados: máximo 3 fichajes de campo por temporada."
  ];

  const handleCreateObj = (e) => {
    e.preventDefault();
    if (!newObjTitle) return;
    onAddObjective({
      id: `obj-${Date.now()}`,
      title: newObjTitle,
      description: newObjDesc,
      category: newObjCategory,
      priority: newObjPriority,
      deadline: 'Fin de temporada',
      completed: false
    });
    setNewObjTitle('');
    setNewObjDesc('');
    setShowAddObj(false);
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRuleText) return;
    onAddRule({
      id: `rule-${Date.now()}`,
      text: newRuleText,
      strict: true
    });
    setNewRuleText('');
    setShowAddRule(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar & Board Approval */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
            <span>Objetivos de la Directiva y Reglas de Carrera</span>
          </h2>
          <p className="text-xs text-slate-400">
            Define las exigencias del club y las normas autoimpuestas para una experiencia ultra realista
          </p>
        </div>

        {/* Board Confidence meter */}
        <div className="bg-[#151f30] px-4 py-2.5 rounded-xl border border-[#23334d] flex items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Confianza de Directiva</span>
            <span className="text-sm font-black text-[#00ff87]">{progressPercent}% Cumplido</span>
          </div>
          <div className="w-24 bg-[#1e2b40] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#00ff87] h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Objectives Section */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🎯 Objetivos de la Directiva ({completedCount}/{objectives.length})</span>
            </h3>
            <button
              onClick={() => setShowAddObj(!showAddObj)}
              className="text-xs font-bold text-[#00ff87] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Objetivo</span>
            </button>
          </div>

          {/* Form to add objective */}
          {showAddObj && (
            <form onSubmit={handleCreateObj} className="bg-[#141d2c] p-3.5 rounded-xl border border-[#23334d] space-y-2.5 text-xs animate-in fade-in">
              <input
                type="text"
                placeholder="Título del objetivo (ej. Clasificar a Champions)..."
                required
                value={newObjTitle}
                onChange={(e) => setNewObjTitle(e.target.value)}
                className="w-full bg-[#1a2538] border border-[#293c59] rounded-lg px-2.5 py-1.5 text-white"
              />
              <textarea
                placeholder="Descripción detallada de la meta..."
                rows="2"
                value={newObjDesc}
                onChange={(e) => setNewObjDesc(e.target.value)}
                className="w-full bg-[#1a2538] border border-[#293c59] rounded-lg px-2.5 py-1.5 text-white"
              ></textarea>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newObjCategory}
                  onChange={(e) => setNewObjCategory(e.target.value)}
                  className="bg-[#1a2538] border border-[#293c59] rounded-lg px-2 py-1 text-white"
                >
                  <option value="Éxito nacional">Éxito nacional</option>
                  <option value="Éxito continental">Éxito continental</option>
                  <option value="Difusión de marca">Difusión de marca</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Fuerzas básicas">Fuerzas básicas</option>
                </select>
                <select
                  value={newObjPriority}
                  onChange={(e) => setNewObjPriority(e.target.value)}
                  className="bg-[#1a2538] border border-[#293c59] rounded-lg px-2 py-1 text-white"
                >
                  <option value="Crítica">Crítica</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddObj(false)}
                  className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-[#00ff87] text-[#090d14] font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}

          {/* List of objectives */}
          <div className="space-y-2.5">
            {objectives.map((obj) => (
              <div
                key={obj.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 group ${
                  obj.completed 
                    ? 'bg-[#0b171c]/70 border-emerald-500/30 text-slate-300' 
                    : 'bg-[#141d2c] border-[#223049] hover:border-[#304364] text-slate-200'
                }`}
              >
                <div 
                  className="flex items-start gap-3 cursor-pointer flex-1"
                  onClick={() => onToggleObjective(obj.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    {obj.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-xs ${obj.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {obj.title}
                      </p>
                      {obj.priority && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          obj.priority === 'Crítica' ? 'bg-red-500/20 text-red-400' :
                          obj.priority === 'Alta' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {obj.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {obj.description}
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      Categoría: {obj.category} · Plazo: {obj.deadline || 'Temporada'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteObjective(obj.id)}
                  className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar objetivo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-[#101724] border border-[#1e2a3f] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#182335]">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <span>🛡️ Reglas y Retos del Modo Carrera</span>
            </h3>
            <button
              onClick={() => setShowAddRule(!showAddRule)}
              className="text-xs font-bold text-[#00ff87] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Regla</span>
            </button>
          </div>

          {/* Form to add rule */}
          {showAddRule && (
            <form onSubmit={handleCreateRule} className="bg-[#141d2c] p-3.5 rounded-xl border border-[#23334d] space-y-2.5 text-xs animate-in fade-in">
              <textarea
                placeholder="Escribe la regla o restricción que seguirás..."
                rows="2"
                required
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                className="w-full bg-[#1a2538] border border-[#293c59] rounded-lg px-2.5 py-1.5 text-white"
              ></textarea>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddRule(false)}
                  className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-[#00ff87] text-[#090d14] font-bold"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          )}

          {/* Quick presets */}
          <div className="bg-[#141d2c] p-3 rounded-xl border border-[#202d42]">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00ff87]" />
              <span>Ideas de Reglas Realistas (Click para añadir)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {rulePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddRule({ id: `rule-p-${Date.now()}-${idx}`, text: preset, strict: true })}
                  className="text-[10px] text-slate-300 hover:text-[#00ff87] bg-[#1a2538] hover:bg-[#202e47] px-2 py-1 rounded-lg border border-[#293c59] text-left transition-colors"
                >
                  + {preset.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* List of rules */}
          <div className="space-y-2.5">
            {rules.map((rule, idx) => (
              <div
                key={rule.id || idx}
                className="p-3.5 rounded-xl bg-[#141d2c] border border-[#223049] flex items-start justify-between gap-2.5 text-xs text-slate-300 group"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium leading-relaxed">
                    {rule.text}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteRule(rule.id || idx)}
                  className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar regla"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
