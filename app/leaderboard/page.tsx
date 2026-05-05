<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Flame, Target, Terminal, Activity, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LeaderboardPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    'https://gtioqzodmulbqbohdyet.supabase.co', 
    'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
  );

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function initializeSystem() {
      // 1. EXTRAER EL MURO DE LOS 100 (DATOS REALES)
      // Ordenamos a los usuarios por su capital (pitchx_coins) de mayor a menor.
      const { data: perfilesData, error: perfilesError } = await supabase
        .from('perfiles')
        .select('id, nombre, codigo_recluta, pitchx_coins, avatar_url')
        .order('pitchx_coins', { ascending: false })
        .limit(100);

      // Extraemos las predicciones para calcular vidas y rachas reales (Opcional/Avanzado)
      const { data: prediccionesData } = await supabase
        .from('predicciones')
        .select('user_id, resultado');

      if (!perfilesError && perfilesData) {
        const rankingReal = perfilesData.map((perfil, index) => {
          // Filtramos las predicciones de este usuario en particular
          const misPredicciones = prediccionesData?.filter(p => p.user_id === perfil.id) || [];
          const perdidas = misPredicciones.filter(p => p.resultado === 'perdida').length;
          const ganadas = misPredicciones.filter(p => p.resultado === 'ganada').length;

          return {
            id: perfil.id,
            rank: index + 1,
            alias: perfil.nombre || `RECLUTA_${perfil.codigo_recluta || 'X'}`,
            racha: ganadas, // Asignamos las victorias como racha
            capital: perfil.pitchx_coins || 0,
            vidas: Math.max(3 - perdidas, 0), // 3 vidas iniciales menos las derrotas
            exp: `#${perfil.codigo_recluta || '0000'}`,
            avatar: perfil.avatar_url || `https://api.dicebear.com/8.x/adventurer/svg?seed=${perfil.nombre || perfil.id}&backgroundColor=0a0a0a`
          };
        });

        setLeaderboard(rankingReal);
      }

      // 2. EXTRAER EL HUD PERSONAL DEL RECLUTA LOGUEADO
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const miPerfil = perfilesData?.find(p => p.id === user.id);
        const misPredicciones = prediccionesData?.filter(p => p.user_id === user.id) || [];
        const misPerdidas = misPredicciones.filter(p => p.resultado === 'perdida').length;

        if (miPerfil) {
          setCurrentUser({
            id: user.id,
            nombre: miPerfil.nombre || 'RECLUTA',
            codigo: miPerfil.codigo_recluta || '0000',
            avatar_url: miPerfil.avatar_url || null,
            coins: miPerfil.pitchx_coins || 0,
            vidas_restantes: Math.max(3 - misPerdidas, 0),
          });
        }
      }

      // Terminar carga del sistema
      setTimeout(() => setLoading(false), 700);
    }
    
    initializeSystem();
  }, [supabase]);

  // Tonos sutiles metálicos para el Top 3
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { color: '#E5C158', border: 'rgba(229,193,88,0.3)', bg: 'rgba(229,193,88,0.03)' };
      case 2: return { color: '#B4B4B4', border: 'rgba(180,180,180,0.3)', bg: 'rgba(180,180,180,0.03)' };
      case 3: return { color: '#AD7F5A', border: 'rgba(173,127,90,0.3)', bg: 'rgba(173,127,90,0.03)' };
      default: return { color: 'rgba(255,255,255,0.3)', border: 'rgba(255,255,255,0.05)', bg: 'rgba(10,10,10,0.6)' };
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: 'monospace' }}>
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>
          <Activity size={32} color="rgba(255,255,255,0.5)" style={{ margin: '0 auto' }} />
        </motion.div>
        <div style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', fontSize: 10 }}>SINCRONIZANDO CON LA ARENA GLOBAL...</div>
      </div>
    );
  }

  return (
    <div className="ps5-leaderboard-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

        :root {
          --red: #FF0033;
          --green: #00C853;
          --font-sans: 'Space Grotesk', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .ps5-leaderboard-root {
          background: #000; min-height: 100vh; width: 100vw;
          font-family: var(--font-sans); color: #fff;
          position: relative; overflow-x: hidden;
        }

        /* ── ATMÓSFERA PS5 ── */
        .ambient-bg {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, #000 60%);
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px);
        }

        /* ── HEADER SUPERIOR ── */
        .top-nav {
          position: sticky; top: 0; z-index: 100;
          padding: 15px 5vw; display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 4px;
          font-family: var(--font-sans); font-size: 11px; letter-spacing: 1px;
          cursor: pointer; transition: 0.2s; text-transform: uppercase;
        }
        .btn-back:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .system-status { display: flex; gap: 10px; color: rgba(255,255,255,0.3); font-family: var(--font-mono); font-size: 9px; align-items: center; letter-spacing: 1px; }

        /* ── CONTENEDOR DE LA TABLA ── */
        .board-container { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; padding: 40px 5vw 120px; }
        
        .hero-section { margin-bottom: 40px; }
        .hero-title { font-family: var(--font-sans); font-size: clamp(24px, 4vw, 36px); font-weight: 300; letter-spacing: 2px; color: #fff; margin-bottom: 5px; }
        .hero-title span { font-weight: 700; }
        .hero-desc { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; }

        /* ── SISTEMA DE LISTA (FLEXBOX) ── */
        .list-wrapper { display: flex; flex-direction: column; gap: 6px; }

        .list-header {
          display: flex; align-items: center; padding: 0 15px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;
        }
        .head-title { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }

        .list-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 15px; border-radius: 4px; border: 1px solid;
          backdrop-filter: blur(10px); transition: background 0.2s, border-color 0.2s;
          height: 64px; /* Altura compacta */
        }
        .list-row:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.15) !important; }

        /* ── CELDAS FLEX ── */
        .cell-rank { width: 50px; display: flex; align-items: center; gap: 8px; font-family: var(--font-sans); font-size: 15px; font-weight: 700; }
        .cell-user { flex: 1; display: flex; align-items: center; gap: 12px; min-width: 0; }
        .cell-racha { width: 140px; display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); }
        
        .cell-right-block { width: 220px; display: flex; align-items: center; justify-content: flex-end; gap: 30px; }
        .cell-capital { width: 100px; text-align: right; font-family: var(--font-sans); font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; }
        .cell-vidas { width: 60px; display: flex; justify-content: flex-end; gap: 4px; }

        /* ── ESTILOS INTERNOS DE FILA ── */
        .avatar-mini { 
          min-width: 36px; width: 36px; height: 36px; border-radius: 50%; 
          border: 1px solid; display: flex; align-items: center; justify-content: center; 
          background: rgba(0,0,0,0.8); overflow: hidden;
        }
        .avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { display: flex; flex-direction: column; overflow: hidden; }
        .alias-text { font-family: var(--font-sans); font-size: 13px; font-weight: 500; color: #fff; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .exp-text { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .px-symbol { font-size: 8px; color: var(--green); font-family: var(--font-mono); margin-left: 2px; }

        .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,0,51,0.2); transition: 0.3s; }
        .dot.safe { background: var(--green); box-shadow: 0 0 6px rgba(0,200,83,0.5); }

        /* ── HUD PERSONAL DEL RECLUTA ── */
        .personal-hud {
          position: fixed; bottom: 30px; right: 30px; z-index: 500;
          background: rgba(10,10,10,0.85); backdrop-filter: blur(20px);
          border: 1px solid rgba(0,200,83,0.3); border-radius: 6px;
          padding: 15px 20px; display: flex; align-items: center; gap: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.9), 0 0 20px rgba(0,200,83,0.05);
        }
        .hud-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--green); overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; }
        .hud-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .hud-details { display: flex; flex-direction: column; gap: 4px; }
        .hud-label { font-family: var(--font-mono); font-size: 8px; color: var(--green); letter-spacing: 2px; text-transform: uppercase; }
        .hud-name { font-family: var(--font-sans); font-size: 14px; font-weight: 700; color: #fff; }
        .hud-stats { display: flex; gap: 15px; align-items: center; margin-top: 2px; }

        /* ── RESPONSIVIDAD MÓVIL ── */
        @media (max-width: 768px) {
          .list-header { display: none; }
          .board-container { padding: 30px 5vw 140px; } 
          
          .list-row { height: auto; min-height: 64px; padding: 12px 15px; }
          .cell-racha { display: none; }
          .cell-rank { width: 25px; font-size: 13px; }
          .cell-user { gap: 10px; }
          .cell-right-block { width: auto; flex-direction: column; align-items: flex-end; gap: 6px; justify-content: center; }
          .cell-capital { width: auto; font-size: 12px; line-height: 1; }
          .cell-vidas { width: auto; line-height: 1; }
          .avatar-mini { width: 30px; height: 30px; min-width: 30px; }

          .personal-hud {
            bottom: 0; right: 0; left: 0; border-radius: 0;
            border-bottom: none; border-left: none; border-right: none;
            border-top: 1px solid rgba(0,200,83,0.4);
            justify-content: space-between; padding: 12px 5vw;
          }
          .hud-avatar { width: 36px; height: 36px; }
          .hud-name { font-size: 12px; }
        }
      `}} />

      <div className="ambient-bg" />
      <div className="scanlines" />

      {/* HEADER SUPERIOR */}
      <header className="top-nav">
        <button className="btn-back" onClick={() => router.push('/radar')}>
          <ChevronLeft size={14} /> RADAR
        </button>
        <div className="system-status">
          <Terminal size={12} /> SECURE_CONNECTION
        </div>
      </header>

      <main className="board-container">
        
        {/* TITULAR MINIMALISTA PS5 */}
        <div className="hero-section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="hero-title">MURO DE LOS <span>100</span></h1>
            <div className="hero-desc">CLASIFICACIÓN GLOBAL DE SUPERVIVENCIA</div>
          </motion.div>
        </div>

        {/* CABECERA DE TABLA (PC) */}
        <div className="list-header">
          <div className="cell-rank head-title" style={{ justifyContent: 'center' }}>#</div>
          <div className="cell-user head-title">IDENTIDAD</div>
          <div className="cell-racha head-title">RACHA</div>
          <div className="cell-right-block">
            <div className="cell-capital head-title">CAPITAL</div>
            <div className="cell-vidas head-title" style={{ justifyContent: 'flex-end' }}>VIDAS</div>
          </div>
        </div>

        {/* LISTA COMPACTA */}
        <div className="list-wrapper">
          <AnimatePresence>
            {leaderboard.length > 0 ? leaderboard.map((player, index) => {
              const rankStyle = getRankStyle(player.rank);
              
              return (
                <motion.div 
                  key={player.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="list-row"
                  style={{ backgroundColor: rankStyle.bg, borderColor: rankStyle.border }}
                >
                  
                  {/* RANGO */}
                  <div className="cell-rank" style={{ color: rankStyle.color, justifyContent: 'center' }}>
                    {player.rank === 1 && <Trophy size={14} />}
                    {player.rank > 1 && player.rank <= 3 && <Target size={14} />}
                    {player.rank > 3 && player.rank}
                  </div>
                  
                  {/* USUARIO CON AVATAR REAL O ANIME */}
                  <div className="cell-user">
                    <div className="avatar-mini" style={{ borderColor: rankStyle.border }}>
                      <img src={player.avatar} alt="Avatar" />
                    </div>
                    <div className="user-info">
                      <div className="alias-text">{player.alias}</div>
                      <div className="exp-text">{player.exp}</div>
                    </div>
                  </div>

                  {/* RACHA */}
                  <div className="cell-racha">
                    <Flame size={12} color="rgba(255,255,255,0.2)" /> {player.racha} ACIERTOS
                  </div>

                  {/* BLOQUE DERECHO (Capital + Vidas) */}
                  <div className="cell-right-block">
                    <div className="cell-capital">
                      {player.capital.toLocaleString()} <span className="px-symbol">PX</span>
                    </div>

                    <div className="cell-vidas">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`dot ${i < player.vidas ? 'safe' : ''}`} />
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '50px 0', opacity: 0.3 }}>
                <Shield size={40} style={{ margin: '0 auto 15px', color: '#fff' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>NO HAY RECLUTAS REGISTRADOS</div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* ── HUD PERSONAL DEL RECLUTA LOGUEADO ── */}
      <AnimatePresence>
        {currentUser && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.5 }}
            className="personal-hud"
          >
            <div className="hud-avatar">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Mi Avatar" />
              ) : (
                <User size={20} color="var(--green)" />
              )}
            </div>
            
            <div className="hud-details">
              <div className="hud-label">TU EXPEDIENTE • #{currentUser.codigo}</div>
              <div className="hud-name">{currentUser.nombre}</div>
              
              <div className="hud-stats">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                    {currentUser.coins.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>PX</span>
                </div>
                
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`dot ${i < currentUser.vidas_restantes ? 'safe' : ''}`} style={{ width: '4px', height: '4px' }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
=======
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Flame, Target, Terminal, Activity, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LeaderboardPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    'https://gtioqzodmulbqbohdyet.supabase.co', 
    'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
  );

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function initializeSystem() {
      // 1. EXTRAER EL MURO DE LOS 100 (DATOS REALES)
      // Ordenamos a los usuarios por su capital (pitchx_coins) de mayor a menor.
      const { data: perfilesData, error: perfilesError } = await supabase
        .from('perfiles')
        .select('id, nombre, codigo_recluta, pitchx_coins, avatar_url')
        .order('pitchx_coins', { ascending: false })
        .limit(100);

      // Extraemos las predicciones para calcular vidas y rachas reales (Opcional/Avanzado)
      const { data: prediccionesData } = await supabase
        .from('predicciones')
        .select('user_id, resultado');

      if (!perfilesError && perfilesData) {
        const rankingReal = perfilesData.map((perfil, index) => {
          // Filtramos las predicciones de este usuario en particular
          const misPredicciones = prediccionesData?.filter(p => p.user_id === perfil.id) || [];
          const perdidas = misPredicciones.filter(p => p.resultado === 'perdida').length;
          const ganadas = misPredicciones.filter(p => p.resultado === 'ganada').length;

          return {
            id: perfil.id,
            rank: index + 1,
            alias: perfil.nombre || `RECLUTA_${perfil.codigo_recluta || 'X'}`,
            racha: ganadas, // Asignamos las victorias como racha
            capital: perfil.pitchx_coins || 0,
            vidas: Math.max(3 - perdidas, 0), // 3 vidas iniciales menos las derrotas
            exp: `#${perfil.codigo_recluta || '0000'}`,
            avatar: perfil.avatar_url || `https://api.dicebear.com/8.x/adventurer/svg?seed=${perfil.nombre || perfil.id}&backgroundColor=0a0a0a`
          };
        });

        setLeaderboard(rankingReal);
      }

      // 2. EXTRAER EL HUD PERSONAL DEL RECLUTA LOGUEADO
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const miPerfil = perfilesData?.find(p => p.id === user.id);
        const misPredicciones = prediccionesData?.filter(p => p.user_id === user.id) || [];
        const misPerdidas = misPredicciones.filter(p => p.resultado === 'perdida').length;

        if (miPerfil) {
          setCurrentUser({
            id: user.id,
            nombre: miPerfil.nombre || 'RECLUTA',
            codigo: miPerfil.codigo_recluta || '0000',
            avatar_url: miPerfil.avatar_url || null,
            coins: miPerfil.pitchx_coins || 0,
            vidas_restantes: Math.max(3 - misPerdidas, 0),
          });
        }
      }

      // Terminar carga del sistema
      setTimeout(() => setLoading(false), 700);
    }
    
    initializeSystem();
  }, [supabase]);

  // Tonos sutiles metálicos para el Top 3
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { color: '#E5C158', border: 'rgba(229,193,88,0.3)', bg: 'rgba(229,193,88,0.03)' };
      case 2: return { color: '#B4B4B4', border: 'rgba(180,180,180,0.3)', bg: 'rgba(180,180,180,0.03)' };
      case 3: return { color: '#AD7F5A', border: 'rgba(173,127,90,0.3)', bg: 'rgba(173,127,90,0.03)' };
      default: return { color: 'rgba(255,255,255,0.3)', border: 'rgba(255,255,255,0.05)', bg: 'rgba(10,10,10,0.6)' };
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: 'monospace' }}>
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }}>
          <Activity size={32} color="rgba(255,255,255,0.5)" style={{ margin: '0 auto' }} />
        </motion.div>
        <div style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', fontSize: 10 }}>SINCRONIZANDO CON LA ARENA GLOBAL...</div>
      </div>
    );
  }

  return (
    <div className="ps5-leaderboard-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

        :root {
          --red: #FF0033;
          --green: #00C853;
          --font-sans: 'Space Grotesk', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        .ps5-leaderboard-root {
          background: #000; min-height: 100vh; width: 100vw;
          font-family: var(--font-sans); color: #fff;
          position: relative; overflow-x: hidden;
        }

        /* ── ATMÓSFERA PS5 ── */
        .ambient-bg {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, #000 60%);
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px);
        }

        /* ── HEADER SUPERIOR ── */
        .top-nav {
          position: sticky; top: 0; z-index: 100;
          padding: 15px 5vw; display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 4px;
          font-family: var(--font-sans); font-size: 11px; letter-spacing: 1px;
          cursor: pointer; transition: 0.2s; text-transform: uppercase;
        }
        .btn-back:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .system-status { display: flex; gap: 10px; color: rgba(255,255,255,0.3); font-family: var(--font-mono); font-size: 9px; align-items: center; letter-spacing: 1px; }

        /* ── CONTENEDOR DE LA TABLA ── */
        .board-container { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; padding: 40px 5vw 120px; }
        
        .hero-section { margin-bottom: 40px; }
        .hero-title { font-family: var(--font-sans); font-size: clamp(24px, 4vw, 36px); font-weight: 300; letter-spacing: 2px; color: #fff; margin-bottom: 5px; }
        .hero-title span { font-weight: 700; }
        .hero-desc { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; }

        /* ── SISTEMA DE LISTA (FLEXBOX) ── */
        .list-wrapper { display: flex; flex-direction: column; gap: 6px; }

        .list-header {
          display: flex; align-items: center; padding: 0 15px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;
        }
        .head-title { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }

        .list-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 15px; border-radius: 4px; border: 1px solid;
          backdrop-filter: blur(10px); transition: background 0.2s, border-color 0.2s;
          height: 64px; /* Altura compacta */
        }
        .list-row:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.15) !important; }

        /* ── CELDAS FLEX ── */
        .cell-rank { width: 50px; display: flex; align-items: center; gap: 8px; font-family: var(--font-sans); font-size: 15px; font-weight: 700; }
        .cell-user { flex: 1; display: flex; align-items: center; gap: 12px; min-width: 0; }
        .cell-racha { width: 140px; display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); }
        
        .cell-right-block { width: 220px; display: flex; align-items: center; justify-content: flex-end; gap: 30px; }
        .cell-capital { width: 100px; text-align: right; font-family: var(--font-sans); font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; }
        .cell-vidas { width: 60px; display: flex; justify-content: flex-end; gap: 4px; }

        /* ── ESTILOS INTERNOS DE FILA ── */
        .avatar-mini { 
          min-width: 36px; width: 36px; height: 36px; border-radius: 50%; 
          border: 1px solid; display: flex; align-items: center; justify-content: center; 
          background: rgba(0,0,0,0.8); overflow: hidden;
        }
        .avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
        .user-info { display: flex; flex-direction: column; overflow: hidden; }
        .alias-text { font-family: var(--font-sans); font-size: 13px; font-weight: 500; color: #fff; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .exp-text { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .px-symbol { font-size: 8px; color: var(--green); font-family: var(--font-mono); margin-left: 2px; }

        .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,0,51,0.2); transition: 0.3s; }
        .dot.safe { background: var(--green); box-shadow: 0 0 6px rgba(0,200,83,0.5); }

        /* ── HUD PERSONAL DEL RECLUTA ── */
        .personal-hud {
          position: fixed; bottom: 30px; right: 30px; z-index: 500;
          background: rgba(10,10,10,0.85); backdrop-filter: blur(20px);
          border: 1px solid rgba(0,200,83,0.3); border-radius: 6px;
          padding: 15px 20px; display: flex; align-items: center; gap: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.9), 0 0 20px rgba(0,200,83,0.05);
        }
        .hud-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--green); overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; }
        .hud-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .hud-details { display: flex; flex-direction: column; gap: 4px; }
        .hud-label { font-family: var(--font-mono); font-size: 8px; color: var(--green); letter-spacing: 2px; text-transform: uppercase; }
        .hud-name { font-family: var(--font-sans); font-size: 14px; font-weight: 700; color: #fff; }
        .hud-stats { display: flex; gap: 15px; align-items: center; margin-top: 2px; }

        /* ── RESPONSIVIDAD MÓVIL ── */
        @media (max-width: 768px) {
          .list-header { display: none; }
          .board-container { padding: 30px 5vw 140px; } 
          
          .list-row { height: auto; min-height: 64px; padding: 12px 15px; }
          .cell-racha { display: none; }
          .cell-rank { width: 25px; font-size: 13px; }
          .cell-user { gap: 10px; }
          .cell-right-block { width: auto; flex-direction: column; align-items: flex-end; gap: 6px; justify-content: center; }
          .cell-capital { width: auto; font-size: 12px; line-height: 1; }
          .cell-vidas { width: auto; line-height: 1; }
          .avatar-mini { width: 30px; height: 30px; min-width: 30px; }

          .personal-hud {
            bottom: 0; right: 0; left: 0; border-radius: 0;
            border-bottom: none; border-left: none; border-right: none;
            border-top: 1px solid rgba(0,200,83,0.4);
            justify-content: space-between; padding: 12px 5vw;
          }
          .hud-avatar { width: 36px; height: 36px; }
          .hud-name { font-size: 12px; }
        }
      `}} />

      <div className="ambient-bg" />
      <div className="scanlines" />

      {/* HEADER SUPERIOR */}
      <header className="top-nav">
        <button className="btn-back" onClick={() => router.push('/radar')}>
          <ChevronLeft size={14} /> RADAR
        </button>
        <div className="system-status">
          <Terminal size={12} /> SECURE_CONNECTION
        </div>
      </header>

      <main className="board-container">
        
        {/* TITULAR MINIMALISTA PS5 */}
        <div className="hero-section">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="hero-title">MURO DE LOS <span>100</span></h1>
            <div className="hero-desc">CLASIFICACIÓN GLOBAL DE SUPERVIVENCIA</div>
          </motion.div>
        </div>

        {/* CABECERA DE TABLA (PC) */}
        <div className="list-header">
          <div className="cell-rank head-title" style={{ justifyContent: 'center' }}>#</div>
          <div className="cell-user head-title">IDENTIDAD</div>
          <div className="cell-racha head-title">RACHA</div>
          <div className="cell-right-block">
            <div className="cell-capital head-title">CAPITAL</div>
            <div className="cell-vidas head-title" style={{ justifyContent: 'flex-end' }}>VIDAS</div>
          </div>
        </div>

        {/* LISTA COMPACTA */}
        <div className="list-wrapper">
          <AnimatePresence>
            {leaderboard.length > 0 ? leaderboard.map((player, index) => {
              const rankStyle = getRankStyle(player.rank);
              
              return (
                <motion.div 
                  key={player.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="list-row"
                  style={{ backgroundColor: rankStyle.bg, borderColor: rankStyle.border }}
                >
                  
                  {/* RANGO */}
                  <div className="cell-rank" style={{ color: rankStyle.color, justifyContent: 'center' }}>
                    {player.rank === 1 && <Trophy size={14} />}
                    {player.rank > 1 && player.rank <= 3 && <Target size={14} />}
                    {player.rank > 3 && player.rank}
                  </div>
                  
                  {/* USUARIO CON AVATAR REAL O ANIME */}
                  <div className="cell-user">
                    <div className="avatar-mini" style={{ borderColor: rankStyle.border }}>
                      <img src={player.avatar} alt="Avatar" />
                    </div>
                    <div className="user-info">
                      <div className="alias-text">{player.alias}</div>
                      <div className="exp-text">{player.exp}</div>
                    </div>
                  </div>

                  {/* RACHA */}
                  <div className="cell-racha">
                    <Flame size={12} color="rgba(255,255,255,0.2)" /> {player.racha} ACIERTOS
                  </div>

                  {/* BLOQUE DERECHO (Capital + Vidas) */}
                  <div className="cell-right-block">
                    <div className="cell-capital">
                      {player.capital.toLocaleString()} <span className="px-symbol">PX</span>
                    </div>

                    <div className="cell-vidas">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`dot ${i < player.vidas ? 'safe' : ''}`} />
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '50px 0', opacity: 0.3 }}>
                <Shield size={40} style={{ margin: '0 auto 15px', color: '#fff' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>NO HAY RECLUTAS REGISTRADOS</div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* ── HUD PERSONAL DEL RECLUTA LOGUEADO ── */}
      <AnimatePresence>
        {currentUser && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.5 }}
            className="personal-hud"
          >
            <div className="hud-avatar">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Mi Avatar" />
              ) : (
                <User size={20} color="var(--green)" />
              )}
            </div>
            
            <div className="hud-details">
              <div className="hud-label">TU EXPEDIENTE • #{currentUser.codigo}</div>
              <div className="hud-name">{currentUser.nombre}</div>
              
              <div className="hud-stats">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                    {currentUser.coins.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>PX</span>
                </div>
                
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`dot ${i < currentUser.vidas_restantes ? 'safe' : ''}`} style={{ width: '4px', height: '4px' }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
}