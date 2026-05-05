<<<<<<< HEAD
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const uefaData = {
  "OCTAVOS DE FINAL": [],
  "CUARTOS DE FINAL": [],
  "SEMIFINALES": [
    {
      id: 'semi_ida_1',
      tipo: 'IDA',
      fecha: '2026-04-28T21:00:00', 
      equipo_local: 'PARIS SG',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
      marcador: 'VS',
      equipo_visitante: 'BAYERN MÚNICH',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
      estadio: 'Parc des Princes',
      ciudad: 'París, Francia'
    },
    {
      id: 'semi_ida_2',
      tipo: 'IDA',
      fecha: '2026-04-29T21:00:00',
      equipo_local: 'ATLÉTICO MADRID',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
      marcador: 'VS',
      equipo_visitante: 'ARSENAL',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      estadio: 'Cívitas Metropolitano',
      ciudad: 'Madrid, España'
    },
    {
      id: 'semi_vuelta_1',
      tipo: 'VUELTA',
      fecha: '2026-05-05T21:00:00',
      equipo_local: 'ARSENAL',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      marcador: 'VS',
      equipo_visitante: 'ATLÉTICO MADRID',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
      estadio: 'Emirates Stadium',
      ciudad: 'Londres, Inglaterra'
    },
    {
      id: 'semi_vuelta_2',
      tipo: 'VUELTA',
      fecha: '2026-05-06T21:00:00',
      equipo_local: 'BAYERN MÚNICH',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
      marcador: 'VS',
      equipo_visitante: 'PARIS SG',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
      estadio: 'Allianz Arena',
      ciudad: 'Múnich, Alemania'
    }
  ],
  "LA GRAN FINAL": [
    {
      id: 'final_1',
      tipo: 'FINAL',
      fecha: '2026-05-30T21:00:00',
      equipo_local: 'TBD',
      logo_local: 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png',
      marcador: 'VS',
      equipo_visitante: 'TBD',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png',
      estadio: 'Puskás Aréna',
      ciudad: 'Budapest, Hungría'
    }
  ]
};

export default function ChampionsIntelligence() {
  const router = useRouter();
  const [activePhase, setActivePhase] = useState("SEMIFINALES");
  const matches = uefaData[activePhase as keyof typeof uefaData] || [];

  return (
    <div className="intelligence-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');

        :root {
          --ucl-blue: #00AEEF;
          --ucl-bg: #000;
        }

        .intelligence-center {
          background: var(--ucl-bg);
          min-height: 100vh;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── FONDO CHAMPIONS FINAL (league.jpg) ── */
        .dynamic-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('/img/league.jpg'); 
          background-size: cover; 
          background-position: center;
          filter: brightness(0.4) contrast(1.1);
        }

        .bg-overlay {
          position: fixed; inset: 0; z-index: 1;
          background: radial-gradient(circle at center, rgba(0,174,239,0.03) 0%, rgba(0,0,0,0.85) 100%);
        }

        .mission-header { position: relative; z-index: 10; padding: 30px 5vw 15px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .fix-title { font-family: 'Syncopate'; font-weight: 900; font-size: 24px; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 5px; }

        .fix-header { position: sticky; top: 0; z-index: 100; background: rgba(0,0,0,0.7); border-bottom: 1px solid rgba(0,174,239,0.15); backdrop-filter: blur(15px); padding: 12px 5vw; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { display: flex; align-items: center; gap: 8px; font-family: 'Syncopate'; font-size: 8px; color: #fff; cursor: pointer; background: none; border: none; opacity: 0.5; transition: 0.3s; letter-spacing: 1px; }
        .back-btn:hover { opacity: 1; color: var(--ucl-blue); }

        .phase-tabs { position: relative; z-index: 10; display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .phase-tab { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #666; padding: 6px 14px; font-family: 'Syncopate'; font-size: 7.5px; cursor: pointer; border-radius: 2px; transition: 0.3s; }
        .phase-tab.active { background: var(--ucl-blue); color: #fff; border-color: var(--ucl-blue); box-shadow: 0 0 15px rgba(0,174,239,0.2); }

        .matches-container { position: relative; z-index: 10; width: 100%; max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 4px; }

        /* ── FILAS "GLASS" UEFA (ESCALA PEQUEÑA PROFESIONAL) ── */
        .broadcast-row {
          display: flex; flex-direction: column;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 174, 239, 0.1);
          border-bottom: 1px solid rgba(0, 174, 239, 0.1);
        }

        .b-meta { display: flex; justify-content: center; gap: 12px; padding: 5px; background: rgba(0,0,0,0.25); font-family: 'Space Grotesk'; font-size: 8.5px; color: rgba(255,255,255,0.5); letter-spacing: 1px; font-weight: 600; }
        .b-core { display: grid; grid-template-columns: 1fr 70px 1fr; align-items: center; padding: 12px 25px; }
        
        .team-side { display: flex; align-items: center; gap: 12px; }
        .team-side.local { justify-content: flex-end; text-align: right; }
        .team-side.visit { justify-content: flex-start; text-align: left; }
        
        .team-name { font-family: 'Syncopate', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: -0.5px; }
        .team-logo { width: 35px; height: 35px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); }
        
        .score-box { font-family: 'Bebas Neue'; font-size: 22px; color: var(--ucl-blue); text-align: center; letter-spacing: 2px; }

        .b-bottom { text-align: center; padding: 6px; font-family: 'Space Grotesk'; font-size: 8.5px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; }
      `}} />

      <div className="dynamic-bg" />
      <div className="bg-overlay" />

      <header className="fix-header">
        <button onClick={() => router.push('/')} className="back-btn">
          <ChevronLeft size={12} /> REGRESAR
        </button>
        <div style={{fontFamily:'Syncopate', fontSize:'9px', fontWeight:900, opacity:0.7, letterSpacing: '1px'}}>CENTRO DE INTELIGENCIA UEFA</div>
      </header>

      <section className="mission-header">
        <Trophy size={30} color="var(--ucl-blue)" style={{marginBottom: '10px'}} />
        <h1 className="fix-title">UEFA CHAMPIONS LEAGUE</h1>
        <div style={{width: '30px', height: '1.5px', background: 'var(--ucl-blue)', margin: '0 auto'}}></div>
      </section>

      <div className="phase-tabs">
        {["OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "LA GRAN FINAL"].map(phase => (
          <button key={phase} className={`phase-tab ${activePhase === phase ? 'active' : ''}`} onClick={() => setActivePhase(phase)}>
            {phase}
          </button>
        ))}
      </div>

      <main className="matches-container">
        <AnimatePresence mode="wait">
          {matches.map((match, i) => (
            <motion.div key={match.id} initial={{opacity:0, y: 5}} animate={{opacity:1, y: 0}} transition={{delay: i * 0.02}} className="broadcast-row">
              <div className="b-meta">
                <span style={{color:'var(--ucl-blue)'}}>{match.tipo}</span>
                <span style={{opacity: 0.2}}>|</span>
                <span>{new Date(match.fecha).toLocaleDateString('es-ES', {weekday: 'short', day:'2-digit', month:'short'}).toUpperCase()}</span>
                <span style={{opacity: 0.2}}>|</span>
                <span>21:00 CET</span>
              </div>
              
              <div className="b-core">
                <div className="team-side local">
                  <span className="team-name">{match.equipo_local}</span>
                  <img src={match.logo_local} alt="" className="team-logo" />
                </div>
                
                <div className="score-box">VS</div>

                <div className="team-side visit">
                  <img src={match.logo_visitante} alt="" className="team-logo" />
                  <span className="team-name">{match.equipo_visitante}</span>
                </div>
              </div>

              <div className="b-bottom">
                {match.estadio} • {match.ciudad}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
=======
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const uefaData = {
  "OCTAVOS DE FINAL": [],
  "CUARTOS DE FINAL": [],
  "SEMIFINALES": [
    {
      id: 'semi_ida_1',
      tipo: 'IDA',
      fecha: '2026-04-28T21:00:00', 
      equipo_local: 'PARIS SG',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
      marcador: 'VS',
      equipo_visitante: 'BAYERN MÚNICH',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
      estadio: 'Parc des Princes',
      ciudad: 'París, Francia'
    },
    {
      id: 'semi_ida_2',
      tipo: 'IDA',
      fecha: '2026-04-29T21:00:00',
      equipo_local: 'ATLÉTICO MADRID',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
      marcador: 'VS',
      equipo_visitante: 'ARSENAL',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      estadio: 'Cívitas Metropolitano',
      ciudad: 'Madrid, España'
    },
    {
      id: 'semi_vuelta_1',
      tipo: 'VUELTA',
      fecha: '2026-05-05T21:00:00',
      equipo_local: 'ARSENAL',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
      marcador: 'VS',
      equipo_visitante: 'ATLÉTICO MADRID',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
      estadio: 'Emirates Stadium',
      ciudad: 'Londres, Inglaterra'
    },
    {
      id: 'semi_vuelta_2',
      tipo: 'VUELTA',
      fecha: '2026-05-06T21:00:00',
      equipo_local: 'BAYERN MÚNICH',
      logo_local: 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
      marcador: 'VS',
      equipo_visitante: 'PARIS SG',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
      estadio: 'Allianz Arena',
      ciudad: 'Múnich, Alemania'
    }
  ],
  "LA GRAN FINAL": [
    {
      id: 'final_1',
      tipo: 'FINAL',
      fecha: '2026-05-30T21:00:00',
      equipo_local: 'TBD',
      logo_local: 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png',
      marcador: 'VS',
      equipo_visitante: 'TBD',
      logo_visitante: 'https://a.espncdn.com/i/teamlogos/default-team-logo-500.png',
      estadio: 'Puskás Aréna',
      ciudad: 'Budapest, Hungría'
    }
  ]
};

export default function ChampionsIntelligence() {
  const router = useRouter();
  const [activePhase, setActivePhase] = useState("SEMIFINALES");
  const matches = uefaData[activePhase as keyof typeof uefaData] || [];

  return (
    <div className="intelligence-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');

        :root {
          --ucl-blue: #00AEEF;
          --ucl-bg: #000;
        }

        .intelligence-center {
          background: var(--ucl-bg);
          min-height: 100vh;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ── FONDO CHAMPIONS FINAL (league.jpg) ── */
        .dynamic-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('/img/league.jpg'); 
          background-size: cover; 
          background-position: center;
          filter: brightness(0.4) contrast(1.1);
        }

        .bg-overlay {
          position: fixed; inset: 0; z-index: 1;
          background: radial-gradient(circle at center, rgba(0,174,239,0.03) 0%, rgba(0,0,0,0.85) 100%);
        }

        .mission-header { position: relative; z-index: 10; padding: 30px 5vw 15px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .fix-title { font-family: 'Syncopate'; font-weight: 900; font-size: 24px; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 5px; }

        .fix-header { position: sticky; top: 0; z-index: 100; background: rgba(0,0,0,0.7); border-bottom: 1px solid rgba(0,174,239,0.15); backdrop-filter: blur(15px); padding: 12px 5vw; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { display: flex; align-items: center; gap: 8px; font-family: 'Syncopate'; font-size: 8px; color: #fff; cursor: pointer; background: none; border: none; opacity: 0.5; transition: 0.3s; letter-spacing: 1px; }
        .back-btn:hover { opacity: 1; color: var(--ucl-blue); }

        .phase-tabs { position: relative; z-index: 10; display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .phase-tab { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #666; padding: 6px 14px; font-family: 'Syncopate'; font-size: 7.5px; cursor: pointer; border-radius: 2px; transition: 0.3s; }
        .phase-tab.active { background: var(--ucl-blue); color: #fff; border-color: var(--ucl-blue); box-shadow: 0 0 15px rgba(0,174,239,0.2); }

        .matches-container { position: relative; z-index: 10; width: 100%; max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 4px; }

        /* ── FILAS "GLASS" UEFA (ESCALA PEQUEÑA PROFESIONAL) ── */
        .broadcast-row {
          display: flex; flex-direction: column;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 174, 239, 0.1);
          border-bottom: 1px solid rgba(0, 174, 239, 0.1);
        }

        .b-meta { display: flex; justify-content: center; gap: 12px; padding: 5px; background: rgba(0,0,0,0.25); font-family: 'Space Grotesk'; font-size: 8.5px; color: rgba(255,255,255,0.5); letter-spacing: 1px; font-weight: 600; }
        .b-core { display: grid; grid-template-columns: 1fr 70px 1fr; align-items: center; padding: 12px 25px; }
        
        .team-side { display: flex; align-items: center; gap: 12px; }
        .team-side.local { justify-content: flex-end; text-align: right; }
        .team-side.visit { justify-content: flex-start; text-align: left; }
        
        .team-name { font-family: 'Syncopate', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: -0.5px; }
        .team-logo { width: 35px; height: 35px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); }
        
        .score-box { font-family: 'Bebas Neue'; font-size: 22px; color: var(--ucl-blue); text-align: center; letter-spacing: 2px; }

        .b-bottom { text-align: center; padding: 6px; font-family: 'Space Grotesk'; font-size: 8.5px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; }
      `}} />

      <div className="dynamic-bg" />
      <div className="bg-overlay" />

      <header className="fix-header">
        <button onClick={() => router.push('/')} className="back-btn">
          <ChevronLeft size={12} /> REGRESAR
        </button>
        <div style={{fontFamily:'Syncopate', fontSize:'9px', fontWeight:900, opacity:0.7, letterSpacing: '1px'}}>CENTRO DE INTELIGENCIA UEFA</div>
      </header>

      <section className="mission-header">
        <Trophy size={30} color="var(--ucl-blue)" style={{marginBottom: '10px'}} />
        <h1 className="fix-title">UEFA CHAMPIONS LEAGUE</h1>
        <div style={{width: '30px', height: '1.5px', background: 'var(--ucl-blue)', margin: '0 auto'}}></div>
      </section>

      <div className="phase-tabs">
        {["OCTAVOS DE FINAL", "CUARTOS DE FINAL", "SEMIFINALES", "LA GRAN FINAL"].map(phase => (
          <button key={phase} className={`phase-tab ${activePhase === phase ? 'active' : ''}`} onClick={() => setActivePhase(phase)}>
            {phase}
          </button>
        ))}
      </div>

      <main className="matches-container">
        <AnimatePresence mode="wait">
          {matches.map((match, i) => (
            <motion.div key={match.id} initial={{opacity:0, y: 5}} animate={{opacity:1, y: 0}} transition={{delay: i * 0.02}} className="broadcast-row">
              <div className="b-meta">
                <span style={{color:'var(--ucl-blue)'}}>{match.tipo}</span>
                <span style={{opacity: 0.2}}>|</span>
                <span>{new Date(match.fecha).toLocaleDateString('es-ES', {weekday: 'short', day:'2-digit', month:'short'}).toUpperCase()}</span>
                <span style={{opacity: 0.2}}>|</span>
                <span>21:00 CET</span>
              </div>
              
              <div className="b-core">
                <div className="team-side local">
                  <span className="team-name">{match.equipo_local}</span>
                  <img src={match.logo_local} alt="" className="team-logo" />
                </div>
                
                <div className="score-box">VS</div>

                <div className="team-side visit">
                  <img src={match.logo_visitante} alt="" className="team-logo" />
                  <span className="team-name">{match.equipo_visitante}</span>
                </div>
              </div>

              <div className="b-bottom">
                {match.estadio} • {match.ciudad}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
}