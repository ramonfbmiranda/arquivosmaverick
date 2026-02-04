import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Search, ImageIcon, MessageSquareQuote, ShieldAlert } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MembersGrid = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const rotations = [-2, 1, -1, 2, -1.5, 1.5, -2.5, 2];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="inline-block border-b-4 border-maverick-red pb-4 rotate-1">
            <h1 className="text-5xl md:text-7xl font-black-ops text-maverick-red uppercase tracking-tighter" data-testid="members-title">
              Banco de Dados
            </h1>
          </div>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ 8 Suspeitos Identificados ]
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 1 }}
            onClick={() => navigate("/gallery")}
            className="bg-transparent text-maverick-yellow border-2 border-maverick-yellow font-courier-prime uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-all flex items-center gap-2"
            data-testid="gallery-nav-button"
          >
            <ImageIcon className="w-5 h-5" /> Galeria
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            onClick={() => navigate("/quotes")}
            className="bg-transparent text-maverick-yellow border-2 border-maverick-yellow font-courier-prime uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-all flex items-center gap-2"
            data-testid="quotes-nav-button"
          >
            <MessageSquareQuote className="w-5 h-5" /> Citações
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 1 }}
            onClick={() => navigate("/admin")}
            className="bg-transparent text-maverick-red border-2 border-maverick-red font-courier-prime uppercase px-6 py-3 hover:bg-maverick-red hover:text-white transition-all flex items-center gap-2"
            data-testid="admin-nav-button"
          >
            <ShieldAlert className="w-5 h-5" /> Admin
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center text-maverick-yellow font-special-elite text-2xl" data-testid="loading-message">
            [ CARREGANDO ARQUIVOS... ]
          </div>
        ) : members.length === 0 ? (
          <div className="text-center" data-testid="empty-state">
            <p className="text-maverick-yellow font-special-elite text-xl mb-4">
              [ NENHUM MEMBRO CADASTRADO ]
            </p>
            <button
              onClick={() => navigate("/admin")}
              className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:scale-105 transition-transform"
              data-testid="add-first-member-button"
            >
              Adicionar Primeiro Membro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8, rotate: rotations[index % 8] }}
                animate={{ opacity: 1, scale: 1, rotate: rotations[index % 8] }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => navigate(`/members/${member.id}`)}
                className="bg-maverick-paper border-2 border-stone-700 p-6 shadow-2xl cursor-pointer relative overflow-hidden group"
                style={{ rotate: `${rotations[index % 8]}deg` }}
                data-testid={`member-card-${member.id}`}
              >
                <div className="absolute top-2 right-2 bg-maverick-red text-white text-xs font-courier-prime px-2 py-1 rotate-6">
                  {String(index + 1).padStart(3, '0')}
                </div>

                {member.photo_url && (
                  <div className="mb-4 overflow-hidden border-2 border-stone-600">
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                )}

                <h2 className="text-2xl font-black-ops text-maverick-red uppercase mb-2" data-testid={`member-name-${member.id}`}>
                  {member.name}
                </h2>

                <div className="border-t border-b border-maverick-yellow py-2 mb-3">
                  <p className="text-lg font-special-elite text-maverick-yellow uppercase">
                    {member.nickname}
                  </p>
                </div>

                <p className="text-sm font-courier-prime text-maverick-ink mb-4 line-clamp-3">
                  {member.description}
                </p>

                <div className="absolute bottom-2 left-2 text-xs font-courier-prime text-maverick-dim">
                  CLASSIFICAÇÃO: {member.classification}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersGrid;
