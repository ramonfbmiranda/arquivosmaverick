import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MemberProfile = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ author_name: "", text: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const memberRes = await axios.get(`${API}/members/${memberId}`);
        const commentsRes = await axios.get(`${API}/comments/${memberId}`);
        setMember(memberRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [memberId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.author_name.trim() || !newComment.text.trim()) return;

    try {
      await axios.post(`${API}/comments`, {
        member_id: memberId,
        author_name: newComment.author_name,
        text: newComment.text
      });
      setNewComment({ author_name: "", text: "" });
      const commentsRes = await axios.get(`${API}/comments/${memberId}`);
      setComments(commentsRes.data);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-maverick-bg flex items-center justify-center">
        <p className="text-maverick-yellow font-special-elite text-2xl" data-testid="loading-profile">[ CARREGANDO ARQUIVO... ]</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-maverick-bg flex items-center justify-center">
        <p className="text-maverick-red font-special-elite text-2xl">[ ARQUIVO NÃO ENCONTRADO ]</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft /> VOLTAR AO BANCO DE DADOS
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 50, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring" }}
          className="bg-maverick-paper border-4 border-maverick-red p-8 shadow-2xl relative mb-8"
        >
          <div className="absolute -top-6 -right-6 bg-maverick-red text-white px-6 py-3 rotate-12 border-2 border-maverick-yellow font-black-ops shadow-xl">
            DOSSIÊ
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {member.photo_url && (
              <div className="md:col-span-1">
                <div className="border-4 border-stone-600 p-2 bg-white shadow-lg rotate-2">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full aspect-square object-cover grayscale"
                    data-testid="member-photo"
                  />
                  <p className="text-center text-black font-courier-prime text-xs mt-2">FOTO ANEXADA</p>
                </div>
              </div>
            )}

            <div className={member.photo_url ? "md:col-span-2" : "md:col-span-3"}>
              <h1 className="text-4xl md:text-5xl font-black-ops text-maverick-red uppercase mb-4 border-b-2 border-maverick-red pb-2" data-testid="profile-name">
                {member.name}
              </h1>

              <div className="bg-maverick-yellow text-black px-4 py-2 mb-4 rotate-1 inline-block">
                <p className="font-special-elite uppercase tracking-widest text-xl">{member.nickname}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ CLASSIFICAÇÃO ]</h3>
                <p className="font-courier-prime text-maverick-ink text-lg">{member.classification}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ DESCRIÇÃO ]</h3>
                <p className="font-courier-prime text-maverick-ink leading-relaxed">{member.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ CARACTERÍSTICAS ]</h3>
                <ul className="space-y-2">
                  {member.characteristics.map((char, index) => (
                    <li key={index} className="font-courier-prime text-maverick-ink flex items-start" data-testid={`characteristic-${index}`}>
                      <span className="text-maverick-red mr-2">▸</span> {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ STATUS ATUAL ]</h3>
                <p className="font-courier-prime text-maverick-ink">{member.current_status}</p>
              </div>

              <div className="border-t-2 border-maverick-red pt-4">
                <h3 className="text-xl font-special-elite text-maverick-red uppercase">[ FUNÇÃO NO GRUPO ]</h3>
                <p className="font-courier-prime text-maverick-ink text-lg mt-2">{member.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-maverick-paper border-2 border-stone-700 p-8 shadow-xl"
        >
          <h2 className="text-3xl font-black-ops text-maverick-yellow uppercase mb-6 flex items-center gap-3" data-testid="comments-title">
            <MessageSquare className="w-8 h-8" /> Comentários
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-8" data-testid="comment-form">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={newComment.author_name}
                onChange={(e) => setNewComment({ ...newComment, author_name: e.target.value })}
                className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                data-testid="comment-author-input"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Deixe seu comentário..."
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                rows={4}
                className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none resize-none"
                data-testid="comment-text-input"
              />
            </div>
            <button
              type="submit"
              className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-colors flex items-center gap-2 border-2 border-transparent hover:border-white"
              data-testid="submit-comment-button"
            >
              <Send className="w-4 h-4" /> Enviar
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-maverick-dim font-courier-prime italic" data-testid="no-comments-message">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-maverick-bg border-l-4 border-maverick-yellow p-4"
                  data-testid={`comment-${comment.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-special-elite text-maverick-yellow uppercase">{comment.author_name}</p>
                    <p className="text-xs text-maverick-dim font-courier-prime">
                      {new Date(comment.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="font-courier-prime text-maverick-ink">{comment.text}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberProfile;
