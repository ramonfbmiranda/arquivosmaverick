import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Gallery = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ url: "", caption: "" });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await axios.get(`${API}/photos`);
      setPhotos(response.data);
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.url.trim()) return;

    try {
      await axios.post(`${API}/photos`, newPhoto);
      setNewPhoto({ url: "", caption: "" });
      setShowAddForm(false);
      loadPhotos();
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta foto?")) return;
    
    try {
      await axios.delete(`${API}/photos/${photoId}`);
      loadPhotos();
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
    }
  };

  const rotations = [-3, 2, -1, 3, -2, 1, -2.5, 2.5];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red transition-colors"
          data-testid="back-to-members-button"
        >
          <ArrowLeft /> VOLTAR
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black-ops text-maverick-red uppercase tracking-tighter inline-block border-b-4 border-maverick-red pb-4 rotate-1" data-testid="gallery-title">
            Galeria
          </h1>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ Momentos Capturados ]
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 border-2 border-transparent hover:border-maverick-yellow transition-all flex items-center gap-2"
            data-testid="toggle-add-photo-button"
          >
            <ImagePlus className="w-5 h-5" /> {showAddForm ? "Cancelar" : "Adicionar Foto"}
          </motion.button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-maverick-paper border-2 border-maverick-yellow p-8 mb-12 max-w-2xl mx-auto"
          >
            <form onSubmit={handleAddPhoto} data-testid="add-photo-form">
              <div className="mb-4">
                <label className="block text-maverick-yellow font-special-elite uppercase mb-2">URL da Foto</label>
                <input
                  type="url"
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                  placeholder="https://..."
                  required
                  data-testid="photo-url-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-maverick-yellow font-special-elite uppercase mb-2">Legenda (Opcional)</label>
                <input
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                  placeholder="Descreva a foto..."
                  data-testid="photo-caption-input"
                />
              </div>
              <button
                type="submit"
                className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-colors w-full"
                data-testid="submit-photo-button"
              >
                Adicionar
              </button>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center text-maverick-yellow font-special-elite text-2xl" data-testid="loading-photos">
            [ CARREGANDO FOTOS... ]
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-maverick-dim font-courier-prime text-xl" data-testid="no-photos-message">
            Nenhuma foto adicionada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8, rotate: rotations[index % 8] }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
                transition={{ type: "spring" }}
                className="relative group"
                style={{ rotate: `${rotations[index % 8]}deg` }}
                data-testid={`photo-${photo.id}`}
              >
                <div className="bg-white p-3 pb-12 shadow-2xl">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Foto da gangue"}
                    className="w-full aspect-square object-cover"
                  />
                  {photo.caption && (
                    <p className="text-center text-black font-courier-prime text-sm mt-3">{photo.caption}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-maverick-red text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  data-testid={`delete-photo-${photo.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
