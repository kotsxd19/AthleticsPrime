// src/components/products/ImageUploader.jsx
import { useState, useRef } from 'react';

const MAX = 15;

export default function ImageUploader() {
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    const remaining = MAX - images.length;
    if (remaining <= 0) { alert(`Solo puedes subir hasta ${MAX} imágenes.`); return; }
    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const remove = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      {/* Drop area — se oculta cuando hay imágenes */}
      {images.length === 0 ? (
        <label
          className={`drop-area block ${dragging ? 'dragover' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <i className="fa-solid fa-cloud-arrow-up" />
          </div>
          <p className="text-sm font-medium text-slate-700">Arrastra imágenes o haz clic para subir</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG o WEBP · máx. {MAX} imágenes · 5MB c/u</p>
        </label>
      ) : (
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {images.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
            {images.length < MAX && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition">
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
                <i className="fa-solid fa-plus text-slate-300 text-lg" />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{images.length} / {MAX} imágenes</p>
        </div>
      )}
    </div>
  );
}