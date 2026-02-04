import { motion } from "framer-motion";
import { FileText, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-maverick-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-maverick-red text-9xl rotate-12 font-black-ops">CONFIDENCIAL</div>
        <div className="absolute bottom-20 right-10 text-maverick-yellow text-9xl -rotate-12 font-black-ops">TOP SECRET</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <div className="bg-maverick-paper border-4 border-maverick-red p-12 shadow-2xl relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -top-12 -right-12 bg-maverick-red text-maverick-ink px-8 py-4 rotate-12 border-4 border-maverick-yellow font-black-ops text-2xl shadow-xl"
          >
            CONFIDENCIAL
          </motion.div>

          <div className="flex items-center justify-center mb-8">
            <Lock className="text-maverick-yellow w-16 h-16 mr-4" />
            <FileText className="text-maverick-red w-20 h-20" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-7xl font-black-ops text-maverick-red text-center mb-6 tracking-tighter uppercase"
            data-testid="main-title"
          >
            Gangue da Maverick
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="border-t-2 border-b-2 border-maverick-yellow py-4 mb-8"
          >
            <p className="text-xl md:text-2xl font-special-elite text-maverick-yellow text-center uppercase tracking-widest">
              Mais que amigos. Irmãos desde o CEI Zona Sul.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-base md:text-lg font-courier-prime text-maverick-ink text-center mb-8 leading-relaxed"
          >
            Este é o arquivo oficial dos melhores momentos, personalidades e histórias internas do grupo. 
            Um dossiê secreto de uma gangue lendária que começou na escola e se tornou uma irmandade para a vida toda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate("/members")}
              className="bg-maverick-red text-white font-special-elite uppercase tracking-widest px-8 py-4 border-2 border-transparent hover:border-maverick-yellow hover:rotate-1 hover:scale-105 shadow-[6px_6px_0px_0px_rgba(255,193,7,0.5)] transition-all text-xl"
              data-testid="open-file-button"
            >
              [ ABRIR ARQUIVO ]
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.6 }}
            className="absolute bottom-4 right-4 text-maverick-dim font-courier-prime text-xs"
          >
            CLASSIFICAÇÃO: RESTRITO
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
