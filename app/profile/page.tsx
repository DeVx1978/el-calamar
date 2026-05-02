"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, User, Mail, Calendar, Shield, Activity,
  Skull, Wallet, MapPin, Fingerprint, Database, Terminal, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// ✅ CORRECCIÓN: Cliente centralizado — sin keys hardcodeadas
import { supabase } from '@/lib/supabase';

export default function ReclutaProfile() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [userData, setUserData]   = useState<any>(null);
  const [userStats, setUserStats] = useState({
    ganadas: 0, perdidas: 0, total: 0,
    pitchx: 0, lives: 0, streak: 0, status: 'VIVO'
  });

  useEffect(() => {
    async function fetchReclutaData() {
      // ✅ getUser() es más seguro que getSession()
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // ✅ Tabla unificada: profiles (no perfiles)
      const { data: perfil } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // ✅ Tabla unificada: predictions (no predicciones)
      const { data: predicciones } = await supabase
        .from('predictions')
        .select('is_correct')
        .eq('user_id', user.id);

      let ganadas = 0;
      let perdidas = 0;
      if (predicciones) {
        ganadas  = predicciones.filter(p => p.is_correct === true).length;
        perdidas = predicciones.filter(p => p.is_correct === false).length;
      }

      setUserData({
        id:          user.id,
        email:       user.email,
        created_at:  user.created_at,
        // ✅ Campos correctos de la tabla profiles
        nombre:      perfil?.username     || perfil?.full_name || 'RECLUTA DESCONOCIDO',
        pais:        perfil?.country      || 'ZONA NO IDENTIFICADA',
        player_code: perfil?.player_code  || `CQ-${Math.floor(Math.random() * 900000) + 100000}`,
        avatar_url:  perfil?.avatar_url   || null,
      });

      setUserStats({
        ganadas,
        perdidas,
        total:   ganadas + perdidas,
        // ✅ Campos correctos de la tabla profiles
        pitchx:  perfil?.pitchx_balance ?? 0,
        lives:   perfil?.lives          ?? 0,
        streak:  perfil?.streak         ?? 0,
        status:  perfil?.status         || 'VIVO',
      });

      setTimeout(() => setLoading(false), 1200);
    }
    fetchReclutaData();
  }, [router]);

  const isDead  = userStats.status === 'ELIMINADO';
  const isComa  = userStats.status === 'COMA';
  const winRate = userStats.total > 0
    ? Math.round((userStats.ganadas / userStats.total) * 100)
    : 0;

  // ── PANTALLA DE CARGA ──
  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: 'monospace' }}>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ color: '#00C853', letterSpacing: '6px', fontSize: 13, fontWeight: 900, textAlign: 'center' }}
        >
          <Fingerprint size={40} style={{ margin: '0 auto 20px', display: 'block' }} />
          DESENCRIPTANDO EXPEDIENTE DEL RECLUTA...
        </motion.div>
      </div>
    );
  }

  // ── SIN USUARIO ──
  if (!userData) {
    return (
      <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FF0033', fontFamily: 'monospace' }}>
        <Shield size={60} style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '24px', letterSpacing: '4px' }}>ACCESO DENEGADO</h1>
        <p style={{ marginTop: '10px', opacity: 0.6 }}>NO SE DETECTA CREDENCIAL DE RECLUTA</p>
        <button
          onClick={() => router.push('/login')}
          style={{ marginTop: '30px', background: '#FF0033', color: '#fff', border: 'none', padding: '15px 30px', cursor: 'pointer', fontFamily: 'Syncopate, sans-serif', letterSpacing: '2px' }}
        >
          IDENTIFICARSE
        </button>
      </div>
    );
  }

  // ── COLOR DE ESTADO ──
  const statusColor = isDead ? '#FF0033' : isComa ? '#FFAA00' : '#00C853';
  const statusLabel = isDead ? 'ELIMINADO' : isComa ? 'EN COMA' : 'VIVO';

  return (
    <div className="profile-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

        :root {
          --red:   #FF0033;
          --green: #00C853;
          --font-display: 'Syncopate', sans-serif;
          --font-mono:    'DM Mono', monospace;
          --font-body:    'Space Grotesk', sans-serif;
        }

        .profile-root {
          background: #000; min-height: 100vh; width: 100vw;
          font-family: var(--font-body); color: #fff;
          position: relative; overflow-x: hidden;
        }

        .bg-grid {
          position: fixed; inset: 0; z-index: 0; opacity: 0.15;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%);
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
        }

        .top-bar {
          position: sticky; top: 0; z-index: 100;
          padding: 20px 5vw; display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0,200,83,0.2);
        }
        .btn-back {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(0,200,83,0.05); color: var(--green);
          border: 1px solid rgba(0,200,83,0.3); padding: 12px 24px;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px;
          cursor: pointer; transition: all 0.3s ease; text-transform: uppercase;
        }
        .btn-back:hover { background: var(--green); color: #000; box-shadow: 0 0 20px rgba(0,200,83,0.4); transform: translateX(-5px); }
        .header-title {
          font-family: var(--font-display); font-size: 16px; font-weight: 900;
          letter-spacing: 4px; color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.4);
        }

        .dossier-container {
          position: relative; z-index: 10; max-width: 1000px; margin: 60px auto; padding: 0 5vw;
          display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px;
        }

        .id-card {
          background: rgba(10,10,10,0.9); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px; padding: 30px; position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8); backdrop-filter: blur(10px); overflow: hidden;
        }
        .id-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: ${statusColor}; box-shadow: 0 0 20px ${statusColor};
        }

        .avatar-box {
          width: 120px; height: 120px; margin: 0 auto 20px;
          border: 2px solid ${isDead ? 'var(--red)' : 'rgba(255,255,255,0.2)'};
          background: rgba(255,255,255,0.02);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .avatar-box img { width: 100%; height: 100%; object-fit: cover; filter: ${isDead ? 'grayscale(100%)' : 'none'}; opacity: 0.9; }
        .status-badge {
          position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
          background: ${statusColor}; color: #000;
          font-family: var(--font-mono); font-size: 9px; font-weight: 900;
          padding: 4px 12px; letter-spacing: 2px; box-shadow: 0 0 15px ${statusColor}; z-index: 5;
        }

        .id-data-row { margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px; }
        .id-label { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; display: block; }
        .id-value { font-family: var(--font-display); font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 1px; word-break: break-all; }
        .id-value-mono { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.8); }

        .barcode {
          height: 40px; width: 100%; margin-top: 30px; opacity: 0.5;
          background: repeating-linear-gradient(to right,
            #fff, #fff 2px, transparent 2px, transparent 4px,
            #fff 4px, #fff 5px, transparent 5px, transparent 8px,
            #fff 8px, #fff 12px, transparent 12px, transparent 14px
          );
        }

        .tactical-panel { display: flex; flex-direction: column; gap: 20px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-box {
          background: rgba(15,15,15,0.8); border: 1px solid rgba(255,255,255,0.05);
          padding: 20px; border-radius: 2px;
        }
        .stat-box-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.5); letter-spacing: 2px; margin-bottom: 15px; text-transform: uppercase; }
        .stat-box-value { font-family: var(--font-display); font-size: 32px; font-weight: 900; }

        .vault-box {
          background: linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(5,5,5,1) 100%);
          border: 1px solid rgba(255,215,0,0.2); padding: 30px; border-radius: 2px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: inset 0 0 30px rgba(255,215,0,0.02);
        }
        .vault-label { font-family: var(--font-mono); font-size: 10px; color: rgba(255,215,0,0.6); letter-spacing: 3px; margin-bottom: 8px; }
        .vault-value { font-family: var(--font-display); font-size: 28px; color: #FFD700; font-weight: 900; text-shadow: 0 0 20px rgba(255,215,0,0.4); }

        /* Caja de vidas */
        .lives-box {
          background: rgba(255,0,51,0.05); border: 1px solid rgba(255,0,51,0.2);
          padding: 20px; border-radius: 2px;
          display: flex; justify-content: space-between; align-items: center;
        }

        .btn-batalla {
          width: 100%; background: rgba(255,255,255,0.05); color: #fff;
          border: 1px solid rgba(255,255,255,0.1); padding: 20px;
          font-family: var(--font-display); font-size: 12px; letter-spacing: 2px;
          cursor: pointer; transition: 0.3s;
        }
        .btn-batalla:hover { background: var(--red); border-color: var(--red); }

        @media (max-width: 900px) { .dossier-container { grid-template-columns: 1fr; } }
      `}} />

      <div className="bg-grid" />
      <div className="scanlines" />

      <header className="top-bar">
        <button className="btn-back" onClick={() => router.push('/radar')}>
          <ChevronLeft size={14} /> CENTRO DE MANDO
        </button>
        <div className="header-title hidden md:block">EXPEDIENTE DEL RECLUTA</div>
        <div style={{ display: 'flex', gap: '15px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '10px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} /> SYS_DATA_LINKED
          </span>
        </div>
      </header>

      <main className="dossier-container">

        {/* ── COLUMNA 1: ID CARD ── */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="id-card">
            <div className="avatar-box">
              {userData.avatar_url
                ? <img src={userData.avatar_url} alt="Avatar" />
                : <User size={50} color={isDead ? 'var(--red)' : 'rgba(255,255,255,0.2)'} />
              }
              <div className="status-badge">{statusLabel}</div>
            </div>

            <div className="id-data-row" style={{ textAlign: 'center', marginBottom: '30px', border: 'none' }}>
              <span className="id-label">CODIGO DE JUGADOR</span>
              <span style={{ fontFamily: 'Syncopate, sans-serif', fontSize: '20px', color: 'var(--red)', letterSpacing: '2px' }}>
                {userData.player_code}
              </span>
            </div>

            <div className="id-data-row">
              <span className="id-label"><User size={10} className="inline mr-1" /> ALIAS / NOMBRE</span>
              <span className="id-value">{userData.nombre}</span>
            </div>

            <div className="id-data-row">
              <span className="id-label"><Mail size={10} className="inline mr-1" /> CREDENCIAL DE ACCESO</span>
              <span className="id-value-mono">{userData.email}</span>
            </div>

            <div className="id-data-row">
              <span className="id-label"><MapPin size={10} className="inline mr-1" /> SECTOR (PAIS)</span>
              <span className="id-value">{userData.pais}</span>
            </div>

            <div className="id-data-row">
              <span className="id-label"><Calendar size={10} className="inline mr-1" /> FECHA DE INGRESO</span>
              <span className="id-value-mono">
                {new Date(userData.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }).toUpperCase()}
              </span>
            </div>

            <div className="id-data-row" style={{ border: 'none' }}>
              <span className="id-label"><Database size={10} className="inline mr-1" /> HASH DE SEGURIDAD (UID)</span>
              <span className="id-value-mono" style={{ fontSize: '8px', opacity: 0.5 }}>{userData.id}</span>
            </div>

            <div className="barcode" />
            <div style={{ textAlign: 'center', marginTop: '5px', fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.4 }}>
              {userData.id.split('-').join('').toUpperCase().substring(0, 24)}
            </div>
          </div>
        </motion.div>

        {/* ── COLUMNA 2: ESTADÍSTICAS ── */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="tactical-panel">

            {/* BÓVEDA PitchX */}
            <div className="vault-box">
              <div>
                <div className="vault-label">BOVEDA PERSONAL (PITCHX)</div>
                <div className="vault-value">
                  {userStats.pitchx.toLocaleString()}
                  <span style={{ fontSize: '14px', color: 'rgba(255,215,0,0.6)' }}> PX</span>
                </div>
              </div>
              <Wallet size={40} color="rgba(255,215,0,0.2)" />
            </div>

            {/* VIDAS RESTANTES */}
            <div className="lives-box">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,0,51,0.6)', letterSpacing: '3px', marginBottom: '8px' }}>
                  VIDAS RESTANTES
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FF0033', fontWeight: 900 }}>
                  {userStats.lives}
                  <span style={{ fontSize: '14px', color: 'rgba(255,0,51,0.6)' }}> VIDAS</span>
                </div>
                {userStats.streak > 0 && (
                  <div style={{ fontSize: '10px', color: '#00C853', fontFamily: 'var(--font-mono)', marginTop: '5px' }}>
                    RACHA ACTUAL: {userStats.streak} ✓ ({5 - (userStats.streak % 5)} para vida gratis)
                  </div>
                )}
              </div>
              <Shield size={40} color="rgba(255,0,51,0.2)" />
            </div>

            {/* STATS GRID */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-box-title"><Activity size={14} color="var(--green)" /> TASA SUPERVIVENCIA</div>
                <div className="stat-box-value" style={{ color: 'var(--green)' }}>{winRate}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>EFECTIVIDAD GLOBAL</div>
              </div>

              <div className="stat-box">
                <div className="stat-box-title"><Shield size={14} color="#00BFFF" /> OPERACIONES TOTALES</div>
                <div className="stat-box-value" style={{ color: '#00BFFF' }}>{userStats.total}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>CONTRATOS FIRMADOS</div>
              </div>

              <div className="stat-box">
                <div className="stat-box-title"><Star size={14} color="var(--green)" /> ACIERTOS TACTICOS</div>
                <div className="stat-box-value" style={{ color: 'var(--green)' }}>{userStats.ganadas}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>PREDICCIONES CORRECTAS</div>
              </div>

              <div className="stat-box" style={{ borderColor: isDead ? 'rgba(255,0,51,0.3)' : 'rgba(255,255,255,0.05)' }}>
                <div className="stat-box-title"><Skull size={14} color="var(--red)" /> FALLOS CRITICOS</div>
                <div className="stat-box-value" style={{ color: 'var(--red)' }}>{userStats.perdidas}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>PREDICCIONES ERRADAS</div>
              </div>
            </div>

            <button className="btn-batalla" onClick={() => router.push('/radar')}>
              IR AL CAMPO DE BATALLA
            </button>

          </div>
        </motion.div>
      </main>
    </div>
  );
}