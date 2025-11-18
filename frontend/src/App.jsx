import React, { useState, useEffect, useMemo } from 'react';
import { Dog, Cat, Fish, Heart, Search, Plus, Trash2, Edit, User, Calendar, Activity } from 'lucide-react';

// --- CONFIGURACIÓN ---
// Poner en FALSE para conectar con el Backend Node.js real (http://localhost:3000)
// Poner en TRUE para probar la interfaz en este entorno sin backend.
const USE_MOCK_DATA = false;
const API_URL = 'http://localhost:3000/mascotas';

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  // Estados
  const [mascotas, setMascotas] = useState([]);
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [promedioEdad, setPromedioEdad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('tabla'); // 'tabla' | 'formulario'
  const [mascotaEditar, setMascotaEditar] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    especie: 'Perro',
    edad: '',
    dueno: ''
  });

  // --- SERVICIOS (API vs MOCK) ---
  const fetchMascotas = async (especie = '') => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // Simulación LocalStorage
        let data = JSON.parse(localStorage.getItem('mascotas_db')) || [
          { id: 1, nombre: 'Firulais', especie: 'Perro', edad: 5, dueno: 'Juan Perez' },
          { id: 2, nombre: 'Michi', especie: 'Gato', edad: 3, dueno: 'Maria Lopez' },
          { id: 3, nombre: 'Nemo', especie: 'Pez', edad: 1, dueno: 'Ana Gomez' },
        ];
        if (especie) data = data.filter(m => m.especie === especie);
        setTimeout(() => {
            setMascotas(data);
            calcularPromedio(data); // Calculo manual en mock
            setLoading(false);
        }, 500);
      } else {
        // Conexión Real
        let url = API_URL;
        if (especie) url += `?especie=${especie}`;
        const res = await fetch(url);
        const data = await res.json();
        setMascotas(data);
        
        // Obtener promedio del endpoint adicional
        const resProm = await fetch(`${API_URL}/calculos/promedio-edad`);
        const dataProm = await resProm.json();
        setPromedioEdad(dataProm.promedio);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  // Helpers para Mock (se ignoran si USE_MOCK_DATA es false y el backend hace el trabajo)
  const calcularPromedio = (lista) => {
    if (lista.length === 0) {
        setPromedioEdad(0); 
        return;
    }
    const suma = lista.reduce((acc, curr) => acc + parseFloat(curr.edad), 0);
    setPromedioEdad((suma / lista.length).toFixed(2));
  };

  const guardarMascota = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.dueno || formData.edad <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    if (USE_MOCK_DATA) {
        let db = JSON.parse(localStorage.getItem('mascotas_db')) || [];
        if (mascotaEditar) {
            // Update Mock
            db = db.map(m => m.id === mascotaEditar.id ? { ...formData, id: mascotaEditar.id } : m);
        } else {
            // Create Mock
            const newId = db.length > 0 ? Math.max(...db.map(m => m.id)) + 1 : 1;
            db.push({ ...formData, id: newId });
        }
        localStorage.setItem('mascotas_db', JSON.stringify(db));
        terminarGuardado();
    } else {
        // API Real
        const method = mascotaEditar ? 'PUT' : 'POST';
        const url = mascotaEditar ? `${API_URL}/${mascotaEditar.id}` : API_URL;
        
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        terminarGuardado();
    }
  };

  const eliminarMascota = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta mascota?")) return;

    if (USE_MOCK_DATA) {
        let db = JSON.parse(localStorage.getItem('mascotas_db'));
        db = db.filter(m => m.id !== id);
        localStorage.setItem('mascotas_db', JSON.stringify(db));
        fetchMascotas(filtroEspecie);
    } else {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchMascotas(filtroEspecie);
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

  const handleFiltro = (e) => {
      setFiltroEspecie(e.target.value);
  }

  // Efecto inicial y cuando cambia el filtro
  useEffect(() => {
    fetchMascotas(filtroEspecie);
  }, [filtroEspecie]);

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Dog size={32} /> Sistema de Gestión de Mascotas
                </h1>
                <p className="text-indigo-200 text-sm mt-1">Pablo Andrés Correa Rojas - Programación WEB</p>
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
        {/* Controles Superiores */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            {/* Buscador / Filtro */}
            <div className="w-full md:w-1/2 bg-white p-2 rounded-lg shadow flex items-center border border-slate-200">
                <Search className="text-slate-400 ml-2" />
                <select 
                    value={filtroEspecie} 
                    onChange={handleFiltro}
                    className="w-full p-2 outline-none bg-transparent text-slate-600 cursor-pointer"
                >
                    <option value="">Todas las especies</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Pez">Pez</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            {/* Botón Nuevo */}
            <button 
                onClick={() => { setMascotaEditar(null); setFormData({ nombre: '', especie: 'Perro', edad: '', dueno: '' }); setVista('formulario'); }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg shadow transition flex items-center gap-2 font-semibold"
            >
                <Plus size={20} /> Registrar Mascota
            </button>
        </div>

        {/* VISTA: FORMULARIO */}
        {vista === 'formulario' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
                <div className="bg-slate-800 text-white px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{mascotaEditar ? 'Editar Mascota' : 'Nueva Mascota'}</h2>
                    <button onClick={() => setVista('tabla')} className="text-slate-400 hover:text-white">Cancelar</button>
                </div>
                <form onSubmit={guardarMascota} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                            <div className="relative">
                                <Heart className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.nombre}
                                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    placeholder="Ej: Firulais"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Especie</label>
                            <select 
                                value={formData.especie}
                                onChange={e => setFormData({...formData, especie: e.target.value})}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="Perro">Perro</option>
                                <option value="Gato">Gato</option>
                                <option value="Pez">Pez</option>
                                <option value="Ave">Ave</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Edad (años)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="number" 
                                    value={formData.edad}
                                    onChange={e => setFormData({...formData, edad: e.target.value})}
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Dueño</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.dueno}
                                    onChange={e => setFormData({...formData, dueno: e.target.value})}
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    placeholder="Nombre del propietario"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <button type="button" onClick={() => setVista('tabla')} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow">Guardar Datos</button>
                    </div>
                </form>
            </div>
        )}

        {/* VISTA: TABLA */}
        {vista === 'tabla' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                {loading ? (
                    <div className="p-10 text-center text-slate-500">Cargando datos...</div>
                ) : mascotas.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center text-slate-400">
                        <Dog size={48} className="mb-2 opacity-20" />
                        <p>No se encontraron mascotas.</p>
                        <button onClick={() => setFiltroEspecie('')} className="text-indigo-500 text-sm hover:underline mt-2">Limpiar filtros</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider border-b">
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Mascota</th>
                                    <th className="p-4 font-semibold">Detalles</th>
                                    <th className="p-4 font-semibold">Dueño</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mascotas.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 text-slate-400 font-mono text-sm">#{m.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${m.especie === 'Perro' ? 'bg-orange-100 text-orange-600' : m.especie === 'Gato' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {m.especie === 'Perro' ? <Dog size={20}/> : m.especie === 'Gato' ? <Cat size={20}/> : <Fish size={20}/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{m.nombre}</p>
                                                    <span className="text-xs px-2 py-0.5 bg-slate-200 rounded-full text-slate-600">{m.especie}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400"/>
                                                <span>{m.edad} años</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                <User size={16} className="text-indigo-400"/>
                                                {m.dueno}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => abrirEditar(m)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Editar">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => eliminarMascota(m.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4 bg-slate-50 border-t text-xs text-slate-500 text-center">
                    Mostrando {mascotas.length} registros
                </div>
            </div>
        )}
      </main>
    </div>
  );
}