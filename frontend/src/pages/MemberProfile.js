import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function MemberProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const mid = params.memberId;
      const res1 = await axios.get(`${API}/members/${mid}`);
      const res2 = await axios.get(`${API}/comments/${mid}`);
      setMember(res1.data);
      setComments(res2.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;
    try {
      await axios.post(`${API}/comments`, {
        member_id: params.memberId,
        author_name: authorName,
        text: commentText
      });
      setAuthorName("");
      setCommentText("");
      const r = await axios.get(`${API}/comments/${params.memberId}`);
      setComments(r.data);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-maverick-bg flex items-center justify-center">
        <p className="text-maverick-yellow font-special-elite text-2xl">[ CARREGANDO... ]</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-maverick-bg flex items-center justify-center">
        <p className="text-maverick-red font-special-elite text-2xl">[ NÃO ENCONTRADO ]</p>
      </div>
    );
  }

  const chars = member.characteristics || [];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red"
        >
          <ArrowLeft /> VOLTAR
        </motion.button>

        <div className="bg-maverick-paper border-4 border-maverick-red p-8 shadow-2xl relative mb-8">
          <div className="absolute -top-6 -right-6 bg-maverick-red text-white px-6 py-3 rotate-12 border-2 border-maverick-yellow font-black-ops">
            DOSSIÊ
          </div>

          <h1 className="text-4xl md:text-5xl font-black-ops text-maverick-red uppercase mb-4 border-b-2 border-maverick-red pb-2">
            {member.name}
          </h1>

          <div className="bg-maverick-yellow text-black px-4 py-2 mb-4 rotate-1 inline-block">
            <p className="font-special-elite uppercase text-xl">{member.nickname}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ CLASSIFICAÇÃO ]</h3>
            <p className="font-courier-prime text-maverick-ink">{member.classification}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ DESCRIÇÃO ]</h3>
            <p className="font-courier-prime text-maverick-ink">{member.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ CARACTERÍSTICAS ]</h3>
            {chars.map((c, i) => (
              <div key={i} className="font-courier-prime text-maverick-ink flex items-start mb-1">
                <span className="text-maverick-red mr-2">▸</span> {c}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-special-elite text-maverick-yellow uppercase mb-2">[ STATUS ]</h3>
            <p className="font-courier-prime text-maverick-ink">{member.current_status}</p>
          </div>

          <div className="border-t-2 border-maverick-red pt-4">
            <h3 className="text-xl font-special-elite text-maverick-red uppercase">[ FUNÇÃO ]</h3>
            <p className="font-courier-prime text-maverick-ink text-lg mt-2">{member.role}</p>
          </div>
        </div>

        <div className="bg-maverick-paper border-2 border-stone-700 p-8">
          <h2 className="text-3xl font-black-ops text-maverick-yellow uppercase mb-6 flex items-center gap-3">
            <MessageSquare className="w-8 h-8" /> Comentários
          </h2>

          <form onSubmit={submitComment} className="mb-8">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Seu comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Enviar
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-maverick-dim font-courier-prime italic">Nenhum comentário.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="bg-maverick-bg border-l-4 border-maverick-yellow p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-special-elite text-maverick-yellow uppercase">{c.author_name}</p>
                  <p className="text-xs text-maverick-dim font-courier-prime">
                    {new Date(c.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <p className="font-courier-prime text-maverick-ink">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberProfile;
