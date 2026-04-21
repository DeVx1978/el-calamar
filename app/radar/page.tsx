"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Calendar, ListOrdered, Users, Radio, Activity, Heart, Skull, 
  Database, Server, Globe, Cpu, TrendingUp, Lock, Shield, Star, Zap, Terminal, Eye, Wifi, BarChart2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const carouselSlides = [
  { id: 1, img: '/img/world cup.jpg', title: 'EL JUEGO COMIENZA', subtitle: 'BIENVENIDO AL CAMPO DE BATALLA 2026' },
  { id: 2, img: '/img/estadio.jpg', title: 'PREDICE O MUERE', subtitle: 'PROTOCOLO DE EJECUCIÓN ACTIVADO' },
  { id: 3, img: '/img/futbol.jpg', title: 'EL JACKPOT CRECE', subtitle: 'BÓVEDA DE $5.4M DISPONIBLE' },
];

export default function RadarLanding() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 🟢 MOTOR DE VIDA DINÁMICO (Sincronizado con Landing Principal)
  const [liveUsers, setLiveUsers] = useState(142502);
  const [deadUsers, setDeadUsers] = useState(45623);
  const [comaUsers, setComaUsers] = useState(11400);
  const [jackpot, setJackpot] = useState(5404357);
  const [notifications, setNotifications] = useState<{id: number, text: string, type: string}[]>([]);
  const [glitch, setGlitch] = useState(false);

  // Carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Motor de simulación de población y alertas (Mejorado para Élite)
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuación natural
      setLiveUsers(prev => prev + (Math.floor(Math.random() * 5) - 2));
      if(Math.random() > 0.7) setComaUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      if(Math.random() > 0.95) setDeadUsers(prev => prev + 1);
      setJackpot(prev => prev + Math.floor(Math.random() * 8500) + 1200);

      // Disparador de Notificaciones Live Feed
      if (Math.random() > 0.85) {
        const events = [
          { text: `JUGADOR #2207 FUE ELIMINADO`, type: "death" },
          { text: `NUEVO RECLUTA #8742 INGRESÓ`, type: "entry" },
          { text: `JUGADOR #0941 EN ESTADO CRÍTICO`, type: "coma" },
          { text: `JACKPOT ACTUALIZADO +$12,450`, type: "entry" }
        ];
        const selected = events[Math.floor(Math.random() * events.length)];
        const id = Date.now();
        setNotifications(prev => [{ id, ...selected }, ...prev].slice(0, 3));
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const g = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 7000);
    return () => clearInterval(g);
  }, []);

  return (
    <div className="calamar-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red: #FF0033;
          --green: #00C853;
          --font-display: 'Syncopate', sans-serif;
          --font-mono: 'DM Mono', monospace;
          --font-body: 'Space Grotesk', sans-serif;
          --font-impact: 'Bebas Neue', sans-serif;
        }

        .calamar-root {
          background: #000;
          min-height: 100vh;
          width: 100vw;
          font-family: var(--font-body);
          color: #fff;
          overflow-x: hidden;
          position: relative;
        }

        /* ── FONDOS TÁCTICOS ── */
        .dynamic-bg {
          position: fixed; inset: 0; z-index: 0;
          background-size: cover; background-position: center;
          transition: background-image 0.9s ease;
          filter: brightness(0.4) contrast(1.1);
        }
        .vignette {
          position: fixed; inset: 0; z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0.92) 0%, transparent 45%, rgba(0,0,0,0.85) 75%, #000 100%);
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 2; pointer-events: none;
          background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
        }
        .noise-overlay {
          position: fixed; inset: 0; z-index: 3; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* ── HUD HEADER ── */
        .top-nav {
          position: relative; z-index: 200;
          padding: 24px 5vw;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          border-bottom: 1px solid rgba(255,0,51,0.18);
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(12px);
        }

        .brand-logo { 
          font-family: var(--font-display); font-size: 22px; font-weight: 900; 
          text-shadow: 0 0 20px rgba(255,0,51,0.5);
        }
        .brand-logo span { color: var(--red); }

        .nav-stats { display: flex; gap: 10px; }
        .stat-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(0,0,0,0.5); border: 1px solid;
          padding: 10px 16px; backdrop-filter: blur(6px); min-width: 130px;
        }
        .stat-alive { border-color: rgba(0,200,83,0.4); }
        .stat-coma { border-color: rgba(255,170,0,0.4); }
        .stat-dead  { border-color: rgba(255,0,51,0.4); }
        .stat-num { font-family: var(--font-display); font-size: 14px; font-weight: 700; }
        .stat-lbl { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; }

        .jackpot-display { text-align: right; }
        .jackpot-val { 
          color: var(--green); font-size: 15px; font-family: var(--font-display); font-weight: 700;
          text-shadow: 0 0 15px rgba(0,200,83,0.4);
        }

        /* ── LIVE FEED ── */
        .live-feed {
          position: fixed; bottom: 30px; right: 30px; z-index: 5000;
          display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .feed-item {
          background: rgba(0,0,0,0.9); border: 1px solid;
          padding: 12px 20px; min-width: 260px; backdrop-filter: blur(10px);
          font-family: var(--font-mono); font-size: 10px; display: flex; align-items: center; gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* ── HERO ── */
        .hero-section { position: relative; height: 88vh; overflow: hidden; z-index: 20; }
        .hero-info { position: absolute; bottom: 15%; left: 5vw; z-index: 30; }
        .hero-title { 
          font-family: var(--font-impact); font-size: clamp(60px, 10vw, 130px);
          line-height: 0.9; text-transform: uppercase; letter-spacing: -1px;
        }
        .hero-subtitle { 
          color: var(--red); font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 6px; margin-bottom: 12px; text-transform: uppercase;
        }

        /* ── SECCIONES ── */
        .tactical-section { position: relative; z-index: 20; padding: 100px 5vw; background: #000; }
        .welcome-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
        .welcome-text h2 { font-family: var(--font-display); font-size: 32px; margin-bottom: 24px; line-height: 1.1; text-transform: uppercase; }
        .welcome-text p { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 50px; }

        .main-btn { 
          background: var(--red); color: #fff; padding: 25px 50px; border-radius: 2px;
          text-align: center; cursor: pointer; font-family: var(--font-display); font-size: 14px; 
          font-weight: 900; letter-spacing: 3px; transition: 0.4s ease;
          box-shadow: 0 0 30px rgba(255,0,51,0.3);
        }
        .main-btn:hover { background: #fff; color: var(--red); transform: translateY(-5px); }

        .sub-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 30px; }
        .sub-btn { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          padding: 20px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer; transition: 0.3s;
        }
        .sub-btn:hover { border-color: var(--red); background: rgba(255,0,51,0.05); transform: translateY(-3px); }
        .sub-btn span { font-family: var(--font-mono); font-size: 8px; color: #666; letter-spacing: 1px; text-transform: uppercase; }

        /* ── FOOTER ÉLITE ── */
        .site-footer { position: relative; z-index: 20; background: #000; border-top: 1px solid rgba(255,0,51,0.2); }
        .warning-tape { width: 100%; height: 18px; background: repeating-linear-gradient(45deg, #000, #000 14px, var(--red) 14px, var(--red) 28px); }
        .footer-main { padding: 80px 5vw 40px; }
        .footer-logo { font-family: var(--font-impact); font-size: 48px; line-height: 0.95; margin-bottom: 10px; }
        
        .pulse-icon { animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        @media (max-width: 900px) {
          .welcome-grid { grid-template-columns: 1fr; text-align: center; }
          .sub-grid { grid-template-columns: 1fr 1fr; }
        }
      `}} />

      {/* ── LIVE FEED NOTIFICATIONS ── */}
      <div className="live-feed">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="feed-item" style={{ borderColor: n.type === 'death' ? '#FF0033' : n.type === 'coma' ? '#FFAA00' : '#00C853', color: n.type === 'death' ? '#FF0033' : n.type === 'coma' ? '#FFAA00' : '#00C853' }}>
              {n.type === 'death' ? <Skull size={14} /> : n.type === 'coma' ? <Heart size={14} /> : <Activity size={14} />}
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="dynamic-bg" style={{ backgroundImage: `url(${carouselSlides[currentSlide].img})` }} />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="noise-overlay" />

      {/* ── HUD HEADER TÁCTICO ── */}
      <header className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo">RADAR <span>○△□</span></div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '5px', fontFamily: 'var(--font-mono)' }}>CENTRO DE MONITOREO 2026</div>
        </div>

        <div className="nav-stats">
          <div className="stat-pill stat-alive">
            <Activity size={12} className="pulse-icon" style={{ color: 'var(--green)' }} />
            <div><div className="stat-num" style={{ color: 'var(--green)' }}>{liveUsers.toLocaleString()}</div><div className="stat-lbl">VIVOS</div></div>
          </div>
          <div className="stat-pill stat-coma">
            <Heart size={12} className="pulse-icon" style={{ color: '#FFAA00' }} />
            <div><div className="stat-num" style={{ color: '#FFAA00' }}>{comaUsers.toLocaleString()}</div><div className="stat-lbl">EN COMA</div></div>
          </div>
          <div className="stat-pill stat-dead">
            <Skull size={12} style={{ color: 'var(--red)' }} />
            <div><div className="stat-num" style={{ color: 'var(--red)' }}>{deadUsers.toLocaleString()}</div><div className="stat-lbl">MUERTOS</div></div>
          </div>
        </div>

        <div className="jackpot-display">
          <div style={{fontSize: '8px', color: 'var(--red)', marginBottom: '4px', letterSpacing: '2px'}}>BÓVEDA DISPONIBLE</div>
          <div className="jackpot-val">${jackpot.toLocaleString()} PX</div>
        </div>
      </header>

      <main>
        {/* ── HERO SECTION ── */}
        <section className="hero-section">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} className="absolute inset-0">
              <div className="hero-info">
                <p className="hero-subtitle">{carouselSlides[currentSlide].subtitle}</p>
                <h1 className="hero-title">{carouselSlides[currentSlide].title}</h1>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── TACTICAL SECTION ── */}
        <section className="tactical-section">
          <div className="welcome-grid">
            <div className="welcome-text">
              <h2>ESTADÍSTICAS <span style={{ color: 'var(--red)' }}>EN TIEMPO REAL</span></h2>
              <p>Cada fluctuación en el radar representa una vida o una eliminación definitiva. <br />Monitorea el campo de batalla antes de entrar a la Arena.</p>
              
              {/* 🛡️ CORRECCIÓN: ACCESO DIRECTO AL CAMPO DE BATALLA */}
              <div className="main-btn" onClick={() => router.push('/campo-de-batalla')}>ENTRAR AL CAMPO DE BATALLA</div>

              <div className="sub-grid">
                <div className="sub-btn" onClick={() => router.push('/recharge')}><Wallet size={20} color="var(--red)" /><span>BÓVEDA</span></div>
                <div className="sub-btn" onClick={() => router.push('/history')}><Calendar size={20} color="var(--red)" /><span>FECHAS</span></div>
                <div className="sub-btn" onClick={() => router.push('/leaderboard')}><ListOrdered size={20} color="var(--red)" /><span>RANKING</span></div>
                <div className="sub-btn" onClick={() => router.push('/profile')}><Users size={20} color="var(--red)" /><span>PERFIL</span></div>
              </div>
            </div>

            <div className="hidden lg:block">
              <img src="/img/calamar.jpg" alt="El Calamar" style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,0,51,0.3)', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ÉLITE ── */}
      <footer className="site-footer">
        <div className="warning-tape" />
        <div className="footer-main">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px' }}>
            <div>
              <div className="footer-logo">EL CALAMAR<br /><span style={{ color: 'var(--red)' }}>MUNDIALISTA</span></div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '4px' }}>CENTRO DE MANDO • 2026</p>
              <div style={{ marginTop: '30px', background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.2)', padding: '16px', maxWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="status-dot green-dot" style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>RED SEGURA • OPERATIVA</span>
                </div>
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--red)', marginBottom: '24px' }}>SISTEMA</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}><Cpu size={12} /> CPU LOAD: 34%</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}><Database size={12} /> ENCRIPTADO AES-256</div>
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--red)', marginBottom: '24px' }}>LEGAL</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>REGLAMENTO</a>
                <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>PRIVACIDAD</a>
              </nav>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'transparent', WebkitTextStroke: '1px rgba(255,0,51,0.2)' }}>○ △ □</div>
            </div>
          </div>
          <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
            © 2026 EL CALAMAR MUNDIALISTA. LA SUPERVIVENCIA NO ESTÁ GARANTIZADA. TODAS LAS APUESTAS SON IRREVERSIBLES.
          </div>
        </div>
      </footer>
    </div>
  );
}