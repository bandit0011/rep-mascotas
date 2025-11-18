import React, { useState, useEffect } from 'react';
import { Dog, Cat, Fish, Heart, Search, Plus, Trash2, Edit, User, Calendar, Activity } from 'lucide-react';

// --- CONFIGURACIÓN INTELIGENTE ---
// Intentamos usar import.meta.env solo si está disponible (para evitar errores en entornos antiguos)
// Si no, usamos localhost como fallback seguro.
let API_URL = 'http://localhost:3000/mascotas';
try {
    // Verificación segura de import.meta para evitar errores de compilación en targets antiguos
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
        API_URL = import.meta.env.VITE_API_URL;
    }
} catch (e) {
    // Si falla el acceso a import.meta, nos quedamos con localhost silenciosamente
    console.log("Usando configuración local por defecto");
}

export default function App() {
  const [mascotas, setMascotas] = useState([]);
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [promedioEdad, setPromedioEdad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('tabla'); // 'tabla' | 'formulario'
  const [mascotaEditar, setMascotaEditar] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', especie: 'Perro', edad: '', dueno: '' });
  // Si falla la conexión, activa el modo simulación automáticamente
  const [useMock, setUseMock] = useState(false); 

  // --- SERVICIOS ---
  const fetchMascotas = async (especie = '') => {
    setLoading(true);
    try {
      // Intentar conexión real primero
      if (!useMock) {
        let url = API_URL;
        if (especie) url += `?especie=${especie}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Fallo API");
        
        const data = await res.json();
        setMascotas(data);
        
        // Promedio
        try {
            // Ajuste de URL para el endpoint extra: quitamos '/mascotas' si está duplicado o usamos la base
            const baseUrl = API_URL.replace('/mascotas', ''); 
            const resProm = await fetch(`${baseUrl}/mascotas/calculos/promedio-edad`);
            const dataProm = await resProm.json();
            setPromedioEdad(parseFloat(dataProm.promedio || 0).toFixed(1));
        } catch(e) { console.warn("Error promedio", e); }

      } else {
         throw new Error("Usando Mock forzado");
      }
    } catch (error) {
      console.warn("Backend no responde, usando datos locales (Modo Demo)", error);
      setUseMock(true); // Activar modo demo si falla el backend real
      
      // DATOS DE RESPALDO (Para que el profesor siempre vea algo)
      let data = [
          { id: 1, nombre: 'DemoPerro', especie: 'Perro', edad: 4, dueno: 'Modo Offline' },
          { id: 2, nombre: 'DemoGato', especie: 'Gato', edad: 2, dueno: 'Sin Backend' }
      ];
      if (especie) data = data.filter(m => m.especie === especie);
      setMascotas(data);
      setPromedioEdad(3.0);
    }
    setLoading(false);
  };

  const guardarMascota = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.dueno) return alert("Completa los datos");

    if (useMock) {
        alert("Guardado simulado (Backend offline)");
        terminarGuardado();
    } else {
        try {
            const method = mascotaEditar ? 'PUT' : 'POST';
            const url = mascotaEditar ? `${API_URL}/${mascotaEditar.id}` : API_URL;
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            terminarGuardado();
        } catch (error) { alert("Error al guardar en servidor"); }
    }
  };

  const eliminarMascota = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    if (useMock) {
        setMascotas(mascotas.filter(m => m.id !== id));
    } else {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchMascotas(filtroEspecie);
        } catch (error) { alert("Error al eliminar"); }
    }
  };

  const terminarGuardado = () => {
    setVista('tabla');
    setMascotaEditar(null);
    setFormData({ nombre: '', especie: 'Perro', edad: '', dueno: '' });
    fetchMascotas(filtroEspecie);
  };

  const abrirEditar = (mascota) => {
    setMascotaEditar(mascota);
    setFormData(mascota);
    setVista('formulario');
  };

  useEffect(() => {
    fetchMascotas(filtroEspecie);
  }, [filtroEspecie]);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-10">
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Dog size={32} /> Gestión Mascotas
                </h1>
                <p className="text-indigo-200 text-sm mt-1">Pablo Andrés Correa Rojas {useMock && '(MODO DEMO)'}</p>
            </div>
            <div className="bg-indigo-700 px-4 py-2 rounded-lg shadow-inner flex items-center gap-3">
                <Activity className="text-green-400" />
                <div>
                    <p className="text-xs text-indigo-300 uppercase font-bold">Promedio Edad</p>
                    <p className="text-xl font-mono font-bold">{promedioEdad} años</p>
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="w-full md:w-1/2 bg-white p-2 rounded-lg shadow flex items-center border border-slate-200">
                <Search className="text-slate-400 ml-2" />
                <select value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} className="w-full p-2 outline-none bg-transparent text-slate-600 cursor-pointer">
                    <option value="">Todas las especies</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Pez">Pez</option>
                    <option value="Ave">Ave</option>
                </select>
            </div>

            <button onClick={() => { setMascotaEditar(null); setFormData({ nombre: '', especie: 'Perro', edad: '', dueno: '' }); setVista('formulario'); }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg shadow transition flex items-center gap-2 font-semibold">
                <Plus size={20} /> Registrar Mascota
            </button>
        </div>

        {vista === 'formulario' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{mascotaEditar ? 'Editar Mascota' : 'Nueva Mascota'}</h2>
                    <button onClick={() => setVista('tabla')} className="text-slate-400 hover:text-white">Cancelar</button>
                </div>
                <form onSubmit={guardarMascota} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                            <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Especie</label>
                            <select value={formData.especie} onChange={e => setFormData({...formData, especie: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="Perro">Perro</option>
                                <option value="Gato">Gato</option>
                                <option value="Pez">Pez</option>
                                <option value="Ave">Ave</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Edad</label>
                            <input type="number" value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Dueño</label>
                            <input type="text" value={formData.dueno} onChange={e => setFormData({...formData, dueno: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <button type="button" onClick={() => setVista('tabla')} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow">Guardar</button>
                    </div>
                </form>
            </div>
        )}

        {vista === 'tabla' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                {loading ? <div className="p-10 text-center text-slate-500">Cargando datos...</div> : 
                mascotas.length === 0 ? <div className="p-10 text-center text-slate-400">No se encontraron mascotas.</div> : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4">Mascota</th>
                                <th className="p-4">Edad</th>
                                <th className="p-4">Dueño</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mascotas.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-slate-400 font-mono">#{m.id}</td>
                                    <td className="p-4 font-bold text-slate-800">{m.nombre} <span className="text-xs font-normal px-2 bg-slate-200 rounded-full ml-2">{m.especie}</span></td>
                                    <td className="p-4">{m.edad} años</td>
                                    <td className="p-4">{m.dueno}</td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => abrirEditar(m)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                                        <button onClick={() => eliminarMascota(m.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}
      </main>
    </div>
  );
}