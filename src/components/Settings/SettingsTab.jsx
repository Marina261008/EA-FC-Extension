import React from 'react';
import { Settings, RefreshCw, Download, Upload, Shield, Database } from 'lucide-react';
import { exportCareersAsJSON } from '../../storage';

export default function SettingsTab({ 
  careers, 
  onResetData, 
  onImportData 
}) {
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          onImportData(json);
          alert('¡Datos importados con éxito!');
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#00ff87]" />
          <span>Ajustes y Configuración</span>
        </h2>
        <p className="text-xs text-slate-400">
          Gestiona las preferencias de almacenamiento local, copias de seguridad e importación.
        </p>
      </div>

      {/* Backup and restore */}
      <div className="bg-[#101724] border border-[#1e2a3f] p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Copias de Seguridad (Backup & Restore)</span>
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          Toda la información se guarda automáticamente en tu navegador (LocalStorage). Descarga una copia en formato JSON para no perder nunca tus carreras o traspasarlas a otro ordenador.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => exportCareersAsJSON(careers)}
            className="flex items-center gap-2 bg-[#172235] hover:bg-[#202e47] border border-[#273954] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-[#00ff87]" />
            <span>Exportar Todo (Descargar JSON)</span>
          </button>

          <label className="flex items-center gap-2 bg-[#172235] hover:bg-[#202e47] border border-[#273954] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Importar Archivo JSON</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Reset to defaults */}
      <div className="bg-[#101724] border border-red-500/20 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-red-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span>Restablecer Datos de Demostración</span>
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          Si deseas reiniciar la aplicación al estado inicial con la carrera de Carlos Corberán en el Valencia CF tal como se ve en la captura de pantalla oficial, haz clic aquí.
        </p>

        <button
          onClick={() => {
            if (confirm('¿Estás seguro de que quieres reiniciar todos los datos a la carrera demo por defecto?')) {
              onResetData();
            }
          }}
          className="flex items-center gap-2 bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restablecer Carrera Demo (Valencia CF)</span>
        </button>
      </div>

    </div>
  );
}
