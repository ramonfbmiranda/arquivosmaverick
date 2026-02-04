import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

function Bordoes() {
  const navigate = useNavigate();

  const bordoes = [
    {
      frase: "Ei lá ele",
      contexto: "Para brincar com o uso repetitivo da expressão 'lá ele' do grupo"
    },
    {
      frase: "Ain lula",
      contexto: "Uma brincadeira com o nome Lula"
    },
    {
      frase: "Quem lembra?",
      contexto: "Quando for chamar pra fazer qualquer coisa. Ex: 'Minecraft quem lembra'"
    },
    {
      frase: "Tira o já",
      contexto: "Em homenagem a um meme"
    },
    {
      frase: "Vai dar no boy?",
      contexto: "Quando alguém foi muito grosso"
    },
    {
      frase: "Hoje eu vou parar no bailão",
      contexto: "Trecho de uma música da banda Grafitth, muito cantada pelos membros"
    },
    {
      frase: "Ah meninão",
      contexto: "Pra enaltecer algo de alguém do grupo"
    },
    {
      frase: "ENNNgole",
      contexto: "Expressão de humor nonsense"
    },
    {
      frase: "Não beleza",
      contexto: "Pra dizer algo que não gostou em tom de humor"
    },
    {
      frase: "Cabeça e pescoço",
      contexto: "Referente a um cirurgião de cabeça e pescoço do Aqueles Caras, em que muitos acreditavam que não existe"
    },
    {
      frase: "Eu tentei",
      contexto: "Referente ao Chico Moedas"
    },
    {
      frase: "Vai ficar nessa",
      contexto: "Uma das melhores expressões do grupo, quando alguém fazia algum comportamento repetitivo ou chato"
    }
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
              className="bg-maverick-yellow text-black p-6 shadow-2xl relative"
              style={{ rotate: `${rotations[index % 12]}deg` }}
            >
              <MessageCircle className="absolute top-3 right-3 w-6 h-6 opacity-30" />
              
              <div className="mb-4 pt-2">
                <h3 className="text-2xl font-black-ops uppercase text-center">
                  "{bordao.frase}"
                </h3>
              </div>

              <div className="border-t-2 border-black pt-4">
                <p className="font-courier-prime text-sm leading-relaxed text-center">
                  {bordao.contexto}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bordoes;
