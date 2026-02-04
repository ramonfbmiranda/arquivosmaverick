import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Edit, Trash2, Save } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    classification: "",
    description: "",
    characteristics: "",
    current_status: "",
    role: "",
    photo_url: ""
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await axios.get(`${API}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      nickname: member.nickname,
      classification: member.classification,
      description: member.description,
      characteristics: member.characteristics.join(", "),
      current_status: member.current_status,
      role: member.role,
      photo_url: member.photo_url || ""
    });
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      name: "",
      nickname: "",
      classification: "",
      description: "",
      characteristics: "",
      current_status: "",
      role: "",
      photo_url: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      characteristics: formData.characteristics.split(",").map(c => c.trim()).filter(c => c)
    };

    try {
      if (editingId) {
        await axios.put(`${API}/members/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API}/members`, dataToSend);
      }
      setEditingId(null);
      setShowAddForm(false);
      loadMembers();
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Tem certeza que deseja deletar este membro?")) return;
    
    try {
      await axios.delete(`${API}/members/${memberId}`);
      loadMembers();
    } catch (error) {
      console.error("Erro ao deletar membro:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red transition-colors"
          data-testid="back-to-members-admin"
        >
          <ArrowLeft /> VOLTAR
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black-ops text-maverick-red uppercase tracking-tighter inline-block border-b-4 border-maverick-red pb-4 rotate-1" data-testid="admin-title">
            Painel Admin
          </h1>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ Gerenciar Membros ]
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={handleAdd}
            className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 border-2 border-transparent hover:border-maverick-yellow transition-all flex items-center gap-2"
            data-testid="add-member-button"
          >
            <UserPlus className="w-5 h-5" /> Adicionar Membro
          </motion.button>
        </div>

        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-maverick-paper border-4 border-maverick-yellow p-8 mb-12"
          >
            <h2 className="text-3xl font-black-ops text-maverick-yellow uppercase mb-6" data-testid="form-title">
              {editingId ? "Editar Membro" : "Novo Membro"}
            </h2>
            <form onSubmit={handleSubmit} data-testid="member-form">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    required
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Apelido *</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    required
                    data-testid="input-nickname"
                  />
                </div>
                <div>
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Classificação *</label>
                  <input
                    type="text"
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    placeholder="Ex: O Humor Primordial"
                    required
                    data-testid="input-classification"
                  />
                </div>
                <div>
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Função no Grupo *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    placeholder="Ex: Principal fornecedor de piadas"
                    required
                    data-testid="input-role"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Descrição *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none resize-none"
                    rows={3}
                    required
                    data-testid="input-description"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Características (separadas por vírgula) *</label>
                  <textarea
                    value={formData.characteristics}
                    onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none resize-none"
                    rows={3}
                    placeholder="Ex: Dormiu na escola, Botafoguense sofredor, Fã da DC"
                    required
                    data-testid="input-characteristics"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">Status Atual *</label>
                  <input
                    type="text"
                    value={formData.current_status}
                    onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    placeholder="Ex: Desempregado, futuro aluno de CeT"
                    required
                    data-testid="input-status"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-maverick-yellow font-special-elite uppercase mb-2 text-sm">URL da Foto (Opcional)</label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                    placeholder="https://..."
                    data-testid="input-photo-url"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-colors flex items-center justify-center gap-2"
                  data-testid="save-member-button"
                >
                  <Save className="w-5 h-5" /> Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-maverick-dim text-white font-special-elite uppercase px-6 py-3 hover:bg-gray-700 transition-colors"
                  data-testid="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center text-maverick-yellow font-special-elite text-2xl" data-testid="loading-admin">
            [ CARREGANDO... ]
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-maverick-paper border-2 border-stone-700 p-6 shadow-xl flex justify-between items-center"
                data-testid={`admin-member-${member.id}`}
              >
                <div>
                  <h3 className="text-2xl font-black-ops text-maverick-red uppercase">{member.name}</h3>
                  <p className="text-maverick-yellow font-special-elite">{member.nickname}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(member)}
                    className="bg-maverick-yellow text-black p-3 hover:bg-yellow-500 transition-colors"
                    data-testid={`edit-member-${member.id}`}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-maverick-red text-white p-3 hover:bg-red-700 transition-colors"
                    data-testid={`delete-member-${member.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
