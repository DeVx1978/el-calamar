"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, ShieldAlert, Crosshair, Terminal, Activity, Skull } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ─── INTERFACES ─────────────────────────────────────────────────────────────
interface Partido {
  id: number;
  fecha_inicio: string;
  equipo_local: string;
  equipo_visitante: string;
  bandera_local: string;
  bandera_visitante: string;
  fase: string;
  codigo_partido: string;
  resultado_prediccion?: 'ganada' | 'perdida' | null; 
}

export default function HistoryCalendar() {
  const router = useRouter();
  const supabase = createBrowserClient(
    'https://gtioqzodmulbqbohdyet.supabase.co', 
    'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
  );

  const [matches, setMatches] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── PASO 1: CONEXIÓN AL NÚCLEO (DATOS REALES DEL JUGADOR) ───
  useEffect(() => {
    async function fetchMatchesAndPredictions() {
      // 1. Extraer todos los partidos del mundial
      const { data: partidosData, error: partidosError } = await supabase
        .from('partidos')
        .select('*')
        .order('fecha_inicio', { ascending: true });

      // 2. Identificar al recluta (usuario logueado)
      const { data: { user } } = await supabase.auth.getUser();

      if (!partidosError && partidosData) {
        if (user) {
          // 3. Extraer solo las predicciones de ESTE usuario
          const { data: prediccionesData } = await supabase
            .from('predicciones')
            .select('partido_id, resultado')
            .eq('user_id', user.id);

          // 4. Inyectar el resultado en el radar del jugador
          const partidosConResultados = partidosData.map(partido => {
            const prediccion = prediccionesData?.find(p => p.partido_id === partido.id);
            return {
              ...partido,
              // Asignamos 'ganada', 'perdida' o null si no apostó
              resultado_prediccion: prediccion ? prediccion.resultado : null 
            };
          });
          setMatches(partidosConResultados);
        } else {
          // Si el sistema no detecta usuario, muestra el calendario virgen
          setMatches(partidosData);
        }
      }
      setTimeout(() => setLoading(false), 1200);
    }
    fetchMatchesAndPredictions();
  }, [supabase]);

  // ─── PASO 2: LÓGICA DE SUPERVIVENCIA REAL ───
  const getMatchStatus = (match: Partido) => {
    const matchDate = new Date(match.fecha_inicio).getTime();
    const now = Date.now();

    // Si el jugador TIENE un resultado oficial 'ganada'
    if (match.resultado_prediccion === 'ganada') {
      return { 
        state: 'won', symbol: '⭕', 
        color: '#00C853', bg: 'rgba(0,200,83,0.03)', 
        border: 'rgba(0,200,83,0.4)', label: 'CONTRATO CUMPLIDO',
        glow: '0 0 20px rgba(0,200,83,0.15)'
      };
    } 
    
    // Si el jugador TIENE un resultado oficial 'perdida'
    if (match.resultado_prediccion === 'perdida') {
      return { 
        state: 'lost', symbol: '❌', 
        color: '#FF0033', bg: 'rgba(25,0,5,0.8)', 
        border: 'rgba(255,0,51,0.5)', label: 'JUGADOR ELIMINADO',
        glow: '0 0 30px rgba(255,0,51,0.2)'
      };
    }

    // Si NO hay resultado evaluado aún
    if (matchDate > now) {
      // El partido es en el futuro
      return { 
        state: 'pending', symbol: 'VS', 
        color: 'rgba(255,255,255,0.2)', bg: 'rgba(15,15,15,0.6)', 
        border: 'rgba(255,255,255,0.05)', label: 'OBJETIVO FIJADO',
        glow: 'none'
      };
    } else {
      // El partido ya pasó, pero no hay resultado (evaluando o no apostó)
      return { 
        state: 'pending', symbol: 'VS', 
        color: 'rgba(255,255,255,0.2)', bg: 'rgba(15,15,15,0.6)', 
        border: 'rgba(255,255,255,0.05)', label: 'SIN CONTRATO / EVALUANDO',
        glow: 'none'
      };
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: 'monospace' }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ color: '#FF0033', letterSpacing: '6px', fontSize: 13, fontWeight: 900 }}>
          <Skull size={40} style={{ margin: '0 auto 20px' }} />
          ■ CONECTANDO CON EL CAMPO DE BATALLA...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="history-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

        :root {
          --red: #FF0033;
          --green: #00C853;
          --font-display: 'Syncopate', sans-serif;
          --font-mono: 'DM Mono', monospace;
          --font-body: 'Space Grotesk', sans-serif;
        }

        .history-root {
          background: #000; min-height: 100vh; width: 100vw;
          font-family: var(--font-body); color: #fff;
          position: relative; overflow-x: hidden;
        }

        /* ── ATMÓSFERA DE EJECUCIÓN ── */
        .bg-pattern {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at 50% 0%, rgba(255,0,51,0.08) 0%, transparent 60%),
                      radial-gradient(circle at 50% 100%, rgba(255,0,51,0.03) 0%, transparent 50%);
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
        }
        .bg-symbol {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-family: var(--font-display); font-size: 40vw; color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.02); z-index: 0; pointer-events: none; white-space: nowrap;
        }

        /* ── CINTA DE PELIGRO (MARQUESINA) ── */
        .warning-marquee {
          width: 100%; background: var(--red); color: #000;
          font-family: var(--font-mono); font-size: 10px; font-weight: 900; letter-spacing: 4px;
          padding: 6px 0; overflow: hidden; white-space: nowrap; position: relative; z-index: 150;
        }
        .marquee-content { display: inline-block; animation: scrollText 20s linear infinite; }
        @keyframes scrollText { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* ── NAVEGACIÓN SUPERIOR ── */
        .top-bar {
          position: sticky; top: 0; z-index: 100;
          padding: 20px 5vw; display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255,0,51,0.2);
        }

        .btn-back {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,0,51,0.1); color: var(--red);
          border: 1px solid rgba(255,0,51,0.3); padding: 12px 24px;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px;
          cursor: pointer; transition: all 0.3s ease; text-transform: uppercase;
        }
        .btn-back:hover { background: var(--red); color: #fff; box-shadow: 0 0 20px rgba(255,0,51,0.4); }

        .header-title {
          font-family: var(--font-display); font-size: 16px; font-weight: 900;
          letter-spacing: 4px; color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.4);
        }

        /* ── CONTENIDO PRINCIPAL ── */
        .main-container { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 60px 5vw; }
        .section-header { margin-bottom: 60px; text-align: center; }
        .section-title {
          font-family: var(--font-display); font-size: clamp(32px, 5vw, 54px);
          font-weight: 900; line-height: 1.1; margin-bottom: 15px; text-transform: uppercase;
          text-shadow: 0 0 30px rgba(255,0,51,0.3);
        }
        .section-desc { font-family: var(--font-mono); font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 4px; text-transform: uppercase; }

        /* ── GRID DE MASACRE ── */
        .matches-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 30px; }

        .match-card {
          border-radius: 2px; padding: 25px; position: relative; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          backdrop-filter: blur(10px); border-width: 1px; border-style: solid;
        }
        .match-card:hover { transform: translateY(-5px); }

        /* EFECTO DE ELIMINACIÓN (SCANLINES ROJOS SANGRE) */
        .elimination-overlay {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(45deg, rgba(255,0,51,0.05), rgba(255,0,51,0.05) 5px, transparent 5px, transparent 10px);
          opacity: 0.8;
        }
        /* EFECTO DE SUPERVIVENCIA */
        .survival-overlay {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: linear-gradient(180deg, rgba(0,200,83,0.02), transparent);
        }

        .card-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 10;
        }
        .match-phase { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; }
        .match-date { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }

        /* ── ARENA DE COMBATE ── */
        .clash-dome { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10; }

        .team-block { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 35%; }
        .team-flag {
          width: 54px; height: 38px; object-fit: cover; border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.1); transition: filter 0.3s;
        }
        /* Apagar la luz de los equipos si el partido está perdido */
        .match-card.state-lost .team-flag { filter: grayscale(1) brightness(0.4); border-color: rgba(255,0,51,0.3); }
        .match-card.state-won .team-flag { box-shadow: 0 0 15px rgba(0,200,83,0.2); border-color: rgba(0,200,83,0.5); }

        .team-name { font-family: var(--font-display); font-size: 11px; font-weight: 900; text-align: center; text-transform: uppercase; }
        .match-card.state-lost .team-name { color: rgba(255,255,255,0.3); text-decoration: line-through; text-decoration-color: var(--red); }

        .status-center { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 30%; position: relative; }
        
        /* ESTILOS DE LOS SÍMBOLOS ⭕ ❌ VS */
        .status-symbol { font-family: var(--font-display); font-size: 38px; font-weight: 900; line-height: 1; }
        .state-pending .status-symbol { font-size: 24px; color: rgba(255,255,255,0.2); }
        .state-won .status-symbol { color: var(--green); text-shadow: 0 0 25px var(--green); animation: pulseSafe 2s infinite; }
        .state-lost .status-symbol { color: var(--red); text-shadow: 0 0 25px var(--red); }

        @keyframes pulseSafe { 0%,100%{opacity:1} 50%{opacity:0.6} }

        .status-label {
          font-family: var(--font-mono); font-size: 8px; margin-top: 10px;
          letter-spacing: 2px; text-transform: uppercase; font-weight: 700;
          background: rgba(0,0,0,0.5); padding: 4px 8px; border: 1px solid;
        }
        .state-pending .status-label { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .state-won .status-label { border-color: var(--green); color: var(--green); }
        .state-lost .status-label { border-color: var(--red); color: var(--red); }

        /* MÓVIL */
        @media (max-width: 768px) {
          .matches-grid { grid-template-columns: 1fr; }
          .clash-dome { padding: 0 10px; }
        }
      `}} />

      <div className="bg-pattern" />
      <div className="scanlines" />
      <div className="bg-symbol">○ △ □</div>

      {/* MARQUESINA DE PELIGRO */}
      <div className="warning-marquee">
        <div className="marquee-content">
          {[...Array(6)].map((_, i) => (
            <span key={i}>⚠️ SISTEMA DE EJECUCIÓN ACTIVO • SECTOR MUNDIALISTA 2026 • REVISIÓN DE CONTRATOS • </span>
          ))}
        </div>
      </div>

      {/* ── BARRA SUPERIOR ── */}
      <header className="top-bar">
        <button className="btn-back" onClick={() => router.push('/radar')}>
          <ChevronLeft size={14} /> VOLVER AL RADAR
        </button>
        <div className="header-title hidden md:block">REGISTRO DE <span style={{color: 'var(--red)'}}>SUPERVIVENCIA</span></div>
        <div style={{ display: 'flex', gap: '15px', color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '10px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={12} /> ALERTA DE PURGA</span>
        </div>
      </header>

      <main className="main-container">
        <div className="section-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="section-title">CALENDARIO DE <span style={{ color: 'var(--red)' }}>EJECUCIÓN</span></h1>
            <p className="section-desc">AUDITORÍA DE SUPERVIVIENTES Y ELIMINADOS</p>
          </motion.div>
        </div>

        <div className="matches-grid">
          <AnimatePresence>
            {matches.length > 0 ? (
              matches.map((match, index) => {
                const status = getMatchStatus(match);
                const dateObj = new Date(match.fecha_inicio);
                const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
                const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div 
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`match-card state-${status.state}`}
                    style={{ borderColor: status.border, backgroundColor: status.bg, boxShadow: status.glow }}
                  >
                    {/* Filtros visuales de vida o muerte */}
                    {status.state === 'lost' && <div className="elimination-overlay" />}
                    {status.state === 'won' && <div className="survival-overlay" />}

                    <div className="card-header">
                      <div className="match-phase" style={{ color: status.state === 'lost' ? 'rgba(255,0,51,0.5)' : status.state === 'won' ? 'var(--green)' : 'rgba(255,255,255,0.5)' }}>
                        {match.fase}
                      </div>
                      <div className="match-date"><Clock size={10} /> {formattedDate} • {formattedTime}</div>
                    </div>

                    <div className="clash-dome">
                      {/* EQUIPO LOCAL */}
                      <div className="team-block">
                        <img 
                          src={`https://flagcdn.com/w80/${match.bandera_local?.toLowerCase() || 'un'}.png`} 
                          alt={match.equipo_local} 
                          className="team-flag"
                          onError={(e) => e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg'}
                        />
                        <span className="team-name">{match.equipo_local}</span>
                      </div>

                      {/* ESTADO CENTRAL (⭕, ❌, VS) */}
                      <div className="status-center">
                        <div className="status-symbol">{status.symbol}</div>
                        <div className="status-label">{status.label}</div>
                      </div>

                      {/* EQUIPO VISITANTE */}
                      <div className="team-block">
                        <img 
                          src={`https://flagcdn.com/w80/${match.bandera_visitante?.toLowerCase() || 'un'}.png`} 
                          alt={match.equipo_visitante} 
                          className="team-flag"
                          onError={(e) => e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg'}
                        />
                        <span className="team-name">{match.equipo_visitante}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>
                <ShieldAlert size={48} style={{ margin: '0 auto 20px', color: 'var(--red)' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px' }}>NO HAY OPERACIONES REGISTRADAS</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}