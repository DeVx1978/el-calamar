"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Calendar, ListOrdered, Users, Radio, Activity, Heart, Skull, 
  Database, Server, Globe, Cpu, TrendingUp, Lock, Shield, Star, Zap, Terminal, Eye, Wifi, BarChart2, Crosshair, Play,
  ChevronRight, Target, Map
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 🛡️ INYECCIÓN DE CONECTIVIDAD SUPABASE
import { supabase } from '@/lib/supabase';

export default function RadarLanding() {
  const router = useRouter();
  
 // 🟢 MOTOR HÍBRIDO: GHOST PLAYERS + REAL DATA
  const GHOST_BASE = 20000; // Iniciamos con 20k como pediste
  const [liveUsers, setLiveUsers] = useState(GHOST_BASE);
  const [deadUsers, setDeadUsers] = useState(542); // Eliminados acumulados simulados
  const [comaUsers, setComaUsers] = useState(120);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLives, setUserLives] = useState<number | null>(null);
  
  // 💰 JACKPOT: 100k Fijos + Real
  const [jackpot, setJackpot] = useState(100000); 
  
  const [notifications, setNotifications] = useState<{id: number, text: string, type: string}[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  // 🛰️ 1. VARIABLES DEL EXPEDIENTE
  const [profileData, setProfileData] = useState({ 
    name: '---', 
    country: 'DESCONOCIDO', 
    code: 'CQ-000000' 
  });

  // 🛰️ 2. FUNCIÓN DE ESCANEO
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('lives, full_name, country, player_code')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setUserLives(profile.lives);
          setProfileData({
            name: profile.full_name || 'RECLUTA',
            country: profile.country || 'DESCONOCIDO',
            code: profile.player_code || 'CQ-000'
          });
        }
      }
    };
    checkUser();
  }, []);

  // 📡 EFECTO: SUMAR DATOS REALES A LA SIMULACIÓN
  useEffect(() => {
    const fetchRealData = async () => {
      // 1. Contamos cuántos perfiles reales hay en la DB
      const { count: realUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Traemos el acumulado real de los torneos
      const { data: torneoData } = await supabase
        .from('tournaments')
        .select('prize_current');

      const realPrizePool = torneoData?.reduce((acc, t) => acc + (Number(t.prize_current) || 0), 0) || 0;

      // Actualizamos: Base Ghost + Usuarios Reales
      setLiveUsers(GHOST_BASE + (realUsers || 0));
      setJackpot(100000 + realPrizePool);
    };

    fetchRealData();
  }, []);

  // 🔄 SIMULADOR DE MOVIMIENTO (2 ingresos por minuto aprox)
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      // Simulamos ingreso (aumenta vivos)
      if (Math.random() > 0.5) {
        setLiveUsers(prev => prev + 1);
        
        // Alerta de nuevo recluta
        const id = Date.now();
        setNotifications(prev => [{ 
          id, 
          text: `NUEVO RECLUTA #${Math.floor(Math.random()*90000) + 10000} INGRESÓ`, 
          type: "entry" 
        }, ...prev].slice(0, 3));
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
      }

      // Simulamos muerte ocasional para que el número fluctúe
      if (Math.random() > 0.8) {
        setLiveUsers(prev => prev - 1);
        setDeadUsers(prev => prev + 1);
      }
    }, 30000); // Se ejecuta cada 30 segundos para cumplir tus 2x minuto

    return () => clearInterval(simulationInterval);
  }, []);

  // 🟢 LÓGICA DEL CRONÓMETRO - ACTIVADA INMEDIATAMENTE
  useEffect(() => {
    const target = new Date("2026-06-11T00:00:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateTimer(); 
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // 📡 EFECTO: ESCANEO DE SECTORES ACTIVOS EN SUPABASE
  useEffect(() => {
    const fetchSectors = async () => {
      setIsScanning(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTournaments(data);
      }
      setIsScanning(false);
    };
    fetchSectors();
  }, []);

  // Motor de simulación de población y alertas (Mejorado para Élite)
  useEffect(() => {
    const triggerSim = () => {
      setLiveUsers(prev => prev + (Math.floor(Math.random() * 5) - 2));
      if(Math.random() > 0.7) setComaUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      if(Math.random() > 0.95) setDeadUsers(prev => prev + 1);
      setJackpot(prev => prev + Math.floor(Math.random() * 8500) + 1200);

      if (Math.random() > 0.85) {
        const events = [
          { text: `JUGADOR #${Math.floor(Math.random()*9999)} FUE ELIMINADO`, type: "death" },
          { text: `NUEVO RECLUTA #${Math.floor(Math.random()*9999)} INGRESÓ`, type: "entry" },
          { text: `JUGADOR #${Math.floor(Math.random()*9999)} EN ESTADO CRÍTICO`, type: "coma" },
          { text: `JACKPOT ACTUALIZADO +$12,450`, type: "entry" }
        ];
        const selected = events[Math.floor(Math.random() * events.length)];
        const id = Date.now();
        setNotifications(prev => [{ id, ...selected }, ...prev].slice(0, 3));
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
      }
    };

    triggerSim(); 
    const interval = setInterval(triggerSim, 3000);
    return () => clearInterval(interval);
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

        .master-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('/img/arena-final.jpg');
          background-size: cover; background-position: center;
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

        .top-nav {
          position: relative; z-index: 200;
          padding: 24px 5vw;
          display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center;
          border-bottom: 1px solid rgba(255,0,51,0.18);
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(12px);
        }

        .brand-logo { 
          font-family: var(--font-display); font-size: 22px; font-weight: 900; 
          text-shadow: 0 0 20px rgba(255,0,51,0.5);
        }
        .brand-logo span { color: var(--red); }

        .countdown-strip { display: flex; align-items: center; gap: 6px; }
        .countdown-unit { display: flex; flex-direction: column; align-items: center; background: rgba(255,0,51,0.08); border: 1px solid rgba(255,0,51,0.2); padding: 6px 12px; min-width: 52px; }
        .countdown-val { font-family: var(--font-impact); font-size: 32px; line-height: 1; color: #fff; }
        .countdown-label { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; }

        .nav-stats { display: flex; gap: 10px; justify-content: flex-end; }
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

        .jackpot-display { display: flex; flex-direction: column; align-items: flex-end; margin-left: 20px; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 20px; }
        .jackpot-val { 
          color: var(--green); font-size: 18px; font-family: var(--font-display); font-weight: 700;
          text-shadow: 0 0 15px rgba(0,200,83,0.4);
        }

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

        .hero-section { position: relative; height: 88vh; overflow: hidden; z-index: 20; }
        .hero-info { position: absolute; bottom: 15%; left: 5vw; z-index: 30; }
        .hero-title { 
          font-family: var(--font-impact); font-size: clamp(60px, 10vw, 130px);
          line-height: 0.9; text-transform: uppercase; letter-spacing: -1px;
        }
        .hero-vs { color: var(--red); text-shadow: 0 0 40px var(--red); }
        .hero-subtitle { 
          color: var(--red); font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 6px; margin-bottom: 12px; text-transform: uppercase;
        }

        .tactical-section { 
          position: relative; z-index: 20; 
          padding: 100px 5vw 40px; 
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(3px);
        }
        .welcome-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
        .welcome-text h2 { font-family: var(--font-display); font-size: 32px; margin-bottom: 24px; line-height: 1.1; text-transform: uppercase; }
        .welcome-text p { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 50px; }

        .main-btn { 
          background: var(--red); color: #fff; padding: 25px 50px; border-radius: 2px;
          text-align: center; cursor: pointer; font-family: var(--font-display); font-size: 14px; 
          font-weight: 900; letter-spacing: 3px; transition: 0.4s ease;
          box-shadow: 0 0 30px rgba(255,0,51,0.3);
        }
        .main-btn:hover { background: #fff; color: var(--red); transform: translateY(-5px); }

        .sub-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 30px; }
        .sub-btn { 
          background: rgba(0,0,0,0.6); 
          border: 1px solid var(--red); 
          padding: 20px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }
        .sub-btn:hover { 
          transform: translateY(-3px); 
          border-color: #fff;
        }
        .sub-btn:active { 
          border-color: var(--green) !important;
          background: rgba(0, 200, 83, 0.1);
          box-shadow: 0 0 25px var(--green);
        }
        .sub-btn span { font-family: var(--font-mono); font-size: 8px; color: #fff; letter-spacing: 1px; text-transform: uppercase; }

        /* 📡 NUEVOS ESTILOS: RADAR DINÁMICO DE SECTORES */
        .radar-sectors-section {
          position: relative; z-index: 20; padding: 0 5vw 100px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);
        }
        .radar-container { max-width: 1280px; margin: 0 auto; }
        .radar-header-area { 
          display: flex; justify-content: space-between; align-items: flex-end; 
          margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;
        }
        .radar-title-group h3 { font-family: var(--font-display); font-size: 18px; letter-spacing: 2px; }
        .radar-status { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 10px; color: var(--green); }
        
        .sectors-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 25px; 
        }
        .sector-card {
          background: rgba(15, 15, 15, 0.8);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px; padding: 30px;
          position: relative; overflow: hidden;
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .sector-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%;
          background: var(--accent-color, var(--red));
          box-shadow: 0 0 15px var(--accent-color, var(--red));
        }
        .sector-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color, var(--red));
          background: rgba(20, 20, 20, 0.9);
        }
        .sector-info { position: relative; z-index: 2; }
        .sector-tag { font-family: var(--font-mono); font-size: 9px; color: var(--accent-color, var(--red)); letter-spacing: 2px; margin-bottom: 10px; display: block; }
        .sector-name { font-family: var(--font-display); font-size: 20px; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
        .sector-meta { display: flex; gap: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
        .meta-item { display: flex; flex-direction: column; gap: 4px; }
        .meta-lbl { font-size: 8px; color: rgba(255,255,255,0.3); font-family: var(--font-mono); letter-spacing: 1px; }
        .meta-val { font-size: 11px; font-weight: bold; font-family: var(--font-body); }
        
        .enter-arena-link {
          margin-top: 25px; display: flex; align-items: center; justify-content: space-between;
          color: #fff; font-family: var(--font-display); font-size: 10px; font-weight: 900;
          letter-spacing: 2px; text-decoration: none;
        }
        .enter-arena-link .icon-box { background: var(--accent-color, var(--red)); color: #000; padding: 8px; }

        .site-footer { position: relative; z-index: 20; background: #000; border-top: 1px solid rgba(255,0,51,0.2); overflow: hidden; width: 100%; }
        .warning-tape { width: 100%; height: 18px; background: repeating-linear-gradient(45deg, #000, #000 14px, var(--red) 14px, var(--red) 28px); }
        .footer-ops-bar { background: var(--red); padding: 8px 0; overflow: hidden; white-space: nowrap; border-top: 1px solid rgba(255,255,255,0.2); border-bottom: 1px solid rgba(255,255,255,0.2); }
        .ops-ticker { display: inline-block; white-space: nowrap; animation: ticker 25s linear infinite; font-family: var(--font-mono); font-size: 10px; font-weight: bold; letter-spacing: 2px; }
        .ticker-item { margin-right: 40px; color: #fff; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        
        .footer-main { padding: 60px 5vw 30px; background: #000; position: relative; z-index: 10; width: 100%; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; }
        .footer-logo { font-family: var(--font-impact); font-size: 42px; line-height: 0.9; margin-bottom: 8px; color: #fff; }
        .footer-logo-red { color: var(--red); }
        .footer-tagline { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 3px; margin-bottom: 24px; }
        
        .footer-status-panel { background: rgba(0,200,83,0.05); border: 1px solid rgba(0,200,83,0.2); padding: 16px; display: flex; flex-direction: column; gap: 10px; max-width: 280px; }
        .status-row { display: flex; align-items: center; gap: 8px; }
        .status-text { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.6); }
        
        .footer-col-title { font-family: var(--font-display); font-size: 12px; color: var(--red); margin-bottom: 20px; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-link { font-family: var(--font-body); font-size: 12px; color: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; }
        .footer-link:hover { color: var(--red); padding-left: 5px; }
        
        .footer-sys-stats { display: flex; flex-direction: column; gap: 12px; }
        .sys-stat-row { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10px; }
        .sys-stat-label { color: rgba(255,255,255,0.4); flex: 1; }
        .sys-stat-val { font-weight: bold; }
        
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.3); }
        .footer-badges { display: flex; gap: 15px; }
        .footer-badge { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.5); }
        
        .footer-symbols { position: absolute; bottom: -30px; right: 5vw; display: flex; gap: 20px; opacity: 0.03; font-family: var(--font-display); font-size: 150px; pointer-events: none; user-select: none; }

        .pulse-icon { animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        @media (max-width: 900px) {
          .top-nav { grid-template-columns: 1fr; text-align: center; }
          .nav-stats { justify-content: center; flex-wrap: wrap; }
          .welcome-grid { grid-template-columns: 1fr; text-align: center; }
          .sub-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px; } 
          .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
          .sectors-grid { grid-template-columns: 1fr; }
        }
          /* 🪪 ESTILOS DE LA TARJETA DE IDENTIDAD */
        .id-card-tactical {
          position: fixed; right: 40px; top: 250px; width: 300px;
          background: linear-gradient(135deg, rgba(15,15,15,0.95) 0%, rgba(5,5,5,0.98) 100%);
          border-left: 4px solid var(--red); padding: 25px; z-index: 100;
          backdrop-filter: blur(20px); box-shadow: -15px 0 40px rgba(0,0,0,0.8);
          border-radius: 0 8px 8px 0; font-family: var(--font-mono);
        }
        .barcode-container {
          margin-top: 20px; padding: 10px; background: #fff;
          display: flex; gap: 2px; height: 40px; align-items: flex-end;
          filter: invert(1) brightness(1.5) contrast(1.2); opacity: 0.8;
        }
        .barcode-line { background: #000; width: 2px; }
        .lives-container {
          display: flex; gap: 8px; margin-top: 15px;
        }
        .heart-icon {
          filter: drop-shadow(0 0 5px var(--red));
          transition: all 0.4s ease;
        }
        .heart-off { opacity: 0.15; filter: grayscale(1); }
      `}} />

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

      <div className="master-bg" />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="noise-overlay" />

      <header className="top-nav">
        <div className="nav-left">
          <div className="brand-logo">RADAR <span>○△□</span></div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '5px', fontfamily: 'var(--font-mono)' }}>CENTRO DE MONITOREO 2026</div>
        </div>

        <div className="nav-center">
          <div className="countdown-strip">
            {[{v: timeLeft.days, l: 'DÍAS'}, {v: timeLeft.hours, l: 'HRS'}, {v: timeLeft.minutes, l: 'MIN'}, {v: timeLeft.seconds, l: 'SEG'}].map(item => (
              <div key={item.l} className="countdown-unit">
                <span className="countdown-val">{String(item.v).padStart(2, '0')}</span>
                <span className="countdown-label">{item.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nav-right">
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
              <div><div className="stat-num" style={{ color: 'var(--red)' }}>{deadUsers.toLocaleString()}</div><div className="stat-lbl">ELIMINADOS</div></div>
            </div>
          </div>

          <div className="jackpot-display">
            <div style={{fontSize: '8px', color: 'var(--red)', marginBottom: '4px', letterSpacing: '2px'}}>BÓVEDA DISPONIBLE</div>
            <div className="jackpot-val">${jackpot.toLocaleString()} PX</div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="hero-info">
            <p className="hero-subtitle">EL JUEGO COMIENZA</p>
            <h1 className="hero-title">
              BIENVENIDO <br/>
              <span className="hero-vs">A LA</span> <br/>
              ARENA 2026
            </h1>
          </motion.div>
        </section>

        <section className="tactical-section">
          <div className="welcome-grid">
            <div className="welcome-text">
              <h2>ESTADÍSTICAS <span style={{ color: 'var(--red)' }}>EN TIEMPO REAL</span></h2>
              <p>Cada fluctuación en el radar representa una vida o una eliminación definitiva. <br />Monitorea el campo de batalla antes de entrar a la Arena.</p>
              
              <Link href="/arena/mundial-2026" style={{ textDecoration: 'none' }}>
                <div className="main-btn">ENTRAR AL CAMPO DE BATALLA</div>
              </Link>

              <div className="sub-grid">
                <Link href="/recharge" className="sub-btn">
                  <Wallet size={20} color="var(--red)" /><span>BÓVEDA</span>
                </Link>
                <Link href="/history" className="sub-btn">
                  <Calendar size={20} color="var(--red)" /><span>FECHAS</span>
                </Link>
                <Link href="/leaderboard" className="sub-btn">
                  <ListOrdered size={20} color="var(--red)" /><span>RANKING</span>
                </Link>
                <Link href="/profile" className="sub-btn">
                  <Users size={20} color="var(--red)" /><span>PERFIL</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <img 
                src="/img/radar-500.jpg" 
                alt="Escáner Táctico" 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,0,51,0.3)', 
                  boxShadow: '0 0 50px rgba(255,0,51,0.1)' 
                }} 
              />
            </div>
          </div>
        </section>

        {/* 🛡️ NUEVA SECCIÓN DINÁMICA: ESCÁNER DE SECTORES (TORNEOS) */}
        <section id="sectores-activos" className="radar-sectors-section">
          <div className="radar-container">
            <div className="radar-header-area">
              <div className="radar-title-group">
                <h4 style={{color: 'var(--red)', fontSize: '10px', letterSpacing: '4px', marginBottom: '8px'}}>RASTREO SATELITAL</h4>
                <h3>SECTORES DE COMBATE <span style={{color: 'var(--red)'}}>DETECTADOS</span></h3>
              </div>
              <div className="radar-status">
                <Wifi size={14} className="pulse-icon" />
                <span>{isScanning ? 'ESCANEO EN PROGRESO...' : `${tournaments.length} SECTORES ACTIVOS`}</span>
              </div>
            </div>

            <div className="sectors-grid">
              {tournaments.map((t) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="sector-card"
                  style={{ '--accent-color': t.accent_color } as any}
                  onClick={() => router.push(`/arena/${t.slug}`)}
                >
                  <div className="sector-info">
                    <span className="sector-tag">CÓDIGO: {t.slug}</span>
                    <h5 className="sector-name">{t.name}</h5>
                    
                    <div className="sector-meta">
                      <div className="meta-item">
                        <span className="meta-lbl">TIPO</span>
                        <span className="meta-val">{t.type}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-lbl">ESTADO</span>
                        <span className="meta-val" style={{color: 'var(--green)'}}>DESPLEGADO</span>
                      </div>
                    </div>

                    <div className="enter-arena-link">
                      INGRESAR A LA ARENA
                      <div className="icon-box"><ChevronRight size={14} /></div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {tournaments.length === 0 && !isScanning && (
                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '100px', border: '1px dashed #333'}}>
                  <p style={{color: '#444', letterSpacing: '5px', fontSize: '12px'}}>IDENTIFICANDO OBJETIVOS EN LA RED...</p>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* 🖥️ PANEL DE CONTROL DEL RECLUTA (ESTILO COMMAND CENTER) */}
        <div style={{
          position: 'fixed',
          right: '40px',
          top: '250px',
          width: '280px',
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderLeft: '5px solid #ff0033',
          padding: '25px',
          zIndex: 100,
          backdropFilter: 'blur(15px)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          fontFamily: 'monospace'
        }}>
          <div style={{ color: '#ff0033', fontSize: '10px', marginBottom: '15px', letterSpacing: '3px', fontWeight: 'bold' }}>
            {"> STATUS_RECLUTA_CORE"}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ color: '#aaa', fontSize: '9px', textTransform: 'uppercase' }}>ID Recluta</div>
            <div style={{ color: '#fff', fontSize: '12px' }}>{userId ? userId.substring(0, 12).toUpperCase() : 'NO IDENTIFICADO'}</div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
            <div style={{ color: '#666', fontSize: '9px', marginBottom: '10px' }}>RESERVAS DE VIDA</div>
            {/* Barra de vidas tipo energía */}
            <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  flex: 1,
                  backgroundColor: userLives !== null && i < userLives ? '#00ff55' : 'rgba(255,255,255,0.1)',
                  boxShadow: userLives !== null && i < userLives ? '0 0 8px #00ff55' : 'none',
                  transition: 'all 0.5s ease'
                }} />
              ))}
            </div>
            <div style={{ textAlign: 'right', color: '#00ff55', fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>
              {userLives !== null ? `${userLives} / 5` : '-- / 5'}
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '10px', color: '#ff0033', opacity: 0.7 }}>
             ● SISTEMA DE MONITOREO ACTIVO
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="warning-tape" />

        <div className="footer-ops-bar">
          <div className="ops-ticker">
            {[
              '■ SISTEMA OPERATIVO',
              '○ ARENAS ACTIVAS: 5',
              '△ JUGADORES EN LÍNEA: 142,500',
              '□ JACKPOT GLOBAL: $15,900,000',
              '■ PRÓXIMO CIERRE: 11 JUN 2026',
              '○ RED CIFRADA • BLOCKCHAIN VERIFICADO',
              '■ SISTEMA OPERATIVO',
              '○ ARENAS ACTIVAS: 5',
              '△ JUGADORES EN LÍNEA: 142,500',
              '□ JACKPOT GLOBAL: $15,900,000',
              '■ PRÓXIMO CIERRE: 11 JUN 2026',
              '○ RED CIFRADA • BLOCKCHAIN VERIFICADO'
            ].map((t, i) => (
              <span key={i} className="ticker-item">{t}</span>
            ))}
          </div>
        </div>

        <div className="footer-main">
          <div className="max-w-7xl mx-auto" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <div className="footer-grid">

              <div className="footer-brand-col">
                <div className="footer-logo">
                  EL CALAMAR<br />
                  <span className="footer-logo-red">MUNDIALISTA</span>
                </div>
                <p className="footer-tagline">CENTRO DE MANDO • 2026</p>
                <div className="footer-status-panel">
                  <div className="status-row">
                    <span className="status-dot green-dot" style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }} />
                    <span className="status-text">RED SEGURA • OPERATIVA</span>
                  </div>
                  <div className="status-row">
                    <span className="status-dot" style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%' }} />
                    <span className="status-text">{liveUsers.toLocaleString()} JUGADORES CONECTADOS</span>
                  </div>
                  <div className="status-row">
                    <Server size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <span className="status-text">LATENCIA: 12ms • UPTIME: 99.98%</span>
                  </div>
                  <div className="status-row">
                    <Globe size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <span className="status-text">COBERTURA: 47 PAÍSES</span>
                  </div>
                </div>
              </div>

              <div className="footer-col">
                <h4 className="footer-col-title">Operaciones</h4>
                <nav className="footer-links">
                  {['Arenas Globales', 'Radar de Apuestas', 'Registros VIP', 'Estadísticas en Vivo', 'Historial de Partidas'].map(l => (
                    <span key={l} className="footer-link">{l}</span>
                  ))}
                </nav>
              </div>

              <div className="footer-col">
                <h4 className="footer-col-title">Directrices</h4>
                <nav className="footer-links">
                  {['Protocolo Legal', 'Seguridad de Red', 'Soporte Táctico', 'Términos de Contrato', 'Política de Privacidad'].map(l => (
                    <span key={l} className="footer-link">{l}</span>
                  ))}
                </nav>
              </div>

              <div className="footer-col">
                <h4 className="footer-col-title">Sistema</h4>
                <div className="footer-sys-stats">
                  {[
                    { icon: <Cpu size={13} />, label: 'CPU LOAD', val: '34%', color: '#00C853' },
                    { icon: <Activity size={13} />, label: 'PREDICCIONES/SEG', val: '8,430', color: '#00C853' },
                    { icon: <TrendingUp size={13} />, label: 'JACKPOT CRECIMIENTO', val: '+4.2%/h', color: '#FFD700' },
                    { icon: <Skull size={13} />, label: 'TASA ELIMINACIÓN', val: '24%', color: '#FF0033' },
                  ].map(({ icon, label, val, color }) => (
                    <div key={label} className="sys-stat-row">
                      <span className="sys-stat-icon" style={{ color }}>{icon}</span>
                      <span className="sys-stat-label">{label}</span>
                      <span className="sys-stat-val" style={{ color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="footer-bottom">
              <p className="footer-copy">
                © 2026 EL CALAMAR DEL MUNDIAL. LA SUPERVIVENCIA NO ESTÁ GARANTIZADA. JUEGA RESPONSABLEMENTE.
              </p>
              <div className="footer-badges">
                <span className="footer-badge"><Lock size={11} /> CONEXIÓN CIFRADA</span>
                <span className="footer-badge"><Shield size={11} /> BLOCKCHAIN AUDITADO</span>
                <span className="footer-badge"><Star size={11} /> LICENCIA VIP 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-symbols">
          {['○', '△', '□'].map((s, i) => (
            <span key={i} className="footer-symbol">{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}