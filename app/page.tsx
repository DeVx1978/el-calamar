"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Skull, Zap, Lock, Crosshair, Clock, AlertTriangle, BatteryWarning, ShieldAlert, Target, Server, ShieldCheck, Gamepad2, Database, MapPin, Radio, Check, X, Timer, Play, User, TrendingUp, Heart, Star, Eye, ChevronDown, ChevronRight, KeyRound, UserPlus, Globe, Cpu, BarChart2, Calendar, Wifi, Terminal, Shield, Trophy, Monitor, CreditCard, Info, Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
<<<<<<< HEAD
import LiveMatchTicker from './components/LiveMatchTicker';
=======
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3

// --- CONEXIÓN AL CEREBRO CENTRAL ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gtioqzodmulbqbohdyet.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aW9xem9kbXVsYnFib2hkeWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjkyMzUsImV4cCI6MjA5MTE0NTIzNX0.OuK_ueIdYZEmUvU4jexr4dclRhHGBPglQ96pntN4v9o";

const supabase = createBrowserClient(supabaseUrl, supabaseKey);
<<<<<<< HEAD
type Match = {
  id: string
  league: string
  phase: string
  status: string
  team1: string
  team2: string
  score: string
  time: string
  activeusers: number
  jackpot: number
}
=======
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3

// ─── ESTILOS GLOBALES ───
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #FF0033;
    --red-dim: rgba(255,0,51,0.35);
    --green: #00C853;
    --green-dim: rgba(0,200,83,0.25);
    --gold: #FFD700;
    --black: #000;
    --panel-bg: rgba(6,0,2,0.92);
    --border: rgba(255,0,51,0.18);
    --font-display: 'Syncopate', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --font-body: 'Space Grotesk', sans-serif;
    --font-impact: 'Bebas Neue', sans-serif;
  }

  .calamar-root {
    background: #000; min-height: 100vh; width: 100vw;
    font-family: var(--font-body); color: #fff; overflow-x: hidden; position: relative;
  }

<<<<<<< HEAD
 .dynamic-bg{
position:fixed;
inset:0;
z-index:0;
background-size:cover;
background-position:center;
transition:background-image .9s ease;
filter:brightness(.28) contrast(1.18) saturate(.7);
transform:scale(1.03);
}
    position: fixed; inset: 0; z-index: 0; background-size: cover; background-position: center;
    transition: background-image 0.9s ease; filter: brightness(0.4) contrast(1.2) saturate(0.5);
  }
  
=======
  .dynamic-bg {
    position: fixed; inset: 0; z-index: 0; background-size: cover; background-position: center;
    transition: background-image 0.9s ease; filter: brightness(0.4) contrast(1.2) saturate(0.5);
  }
  .vignette {
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    position: fixed; inset: 0; z-index: 1;
    background: linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.9) 75%, #000 100%),
                radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(255,0,51,0.1) 100%);
  }
  .scanlines {
    position: fixed; inset: 0; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
  }
  .noise-overlay {
    position: fixed; inset: 0; z-index: 3; pointer-events: none; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .glitch-active .brand-logo::after { display: none !important; }
  .glitch-text::after, .glitch-text::before { display: none !important; }
  .brand-logo { position: relative; }
  .glitch-text { position: relative; }

  .top-nav {
    position: relative; z-index: 20; padding: 24px 5vw; display: grid; grid-template-columns: 1fr auto 1fr;
    gap: 20px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); align-items: center;
  }

  .nav-left { display: flex; flex-direction: column; gap: 12px; justify-content: flex-start; }
  .nav-center { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .nav-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }

  .brand-logo {
    font-family: var(--font-display); font-size: clamp(18px, 2.2vw, 26px);
    font-weight: 700; letter-spacing: -0.5px; color: #fff; text-shadow: 0 0 20px rgba(255,0,51,0.5);
  }
  .brand-logo .symbols { color: var(--red); letter-spacing: 4px; text-shadow: 0 0 12px var(--red), 0 0 30px rgba(255,0,51,0.4); }

  .jackpot-badge {
    display: inline-flex; align-items: center; gap: 8px; background: rgba(0,200,83,0.07); border: 1px solid rgba(0,200,83,0.3);
    padding: 6px 14px; backdrop-filter: blur(4px); width: fit-content;
  }
  .jackpot-label { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase; }
  .jackpot-value { font-family: var(--font-display); font-size: 13px; color: var(--green); font-weight: 700; text-shadow: 0 0 10px rgba(0,200,83,0.6); }

  .countdown-strip { display: flex; align-items: center; gap: 6px; }
  .countdown-unit { display: flex; flex-direction: column; align-items: center; background: rgba(255,0,51,0.08); border: 1px solid var(--border); padding: 6px 12px; min-width: 52px; }
  .countdown-val { font-family: var(--font-impact); font-size: clamp(22px, 2.5vw, 32px); line-height: 1; color: #fff; letter-spacing: 1px; }
  .countdown-label { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; margin-top: 2px; }
  .countdown-sep { font-family: var(--font-impact); font-size: 28px; color: var(--red); opacity: 0.6; margin-bottom: 8px; }
  .countdown-sub { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: 4px; text-transform: uppercase; }

  .nav-stats { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
  .stat-pill {
    display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); border: 1px solid;
    padding: 10px 16px; backdrop-filter: blur(6px); min-width: 130px;
  }
  .stat-alive { border-color: rgba(0,200,83,0.4); box-shadow: inset 0 0 20px rgba(0,200,83,0.08); }
  .stat-coma { border-color: rgba(255,170,0,0.4); box-shadow: inset 0 0 20px rgba(255,170,0,0.08); }
  .stat-dead  { border-color: rgba(255,0,51,0.4);  box-shadow: inset 0 0 20px rgba(255,0,51,0.08); }
  .stat-num { font-family: var(--font-display); font-size: 15px; font-weight: 700; }
  .stat-alive .stat-num { color: var(--green); }
  .stat-coma .stat-num { color: #FFAA00; }
  .stat-dead  .stat-num { color: var(--red); }
  .stat-lbl { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; }
  .stat-alive svg { color: var(--green); }
  .stat-coma svg { color: #FFAA00; }
  .stat-dead  svg { color: var(--red); }

  .pulse-icon { animation: pulse 1.4s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .alert-feed { position: fixed; bottom: 30px; right: 30px; z-index: 5000; display: flex; flex-direction: column; gap: 12px; pointer-events: none; }
  .alert-box { background: rgba(0,0,0,0.9); border: 1px solid; padding: 14px 20px; backdrop-filter: blur(10px); font-family: var(--font-mono); font-size: 10px; color: #fff; display: flex; align-items: center; gap: 12px; min-width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

<<<<<<< HEAD
  .hero-area{
  position:relative;
  z-index:20;
  padding:60px 5vw;
  display:grid;
  grid-template-columns:1.2fr .8fr;
  gap:40px;
  align-items:center;
  min-height:82vh;
}
  .hero-content{
  max-width:720px;
}

  .phase-badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,0,51,0.6); background: rgba(255,0,51,0.15); padding: 8px 18px; margin-bottom: 28px; font-family: var(--font-mono); font-size: 10px; color: var(--red); letter-spacing: 4px; text-transform: uppercase; box-shadow: 0 0 15px rgba(255,0,51,0.2), inset 0 0 15px rgba(255,0,51,0.05); }

  .hero-title{
  font-family: 'Arial Black', sans-serif;
  font-size: clamp(52px,7vw,110px);
  line-height: .92;
  letter-spacing:-2px;
}
  font-size:clamp(68px,9vw,150px);
  line-height:.9;
}
  font-size:clamp(68px,9vw,150px);
  line-height:.9;
}
font-family:var(--font-impact);
font-size:clamp(78px,10vw,170px);
line-height:.88;
text-transform:uppercase;
letter-spacing:-3px;
margin:18px 0 24px;
text-shadow:
0 0 10px rgba(255,255,255,.08),
0 0 25px rgba(255,0,60,.20);
}
  .hero-line1 { display: block; color: #fff; text-shadow: 0 4px 40px rgba(255,0,51,0.4); }
  .hero-vs{
display:block;
color:#ff003c;
font-size:.55em;
text-shadow:0 0 30px rgba(255,0,60,.75);
}
=======
  .hero-area { position: relative; z-index: 20; padding: 80px 5vw 60px; display: flex; align-items: flex-start; justify-content: space-between; gap: 40px; flex-wrap: wrap; min-height: 60vh; }
  .hero-content { flex: 1; min-width: 280px; max-width: 800px;}

  .phase-badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,0,51,0.6); background: rgba(255,0,51,0.15); padding: 8px 18px; margin-bottom: 28px; font-family: var(--font-mono); font-size: 10px; color: var(--red); letter-spacing: 4px; text-transform: uppercase; box-shadow: 0 0 15px rgba(255,0,51,0.2), inset 0 0 15px rgba(255,0,51,0.05); }

  .hero-title { font-family: var(--font-impact); font-size: clamp(68px, 10vw, 140px); line-height: 0.9; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 28px; position: relative; }
  .hero-line1 { display: block; color: #fff; text-shadow: 0 4px 40px rgba(255,0,51,0.4); }
  .hero-vs  { display: block; color: var(--red); text-shadow: 0 0 40px var(--red); font-size: 0.65em; }
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
  .hero-line2 { display: block; color: #fff; text-shadow: 0 4px 40px rgba(255,0,51,0.4); }

  .hero-sub { font-size: clamp(13px, 1.5vw, 16px); color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 520px; margin-bottom: 40px; font-weight: 300; }

<<<<<<< HEAD
  .hero-cta-group{
  display:flex;
  gap:16px;
  flex-wrap:wrap;
}

 .btn-login{
display:inline-flex;
align-items:center;
gap:10px;
padding:16px 30px;
border:1px solid rgba(0,255,120,.35);
background:rgba(0,255,120,.08);
color:#00ff88;
font-weight:800;
letter-spacing:2px;
text-transform:uppercase;
cursor:pointer;

transition:
transform .25s ease,
background .25s ease,
box-shadow .25s ease,
border-color .25s ease;

box-shadow:none;
}

.btn-login:hover{
transform:translateY(-2px);
background:rgba(0,255,120,.14);
border-color:#00ff88;
box-shadow:0 0 14px rgba(0,255,120,.18);
}

  .btn-register{
display:inline-flex;
align-items:center;
gap:10px;
padding:16px 34px;
border:none;
background:#ffffff;
color:#ff0040;
font-weight:900;
letter-spacing:2px;
text-transform:uppercase;
cursor:pointer;
position:relative;
overflow:hidden;

transition:
transform .25s ease,
background .25s ease,
color .25s ease,
box-shadow .25s ease;

box-shadow:none;
}

.btn-register:hover{
background:#ff0040;
color:#ffffff;
transform:translateY(-2px);
box-shadow:0 0 18px rgba(255,0,70,.22);
}

.btn-arrow{
margin-left:4px;
transition:transform .25s ease;
}

.btn-register:hover .btn-arrow{
transform:translateX(4px);
}

  .hero-meta{
display:flex;
flex-wrap:wrap;
gap:18px;
margin-top:24px;
font-size:12px;
letter-spacing:1px;
color:rgba(255,255,255,.55);
}
  .hero-meta span { display: flex; align-items: center; gap: 6px; }

  .hero-panel{
width:420px;
max-width:100%;
padding:26px;
border:1px solid rgba(255,0,60,.25);
background:rgba(0,0,0,.62);
backdrop-filter:blur(12px);
box-shadow:
0 0 40px rgba(255,0,60,.08),
inset 0 0 20px rgba(255,0,60,.04);
}
=======
  .hero-cta-group { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }

  .btn-login { display: inline-flex; align-items: center; gap: 10px; background: rgba(0,200,83,0.07); border: 1px solid rgba(0,200,83,0.55); color: var(--green); padding: 16px 36px; cursor: pointer; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; transition: all 0.3s ease; box-shadow: inset 0 0 20px rgba(0,200,83,0.08); }
  .btn-login:hover { background: rgba(0,200,83,0.18); border-color: var(--green); box-shadow: 0 0 30px rgba(0,200,83,0.35), inset 0 0 20px rgba(0,200,83,0.15); color: #fff; transform: translateY(-2px); }

  .btn-register { display: inline-flex; align-items: center; gap: 10px; background: var(--red); border: 1px solid rgba(255,100,120,0.5); color: #fff; padding: 16px 40px; cursor: pointer; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 0 30px rgba(255,0,51,0.45), inset 0 0 10px rgba(255,255,255,0.15); position: relative; overflow: hidden; }
  .btn-register::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
  .btn-register:hover::before { left: 100%; }
  .btn-register:hover { background: #fff; color: var(--red); transform: scale(1.04); box-shadow: 0 0 45px rgba(255,255,255,0.5); border-color: #fff; }
  .btn-arrow { margin-left: 4px; transition: transform 0.3s; }
  .btn-register:hover .btn-arrow { transform: translateX(4px); }

  .hero-meta { display: flex; gap: 20px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 2px; }
  .hero-meta span { display: flex; align-items: center; gap: 6px; }

  .hero-panel { background: var(--panel-bg); border: 1px solid var(--border); backdrop-filter: blur(16px); padding: 24px; min-width: 240px; max-width: 300px; width: 100%; box-shadow: 0 0 40px rgba(255,0,51,0.15), inset 0 0 40px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
  .hero-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--red), transparent); box-shadow: 0 0 10px var(--red); }
  .panel-header { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; padding-bottom: 16px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .panel-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; margin-left: auto; box-shadow: 0 0 8px var(--green); animation: pulse 1.4s ease-in-out infinite; }
  .panel-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .panel-key { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: 2px; }
  .panel-val { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 500; }
  .panel-val.green { color: var(--green); text-shadow: 0 0 8px rgba(0,200,83,0.4); }
  .panel-val.red   { color: var(--red);   text-shadow: 0 0 8px rgba(255,0,51,0.4); }
  .panel-val.gold  { color: var(--gold);  text-shadow: 0 0 8px rgba(255,215,0,0.4); }
  .panel-val.symbol-lg { font-size: 20px; font-family: var(--font-display); }
  .panel-divider { margin: 16px 0; height: 1px; background: var(--red); opacity: 0.3; }
  .panel-warning { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 9px; color: var(--red); letter-spacing: 2px; text-transform: uppercase; background: rgba(255,0,51,0.08); padding: 10px; border: 1px solid rgba(255,0,51,0.2); box-shadow: inset 0 0 10px rgba(255,0,51,0.08); }

  .carousel-section { position: relative; z-index: 20; padding: 0 5vw 60px; }
  .carousel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .carousel-title { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 4px; text-transform: uppercase; }
  .carousel-count { font-family: var(--font-mono); font-size: 10px; color: var(--red); letter-spacing: 2px; }
  .carousel-track { display: flex; gap: 15px; overflow-x: auto; padding: 10px 0 20px; scrollbar-width: none; }
  .carousel-track::-webkit-scrollbar { display: none; }
  .game-card { flex: 0 0 auto; width: clamp(160px, 15vw, 200px); height: clamp(110px, 10vw, 140px); border-radius: 2px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background-size: cover; background-position: center; position: relative; opacity: 0.45; filter: grayscale(70%) brightness(0.7); transition: opacity 0.4s, filter 0.4s, border-color 0.4s, box-shadow 0.4s; }
  .game-card.active { border-color: var(--red); opacity: 1; filter: grayscale(0%) brightness(1); box-shadow: 0 0 30px rgba(255,0,51,0.5), 0 20px 50px rgba(0,0,0,0.6); z-index: 5; }
  .game-card:hover:not(.active) { opacity: 0.7; filter: grayscale(30%) brightness(0.85); border-color: rgba(255,255,255,0.2); }
  .card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.95) 100%); }
  .card-top { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: flex-start; padding: 10px; }
  .card-phase { font-family: var(--font-mono); font-size: 7px; color: var(--green); letter-spacing: 1px; text-transform: uppercase; background: rgba(0,200,83,0.12); padding: 2px 5px; border: 1px solid rgba(0,200,83,0.25); }
  .card-symbol { font-family: var(--font-display); font-size: 16px; color: transparent; -webkit-text-stroke: 1.2px rgba(255,0,51,0.5); }
  .game-card.active .card-symbol { -webkit-text-stroke: 1.5px var(--red); text-shadow: 0 0 10px rgba(255,0,51,0.6); }
  .card-bottom { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; }
  .card-teams { font-family: var(--font-display); font-size: clamp(9px, 0.9vw, 11px); font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .card-vs { color: var(--red); margin: 0 3px; }
  .card-meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
  .card-time { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
  .card-diff { font-family: var(--font-mono); font-size: 7px; font-weight: 500; letter-spacing: 1px; }
  .card-jackpot { font-family: var(--font-impact); font-size: 14px; color: var(--gold); letter-spacing: 1px; text-shadow: 0 0 6px rgba(255,215,0,0.5); }
  .card-active-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--red); box-shadow: 0 0 10px var(--red), 0 0 20px rgba(255,0,51,0.5); }

  .tension-bar-wrapper { margin-top: 24px; max-width: 600px; }
  .tension-label { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; text-transform: uppercase; }
  .tension-pct { color: var(--red); margin-left: auto; }
  .tension-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 0; overflow: hidden; position: relative; }
  .tension-fill { height: 100%; background: linear-gradient(90deg, #FF5500, var(--red)); box-shadow: 0 0 12px var(--red); border-radius: 0; }

<<<<<<< HEAD
  /* 🟢 CLASE SANGRIENTA PARA LA DESCRIPCIÓN 🟢 */
  .bloody-text {
    font-family: var(--font-impact);
    text-transform: uppercase;
    text-shadow: 0 0 15px rgba(255,0,51,0.8), 0 0 30px rgba(255,0,51,0.4);
    letter-spacing: 2px;
    -webkit-text-stroke: 0.5px rgba(255,255,255,0.1);
  }

  .hero-game-wrapper {
    width: 100%; max-width: 100%; margin: 0 auto; 
    background: #000;
    display: flex; flex-direction: column; overflow: hidden;
  }
=======
  /* 🟢 UN SOLO JUEGO - DISEÑO CINEMÁTICO 🟢 */
  .hero-game-wrapper {
    width: 100%; max-width: 1200px; margin: 0 auto; 
    background: rgba(0,0,0,0.6); backdrop-filter: blur(12px);
    border: 1px solid var(--gold); border-radius: 4px;
    box-shadow: inset 0 0 30px rgba(255,215,0,0.1), 0 20px 50px rgba(0,0,0,0.8);
    display: flex; flex-direction: column; overflow: hidden;
  }
  .hero-game-cover {
    width: 100%; height: 300px; background-size: cover; background-position: center;
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .hero-game-overlay {
    position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.9) 100%);
  }
  .hero-game-content {
    position: relative; z-index: 10; text-align: center; padding: 40px;
  }
  .btn-massive-play {
    background: var(--gold); color: #000; border: none; padding: 20px 50px;
    font-family: var(--font-display); font-size: 16px; font-weight: 900; letter-spacing: 4px;
    cursor: pointer; transition: 0.3s; text-transform: uppercase; border-radius: 4px;
    box-shadow: 0 0 30px rgba(255,215,0,0.5); display: inline-flex; align-items: center; gap: 15px;
  }
  .btn-massive-play:hover { background: #fff; box-shadow: 0 0 50px rgba(255,255,255,0.8); transform: scale(1.05); }

  /* 🟢 MODAL FLOTANTE (TEATRO - SIN RESTRICCIONES) 🟢 */
  .game-modal-overlay { 
    position: fixed; inset: 0; z-index: 9999; 
    background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); 
    display: flex; align-items: center; justify-content: center; padding: 20px; 
  }
  .game-modal-content { 
    width: 100%; max-width: 1200px; height: 85vh; 
    background: #000; border-radius: 8px; border: 1px solid var(--gold);
    box-shadow: 0 0 80px rgba(255,215,0,0.2); 
    display: flex; flex-direction: column; overflow: hidden; position: relative; 
  }
  .game-modal-header { 
    display: flex; justify-content: space-between; align-items: center; 
    padding: 15px 25px; background: rgba(255,215,0,0.1); 
    border-bottom: 1px solid rgba(255,215,0,0.3); 
  }
  .game-modal-close { 
    background: #FF0033; border: none; color: #fff; 
    padding: 10px 20px; border-radius: 4px; font-family: var(--font-mono); 
    font-size: 12px; font-weight: 700; letter-spacing: 2px; cursor: pointer; 
    transition: 0.3s; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 0 15px rgba(255,0,51,0.5);
  }
  .game-modal-close:hover { background: #fff; color: #FF0033; }
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3

  /* ── SECCIÓN: INSTRUCCIONES DEL JUEGO (ACORDEÓN EN LÍNEA) ── */
  .ps5-grid-6 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%; max-width: 1100px; margin: 0 auto; position: relative; z-index: 10; }
  .ps5-card { background: rgba(10,0,2,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; display: flex; flex-direction: column; transition: all 0.4s ease; border-radius: 4px; position: relative; overflow: hidden; cursor: pointer; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
  .ps5-card::before { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 2px; background: var(--card-color); opacity: 0.5; transition: 0.3s; }
  .ps5-card:hover { background: rgba(20,0,5,0.8); border-color: rgba(255, 0, 51, 0.3); }
  .ps5-card.active { border-color: var(--card-color); background: rgba(0,0,0,0.9); box-shadow: inset 0 0 40px rgba(0,0,0,1), 0 10px 30px rgba(0,0,0,0.8); }
  .ps5-card.active::before { opacity: 1; box-shadow: 0 0 15px var(--card-color); }
  .ps5-card-icon { width: 50px; height: 50px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; background: #000; border: 1px solid rgba(255,255,255,0.1); color: var(--card-color); border-radius: 4px; transition: 0.3s; }
  .ps5-card:hover .ps5-card-icon, .ps5-card.active .ps5-card-icon { border-color: var(--card-color); box-shadow: 0 0 20px var(--card-glow); }

  /* ── FRENTES DE BATALLA TÁCTICOS ── */
  .t-card-elite { position: relative; width: 100%; max-width: 480px; min-height: 520px; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.4s ease; text-align: left; background: #000; }
  .t-card-elite:hover { transform: translateY(-10px); border-color: var(--t-accent); box-shadow: 0 30px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(0,0,0,0.9); }
  .t-bg-image { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(100%) brightness(0.2); transition: all 0.6s ease; z-index: 0; }
  .t-card-elite:hover .t-bg-image { filter: grayscale(40%) brightness(0.4) scale(1.05); }
  .t-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,1) 100%); z-index: 1; }
  .t-content { position: relative; z-index: 5; display: flex; flex-direction: column; gap: 15px; }
  .t-logo-box { height: 90px; margin-bottom: 20px; display: flex; justify-content: flex-start; }
  .t-phase { display: inline-flex; font-family: var(--font-mono); font-size: 8px; color: var(--t-accent); letter-spacing: 2px; padding: 4px 10px; background: rgba(0,0,0,0.8); border: 1px solid var(--t-accent-40); width: fit-content; margin-bottom: 10px; }
  .t-title { font-family: var(--font-display); font-size: clamp(20px, 3vw, 26px); color: #fff; font-weight: 900; line-height: 1.2; text-shadow: 0 0 20px rgba(0,0,0,1); }
  .t-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .t-meta-item { display: flex; flex-direction: column; gap: 6px; }
  .t-meta-lbl { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
  .t-meta-val { font-family: var(--font-display); font-size: 13px; color: #fff; font-weight: 700; }
  .btn-t-action { background: rgba(0,0,0,0.8); border: 1px solid var(--t-accent); color: #fff; padding: 18px 24px; font-family: var(--font-display); font-size: 10px; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; display: flex; justify-content: space-between; align-items: center; width: 100%; border-radius: 2px; margin-top: 10px; }
  .t-card-elite:hover .btn-t-action { background: var(--t-accent); color: #000; box-shadow: 0 0 20px var(--t-accent-40); }

  /* ── FOOTER ── */
  .site-footer { position: relative; z-index: 20; background: #000; }
  .warning-tape { width: 100%; height: 18px; background: repeating-linear-gradient(45deg, #000, #000 14px, var(--red) 14px, var(--red) 28px); box-shadow: 0 0 25px rgba(255,0,51,0.5), 0 -5px 20px rgba(255,0,51,0.2); }

  .footer-ops-bar { background: rgba(255,0,51,0.05); border-bottom: 1px solid rgba(255,0,51,0.15); padding: 12px 0; overflow: hidden; white-space: nowrap; }
  .ops-ticker { display: inline-flex; gap: 60px; animation: ticker 30s linear infinite; font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 3px; text-transform: uppercase; }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ops-ticker::after { content: attr(data-repeat); }
  .ticker-item { flex-shrink: 0; }

  .footer-main { padding: 80px 5vw 40px; background: radial-gradient(ellipse at 50% 100%, rgba(40,0,10,0.5) 0%, transparent 70%), #000; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-logo { font-family: var(--font-impact); font-size: clamp(32px, 4vw, 52px); line-height: 0.95; color: #fff; margin-bottom: 8px; letter-spacing: -1px; }
  .footer-logo-red { color: var(--red); text-shadow: 0 0 20px rgba(255,0,51,0.6); }
  .footer-tagline { font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 5px; text-transform: uppercase; margin-bottom: 28px; }

  .footer-status-panel { display: flex; flex-direction: column; gap: 10px; background: rgba(0,200,83,0.04); border: 1px solid rgba(0,200,83,0.15); padding: 16px; max-width: 280px; }
  .status-row { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .green-dot { background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse 1.4s ease-in-out infinite; }
  .status-text { color: rgba(255,255,255,0.45); }
  .status-row svg { color: var(--green); flex-shrink: 0; }

  .footer-col-title { font-family: var(--font-display); font-size: 11px; font-weight: 700; color: var(--red); text-transform: uppercase; letter-spacing: 4px; margin-bottom: 24px; text-shadow: 0 0 8px rgba(255,0,51,0.4); }
  .footer-links { display: flex; flex-direction: column; gap: 14px; }
  .footer-link { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: color 0.2s, padding-left 0.2s; position: relative; }
  .footer-link::before { content: ''; position: absolute; left: -12px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; background: var(--red); border-radius: 50%; opacity: 0; transition: opacity 0.2s; }
  .footer-link:hover { color: var(--green); padding-left: 6px; }
  .footer-link:hover::before { opacity: 1; }

  .footer-sys-stats { display: flex; flex-direction: column; gap: 12px; }
  .sys-stat-row { display: grid; grid-template-columns: 18px 1fr auto; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); }
  .sys-stat-icon { display: flex; align-items: center; justify-content: center; }
  .sys-stat-label { font-family: var(--font-mono); font-size: 8px; color: rgba(255,255,255,0.35); letter-spacing: 2px; text-transform: uppercase; }
  .sys-stat-val { font-family: var(--font-mono); font-size: 11px; font-weight: 500; }

  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; border-top: 1px solid rgba(255,0,51,0.15); padding-top: 28px; }
  .footer-copy { font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 2px; text-transform: uppercase; }
  .footer-badges { display: flex; gap: 12px; flex-wrap: wrap; }
  .footer-badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; transition: border-color 0.2s, color 0.2s; }
  .footer-badge:hover { border-color: rgba(255,0,51,0.4); color: var(--red); }
  .footer-symbols { display: flex; justify-content: center; gap: 40px; padding: 30px 0 40px; border-top: 1px solid rgba(255,0,51,0.08); }
  .footer-symbol { font-family: var(--font-display); font-size: 36px; color: transparent; -webkit-text-stroke: 1.5px rgba(255,0,51,0.2); cursor: default; transition: -webkit-text-stroke-color 0.3s, text-shadow 0.3s; }
  .footer-symbol:hover { -webkit-text-stroke-color: rgba(255,0,51,0.8); text-shadow: 0 0 20px rgba(255,0,51,0.4); }

  @media (max-width: 768px) {
    .top-nav { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px; }
    .nav-left, .nav-center, .nav-right { align-items: center; flex: 1; }
    .nav-stats { justify-content: center; flex-wrap: wrap; }
<<<<<<< HEAD
    .hero-area{
position:relative;
z-index:20;
padding:100px 5vw 80px;
display:flex;
align-items:center;
justify-content:space-between;
gap:60px;
min-height:82vh;
}
    .hero-content{
  max-width:720px;
}
    .hero-cta-group{
  display:flex;
  gap:16px;
  flex-wrap:wrap;
}
    .hero-panel{
  width:100%;
  max-width:420px;
  justify-self:end;
}
=======
    .hero-area { padding: 50px 5vw 40px; flex-direction: column; align-items: center; text-align: center; }
    .hero-content { align-items: center; display: flex; flex-direction: column; }
    .hero-cta-group { flex-direction: column; width: 100%; }
    .hero-panel { max-width: 100%; }
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
    
    /* Adaptación Nativa del Modal para Celulares */
    .game-modal-overlay { padding: 0; }
    .game-modal-content { height: 100vh !important; border-radius: 0 !important; border: none !important; border-top: 1px solid var(--gold) !important; }
  }
`;

const arenas = [
  {
    id: 'cal1', league: 'FASE DE GRUPOS', phase: 'MUNDIAL 2026', status: 'upcoming',
    team1: 'PREDICE', team2: 'SOBREVIVE', time: '11 JUN • 18:00', score: '- vs -',
    activeUsers: '142,500', jackpot: '$5,400,000', isSurvival: true,
<<<<<<< HEAD
    bgImage: '/img/cambio.jpg',
=======
    bgImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2560&q=80',
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    symbol: '○', accent: '#FF0033', difficulty: 'INICIACIÓN'
  },
  {
    id: 'cal3', league: 'CUARTOS DE FINAL', phase: 'ZONA DE GUERRA', status: 'upcoming',
    team1: 'AVANZA', team2: 'O MUERE', time: '25 JUN', score: '- vs -',
    activeUsers: '22,400', jackpot: '$500,000', isSurvival: true,
<<<<<<< HEAD
    bgImage: '/img/cambio.jpg',
=======
    bgImage: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=2560&q=80',
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    symbol: '□', accent: '#FF0033', difficulty: 'EXTREMO'
  },
  {
    id: 'cal4', league: 'SEMIFINALES', phase: 'TERRITORIO HOSTIL', status: 'upcoming',
    team1: 'SEMIFINAL', team2: 'SANGRE O GLORIA', time: 'MAÑANA', score: '- vs -',
    activeUsers: '210,000', jackpot: '$8,500,000', isSurvival: true,
<<<<<<< HEAD
    bgImage: '/img/cambio.jpg',
=======
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2560&q=80',
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    symbol: '△', accent: '#CC0033', difficulty: 'LETAL'
  },
  {
    id: 'cal5', league: 'LA GRAN FINAL', phase: 'EL ÚLTIMO JUEGO', status: 'upcoming',
    team1: 'EL ÚLTIMO', team2: 'CALAMAR', time: '14 JUL', score: '- vs -',
    activeUsers: '15,100', jackpot: '$300,000', isSurvival: true,
<<<<<<< HEAD
    bgImage: '/img/cambio.jpg',
=======
    bgImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2560&q=80',
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    symbol: '□', accent: '#FF0033', difficulty: 'APOCALÍPTICO'
  },
];

const difficultyColor: Record<string, string> = {
  'INICIACIÓN': '#00C853',
  'PELIGROSO': '#FFAA00',
  'EXTREMO': '#FF5500',
  'LETAL': '#FF0033',
  'APOCALÍPTICO': '#CC00FF',
};

<<<<<<< HEAD
// 🟢 INFORMACIÓN CLASIFICADA (DATOS PARA LA NUEVA SECCIÓN)
const THE_GAME = {
  name: 'EL CALAMAR DEL MUNDIAL 2026', 
  desc: 'ESTÁS APUNTO DE CONOCER EL VERDADERO JUEGO QUE TE PREMIA POR MANTENERTE CON VIDA HASTA EL PITAZO FINAL DEL TORNEO.',
  icon: <Skull size={32} color="#FF0033" />,
  image: '/img/banner-calamar-batalla.jpg', 
  color: '#FF0033'
=======
// 🟢 UN SOLO JUEGO - PROVEEDOR BLINDADO 100% ESTABLE (GameDistribution)
const THE_GAME = {
  name: 'PENALTY SHOOTERS 2', 
  url: 'https://html5.gamedistribution.com/1c8f121d5a7d4a6f9584b423984d9434/', 
  desc: 'Prueba balística de precisión pura. Demuestra tu frialdad en la ronda de penales.',
  icon: <Target size={32} color="#FFD700" />,
  image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80', 
  color: '#FFD700'
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
};

export default function ConsoleLobby() {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeArena = arenas[activeIndex];
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  
  const [activeProtocolId, setActiveProtocolId] = useState<string | null>(null);
<<<<<<< HEAD
  const [activeTournamentTab, setActiveTournamentTab] = useState<string>('champions');
  const [matchFilter, setMatchFilter] = useState<string>('TODOS');
  const [activePhaseFilter, setActivePhaseFilter] = useState<string | null>(null);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLives, setUserLives] = useState<number | null>(null);

  const [activeTournaments, setActiveTournaments] = useState<any[]>([]);
const [tournamentMatches, setTournamentMatches] = useState<Record<string, any[]>>({});

useEffect(() => {
  const loadData = async () => {
    const { data: tourneysData } = await supabase
      .from('tournaments')
      .select('id, name, slug, accent_color, bg_image, status')
      .eq('status', 'ACTIVO')
      .order('created_at', { ascending: true });

    if (tourneysData) {
      setActiveTournaments(tourneysData.map(t => ({
        id: t.slug,
        tournamentId: t.id,
        title: t.name,
        color: t.accent_color || '#FF0033',
        bg: t.bg_image || '/img/euforia.jpg',
        matches: [],
      })));

      const ids = tourneysData.map(t => t.id);
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .in('tournament_id', ids)
        .order('match_date', { ascending: true });

      if (matchesData) {
        const grouped: Record<string, any[]> = {};
        matchesData.forEach((m: any) => {
          const torneo = tourneysData.find(t => t.id === m.tournament_id);
          if (!torneo) return;
          const key = torneo.slug;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(m);
        });
        setTournamentMatches(grouped);
      }
    }
  };
  loadData();
}, []);

const tournamentsWithMatches = activeTournaments.map(t => ({
  ...t,
  matches: tournamentMatches[t.id] || [],
}));

  // 🟢 MOTOR HÍBRIDO SINCRONIZADO (GHOST + REAL)
  const GHOST_BASE = 20000;
  const [liveUsers, setLiveUsers] = useState(GHOST_BASE);
  const [comaUsers, setComaUsers] = useState(121);
  const [deadUsers, setDeadUsers] = useState(542);
  const [jackpotTotal, setJackpotTotal] = useState(100000); 
  const [notifications, setNotifications] = useState<{id: number, text: string, type: string}[]>([]);
  const [glitch, setGlitch] = useState(false);

  // 📡 EFECTO: CAPTURAR DATOS REALES DE SUPABASE
  useEffect(() => {
    const syncData = async () => {
      const { count: realUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: torneos } = await supabase
        .from('tournaments')
        .select('prize_current');

      const realPrize = torneos?.reduce((acc, t) => acc + (Number(t.prize_current) || 0), 0) || 0;

      setLiveUsers(GHOST_BASE + (realUsers || 0));
      setJackpotTotal(100000 + realPrize);
    };

    syncData();
    const syncInterval = setInterval(syncData, 300000); // Cada 5 min
    return () => clearInterval(syncInterval);
  }, []);

  // 🟢 ESTADO DEL JUEGO ÚNICO / TRANSMISIÓN
=======
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const activeTournaments = [
    {
      id: 'mundial',
      title: 'MUNDIAL DE LA FIFA 2026',
      phase: 'OPERACIÓN GLOBAL',
      color: '#FF0033', 
      bg: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2560&q=80',
    },
    {
      id: 'champions',
      title: 'UEFA CHAMPIONS LEAGUE',
      phase: 'FASE ELIMINATORIA',
      color: '#00AEEF',
      bg: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=2560&q=80',
    }
  ];

  const [liveUsers, setLiveUsers] = useState(142500);
  const [comaUsers, setComaUsers] = useState(11400);
  const [deadUsers, setDeadUsers] = useState(45620);
  const [notifications, setNotifications] = useState<{id: number, text: string, type: string}[]>([]);

  const [glitch, setGlitch] = useState(false);

  // 🟢 ESTADO DEL JUEGO ÚNICO
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    if (isGameActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isGameActive]);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
<<<<<<< HEAD
        if (session) {
          setUserId(session.user.id);
          // 📡 Escaneando vidas reales en la base de datos
          const { data } = await supabase
            .from('profiles')
            .select('lives')
            .eq('id', session.user.id)
            .single();
          
          if (data) setUserLives(data.lives);
        }
=======
        if (session) setUserId(session.user.id);
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
      } catch (error) {
        console.error("Fallo de escáner:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchSystemData();
  }, [supabase]);

<<<<<<< HEAD
useEffect(() => {
    const motorSimulacion = setInterval(() => {
      // Suma 1 jugador de vez en cuando (muy ligero)
      setLiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : 0));
      
      // Lanza el aviso de "RECLUTA INGRESADO" solo el 10% de las veces
      if (Math.random() > 0.9) {
        const id = Date.now();
        setNotifications(prev => [{ id, text: `JUGADOR HA INGRESADO`, type: 'entry' }, ...prev].slice(0, 3));
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
      }
    }, 20000); // Se ejecuta cada 20 segundos para no saturar tu PC

    return () => clearInterval(motorSimulacion);
=======
  useEffect(() => {
    const motor = setInterval(() => {
      setLiveUsers(prev => prev + (Math.floor(Math.random() * 5) - 2));
      if(Math.random() > 0.7) setComaUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      if(Math.random() > 0.95) setDeadUsers(prev => prev + 1);

      if (Math.random() > 0.85) {
        const alerts = [
          { text: `RECLUTA #${Math.floor(Math.random() * 8999) + 1000} HA INGRESADO`, type: 'entry' },
          { text: `JUGADOR EN ESTADO CRÍTICO (COMA)`, type: 'coma' },
          { text: `ELIMINACIÓN CONFIRMADA EN SECTOR B-12`, type: 'death' }
        ];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        const id = Date.now();
        setNotifications(prev => [ { id, ...alert }, ...prev ].slice(0, 3));
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
      }
    }, 3000);
    return () => clearInterval(motor);
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
  }, []);

  useEffect(() => {
    const g = setInterval(() => {
      // Efecto glitch desactivado
    }, 7000);
    return () => clearInterval(g);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-06-11T00:00:00").getTime();
    const update = () => {
      const diff = targetDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    const iv = setInterval(update, 1000);
    update();
    return () => clearInterval(iv);
  }, []);

  if (loading || isLoadingData) return (
    <div style={{ height: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: 'monospace' }}>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ color: '#FF0033', letterSpacing: '6px', fontSize: 13, fontWeight: 900, textTransform: 'uppercase' }}
      >
        ■ INICIALIZANDO SISTEMA DE ELIMINACIÓN...
      </motion.div>
      <div style={{ width: 260, height: 2, background: 'rgba(255,0,51,0.2)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'linear' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #FF0033, #FF5577)', boxShadow: '0 0 12px #FF0033' }}
        />
      </div>
      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
        style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 4 }}>
        EL CALAMAR MUNDIALISTA • 2026
      </motion.div>
    </div>
  );

  return (
    <div className="calamar-root">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="alert-feed">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="alert-box"
              style={{ borderColor: n.type === 'death' ? '#FF0033' : n.type === 'coma' ? '#FFAA00' : '#00C853' }}
            >
              <div className="pulse-icon" style={{ color: n.type === 'death' ? '#FF0033' : n.type === 'coma' ? '#FFAA00' : '#00C853' }}>
                {n.type === 'death' ? <Skull size={14} /> : n.type === 'coma' ? <Heart size={14} /> : <Zap size={14} />}
              </div>
              <span>{n.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        className="dynamic-bg"
<<<<<<< HEAD
        style={{ backgroundImage: `url('/img/cambio.jpg')` }}
=======
        style={{ backgroundImage: `url(${activeArena.bgImage})` }}
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
      />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="noise-overlay" />

      <header className="top-nav">
        <div className="nav-left">
          <div className={`brand-logo ${glitch ? 'glitch-active' : ''}`} data-text="EL CALAMAR ○△□">
            EL CALAMAR <span className="symbols">○△□</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="countdown-strip">
            {[
              { v: timeLeft.days, l: 'DÍAS' },
              { v: timeLeft.hours, l: 'HRS' },
              { v: timeLeft.minutes, l: 'MIN' },
              { v: timeLeft.seconds, l: 'SEG' },
            ].map(({ v, l }, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="countdown-sep">:</span>}
                <div className="countdown-unit">
                  <span className="countdown-val">{String(v).padStart(2, '0')}</span>
                  <span className="countdown-label">{l}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="countdown-sub">INICIO DE OPERACIONES GLOBALES</div>
        </div>

        <div className="nav-right">
          <div className="jackpot-badge">
            <span className="jackpot-label">JACKPOT ACUMULADO</span>
<<<<<<< HEAD
            <span className="jackpot-value">{jackpotTotal.toLocaleString()}</span>
=======
            <span className="jackpot-value">{activeArena.jackpot}</span>
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
          </div>
          <div className="nav-stats">
            <div className="stat-pill stat-alive">
              <Activity size={12} className="pulse-icon" />
              <div>
                <div className="stat-num">{liveUsers.toLocaleString()}</div>
                <div className="stat-lbl">VIVOS</div>
              </div>
            </div>
            <div className="stat-pill stat-coma">
              <Heart size={12} className="pulse-icon" />
              <div>
                <div className="stat-num">{comaUsers.toLocaleString()}</div>
                <div className="stat-lbl">EN COMA</div>
              </div>
            </div>
            <div className="stat-pill stat-dead">
              <Skull size={12} />
              <div>
                <div className="stat-num">{deadUsers.toLocaleString()}</div>
<<<<<<< HEAD
                <div className="stat-lbl">ELIMINADOS</div>
=======
                <div className="stat-lbl">MUERTOS</div>
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
              </div>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
<LiveMatchTicker />

<main className="hero-area">

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="hero-content"
  >

    <div className="phase-badge">
      <Crosshair size={12} />
      <span>CENTRO DE PREDICCIONES • ACCESO GLOBAL</span>
    </div>

    <h2 className="hero-title">
      <span className="hero-line1">PREDICE</span>
      <span className="hero-vs">VS</span>
      <span className="hero-line2">SOBREVIVE</span>
    </h2>

    <p className="hero-sub">
      Cada decisión correcta te mantiene en juego.  
      Cada error te acerca a la eliminación.
    </p>

    <div className="hero-cta-group">
      <button
        className="btn-login"
        onClick={() => router.push('/login')}
      >
        <KeyRound size={16} />
        INGRESAR
      </button>

      <button
        className="btn-register"
        onClick={() => router.push('/register')}
      >
        <UserPlus size={16} />
        CREAR CUENTA
      </button>
    </div>

    <div className="hero-meta">
      <span><Eye size={12} /> {activeArena.activeUsers} activos</span>
      <span><Lock size={12} /> Seguro</span>
      <span><Wifi size={12} /> Online</span>
    </div>

  </motion.div>

  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    className="hero-panel"
  >

    <div className="panel-header">
      <Terminal size={14} />
      <span>STATUS LIVE</span>
      <span className="panel-dot" />
    </div>

    <div className="panel-row">
      <span className="panel-key">FASE</span>
      <span className="panel-val green">{activeArena.league}</span>
    </div>

    <div className="panel-row">
      <span className="panel-key">INICIO</span>
      <span className="panel-val">{activeArena.time}</span>
    </div>

    <div className="panel-row">
      <span className="panel-key">JACKPOT</span>
      <span className="panel-val gold">
        ${jackpotTotal.toLocaleString()}
      </span>
    </div>

    <div className="panel-row">
      <span className="panel-key">DIFICULTAD</span>
      <span className="panel-val red">
        {activeArena.difficulty}
      </span>
    </div>

    <div className="panel-divider" />

    <div className="panel-warning">
      <AlertTriangle size={12} />
      LAS DECISIONES SON FINALES
    </div>

  </motion.div>

</main>
<section className="ps5-divider">

  <div className="glass-shine"></div>
  <div className="energy-line"></div>

  <div className="ps5-inner">

    <div className="ps5-label">
      EL CALAMAR MUNDIAL
    </div>

    <div className="ps5-text">
      PARA LLEGAR A LA FINAL
    </div>

    <div className="ps5-highlight">
      MANTENTE CON VIDA
    </div>

  </div>

</section>
    

      {/* 🟢 SECCIÓN DE INTELIGENCIA: ALTURA OPTIMIZADA (COPA COMPLETA) Y FULL WIDTH ── */}
      <section
  style={{
    padding: "40px 0",
    width: "100%",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
    position: "relative"
  }}
>
  <div className="intel-carousel">
    <div className="slides-track">
  <img src="/img/banner1.jpg" alt="banner1" />
  <img src="/img/banner2.jpg" alt="banner2" />
  <img src="/img/banner3.jpg" alt="banner3" />
  <img src="/img/banner4.jpg" alt="banner4" />

  <img src="/img/banner1.jpg" alt="banner1-copy" />
  <img src="/img/banner2.jpg" alt="banner2-copy" />
  <img src="/img/banner3.jpg" alt="banner3-copy" />
  <img src="/img/banner4.jpg" alt="banner4-copy" />
</div>
  </div>
  <section className="winner-strip">
  <p>
    Ingresa al mundo de ganadores. <strong>Diviértete, juega y predice.</strong>
    Pon a prueba tu conocimiento e intuición con todas las opciones que
    tenemos para ti.
  </p>
</section>
</section>

      {/* ── SECCIÓN: PROTOCOLO DE GUERRA ── */}
=======
      <main className="hero-area">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-content"
        >
          <div className="phase-badge">
            <Crosshair size={12} />
            <span>PORTAL DE INGRESO • CENTRO DE MANDO</span>
          </div>

          <h2 className={`hero-title ${glitch ? 'glitch-text' : ''}`} data-text={`${activeArena.team1} VS ${activeArena.team2}`}>
            <span className="hero-line1">{activeArena.team1}</span>
            <span className="hero-vs">VS</span>
            <span className="hero-line2">{activeArena.team2}</span>
          </h2>

          <div style={{ position: 'relative', zIndex: 10, marginBottom: '40px' }}>
            <p style={{ 
              display: 'block', fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.5vw, 16px)',
              color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', maxWidth: '520px', opacity: 1
            }}>
              Cada predicción correcta es un contrato con la supervivencia.<br />
              Cada error, un paso hacia la eliminación definitiva.
            </p>
          </div>

          <div className="hero-cta-group">
            <button className="btn-login" onClick={() => router.push('/login')}>
              <KeyRound size={16} />
              INGRESAR AL SISTEMA
            </button>
            <button className="btn-register" onClick={() => router.push('/register')}>
              <UserPlus size={16} />
              SOLICITAR ACCESO VIP
              <span className="btn-arrow"></span>
            </button>
          </div>

          <div className="hero-meta">
            <span><Eye size={12} /> {activeArena.activeUsers} jugadores activos</span>
            <span><Lock size={12} /> Conexión cifrada</span>
            <span><Wifi size={12} /> Red segura</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hero-panel"
        >
          <div className="panel-header">
            <Terminal size={14} />
            <span>STATUS_ARENA_{activeArena.id.toUpperCase()}</span>
            <span className="panel-dot" />
          </div>
          <div className="panel-row">
            <span className="panel-key">FASE</span>
            <span className="panel-val green">{activeArena.league}</span>
          </div>
          <div className="panel-row">
            <span className="panel-key">INICIO</span>
            <span className="panel-val">{activeArena.time}</span>
          </div>
          <div className="panel-row">
            <span className="panel-key">JACKPOT</span>
            <span className="panel-val gold">{activeArena.jackpot}</span>
          </div>
          <div className="panel-row">
            <span className="panel-key">SÍMBOLO</span>
            <span className="panel-val red symbol-lg">{activeArena.symbol}</span>
          </div>
          <div className="panel-row">
            <span className="panel-key">DIFICULTAD</span>
            <span className="panel-val" style={{ color: difficultyColor[activeArena.difficulty] || '#FF0033' }}>
              {activeArena.difficulty}
            </span>
          </div>
          <div className="panel-divider" />
          <div className="panel-warning">
            <AlertTriangle size={12} />
            LAS APUESTAS SON IRREVERSIBLES
          </div>
        </motion.div>
      </main>

      <section className="carousel-section">
        <div className="carousel-header">
          <span className="carousel-title">SELECCIONA TU ARENA (DEMO)</span>
          <span className="carousel-count">{activeIndex + 1} / {arenas.length}</span>
        </div>
        <div className="carousel-track">
          {arenas.map((arena, index) => (
            <motion.div
              key={arena.id}
              className={`game-card ${activeIndex === index ? 'active' : ''}`}
              style={{ backgroundImage: `url(${arena.bgImage})` }}
              onClick={() => setActiveIndex(index)}
              whileHover={{ y: activeIndex !== index ? -6 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-overlay" />
              <div className="card-top">
                <span className="card-phase">{arena.league}</span>
                <span className="card-symbol">{arena.symbol}</span>
              </div>
              <div className="card-bottom">
                <div className="card-teams">
                  {arena.team1} <span className="card-vs">VS</span> {arena.team2}
                </div>
                <div className="card-meta-row">
                  <span className="card-time">{arena.time}</span>
                  <span className="card-diff" style={{ color: difficultyColor[arena.difficulty] || '#FF0033' }}>
                    {arena.difficulty}
                  </span>
                </div>
                <div className="card-jackpot">{arena.jackpot}</div>
              </div>
              {activeIndex === index && (
                <div className="card-active-bar" />
              )}
            </motion.div>
          ))}
        </div>
        <div className="tension-bar-wrapper">
          <div className="tension-label">
            <BarChart2 size={12} />
            <span>TENSIÓN GLOBAL DEL JUEGO</span>
            <span className="tension-pct">74%</span>
          </div>
          <div className="tension-track">
            <motion.div
              className="tension-fill"
              initial={{ width: '0%' }}
              animate={{ width: '74%' }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </section>

      {/* 🟢 UN SOLO JUEGO INMENSO Y ESTABLE ── */}
      <section style={{ 
        padding: '100px 5vw', 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent, rgba(0,0,0,0.8))', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        position: 'relative', 
        zIndex: 20 
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
            ZONA DE ENTRENAMIENTO <span style={{ color: THE_GAME.color, display: 'block', fontSize: '12px', letterSpacing: '8px', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>SIMULADOR TÁCTICO OFICIAL</span>
          </h2>
        </div>

        <div className="hero-game-wrapper">
          <div className="hero-game-cover" style={{ backgroundImage: `url(${THE_GAME.image})` }}>
            <div className="hero-game-overlay"></div>
            <div className="hero-game-content">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', border: `2px solid ${THE_GAME.color}`, boxShadow: `0 0 30px ${THE_GAME.color}60` }}>
                  {THE_GAME.icon}
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                {THE_GAME.name}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                {THE_GAME.desc}
              </p>
              <button className="btn-massive-play" onClick={() => setIsGameActive(true)}>
                <Play size={20} /> INICIAR SIMULACIÓN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN: INSTRUCCIONES DEL JUEGO (ACORDEÓN EN LÍNEA) ── */}
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
      <section style={{ 
        position: 'relative', zIndex: 20, 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent, rgba(0,0,0,0.9))', 
        padding: '100px 5vw', borderTop: '1px solid rgba(255,0,51,0.2)', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' 
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 10 }}>
<<<<<<< HEAD
          <h2
  style={{
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px,4vw,58px)',
    fontWeight: 900,
    color: '#00E5FF',
    textTransform: 'uppercase',
    letterSpacing: '-1px',
    lineHeight: '1',
    margin: 0,
    textShadow: '0 0 12px #00E5FF, 0 0 28px rgba(0,229,255,.55)'
  }}
>
  INSTRUCCIONES DEL JUEGO

  <span
    style={{
      display: 'block',
      marginTop: '12px',
      fontSize: '11px',
      letterSpacing: '8px',
      color: '#00E5FF',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }}
  >
    GUÍA OFICIAL DE JUGADORES
  </span>
</h2>
        </div>

        {/* === PANEL DESPLEGABLE + BOTONES COMPACTOS === */}

        {/* PANEL SUPERIOR */}
        <AnimatePresence>
          {activeProtocolId && (() => {
            const protocols = [
              { id: "INFO", label: "EL CALAMAR", title: "QUÉ ES EL CALAMAR", color: "#FF0033", text: "El ecosistema definitivo de predicción táctica y supervivencia deportiva. Cada acierto te mantiene con vida. Cada error te acerca a la eliminación." },
              { id: "AUTH", label: "REGISTRO", title: "REGISTRO E INGRESO", color: "#00C853", text: "Obtén tu identidad táctica, recibe tus primeras vidas operativas y entra al sistema blindado." },
              { id: "PX", label: "PITCHX", title: "COMPRA DE PITCHX", color: "#00E5FF", text: "Adquiere PX para ejecutar contratos de predicción, multiplicar ganancias y mantener ventaja competitiva." },
              { id: "PLAY", label: "CÓMO JUGAR", title: "CÓMO JUGAR", color: "#FFD700", text: "Analiza el radar, selecciona partido, firma predicción y espera el resultado oficial." },
              { id: "JACK", label: "JACKPOT", title: "EL PREMIO", color: "#FF8800", text: "El Jackpot aumenta constantemente y solo los jugadores que sobreviven al torneo pueden cobrar." },
              { id: "SEC", label: "SEGURIDAD", title: "SEGURIDAD BLINDADA", color: "#9C27B0", text: "Contratos sellados, registros auditables y protección total para cada operación." },
            ];
            const active = protocols.find(p => p.id === activeProtocolId);
            if (!active) return null;
            return (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35 }}
                style={{
                  width: '100%',
                  maxWidth: '980px',
                  marginBottom: '32px',
                  padding: '32px 36px',
                  borderRadius: '18px',
                  background: 'rgba(10,10,20,0.82)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${active.color}44`,
                  boxShadow: `0 0 40px ${active.color}22, inset 0 0 60px rgba(0,0,0,0.4)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '3px', height: '28px', borderRadius: '2px', background: active.color, boxShadow: `0 0 10px ${active.color}` }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: active.color, fontWeight: 700 }}>
                    {active.title}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px,1.3vw,19px)', color: 'rgba(255,255,255,0.78)', lineHeight: '1.85', fontWeight: 300, margin: 0 }}>
                  {active.text}
                </p>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* FILA DE BOTONES COMPACTOS */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '980px',
        }}>
          {[
            { id: "INFO", label: "EL CALAMAR", color: "#FF0033" },
            { id: "AUTH", label: "REGISTRO", color: "#00C853" },
            { id: "PX", label: "PITCHX", color: "#00E5FF" },
            { id: "PLAY", label: "CÓMO JUGAR", color: "#FFD700" },
            { id: "JACK", label: "JACKPOT", color: "#FF8800" },
            { id: "SEC", label: "SEGURIDAD", color: "#9C27B0" },
          ].map((btn) => (
            <motion.button
              key={btn.id}
              onClick={() => setActiveProtocolId(activeProtocolId === btn.id ? null : btn.id)}
              whileHover={{ scale: 1.03, y: -3, boxShadow: `0 0 28px ${btn.color}66` }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{
                cursor: 'pointer',
                height: '60px',
                padding: '0 28px',
                borderRadius: '14px',
                background: activeProtocolId === btn.id ? `${btn.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeProtocolId === btn.id ? btn.color : btn.color + '44'}`,
                boxShadow: activeProtocolId === btn.id ? `0 0 20px ${btn.color}44` : 'none',
                color: activeProtocolId === btn.id ? btn.color : 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '3px',
                transition: 'background 0.2s, border 0.2s, color 0.2s',
                backdropFilter: 'blur(10px)',
                flexGrow: 1,
                minWidth: '140px',
                maxWidth: '200px',
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontFamily: 'var(--font-display)', fontSize: '180px', color: 'rgba(255,255,255,0.02)', pointerEvents: 'none', userSelect: 'none' }}>○ △ □</div>
      </section>

      {/* ── TORNEOS ACTIVOS ── */}
      <section style={{
        position: 'relative', zIndex: 20,
        padding: '80px 5vw 60px',
        background: 'rgba(0,0,0,0.75)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px', width: '100%', maxWidth: '900px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '6px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '12px' }}>
            SISTEMA DE ESCÁNER SATELITAL
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            TORNEOS EN CURSO
          </h2>
          <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.15)', margin: '16px auto 0' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
          {tournamentsWithMatches.map((t: any) => (
            <motion.button
              key={t.id}
              onClick={() => setActiveTournamentTab(t.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                cursor: 'pointer', padding: '10px 24px', borderRadius: '8px',
                border: activeTournamentTab === t.id ? `1px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)',
                background: activeTournamentTab === t.id ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                color: activeTournamentTab === t.id ? t.color : 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                transition: 'all 0.2s', backdropFilter: 'blur(10px)',
              }}
            >
              {t.id === 'mundial' ? '🌍' : '🏆'} {t.title?.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tournamentsWithMatches.filter((t: any) => t.id === activeTournamentTab).map((t: any) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ width: '100%', maxWidth: '900px' }}>

              {/* ── FILTROS DE STATUS ── */}
<div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
  {['TODOS', 'PROXIMAMENTE', 'EN VIVO', 'FINALIZADO'].map(f => (
    <button key={f} onClick={() => setMatchFilter(f)} style={{
      cursor: 'pointer', padding: '4px 12px', borderRadius: '4px',
      border: matchFilter === f ? `1px solid ${t.color}` : '1px solid rgba(255,255,255,0.06)',
      background: matchFilter === f ? `${t.color}22` : 'transparent',
      color: matchFilter === f ? t.color : 'rgba(255,255,255,0.3)',
      fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', transition: 'all 0.2s',
    }}>{f}</button>
  ))}
</div>

{/* ── BOTONES DE FASES DINÁMICOS ── */}
{(() => {
  const phaseOrder = ['GRUPOS', 'DIECISEISAVOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'TERCER PUESTO', 'FINAL'];
  const availablePhases = phaseOrder.filter(phase =>
    (t.matches || []).some((m: any) => (m.phase || 'GRUPOS') === phase)
  );
  if (availablePhases.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <button
        
        style={{
          cursor: 'pointer', padding: '5px 14px', borderRadius: '4px',
          border: !activePhaseFilter ? `1px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)',
          background: !activePhaseFilter ? `${t.color}22` : 'rgba(255,255,255,0.03)',
          color: !activePhaseFilter ? t.color : 'rgba(255,255,255,0.35)',
          fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', transition: 'all 0.2s',
        }}
        onClick={() => setActivePhaseFilter(null)}
      >TODAS</button>
      {availablePhases.map(phase => (
        <button key={phase}
          onClick={() => setActivePhaseFilter(activePhaseFilter === phase ? null : phase)}
          style={{
            cursor: 'pointer', padding: '5px 14px', borderRadius: '4px',
            border: activePhaseFilter === phase ? `1px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)',
            background: activePhaseFilter === phase ? `${t.color}22` : 'rgba(255,255,255,0.03)',
            color: activePhaseFilter === phase ? t.color : 'rgba(255,255,255,0.35)',
            fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', transition: 'all 0.2s',
          }}
        >{phase}</button>
      ))}
    </div>
  );
})()}

{/* ── PARTIDOS FILTRADOS POR FASE Y STATUS ── */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
  {(() => {
    const phaseOrder = ['GRUPOS', 'DIECISEISAVOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'TERCER PUESTO', 'FINAL'];

    const filteredMatches = (t.matches || []).filter((m: any) =>
      (matchFilter === 'TODOS' || m.status?.toUpperCase() === matchFilter) &&
      (!activePhaseFilter || m.phase === activePhaseFilter)
    );

    if (filteredMatches.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '4px' }}>
          SIN PARTIDOS EN ESTA CATEGORÍA
        </div>
      );
    }

    // Si hay filtro de fase activo Y es GRUPOS → mostrar por subgrupos
if (activePhaseFilter === 'GRUPOS') {
  const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const subGroups = groupOrder.map(g => ({
    label: `GRUPO ${g}`,
    matches: filteredMatches.filter((m: any) => m.group_name === g),
  })).filter(g => g.matches.length > 0);

  return (
    <>
      {subGroups.map(({ label, matches: gMatches }) => (
        <div key={label}>
          <div style={{
            marginTop: '14px', marginBottom: '8px', paddingBottom: '6px',
            borderBottom: `1px solid ${t.color}33`,
            color: t.color, fontFamily: 'var(--font-mono)',
            fontSize: '10px', letterSpacing: '3px', fontWeight: 700,
          }}>{label}</div>
          {gMatches.map((match: any, i: number) => (
            <motion.div key={match.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{
                display: 'grid', gridTemplateColumns: '110px 1fr auto 1fr 120px',
                alignItems: 'center', gap: '12px', padding: '14px 20px',
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
              }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
                  {match.match_date ? new Date(match.match_date).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase() : 'POR DEFINIR'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  {match.match_date ? new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff', textAlign: 'right' }}>{match.home_team || 'TBD'}</span>
                {match.home_flag && <img src={`https://flagcdn.com/w40/${match.home_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
              </div>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                {match.status === 'FINALIZADO' ? (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 900, color: t.color, letterSpacing: '2px' }}>{match.home_score ?? 0} - {match.away_score ?? 0}</span>
                ) : match.status === 'EN VIVO' ? (
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FF0033', letterSpacing: '2px', fontWeight: 700 }}>● VIVO</motion.span>
                ) : (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>VS</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {match.away_flag && <img src={`https://flagcdn.com/w40/${match.away_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff' }}>{match.away_team || 'TBD'}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                {match.status === 'PROXIMAMENTE' ? (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(t.id === 'mundial' ? '/fixture' : '/champions')}
                    style={{
                      cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                      border: `1px solid ${t.color}`, background: 'transparent', color: t.color,
                      fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', transition: 'all 0.2s',
                    }}>PREDECIR →</motion.button>
                ) : (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: match.status === 'FINALIZADO' ? 'rgba(255,255,255,0.25)' : '#FF0033' }}>
                    {match.status === 'FINALIZADO' ? '✓ FINALIZADO' : match.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </>
  );
}

// Si hay filtro de fase activo (no GRUPOS) → mostrar directo sin header
if (activePhaseFilter) {
  
      return filteredMatches.map((match: any, i: number) => (
        <motion.div key={match.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
          style={{
            display: 'grid', gridTemplateColumns: '110px 1fr auto 1fr 120px',
            alignItems: 'center', gap: '12px', padding: '14px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
          }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
              {match.match_date ? new Date(match.match_date).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase() : 'POR DEFINIR'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {match.match_date ? new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff', textAlign: 'right' }}>{match.home_team || 'TBD'}</span>
            {match.home_flag && <img src={`https://flagcdn.com/w40/${match.home_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
          </div>
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            {match.status === 'FINALIZADO' ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 900, color: t.color, letterSpacing: '2px' }}>{match.home_score ?? 0} - {match.away_score ?? 0}</span>
            ) : match.status === 'EN VIVO' ? (
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FF0033', letterSpacing: '2px', fontWeight: 700 }}>● VIVO</motion.span>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>VS</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {match.away_flag && <img src={`https://flagcdn.com/w40/${match.away_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff' }}>{match.away_team || 'TBD'}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            {match.status === 'PROXIMAMENTE' ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push(t.id === 'mundial' ? '/fixture' : '/champions')}
                style={{
                  cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                  border: `1px solid ${t.color}`, background: 'transparent', color: t.color,
                  fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', transition: 'all 0.2s',
                }}>PREDECIR →</motion.button>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: match.status === 'FINALIZADO' ? 'rgba(255,255,255,0.25)' : '#FF0033' }}>
                {match.status === 'FINALIZADO' ? '✓ FINALIZADO' : match.status}
              </span>
            )}
          </div>
        </motion.div>
      ));
    }

    // Sin filtro de fase → agrupar por fases
    const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];



const groups = activePhaseFilter === 'GRUPOS'
  ? groupOrder.map(g => ({
      phase: `GRUPO ${g}`,
      matches: filteredMatches.filter((m: any) => m.group_name === g),
    })).filter(g => g.matches.length > 0)
  : phaseOrder.map(phase => ({
      phase,
      matches: filteredMatches.filter((m: any) => (m.phase || 'GRUPOS') === phase),
    })).filter(g => g.matches.length > 0);

    return (
      <>
        {groups.map(({ phase, matches: phaseMatches }) => (
          <div key={phase}>
            <div style={{
              marginTop: '14px', marginBottom: '8px', paddingBottom: '6px',
              borderBottom: `1px solid ${t.color}33`,
              color: t.color, fontFamily: 'var(--font-mono)',
              fontSize: '10px', letterSpacing: '3px', fontWeight: 700,
            }}>{phase}</div>
            {phaseMatches.map((match: any, i: number) => (
              <motion.div key={match.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{
                  display: 'grid', gridTemplateColumns: '110px 1fr auto 1fr 120px',
                  alignItems: 'center', gap: '12px', padding: '14px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
                    {match.match_date ? new Date(match.match_date).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase() : 'POR DEFINIR'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    {match.match_date ? new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff', textAlign: 'right' }}>{match.home_team || 'TBD'}</span>
                  {match.home_flag && <img src={`https://flagcdn.com/w40/${match.home_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
                </div>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  {match.status === 'FINALIZADO' ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 900, color: t.color, letterSpacing: '2px' }}>{match.home_score ?? 0} - {match.away_score ?? 0}</span>
                  ) : match.status === 'EN VIVO' ? (
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FF0033', letterSpacing: '2px', fontWeight: 700 }}>● VIVO</motion.span>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>VS</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {match.away_flag && <img src={`https://flagcdn.com/w40/${match.away_flag.toLowerCase()}.png`} style={{ width: '24px', height: 'auto', borderRadius: '2px' }} />}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff' }}>{match.away_team || 'TBD'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {match.status === 'PROXIMAMENTE' ? (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(t.id === 'mundial' ? '/fixture' : '/champions')}
                      style={{
                        cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                        border: `1px solid ${t.color}`, background: 'transparent', color: t.color,
                        fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', transition: 'all 0.2s',
                      }}>PREDECIR →</motion.button>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px', color: match.status === 'FINALIZADO' ? 'rgba(255,255,255,0.25)' : '#FF0033' }}>
                      {match.status === 'FINALIZADO' ? '✓ FINALIZADO' : match.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </>
    );
  })()}
</div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>
                  {(t.matches || []).length} PARTIDOS REGISTRADOS
                </span>
                <motion.button whileHover={{ x: 4 }} onClick={() => router.push(t.id === 'mundial' ? '/fixture' : '/champions')}
                  style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', color: t.color, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  VER CALENDARIO COMPLETO →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
=======
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', textShadow: '0 0 20px rgba(255,0,51,0.5)' }}>
            PROTOCOLO DE GUERRA <span style={{ color: '#FF0033', display: 'block', fontSize: '10px', letterSpacing: '8px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>INSTRUCCIONES CLASIFICADAS</span>
          </h2>
        </div>

        <div className="ps5-grid-6">
          {[
            { t: "QUÉ ES EL CALAMAR", c: "#FF0033", i: <Monitor size={22} />, id: "INFO.01", d: "El ecosistema definitivo de predicción táctica y supervivencia deportiva.", f: "El Gurú del Fútbol no es una casa de apuestas convencional. Es un simulador de supervivencia basado en eventos reales (Champions y Mundial). Cada acierto certifica tu permanencia en el búnker; cada error te acerca a la eliminación definitiva." },
            { t: "REGISTRO E INGRESO", c: "#00C853", i: <KeyRound size={22} />, id: "AUTH.02", d: "Obtén tu NIT único y asegura tus primeras 5 vidas operativas.", f: "Al registrarte, recibes una identidad cifrada y 5 VIDAS. Si tu contador llega a cero, pierdes acceso a las arenas. El ingreso se realiza por un portal blindado que protege tus activos y tu historial táctico." },
            { t: "COMPRA DE PITCHX", c: "#FF0033", i: <CreditCard size={22} />, id: "ECON.03", d: "Adquiere PX para firmar contratos de predicción inmutables.", f: "Los PitchX (PX) son la energía del búnker. Son necesarios para ejecutar cada contrato de predicción. Se adquieren mediante pasarelas blindadas, se almacenan en tu billetera y no tienen fecha de caducidad." },
            { t: "CÓMO JUGAR", c: "#00C853", i: <Gamepad2 size={22} />, id: "PLAY.04", d: "Analiza el Radar, firma tu contrato y espera la resolución.", f: "Operación: 1. Selecciona partido. 2. Define tu predicción (Victoria/Marcador). 3. Asigna PX. 4. Si aciertas, multiplicas PX y conservas vidas. Si fallas, el sistema drena una vida operativa de tu perfil." },
            { t: "EL PREMIO", c: "#FFD700", i: <Trophy size={22} />, id: "REWD.05", d: "El Jackpot crece con cada caída. Solo los vivos cobran.", f: "El pozo de premios es dinámico. Al final del torneo, el Jackpot se reparte proporcionalmente SOLO entre los Reclutas que mantengan vidas activas. La supervivencia es la única clave para cobrar el botín." },
            { t: "SEGURIDAD BLINDADA", c: "#FF0033", i: <ShieldCheck size={22} />, id: "SECU.06", d: "Contratos inteligentes y registros inmutables por auditoría.", f: "Toda operación está sellada. Nadie puede alterar una predicción una vez firmada. Utilizamos cifrado militar y validación automática con fuentes oficiales de la FIFA y UEFA para asegurar la transparencia total." }
          ].map((item) => (
            <motion.div 
              layout 
              key={item.t} 
              className={`ps5-card ${activeProtocolId === item.id ? 'active' : ''}`}
              style={{ '--card-color': item.c, '--card-glow': `${item.c}40` } as any}
              onClick={() => setActiveProtocolId(activeProtocolId === item.id ? null : item.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="ps5-card-icon">{item.i}</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 800, letterSpacing: '3px', color: item.c, opacity: 0.8, marginBottom: '8px' }}>{item.id}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#fff', marginBottom: '12px', lineHeight: 1.4 }}>{item.t}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 300 }}>{item.d}</p>
              
              <AnimatePresence>
                {activeProtocolId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ width: '100%', overflow: 'hidden' }}
                  >
                    <div style={{ 
                      padding: '20px', 
                      background: `${item.c}1A`, 
                      border: `1px solid ${item.c}40`, 
                      borderRadius: '4px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                        {item.f}
                      </p>
                      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={14} color={item.c} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: item.c, letterSpacing: '2px' }}>
                          PROTOCOLO DESPLEGADO
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ))}
        </div>
        
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontFamily: 'var(--font-display)', fontSize: '180px', color: 'rgba(255,255,255,0.02)', pointerEvents: 'none', userSelect: 'none' }}>○ △ □</div>
      </section>

      {/* ── FRENTES DE BATALLA TÁCTICOS ── */}
      <section style={{ position: 'relative', zIndex: 20, padding: '100px 5vw', background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 10, width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
            FRENTES DE BATALLA <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '10px', letterSpacing: '8px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>SISTEMA DE ESCÁNER SATELITAL</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1200px' }}>
          <AnimatePresence>
            {activeTournaments.map((t: any, index: number) => (
              <motion.div
                  key={t.id}
                  className="t-card-elite"
                  style={{ '--t-accent': t.color, '--t-accent-40': `${t.color}40` } as any}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              >
                  <div className="t-bg-image" style={{ backgroundImage: `url('${t.bg}')` }} />
                  <div className="t-overlay" />

                  <div className="t-content">
                    <div className="t-logo-box" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fff' }}>
                      {t.id === 'mundial' ? <Globe size={46} color={t.color} /> : <Trophy size={46} color={t.color} />}
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', color: t.color }}>{t.id === 'mundial' ? 'EDICIÓN GLOBAL' : 'ÉLITE EUROPEA'}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>{t.id === 'mundial' ? '2026' : 'UCL'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="t-phase">{t.phase}</div>
                      <h2 className="t-title">{t.title}</h2>
                    </div>

                    <div className="t-meta-grid">
                      <div className="t-meta-item">
                        <span className="t-meta-lbl">ESTADO DE OPERACIÓN</span>
                        <span className="t-meta-val" style={{color: t.color}}>{t.id === 'mundial' ? 'ESPERANDO DESPLIEGUE' : 'ACTIVO'}</span>
                      </div>
                      <div className="t-meta-item">
                        <span className="t-meta-lbl">RIESGO ESTIMADO</span>
                        <span className="t-meta-val" style={{color: 'var(--gold)'}}>ALTO / LETAL</span>
                      </div>
                    </div>

                    <button className="btn-t-action" onClick={() => router.push(t.id === 'mundial' ? '/fixture' : '/champions')}>
                      VER INTELIGENCIA DE TORNEO <ChevronRight size={16} />
                    </button>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
      </section>

      {/* ── PUBLICIDAD / PARTNERS OFICIALES ── */}
      <section style={{ background: '#020202', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '40px 5vw', position: 'relative', zIndex: 20 }}>
        <h4 style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '4px', margin: '0 0 30px' }}>
          INFRAESTRUCTURA Y AUDITORÍA PROVISTA POR
        </h4>
        <div style={{ display: 'flex', gap: '60px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', opacity: 0.4, fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
            <Server size={18} /> SUPABASE CLOUD
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
            <ShieldCheck size={18} /> SMART CONTRACTS
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
            <Database size={18} /> OPTA API
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
            <Globe size={18} /> VERCEL EDGE
          </span>
        </div>
      </section>

<<<<<<< HEAD
      {/* ── FOOTER ÉLITE: EL CALAMAR MUNDIALISTA ── */}
      <style dangerouslySetInnerHTML={{__html: `
        .footer-elite-wrapper { border-top: 1px solid rgba(255, 0, 51, 0.3); background: #000; position: relative; overflow: hidden; }
        .marquee-container { width: 100%; background: #0a0a0a; border-bottom: 1px solid rgba(0, 200, 83, 0.2); overflow: hidden; padding: 12px 0; display: flex; white-space: nowrap; }
        .marquee-content { display: flex; animation: marquee-scroll 25s linear infinite; }
        .marquee-item { display: flex; align-items: center; gap: 15px; margin: 0 30px; font-family: var(--font-display), sans-serif; font-size: 11px; font-weight: 700; color: #666; letter-spacing: 2px; text-transform: uppercase; }
        .marquee-item span { color: #fff; }
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        
        .elite-grid { display: grid; grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; max-width: 1280px; margin: 0 auto; }
        @media (min-width: 768px) { .elite-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .elite-grid { grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 30px; } }
        
        .elite-col-title { color: #fff; font-family: var(--font-display), sans-serif; font-size: 14px; font-weight: 900; letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .elite-link { display: block; color: #888; font-size: 12px; margin-bottom: 12px; transition: all 0.3s ease; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
        .elite-link:hover { color: #00C853; transform: translateX(5px); }
        
        .elite-input-group { display: flex; margin-top: 15px; }
        .elite-input { flex: 1; background-color: #000 !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.2); padding: 12px 15px; font-size: 12px; outline: none; transition: border 0.3s; }
        .elite-input:focus { border-color: #00C853; }
        .elite-btn { background: #FF0033; color: #fff; border: none; padding: 0 20px; font-weight: bold; cursor: pointer; transition: background 0.3s; font-size: 12px; letter-spacing: 1px;}
        .elite-btn:hover { background: #cc0029; }
        
        .glass-status-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; }
        .status-row-elite { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 11px; color: #aaa; letter-spacing: 1px; }
        .status-row-elite:last-child { margin-bottom: 0; }
        .neon-text-green { color: #00C853; text-shadow: 0 0 10px rgba(0, 200, 83, 0.4); }
        
        .footer-bottom-elite { border-top: 1px solid rgba(255,255,255,0.05); padding: 25px 20px; display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; }
        @media (min-width: 768px) { .footer-bottom-elite { flex-direction: row; justify-content: space-between; text-align: left; max-width: 1280px; margin: 0 auto; } }
      `}} />

      <footer className="footer-elite-wrapper">
        {/* CARRUSEL DE PARTNERS & TECNOLOGÍA (MARQUEE) */}
        <div className="marquee-container">
          <div className="marquee-content">
            {/* Se duplica el contenido para el efecto de scroll infinito suave */}
            {[1, 2].map((loop) => (
              <React.Fragment key={loop}>
                <div className="marquee-item"><Database size={14} /> INFRAESTRUCTURA: <span>SUPABASE CLOUD</span></div>
                <div className="marquee-item"><Activity size={14} /> DATOS PROVISTOS POR: <span>OPTA SPORTS API</span></div>
                <div className="marquee-item"><Server size={14} /> DESPLIEGUE GLOBAL: <span>VERCEL EDGE EDGE NETWORKS</span></div>
                <div className="marquee-item"><Shield size={14} /> AUDITORÍA DE HABILIDAD: <span>SMART CONTRACTS WEB3</span></div>
                <div className="marquee-item"><TrendingUp size={14} /> RENDIMIENTO GRÁFICO: <span>PS5 LEVEL RENDER</span></div>
              </React.Fragment>
=======
      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="warning-tape" />

        <div className="footer-ops-bar">
          <div className="ops-ticker" data-repeat="■ SISTEMA OPERATIVO ○ ARENAS ACTIVAS: 5 △ JUGADORES EN LÍNEA: 142,500 □ JACKPOT GLOBAL: $15,900,000 ■ PRÓXIMO CIERRE: 11 JUN 2026 ○ RED CIFRADA • BLOCKCHAIN VERIFICADO ">
            {[
              '■ SISTEMA OPERATIVO',
              '○ ARENAS ACTIVAS: 5',
              '△ JUGADORES EN LÍNEA: 142,500',
              '□ JACKPOT GLOBAL: $15,900,000',
              '■ PRÓXIMO CIERRE: 11 JUN 2026',
              '○ RED CIFRADA • BLOCKCHAIN VERIFICADO',
            ].map((t, i) => (
              <span key={i} className="ticker-item">{t}</span>
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* CINTA DE ADVERTENCIA NEÓN ROJA */}
        <div className="ops-ticker" style={{ background: '#FF0033', color: '#000', padding: '8px 0', borderBottom: '2px solid #fff' }}>
          <div style={{ display: 'flex', animation: 'marquee-scroll 30s linear infinite', whiteSpace: 'nowrap', fontWeight: 900, fontSize: '11px', letterSpacing: '3px' }}>
            {[1, 2].map((loop) => (
              <div key={loop} style={{ display: 'flex', gap: '50px', paddingRight: '50px' }}>
                <span>■ ALERTA DE SISTEMA</span>
                <span>○ ARENAS EN MÁXIMA CAPACIDAD</span>
                <span>△ JUEGO DE HABILIDAD ESTRICTO (NO APUESTAS)</span>
                <span>□ JACKPOT GLOBAL: $15,900,000</span>
                <span>■ PRÓXIMO CIERRE: 11 JUN 2026</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL DEL FOOTER */}
        <div className="elite-grid">
          
          {/* COLUMNA 1: MARCA Y ESTADO DE SERVIDORES */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, color: '#fff', lineHeight: '1.1', marginBottom: '5px' }}>
              EL CALAMAR<br />
              <span style={{ color: '#FF0033', textShadow: '0 0 15px rgba(255,0,51,0.5)' }}>MUNDIALISTA</span>
            </div>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '25px' }}>CENTRO DE MANDO GLOBAL • 2026</p>
            
            <div className="glass-status-panel">
              <div className="status-row-elite">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', background: '#00C853', borderRadius: '50%', boxShadow: '0 0 8px #00C853' }} /> ESTADO DE RED</span>
                <span className="neon-text-green">OPERATIVA</span>
              </div>
              <div className="status-row-elite">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={12} /> JUGADORES (VIVOS)</span>
                <span style={{ color: '#fff' }}>{liveUsers?.toLocaleString() || '142,500'}</span>
              </div>
              <div className="status-row-elite">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Server size={12} /> LATENCIA DEL MOTOR</span>
                <span style={{ color: '#fff' }}>12ms</span>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN TÁCTICA */}
          <div>
            <h4 className="elite-col-title"><span style={{ color: '#FF0033' }}>○</span> ZONAS DE SUPERVIVENCIA</h4>
            <nav>
              <a className="elite-link">Radar de Pronósticos</a>
              <a className="elite-link">Arenas Globales</a>
              <a className="elite-link">Ranking de Supervivientes</a>
              <a className="elite-link">Fixture Oficial 2026</a>
              <a className="elite-link">Historial Táctico</a>
            </nav>
          </div>

          {/* COLUMNA 3: REGLAMENTOS Y LEGALIDAD */}
          <div>
            <h4 className="elite-col-title"><span style={{ color: '#00C853' }}>△</span> PROTOCOLOS Y LEYES</h4>
            <nav>
              <a className="elite-link">Manifiesto de Habilidad (No Azar)</a>
              <a className="elite-link">Reglas de Eliminación</a>
              <a className="elite-link">Auditoría de Contratos Inteligentes</a>
              <a className="elite-link">Términos de Supervivencia</a>
              <a className="elite-link">Privacidad de Datos Cifrados</a>
            </nav>
          </div>

          {/* COLUMNA 4: SISTEMA Y RECLUTAMIENTO */}
          <div>
            <h4 className="elite-col-title"><span style={{ color: '#fff' }}>□</span> TERMINAL DE INTELIGENCIA</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
               <div className="status-row-elite" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={12} color="#00C853" /> CARGA DE PROCESAMIENTO</span>
                 <span className="neon-text-green">34%</span>
               </div>
               <div className="status-row-elite" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={12} color="#00C853" /> PREDICCIONES / SEG</span>
                 <span className="neon-text-green">8,430</span>
               </div>
               <div className="status-row-elite">
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Skull size={12} color="#FF0033" /> TASA DE ELIMINACIÓN</span>
                 <span style={{ color: '#FF0033' }}>24.8%</span>
               </div>
            </div>

            {/* INPUT CUMPLIENDO REGLA DE ORO: NEGRO CON TEXTO BLANCO */}
            <p style={{ fontSize: '11px', color: '#888', letterSpacing: '1px' }}>RECIBIR COORDENADAS DE PRÓXIMAS PREDICCIONES:</p>
            <div className="elite-input-group">
              <input type="email" placeholder="CORREO ELECTRONICO" className="elite-input" />
              <button className="elite-btn">INGRESAR</button>
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR DE COPYRIGHT Y SELLOS OFICIALES */}
        <div className="footer-bottom-elite">
          <p style={{ fontSize: '10px', color: '#555', letterSpacing: '1.5px', maxWidth: '600px' }}>
            © 2026 EL CALAMAR DEL MUNDIAL. ESTA PLATAFORMA ES ESTRICTAMENTE UN JUEGO DE PRONÓSTICOS BASADO EN HABILIDADES ESTADÍSTICAS Y DEPORTIVAS. LA SUPERVIVENCIA NO ESTÁ GARANTIZADA. JUEGA CON ESTRATEGIA.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1px' }}><Lock size={12} color="#00C853"/> RED SEGURA 256-BIT</span>
            <span style={{ fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1px' }}><Shield size={12} color="#00C853"/> PLATAFORMA DE HABILIDAD CERTIFICADA</span>
            <span style={{ fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1px' }}><Star size={12} color="#FFD700"/> ACCESO VIP 2026</span>
          </div>
        </div>
      </footer>

      {/* 🟢 MODAL FLOTANTE CERO RESTRICCIONES (JUEGO SEGURO / TRANSMISIÓN) PRESERVADO INTACTO 🟢 */}
=======
        <div className="footer-main">
          <div className="max-w-7xl mx-auto">
            <div className="footer-grid">

              <div className="footer-brand-col">
                <div className="footer-logo">
                  EL CALAMAR<br />
                  <span className="footer-logo-red">MUNDIALISTA</span>
                </div>
                <p className="footer-tagline">CENTRO DE MANDO • 2026</p>
                <div className="footer-status-panel">
                  <div className="status-row">
                    <span className="status-dot green-dot" />
                    <span className="status-text">RED SEGURA • OPERATIVA</span>
                  </div>
                  <div className="status-row">
                    <Database size={11} />
                    <span className="status-text">{liveUsers.toLocaleString()} JUGADORES CONECTADOS</span>
                  </div>
                  <div className="status-row">
                    <Server size={11} />
                    <span className="status-text">LATENCIA: 12ms • UPTIME: 99.98%</span>
                  </div>
                  <div className="status-row">
                    <Globe size={11} />
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

      {/* 🟢 MODAL FLOTANTE CERO RESTRICCIONES (JUEGO SEGURO) 🟢 */}
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
      <AnimatePresence>
        {isGameActive && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="game-modal-overlay"
            onClick={(e) => { e.stopPropagation(); setIsGameActive(false); }} 
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 50 }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="game-modal-content"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="game-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {THE_GAME.icon}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#fff', fontWeight: 900, letterSpacing: '2px' }}>
                    {THE_GAME.name}
                  </span>
                </div>
                <button className="game-modal-close" onClick={(e) => { e.stopPropagation(); setIsGameActive(false); }}>
<<<<<<< HEAD
                  CERRAR TRANSMISIÓN <X size={16} />
=======
                  ABORTAR SIMULACIÓN <X size={16} />
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
                </button>
              </div>
              
              <div style={{ flex: 1, background: '#000', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 0 }}>
                  <Activity size={32} color={THE_GAME.color} className="animate-pulse" />
                </div>
                
<<<<<<< HEAD
                {/* TÚNEL LIBRE SIN SANDBOX - EL VIDEO RESPIRA */}
                <iframe 
                  src={THE_GAME.url} 
                  style={{ width: '100%', height: '100%', border: 'none', position: 'relative', zIndex: 10 }} 
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  title={THE_GAME.name}
                />
=======
                {/* TÚNEL LIBRE DE RESTRICCIONES */}
                <iframe 
                  src={THE_GAME.url} 
                  style={{ width: '100%', height: '100%', border: 'none', position: 'relative', zIndex: 10 }} 
                  allow="autoplay; fullscreen; gamepad; keyboard-map"
                  title={THE_GAME.name}
                />

>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
<<<<<<< HEAD
=======

>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
    </div>
  );
}