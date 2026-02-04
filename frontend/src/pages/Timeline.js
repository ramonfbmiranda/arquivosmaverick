import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

function Timeline() {
  const navigate = useNavigate();

  const events = [
    { year: "2019", title: "O Início", description: "Davi e Julliano se tornam amigos" },
    { year: "2020", title: "CEI Zona Sul", description: "Ítalo e Davi se tornam amigos no CEI Zona Sul" },
    { year: "2021", title: "Ramon e Felipe", description: "Felipe e Ramon se tornam amigos" },
    { year: "2021", title: "Saída do Juju", description: "Julliano sai do CEI" },
    { year: "2022", title: "A Chegada do Poste", description: "PH chega no CEI, fazendo amizade com Ítalo e Davi após alguns meses, depois fazendo amizade com Gabriel" },
    { year: "2022", title: "Parada de Ônibus", description: "PH faz amizade com Ramon na parada de ônibus" },
    { year: "Metade de 2022", title: "Expansão", description: "Ramon se junta na amizade com Ítalo, Davi e Gabriel vindo pela amizade com PH. Felipe é colega do pessoal mas amigo somente de Ramon e PH. Se cria o grupo dos caras" },
    { year: "Início de 2023", title: "Consolidação", description: "O grupo se consolida, tendo Ramon, PH, Ítalo, Davi, Gabriel e Felipe" },
    { year: "2023", title: "Faguinho", description: "Um pouco depois do começo de 2023, Jordan se junta ao grupo" },
    { year: "Final de 2023", title: "Caso das Figurinhas", description: "Um amigo do grupo chamado Leo manda figurinhas inapropriadas no grupo da sala e a culpa cai no grupo e em boa parte por Julliano" },
    { year: "2023", title: "Rolês na Casa do Marrom", description: "Rolês na casa de Ramon jogando PS4, piscina e dormindo, consolidando a Gangue da Maverick" },
    { year: "2023", title: "Fim de Uma Era", description: "Fim do pré/último ano da escola CEI" },
    { year: "2024", title: "Juju Retorna", description: "Julliano se junta ao grupo via calls do Discord jogando" },
    { year: "2024", title: "Ano dos Games e Rolês", description: "Muitas calls no Discord jogando Minecraft e Valorant no final do ano. Assistindo 'Aqueles Caras' toda terça na call. Rolês assistindo futebol no Espeto do Bombado e dormidas na Ramon House com PS4 e violão" },
    { year: "2025", title: "Maturidade da Gangue", description: "Muita gameplay de MTA, rolês em aniversários e festas. A maioria do grupo se comprometeu com namoros e começou a trabalhar" }
  ];

  return (
    <div className="min-h-screen bg-maverick-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
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
            Linha do Tempo
          </h1>
          <p className="text-xl font-special-elite text-maverick-yellow mt-6 uppercase tracking-widest">
            [ História da Gangue ]
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-maverick-red"></div>

          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20 pb-12"
            >
              <div className="absolute left-4 top-0 w-9 h-9 bg-maverick-red rounded-full border-4 border-maverick-bg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>

              <div className="bg-maverick-paper border-2 border-stone-700 p-6 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="absolute -top-2 -left-2 bg-maverick-yellow text-black px-3 py-1 font-special-elite text-sm rotate-3">
                  {event.year}
                </div>
                <h3 className="text-2xl font-black-ops text-maverick-red uppercase mb-3 mt-2">
                  {event.title}
                </h3>
                <p className="font-courier-prime text-maverick-ink leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
