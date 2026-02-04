import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

function Bordoes() {
  const navigate = useNavigate();

  const bordoes = [
    "Ei lá ele",
    "Ain lula",
    "Quem lembra?",
    "Tira o já",
    "Vai dar no boy?",
    "Hoje eu vou parar no bailão",
    "Ah meninão",
    "ENNNgole",
    "Não beleza",
    "Cabeça e pescoço",
    "Eu tentei",
    "Vai ficar nessa"
  ];

  const rotations = [-2, 1, -1.5, 2, -2.5, 1.5, -1, 2.5, -3, 1.5, -2, 2];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-maverick-yellow font-courier-prime mb-8 hover:text-maverick-red transition-colors"
        >
          <ArrowLeft /> VOLTAR
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black-ops text-maverick-red uppercase tracking-tighter inline-block border-b-4 border-maverick-red pb-4 rotate-1">
            Bordões
          </h1>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ Linguajar da Gangue ]
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bordoes.map((bordao, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: rotations[index % 12] }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              transition={{ type: "spring" }}
              className="bg-maverick-yellow text-black p-8 shadow-2xl relative flex items-center justify-center min-h-[150px]"
              style={{ rotate: `${rotations[index % 12]}deg` }}
            >
              <MessageCircle className="absolute top-3 right-3 w-6 h-6 opacity-20" />
              
              <h3 className="text-2xl md:text-3xl font-black-ops uppercase text-center">
                "{bordao}"
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bordoes;
