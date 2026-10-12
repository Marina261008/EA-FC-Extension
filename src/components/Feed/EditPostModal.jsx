import React, { useState } from 'react';
import { X, Edit3, Trash2, Camera, Image as ImageIcon, Upload, Check } from 'lucide-react';
import { PRESET_CATEGORIES, PRESET_POST_IMAGES } from '../../data/presetImages';
import { POST_TAG_OPTIONS, POST_TITLE_OPTIONS } from '../../data/dropdownPresets';

export default function EditPostModal({ isOpen, onClose, post, onSavePost, onDeletePost }) {
  if (!isOpen || !post) return null;

  const [text, setText] = useState(post.text || '');
  const [date, setDate] = useState(post.date || '');
  const [tag, setTag] = useState(post.graphic?.tag || POST_TAG_OPTIONS[0]);
  const [title, setTitle] = useState(post.graphic?.title || POST_TITLE_OPTIONS[0]);
  const [subtitle, setSubtitle] = useState(post.graphic?.subtitle || '');
  const [imageUrl, setImageUrl] = useState(post.graphic?.image || PRESET_POST_IMAGES[0].url);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all'
    ? PRESET_POST_IMAGES
    : PRESET_POST_IMAGES.filter(img => img.category === activeCategory);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...post,
      text,
      date,
      graphic: {
        ...post.graphic,
        tag,
        title,
        subtitle,
        image: imageUrl
      }
    };
    onSavePost(updatedPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101724] border border-[#22314a] rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162030] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#1c273a] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#00ff87] flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Editar Comunicado Oficial</h2>
            <p className="text-xs text-slate-400">Modifica el texto, fecha o cartel con menús desplegables</p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Texto del Comunicado</label>
              <textarea
                rows="3"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#00ff87]"
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fecha</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Etiqueta Superior (Pill)</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
              >
                {POST_TAG_OPTIONS.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Título del Cartel</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#00ff87]"
              >
                {POST_TITLE_OPTIONS.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Subtítulo / Detalles</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#162234] border border-[#25364f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff87]"
              placeholder="LD · 80 OVR · 24,6 M €"
            />
          </div>

          {/* Preset Images Gallery */}
          <div className="bg-[#0b1019] border border-[#1d293d] rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-slate-200 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#00ff87]" />
                <span>Cambiar a Imagen Predeterminada</span>
              </label>
              <label className="flex items-center gap-1.5 bg-[#172336] hover:bg-[#202e47] text-slate-200 hover:text-white px-3 py-1.5 rounded-xl border border-[#263750] cursor-pointer text-[11px] font-semibold transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#00ff87]" />
                <span>Subir desde mi PC</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeCategory === cat.id
                      ? 'bg-[#00ff87] text-[#080d14]'
                      : 'bg-[#151f30] text-slate-300 hover:bg-[#1c2940]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {filteredImages.map((img) => {
                const isSelected = imageUrl === img.url;
                return (
                  <div
                    key={img.id}
                    onClick={() => setImageUrl(img.url)}
                    className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video bg-[#131b29] ${
                      isSelected
                        ? 'border-[#00ff87] shadow-lg shadow-[#00ff87]/25 scale-[1.02]'
                        : 'border-[#1f2c42] hover:border-slate-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                      <p className="text-[10px] font-bold text-white truncate">{img.title}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#00ff87] text-black flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="O pega una URL..."
                className="w-full bg-[#131b29] border border-[#233148] rounded-xl px-3 py-1.5 text-slate-300 text-[11px] focus:outline-none focus:border-[#00ff87]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1c273a] shrink-0">
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Eliminar este comunicado oficial?')) {
                  onDeletePost(post.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:bg-[#162030] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#00ff87] hover:bg-[#00e676] text-[#090d14] font-bold shadow-sm transition-all"
              >
                Guardar Cambios
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
