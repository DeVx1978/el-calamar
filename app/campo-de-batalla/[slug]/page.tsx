"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, MapPin, Calendar, Users, Activity, Wallet, 
  ShieldCheck, AlertCircle, ChevronLeft, Zap, Lock, Heart,
  Target, Info, ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// 📡 PROTOCOLO DE CARGA TÁCTICA: "PS5_ENGINE_GRANULADO"
const ProtocoloPS5 = ({ etapa }: { etapa: 'rojo' | 'amarillo' | 'verde' }) => {
  const glifo = etapa === 'rojo' ? '◯' : etapa === 'amarillo' ? '△' : '▢';
  const color = etapa === 'rojo' ? '#FF0033' : etapa === 'amarillo' ? '#FFD700' : '#00C853';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3FeclfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div style={{ fontFamily: 'SquidGame', fontSize: '180px', color: color, textShadow: `0 0 80px ${color}` }}>{glifo}</div>
      <div style={{ fontFamily: 'Syncopate', fontSize: '12px', letterSpacing: '12px', marginTop: '40px', color: color, fontWeight: 'bold' }}>SINC_VECTORES_TÁCTICOS_</div>
    </div>
  );
};

export default function ArenaDetallePage() {
  const manejarSelloDeContrato = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generar-escenario', {
        body: { user_id: 'Recluta_001', match_id: 'partido_123' }
      });
      if (error) throw error;
      alert("¡Conexión Exitosa con el Motor!");
    } catch (err) {
      console.error("Fallo crítico:", err);
    }
  };

  const params = useParams();
  const router = useRouter();
  const [etapaCarga, setEtapaCarga] = useState<'rojo' | 'amarillo' | 'verde' | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const [match, setMatch] = useState<any>(null);
  const [player] = useState<any>({ username: 'JOSE_RECLUTA', lives: 35, pitchx_balance: 5404357 });
  const [config, setConfig] = useState<any>({ color: '#00C853', name: 'SECTOR_IDENTIFICADO' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sincronizarSectorReal = async () => {
      try { 
        setLoading(true);

        const { data: torneoEncontrado } = await supabase
          .from('tournaments')
          .select('name, accent_color, slug') 
          .eq('slug', slug)
          .maybeSingle();

        if (torneoEncontrado) {
          setConfig({
            name: torneoEncontrado.name || "OPERACIÓN_ACTIVA",
            color: torneoEncontrado.accent_color || "#00C853"
          });
        }

        const { data: MData } = await supabase
          .from('partidos')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (MData) setMatch(MData);

      } catch (err) {
        console.error("Fallo en sincronización:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (id && slug) sincronizarSectorReal();
  }, [id, slug]);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="pulse-neon"></div>
        <p>ESCANEANDO SECTOR: {slug}...</p>
        <style jsx>{`
          .loader-screen { height: 100vh; background: #000; color: #00C853; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; gap: 20px; }
          .pulse-neon { width: 80px; height: 80px; border: 2px solid #00C853; border-radius: 50%; animation: pulse 1s infinite; box-shadow: 0 0 20px #00C853; }
          @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.1); opacity: 0; } }
          p { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; }
        `}</style>
      </div>
    );
  }

  return (
    <main className="arena-root" style={{ '--accent': config.color } as any}>
      <div className="vignette"></div>
      <div className="scanlines"></div>

      <header className="arena-header">
        <div className="nav-top">
          <button onClick={() => router.push(`/campo-de-batalla/${slug}`)} className="back-btn">
            <ChevronLeft size={16} /> VOLVER_AL_RADAR
          </button>
          <div className="status-badge">
            <span className="dot"></span> SECTOR_ID: {id}
          </div>
        </div>

        <div className="hud-content">
          <div className="title-section">
            <span className="op-tag">OPERACIÓN: {config.name}</span>
            <h1 className="match-title">{match?.home_team || 'ATLÉTICO DE MADRID'} VS {match?.away_team || 'ARSENAL'}</h1>
          </div>

          <div className="player-stats-hub">
            <div className="stat-card lives">
              <Heart size={14} fill="#FF0055" />
              <div className="data">
                <span className="lbl">JUGADOR: {player.username}</span>
                <span className="val">{player.lives} VIDAS</span>
              </div>
            </div>
            <div className="stat-card pitchx">
              <Wallet size={14} color="var(--accent)" />
              <div className="data">
                <span className="lbl">BÓVEDA PITX</span>
                <span className="val">{Number(player.pitchx_balance).toLocaleString()} PX</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="battle-grid">
        <div className="main-theatre">

          {/* BANNER ÉLITE: Equipos, Banderas y Reloj Restaurado */}
          <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '30px 40px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <img src="https://flagcdn.com/w160/es.png" alt="Local" style={{ width: '90px', borderRadius: '5px', marginBottom: '15px', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }} />
                <h2 style={{ fontFamily: 'Syncopate', fontSize: '10px', color: '#fff' }}>ATLÉTICO DE MADRID</h2>
              </div>
              
              <div style={{ fontFamily: 'Syncopate', fontSize: '24px', color: '#FF0033', fontWeight: '900', textShadow: '0 0 15px rgba(255,0,51,0.5)' }}>VS</div>
              
              <div style={{ textAlign: 'center' }}>
                <img src="https://flagcdn.com/w160/gb-eng.png" alt="Visitante" style={{ width: '90px', borderRadius: '5px', marginBottom: '15px', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }} />
                <h2 style={{ fontFamily: 'Syncopate', fontSize: '10px', color: '#fff' }}>ARSENAL</h2>
              </div>
            </div>

            <div style={{ background: '#000', border: '1px solid rgba(0,200,83,0.3)', padding: '20px 30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 0 20px rgba(0,200,83,0.05) inset' }}>
              <div style={{ fontSize: '8px', color: '#888', fontFamily: 'Syncopate', letterSpacing: '3px', marginBottom: '10px' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: '5px', marginBottom: '-2px' }} />
                TIEMPO DE OPERACIÓN
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#00C853', textShadow: '0 0 20px rgba(0,200,83,0.4)', fontFamily: 'Space Grotesk' }}>
                08:56<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>:83</span>
              </div>
            </div>

          </div>
          
          {/* CUADRÍCULA ÉLITE: 2 Filas x 2 Columnas */}
          <div className="markets-grid">
            
            {/* MERCADO 1: LÍNEA DE DINERO */}
            <div className="card-glass">
              <div className="card-h">
                <Zap size={14} color="var(--accent)" />
                <span>MERCADO: LÍNEA DE DINERO (1X2)</span>
              </div>
              <div className="odds-row">
                <button className="odd-btn">
                  <span className="shape">△</span>
                  <span className="t-n">LOCAL</span>
                  <span className="p-x">[2.10]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">◯</span>
                  <span className="t-n">EMPATE</span>
                  <span className="p-x">[3.40]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">✕</span>
                  <span className="t-n">VISITANTE</span>
                  <span className="p-x">[3.10]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">▢</span>
                  <span className="t-n">NO BET</span>
                  <span className="p-x">[1.00]</span>
                </button>
              </div>
            </div>

            {/* MERCADO 2: TOTAL DE GOLES */}
            <div className="card-glass">
              <div className="card-h">
                <BarChart3 size={14} color="var(--accent)" />
                <span>MERCADO: TOTAL GOLES O/U 2.5</span>
              </div>
              <div className="odds-row">
                <button className="odd-btn">
                  <span className="shape">△</span>
                  <span className="t-n">OVER 2.5</span>
                  <span className="p-x">[1.85]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">◯</span>
                  <span className="t-n">UNDER 2.5</span>
                  <span className="p-x">[1.95]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">✕</span>
                  <span className="t-n">OVER 3.5</span>
                  <span className="p-x">[3.20]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">▢</span>
                  <span className="t-n">UNDER 1.5</span>
                  <span className="p-x">[3.50]</span>
                </button>
              </div>
            </div>

            {/* MERCADO 3: PRIMERA SANGRE */}
            <div className="card-glass">
              <div className="card-h">
                <Target size={14} color="var(--accent)" />
                <span>MERCADO: PRIMERA SANGRE</span>
              </div>
              <div className="odds-row">
                <button className="odd-btn">
                  <span className="shape">△</span>
                  <span className="t-n">LOCAL</span>
                  <span className="p-x">[1.90]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">◯</span>
                  <span className="t-n">VISITANTE</span>
                  <span className="p-x">[2.10]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">✕</span>
                  <span className="t-n">SIN GOLES</span>
                  <span className="p-x">[8.50]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">▢</span>
                  <span className="t-n">AUTOGOL</span>
                  <span className="p-x">[12.00]</span>
                </button>
              </div>
            </div>

            {/* MERCADO 4: AMBOS MARCAN */}
            <div className="card-glass">
              <div className="card-h">
                <ShieldCheck size={14} color="var(--accent)" />
                <span>MERCADO: AMBOS EQUIPOS MARCAN</span>
              </div>
              <div className="odds-row">
                <button className="odd-btn">
                  <span className="shape">△</span>
                  <span className="t-n">SÍ</span>
                  <span className="p-x">[1.75]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">◯</span>
                  <span className="t-n">NO</span>
                  <span className="p-x">[2.05]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">✕</span>
                  <span className="t-n">SOLO LOCAL</span>
                  <span className="p-x">[4.10]</span>
                </button>
                <button className="odd-btn">
                  <span className="shape">▢</span>
                  <span className="t-n">SOLO VISITA</span>
                  <span className="p-x">[5.20]</span>
                </button>
              </div>
            </div>
          </div>
          {/* FIN CUADRÍCULA ÉLITE */}
          
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#555', fontFamily: 'Syncopate', fontSize: '10px', letterSpacing: '4px' }}>
            <ShieldCheck size={14} style={{ display: 'inline', marginBottom: '-3px', marginRight: '5px' }} /> 
            ESPERANDO VECTORES
          </div>

        </div>

        <aside className="tactical-sidebar">
          <div className="card-glass intel">
            <h3 className="i-title">REPORTE_TÁCTICO_</h3>
            <div className="i-body">
              <div className="i-row"><MapPin size={14} /> <span>{match?.stadium || 'ESTADIO_CÍVICO_METROPOLITANO'}</span></div>
              <div className="i-row"><Clock size={14} /> <span>08:48:42 Restantes</span></div>
              <div className="risk-box">
                <span className="r-lbl">RIESGO_ESTIMADO:</span>
                <span className="r-val">FASE_ELIMINATORIA</span>
              </div>
              <div className="warn-panel">
                <AlertCircle size={14} color="#FF0055" />
                <p>Supervisando a Jose_Recluta. Cada fallo restará vidas de su bóveda.</p>
              </div>
              <button className="confirm-btn" onClick={manejarSelloDeContrato}>SELLAR_CONTRATO_</button>
            </div>
          </div>
        </aside>
      </section>

      <style jsx>{`
        .arena-root { min-height: 100vh; background: #000; color: #fff; position: relative; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
        .vignette { position: fixed; inset: 0; background: radial-gradient(circle, transparent 20%, #000 100%); z-index: 1; pointer-events: none; }
        .scanlines { position: fixed; inset: 0; z-index: 2; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,83,0.03) 2px, rgba(0,255,83,0.03) 4px); }
        .arena-header { position: relative; z-index: 10; padding: 40px 5vw; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); }
        .nav-top { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: none; border: none; color: #555; font-family: 'Syncopate'; font-size: 9px; cursor: pointer; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; }
        .status-badge { color: var(--accent); font-family: 'Syncopate'; font-size: 8px; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }
        .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: blink 1s infinite; }
        .hud-content { display: flex; justify-content: space-between; align-items: flex-end; }
        .op-tag { font-family: 'Syncopate'; font-size: 8px; color: var(--accent); letter-spacing: 4px; }
        .match-title { font-family: 'Syncopate'; font-size: 1.8rem; font-weight: 900; text-transform: uppercase; }
        .player-stats-hub { display: flex; gap: 20px; }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 15px 25px; border-radius: 12px; display: flex; align-items: center; gap: 15px; }
        .stat-card.lives { border-color: rgba(255,0,85,0.3); }
        .lbl { display: block; font-size: 7px; color: #555; font-family: 'Syncopate'; margin-bottom: 5px; }
        .val { display: block; font-size: 1.3rem; font-weight: 900; }
        .lives .val { color: #FF0055; text-shadow: 0 0 10px rgba(255,0,85,0.3); }
        .pitchx .val { color: var(--accent); text-shadow: 0 0 10px rgba(0,200,83,0.3); }
        
        .battle-grid { position: relative; z-index: 10; padding: 60px 5vw; display: grid; grid-template-columns: 1fr 350px; gap: 40px; max-width: 1400px; margin: 0 auto; }
        
        .markets-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        
        .card-glass { background: rgba(10,10,10,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 35px; backdrop-filter: blur(20px); }
        .card-h { display: flex; align-items: center; gap: 12px; font-family: 'Syncopate'; font-size: 9px; color: #555; margin-bottom: 30px; }
        
        .odds-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        
        .odd-btn { background: #000 !important; border: 1px solid #1a1a1a; padding: 20px 10px; border-radius: 12px; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #fff !important; }
        .odd-btn:hover { border-color: var(--accent); background: rgba(0,200,83,0.05); }
        .shape { font-size: 12px; color: #888; margin-bottom: 5px; }
        .t-n { font-family: 'Syncopate'; font-size: 8px; color: #777; }
        .p-x { font-size: 1.4rem; font-weight: 900; color: var(--accent); }
        .i-title { font-family: 'Syncopate'; font-size: 11px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 25px; }
        .i-row { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; color: #888; font-size: 0.9rem; }
        .risk-box { background: rgba(0,200,83,0.02); padding: 20px; border-radius: 12px; border: 1px solid rgba(0,200,83,0.1); margin: 30px 0; }
        .r-lbl { display: block; font-size: 7px; color: #444; font-family: 'Syncopate'; margin-bottom: 5px; }
        .r-val { color: var(--accent); font-weight: bold; }
        .warn-panel { background: rgba(255,0,85,0.03); padding: 15px; border-radius: 10px; display: flex; gap: 12px; color: #ff0055; font-size: 0.75rem; border: 1px solid rgba(255,0,85,0.1); }
        .confirm-btn { width: 100%; padding: 20px; background: var(--accent); color: #000; border: none; border-radius: 10px; font-family: 'Syncopate'; font-weight: 900; font-size: 10px; cursor: pointer; margin-top: 30px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        
        @media (max-width: 1100px) { 
          .battle-grid { grid-template-columns: 1fr; } 
          .markets-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      
      <AnimatePresence>
        {isLaunching && etapaCarga && <ProtocoloPS5 etapa={etapaCarga} />}
      </AnimatePresence>
    </main>
  );
}