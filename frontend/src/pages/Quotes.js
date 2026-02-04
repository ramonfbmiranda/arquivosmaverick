import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Quote as QuoteIcon, Trash2, Plus } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Quotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: "", context: "", member_id: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quotesRes, membersRes] = await Promise.all([
        axios.get(`${API}/quotes`),
        axios.get(`${API}/members`)
      ]);
      setQuotes(quotesRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (!newQuote.text.trim()) return;

    try {
      await axios.post(`${API}/quotes`, {
        text: newQuote.text,
        context: newQuote.context || null,
        member_id: newQuote.member_id || null
      });
      setNewQuote({ text: "", context: "", member_id: "" });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error("Erro ao adicionar citação:", error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta citação?")) return;
    
    try {
      await axios.delete(`${API}/quotes/${quoteId}`);
      fetchData();
    } catch (error) {
      console.error("Erro ao deletar citação:", error);
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : "Anônimo";
  };

  const rotations = [-2, 1, -1.5, 2, -2.5, 1.5, -3, 2.5];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red transition-colors"
          data-testid="back-to-members-quotes"
        >
          <ArrowLeft /> VOLTAR
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black-ops text-maverick-red uppercase tracking-tighter inline-block border-b-4 border-maverick-red pb-4 rotate-1" data-testid="quotes-title">
            Citações Famosas
          </h1>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ Frases Inesquecíveis ]
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 border-2 border-transparent hover:border-maverick-yellow transition-all flex items-center gap-2"
            data-testid="toggle-add-quote-button"
          >
            <Plus className="w-5 h-5" /> {showAddForm ? "Cancelar" : "Adicionar Citação"}
          </motion.button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-maverick-paper border-2 border-maverick-yellow p-8 mb-12 max-w-3xl mx-auto"
          >
            <form onSubmit={handleAddQuote} data-testid="add-quote-form">
              <div className="mb-4">
                <label className="block text-maverick-yellow font-special-elite uppercase mb-2">Citação</label>
                <textarea
                  value={newQuote.text}
                  onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                  className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none resize-none"
                  rows={3}
                  placeholder='"Digite a citação aqui..."'
                  required
                  data-testid="quote-text-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-maverick-yellow font-special-elite uppercase mb-2">Contexto (Opcional)</label>
                <input
                  type="text"
                  value={newQuote.context}
                  onChange={(e) => setNewQuote({ ...newQuote, context: e.target.value })}
                  className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                  placeholder="Onde/quando foi dito..."
                  data-testid="quote-context-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-maverick-yellow font-special-elite uppercase mb-2">Quem disse? (Opcional)</label>
                <select
                  value={newQuote.member_id}
                  onChange={(e) => setNewQuote({ ...newQuote, member_id: e.target.value })}
                  className="w-full bg-maverick-bg border-2 border-maverick-dim text-maverick-ink font-courier-prime px-4 py-2 focus:border-maverick-yellow outline-none"
                  data-testid="quote-member-select"
                >
                  <option value="">Selecione...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-maverick-red text-white font-special-elite uppercase px-6 py-3 hover:bg-maverick-yellow hover:text-black transition-colors w-full"
                data-testid="submit-quote-button"
              >
                Adicionar Citação
              </button>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center text-maverick-yellow font-special-elite text-2xl" data-testid="loading-quotes">
            [ CARREGANDO CITAÇÕES... ]
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center text-maverick-dim font-courier-prime text-xl" data-testid="no-quotes-message">
            Nenhuma citação adicionada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, scale: 0.8, rotate: rotations[index % 8] }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ type: "spring" }}
                className="bg-yellow-200 text-black p-6 shadow-2xl relative group"
                style={{ rotate: `${rotations[index % 8]}deg` }}
                data-testid={`quote-${quote.id}`}
              >
                <QuoteIcon className="absolute top-2 left-2 w-6 h-6 opacity-30" />
                
                <p className="font-courier-prime text-base mb-4 italic leading-relaxed pt-6">
                  "{quote.text}"
                </p>

                {quote.member_id && (
                  <p className="font-special-elite uppercase text-sm text-right mb-2">
                    - {getMemberName(quote.member_id)}
                  </p>
                )}

                {quote.context && (
                  <p className="font-courier-prime text-xs text-gray-700 border-t border-gray-400 pt-2">
                    {quote.context}
                  </p>
                )}

                <button
                  onClick={() => handleDeleteQuote(quote.id)}
                  className="absolute top-2 right-2 bg-maverick-red text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  data-testid={`delete-quote-${quote.id}`}
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

export default Quotes;
