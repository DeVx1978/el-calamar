"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Skull, Zap, Lock, Crosshair, Clock, AlertTriangle, BatteryWarning, ShieldAlert, Target, Server, ShieldCheck, Gamepad2, Database, MapPin, Radio, Check, X, Timer, Play, User, TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// --- CONEXIÓN AL CEREBRO CENTRAL ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gtioqzodmulbqbohdyet.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aW9xem9kbXVsYnFib2hkeWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjkyMzUsImV4cCI6MjA5MTE0NTIzNX0.OuK_ueIdYZEmUvU4jexr4dclRhHGBPglQ96pntN4v9o";

const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// PROTOCOLO ANTI-ERRORES DE IMAGEN
const getFlagUrl = (code: string | undefined | null) => {
  if (!code) return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; 
  return `https://flagcdn.com/w160/${code.toLowerCase()}.png`;
};

// DATOS DE EMERGENCIA (MANTENIDOS POR SEGURIDAD)
const MOCK_MATCHES = [
  { id: 'm1', fecha_inicio: new Date(Date.now() + 3600000).toISOString(), equipo_local: 'COLOMBIA', bandera_local: 'co', equipo_visitante: 'ECUADOR', bandera_visitante: 'ec', tiempo_limite: 360, costo_ingreso: 500 },
  { id: 'm2', fecha_inicio: new Date(Date.now() + 86400000).toISOString(), equipo_local: 'ARGENTINA', bandera_local: 'ar', equipo_visitante: 'URUGUAY', bandera_visitante: 'uy', tiempo_limite: 540, costo_ingreso: 500 },
  { id: 'm3', fecha_inicio: new Date(Date.now() + 172800000).toISOString(), equipo_local: 'BRASIL', bandera_local: 'br', equipo_visitante: 'CHILE', bandera_visitante: 'cl', tiempo_limite: 720, costo_ingreso: 500 }
];

export default function CampoDeBatalla() {
  const router = useRouter();
  
  // ESTADOS DEL SISTEMA
  const [jackpot, setJackpot] = useState(5404357);
  const [vivos, setVivos] = useState(142502);
  const [muertos, setMuertos] = useState(45623);
  const [coma, setComa] = useState(1241);
  const [playerData, setPlayerData] = useState({ alias: "GURU_ELITE", id: "0456", vidas: 5, pitchx: 3500 }); // DIRECTOR: Vidas inicializadas en 5

  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'fail'>('idle');
  const [systemMsg, setSystemMsg] = useState("");

  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [battleQuestions, setBattleQuestions] = useState<any[]>([]);
  
  // ESTADO DE PRODUCCIÓN: Cierre de zona si no hay partidos
  const [noMatches, setNoMatches] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // IDENTIDAD DE TORNEO (ADN VISUAL)
  const [isChampions, setIsChampions] = useState(false);

  // ESTADOS DE TIEMPO (Centésimas) Y SEMÁFORO
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isLocked, setIsLocked] = useState(true); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [trafficLight, setTrafficLight] = useState<'idle' | 'red' | 'yellow' | 'green'>('idle'); 
  
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [systemAlert, setSystemAlert] = useState<{msg: string, type: 'system' | 'death' | 'life' | 'coma'} | null>(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', session.user.id).single();
          if (perfil) {
            setPlayerData(prev => ({
              ...prev,
              alias: perfil.nombre || "RECLUTA",
              id: String(perfil.codigo_recluta || "0000").padStart(4, '0'),
              vidas: perfil.vidas !== undefined ? perfil.vidas : 5, // DIRECTOR: Respeta DB, si no, otorga 5
              pitchx: Number(perfil.pitchx_coins || 0)
            }));
          }
        }

        // --- MOTOR DE BÚSQUEDA MULTITORNEO ACTUALIZADO ---
        const { data, error } = await supabase
          .from('partidos')
          .select('*')
          .in('fase', ['JORNADA 1', 'SEMIFINAL - CHAMPIONS', 'FINAL - CHAMPIONS', 'CUARTOS - CHAMPIONS'])
          .order('fecha_inicio', { ascending: true });

        if (data && data.length > 0) {
          setAllMatches(data);
          loadMatchDetails(data[0]);
          setNoMatches(false);
        } else {
          setNoMatches(true);
        }
      } catch (err) {
        console.error("Falla de conexión", err);
        setNoMatches(true);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchMatchData();
  }, []);

  const loadMatchDetails = async (match: any) => {
    setCurrentMatch(match);
    setSelections({});
    setIsLocked(true); 
    setHasStarted(false); 
    setTrafficLight('idle');
    setTimeLeft((match.tiempo_limite || 540) * 1000);

    // LÓGICA DE ADN DE TORNEO
    if (match.fase && match.fase.includes('CHAMPIONS')) {
      setIsChampions(true);
    } else {
      setIsChampions(false);
    }

    try {
      const { data: directrices } = await supabase
        .from('directrices')
        .select('*')
        .eq('partido_id', match.id)
        .order('orden', { ascending: true });

      if (directrices && directrices.length > 0) {
        const { data: opciones } = await supabase
          .from('opciones')
          .select('*')
          .in('directriz_id', directrices.map(d => d.id));

        const formattedQuestions = directrices.map(d => ({
          id: d.id,
          title: d.etiqueta,
          options: (opciones || [])
            .filter(o => o.directriz_id === d.id)
            .map(o => ({
              id: o.id, text: o.texto_opcion, icon: ['△', '◯', '✕', '▢'][Math.floor(Math.random() * 4)], odds: (Math.random() * (3.5 - 1.1) + 1.1).toFixed(2)
            }))
        }));
        setBattleQuestions(formattedQuestions);
      } else {
        // --- MERCADO DE APUESTAS SIMULADO (Fallback) ---
        setBattleQuestions([
          { 
            id: 'q1', 
            title: 'MERCADO: LÍNEA DE DINERO (1X2)', 
            options: [
              { id: 'L', text: 'LOCAL', icon: '△', odds: '2.10' }, 
              { id: 'E', text: 'EMPATE', icon: '◯', odds: '3.40' }, 
              { id: 'V', text: 'VISITANTE', icon: '✕', odds: '3.10' }, 
              { id: 'D', text: 'NO BET', icon: '▢', odds: '1.00' }
            ] 
          },
          { 
            id: 'q2', 
            title: 'MERCADO: TOTAL GOLES O/U 2.5', 
            options: [
              { id: 'o1', text: 'OVER 2.5', icon: '△', odds: '1.85' }, 
              { id: 'u1', text: 'UNDER 2.5', icon: '◯', odds: '1.95' }, 
              { id: 'o2', text: 'OVER 3.5', icon: '✕', odds: '3.20' }, 
              { id: 'u2', text: 'UNDER 1.5', icon: '▢', odds: '3.50' }
            ] 
          },
          { 
            id: 'q3', 
            title: 'MERCADO: BTTS (AMBOS ANOTAN)', 
            options: [
              { id: 'y1', text: 'SÍ (YES)', icon: '△', odds: '1.75' }, 
              { id: 'n1', text: 'NO (NO)', icon: '◯', odds: '2.05' }, 
              { id: 'f1', text: '1ER TIEMPO', icon: '✕', odds: '4.50' }, 
              { id: 's2', text: '2DO TIEMPO', icon: '▢', odds: '3.10' }
            ] 
          },
          { 
            id: 'q4', 
            title: 'MERCADO: DOBLE OPORTUNIDAD', 
            options: [
              { id: '1x', text: '1X (LOC/EMP)', icon: '△', odds: '1.30' }, 
              { id: '12', text: '12 (CUALQUIERA)', icon: '◯', odds: '1.35' }, 
              { id: 'x2', text: 'X2 (VIS/EMP)', icon: '✕', odds: '1.65' }, 
              { id: 'cs', text: 'CLEAN SHEET', icon: '▢', odds: '2.80' }
            ] 
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const events: {msg: string, type: 'system'|'death'|'life'|'coma'}[] = [
      { msg: "RECLUTA #2207 ELIMINADO", type: "death" },
      { msg: "NUEVO RECLUTA INGRESANDO", type: "life" },
      { msg: "SISTEMA ESCANEANDO PREDICCIONES", type: "system" },
      { msg: "RECLUTA #0941 EN COMA (12H)", type: "coma" },
      { msg: "JACKPOT ACTUALIZADO", type: "system" }
    ];
    const eventTimer = setInterval(() => {
      const selected = events[Math.floor(Math.random() * events.length)];
      setSystemAlert(selected);
      setJackpot(prev => prev + Math.floor(Math.random() * 300));
      if (selected.type === "death") setMuertos(m => m + 1);
      if (selected.type === "life") setVivos(v => v + 1);
      if (selected.type === "coma") setComa(c => c + 1);
      setTimeout(() => setSystemAlert(null), 4000);
    }, 10000);
    return () => clearInterval(eventTimer);
  }, []);

  // LÓGICA DEL SEMÁFORO DE INICIO
  const startOperation = () => {
    if (hasStarted) return;
    
    setTrafficLight('red');
    
    setTimeout(() => {
      setTrafficLight('yellow');
    }, 1000);
    
    setTimeout(() => {
      setTrafficLight('green');
      setIsLocked(false); 
      setHasStarted(true); 
      setTimeout(() => setTrafficLight('idle'), 1000); 
    }, 2000);
  };

  // MOTOR DEL CRONÓMETRO ANTI-TRAMPAS (Uso de performance.now() inmune a cambios de reloj local)
  useEffect(() => {
    if (!isLocked && currentMatch && hasStarted && timeLeft > 0) {
      const endTime = performance.now() + timeLeft;
      
      const intervalId = setInterval(() => {
        const remaining = endTime - performance.now();
        if (remaining <= 0) {
          setTimeLeft(0);
          setIsLocked(true);
          clearInterval(intervalId);
        } else {
          setTimeLeft(remaining);
        }
      }, 10);
      
      return () => clearInterval(intervalId);
    }
  }, [isLocked, hasStarted]);

  // FORMATEADOR DE TIEMPO
  const formatTimeBomb = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    
    return { minutes, seconds, centiseconds };
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isLocked || status !== 'idle') return;
    setSelections(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleMatchSelect = (match: any) => {
    if (status !== 'idle' || match.id === currentMatch?.id) return;
    loadMatchDetails(match);
  };

  const isFormComplete = battleQuestions.length > 0 && Object.keys(selections).length === battleQuestions.length;

  const handleSubmit = async () => {
    if (!isFormComplete || isLocked) return;
    if (!userId || !currentMatch) {
      setSystemMsg("IDENTIFICACIÓN RECHAZADA. OPERACIÓN ABORTADA.");
      setStatus('fail');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    const costo = currentMatch.costo_ingreso || 500;
    if (playerData.pitchx < costo) {
      setSystemMsg(`FONDOS INSUFICIENTES. REQUIERES ${costo} PX.`);
      setStatus('fail');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');
    setSystemMsg("CIFRANDO CONTRATO TÁCTICO...");

    try {
      // PREPARAR EL JSON DE PREDICCIONES
      const prediccionData = {
        respuestas: selections,
        timestamp: new Date().toISOString()
      };

      const newBalance = playerData.pitchx - costo;
      
      // 1. ACTUALIZAR SALDO
      await supabase.from('perfiles').update({ pitchx_coins: newBalance }).eq('id', userId);
      
      // 2. GUARDAR PREDICCIÓN REAL EN FORMATO JSON
      await supabase.from('predicciones').insert({ 
        user_id: userId, 
        partido_id: currentMatch.id, 
        resultado: prediccionData // <-- AQUÍ ESTÁ LA INYECCIÓN REAL
      });

      setPlayerData(prev => ({ ...prev, pitchx: newBalance }));
      setStatus('success');
      setSystemMsg("¡DESTINO SELLADO! OPERACIÓN ACTIVA.");
      setTimeout(() => { setStatus('idle'); setIsLocked(true); }, 3000);
    } catch (error: any) {
      setSystemMsg(`ERROR DE TRANSMISIÓN: ${error.message}`);
      setStatus('fail');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const upcomingMatches = allMatches.filter(m => m.id !== currentMatch?.id);
  const timeData = formatTimeBomb(timeLeft);
  const originalTimeLimitMs = (currentMatch?.tiempo_limite || 540) * 1000;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / originalTimeLimitMs) * 100));

  // ADN DE TORNEO: DEFINICIÓN DE COLORES
  const primaryColor = isChampions ? '#00AEEF' : '#FF1493'; // Azul UCL vs Magenta Mundial
  const secondaryColor = isChampions ? '#FFFFFF' : '#FF1493';

  return (
    <div className="cm-viewport">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&family=Syncopate:wght@400;700&display=swap');
        @font-face { font-family: 'SquidGame'; src: url('https://fonts.cdnfonts.com/s/76251/GameOfSquids.woff') format('woff'); }
        
        :root {
          --cm-magenta: ${primaryColor}; /* VARIABLE DINÁMICA POR TORNEO */
          --cm-green: #00C853;
          --cm-red: #FF0033;
          --cm-orange: #FF8C00;
          --cm-bg: #050505;
          --ps5-neon: #00AEEF; 
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .cm-viewport { 
          background-color: var(--cm-bg); min-height: 100vh; color: #fff; font-family: 'Space Grotesk', sans-serif; position: relative; overflow-x: hidden; 
        }

        /* HEADER */
        .cm-header { 
          position: fixed; top: 0; width: 100%; z-index: 500; 
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px); 
          border-bottom: 1px solid rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.3); 
          padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; 
        }
        .cm-logo { font-family: 'Syncopate'; font-size: 14px; font-weight: 700; letter-spacing: 4px; display: flex; align-items: center; gap: 15px; }
        .cm-logo span { font-family: 'SquidGame'; color: var(--cm-magenta); font-size: 24px; letter-spacing: 6px; }
        
        /* ESTADÍSTICAS DEL RADAR */
        .cm-stats { display: flex; gap: 30px; align-items: center; }
        .cm-stat-box { text-align: center; }
        .cm-stat-val { font-family: 'SquidGame'; font-size: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .cm-stat-lbl { font-family: 'Syncopate'; font-size: 8px; letter-spacing: 2px; margin-top: 5px; opacity: 0.7; }
        
        /* JACKPOT NEÓN ESQUINA DERECHA */
        .cm-jackpot-right {
          font-family: 'SquidGame'; font-size: 24px; color: var(--cm-green);
          text-shadow: 0 0 15px rgba(0,200,83,0.6); display: flex; flex-direction: column; align-items: flex-end;
        }
        .cm-jackpot-lbl { font-family: 'Syncopate'; font-size: 8px; color: #aaa; letter-spacing: 2px; margin-bottom: 5px; }

        /* HERO BANNER LIMPIO */
        .cm-hero { 
          height: 65vh; width: 100%; background: url('/img/seccion.jpg') center/cover no-repeat fixed; 
          position: relative; display: flex; align-items: center; padding: 0 8%; margin-bottom: 30px;
        }
        .cm-hero::before { 
          content: ''; position: absolute; inset: 0; 
          background: linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.95) 100%); 
        }
        .cm-hero-content { position: relative; z-index: 10; max-width: 900px; }
        .cm-hero-tag { font-family: 'SquidGame'; color: var(--cm-magenta); font-size: 12px; letter-spacing: 5px; margin-bottom: 20px; display: block; text-shadow: 0 0 10px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.5); }
        .cm-hero-desc { color: rgba(255,255,255,0.7); font-size: 16px; max-width: 500px; line-height: 1.6; border-left: 3px solid var(--cm-magenta); padding-left: 20px; }

        /* CUERPO PRINCIPAL */
        .cm-body { position: relative; z-index: 20; padding: 0 5% 100px; max-width: 1500px; margin: 0 auto; }

        /* TIMELINE OPERACIONES */
        .cm-timeline { margin-bottom: 60px; }
        .cm-ops-title { font-family: 'Syncopate'; font-size: 10px; color: var(--cm-magenta); letter-spacing: 6px; margin-bottom: 25px; display: flex; align-items: center; }
        .cm-ops-scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .cm-ops-scroll::-webkit-scrollbar { display: none; }
        .cm-ops-card { 
          min-width: 280px; background: rgba(15,15,15,0.9); border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 8px; padding: 20px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden;
        }
        .cm-ops-card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-3px); }
        .cm-ops-card.active { border-color: var(--cm-magenta); box-shadow: 0 0 20px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .cm-ops-card-header { display: flex; justify-content: space-between; font-size: 10px; color: #888; margin-bottom: 15px; }
        .cm-ops-status { font-family: 'Syncopate'; font-size: 8px; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px; }
        .cm-ops-status.wait { background: rgba(255,255,255,0.05); color: #aaa; }
        .cm-ops-teams { display: flex; justify-content: space-between; align-items: center; font-family: 'Syncopate'; font-size: 11px; font-weight: 700; }
        .cm-ops-flag { width: 45px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px; }
        .cm-ops-vs { font-family: 'SquidGame'; color: #555; font-size: 16px; }

        /* GRID DE COMBATE 4x4 */
        .cm-combat-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 40px; align-items: start; }
        .cm-combat-main { display: flex; flex-direction: column; gap: 40px; position: relative; }
        
        .cm-jumbotron { 
          background: rgba(10,10,10,0.8); border: 1px solid var(--cm-magenta); border-radius: 12px; 
          padding: 40px; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden;
          box-shadow: 0 0 25px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.4), inset 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        /* HOLOGRAMA DE TORNEO EN JUMBOTRON */
        .cm-jumbotron::after {
          content: '${isChampions ? "⭐" : "🌐"}';
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          font-size: 150px; opacity: 0.03; z-index: 0; pointer-events: none;
        }

        .is-not-started .cm-jumbotron { border-color: rgba(255,255,255,0.1); box-shadow: none; }
        .cm-jumbo-teams { display: flex; align-items: center; gap: 30px; flex: 1; justify-content: center; z-index: 10; }
        .cm-jumbo-team { display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .cm-jumbo-flag { width: 120px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); }
        .cm-jumbo-name { font-family: 'Syncopate'; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-shadow: 0 0 10px var(--cm-magenta); }
        .cm-jumbo-vs { font-family: 'SquidGame'; font-size: 48px; color: var(--cm-red); opacity: 0.5; }
        
        /* ESTILO DE CRONÓMETRO BOMBA */
        .cm-bomb-timer { 
          background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.05); padding: 25px 30px; 
          border-radius: 12px; text-align: center; min-width: 260px; position: relative; overflow: hidden; z-index: 10;
        }
        .cm-timer-lbl { font-family: 'Syncopate'; font-size: 9px; color: #888; letter-spacing: 4px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        
        .cm-time-display { 
          display: flex; justify-content: center; align-items: baseline; font-family: 'Space Grotesk'; font-weight: 900; 
          font-variant-numeric: tabular-nums; transition: color 0.3s ease;
        }
        .cm-time-main { font-size: 48px; letter-spacing: -2px; line-height: 1; }
        .cm-time-ms { font-size: 24px; margin-left: 5px; opacity: 0.8; }
        
        .cm-state-safe { color: var(--cm-green); text-shadow: 0 0 20px rgba(0,200,83,0.4); }
        .cm-state-warn { color: var(--cm-orange); text-shadow: 0 0 20px rgba(255,140,0,0.4); }
        .cm-state-danger { color: var(--cm-red); text-shadow: 0 0 20px rgba(255,0,51,0.6); }
        .cm-state-locked { color: #444; }

        .cm-fuse-container { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 15px; overflow: hidden; position: relative; }
        .cm-fuse-bar { height: 100%; transition: width 0.1s linear, background-color 0.3s ease; }
        
        @keyframes pulse-fast { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .is-critical .cm-time-display { animation: pulse-fast 0.5s infinite; }
        
        /* ESTADO: NO INICIADO */
        .is-not-started { opacity: 0.5; filter: grayscale(0.8); pointer-events: none; transition: 0.5s; }
        
        /* BOTÓN DE INICIO TÁCTICO ENVOLVENTE */
        .start-overlay {
          position: absolute; inset: -20px; z-index: 50; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border-radius: 16px; border: 1px dashed rgba(255,20,147,0.3);
        }
        .btn-start-ops {
          background: rgba(255,20,147,0.1); border: 1px solid var(--cm-magenta); padding: 25px 50px; border-radius: 8px;
          font-family: 'SquidGame'; font-size: 24px; color: #fff; letter-spacing: 6px; cursor: pointer;
          box-shadow: inset 0 0 20px rgba(255,20,147,0.2), 0 0 40px rgba(255,20,147,0.4);
          transition: 0.3s; display: flex; align-items: center; gap: 15px;
        }
        .btn-start-ops:hover { background: var(--cm-magenta); color: #fff; transform: scale(1.05); }

        /* SEMÁFORO DE INICIO */
        .traffic-light-container {
          display: flex; gap: 20px; background: #050505; padding: 20px 40px; border-radius: 50px; border: 1px solid #333;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .tl-light { width: 40px; height: 40px; border-radius: 50%; background: #111; border: 2px solid #222; transition: 0.2s; }
        .tl-red.active { background: var(--cm-red); border-color: var(--cm-red); box-shadow: 0 0 40px var(--cm-red); }
        .tl-yellow.active { background: var(--cm-orange); border-color: var(--cm-orange); box-shadow: 0 0 40px var(--cm-orange); }
        .tl-green.active { background: var(--cm-green); border-color: var(--cm-green); box-shadow: 0 0 40px var(--cm-green); }

        /* PREGUNTAS (ESTILO SPORTSBOOK) */
        .cm-q-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .cm-q-card { background: rgba(10,10,10,0.6); border: 1px solid var(--cm-magenta); border-radius: 8px; padding: 25px; transition: 0.3s; box-shadow: 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .is-not-started .cm-q-card { border-color: rgba(255,255,255,0.05); box-shadow: none; }
        .cm-q-card.completed { border-color: rgba(0,200,83,0.5); background: rgba(0,200,83,0.05); box-shadow: 0 0 20px rgba(0,200,83,0.3); }
        .cm-q-title { font-family: 'Syncopate'; font-size: 10px; color: #fff; letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; text-shadow: 0 0 5px rgba(255,255,255,0.5); }
        
        .cm-q-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .cm-q-btn { 
          background: #000; border: 1px solid #333; border-radius: 6px; padding: 15px 10px; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; 
          cursor: pointer; transition: 0.2s; position: relative; color: #fff;
        }
        .cm-q-btn:hover:not(:disabled) { border-color: var(--cm-magenta); background: rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.1); box-shadow: 0 0 10px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.3); }
        .cm-q-btn.selected { border-color: var(--cm-magenta); background: rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.1); box-shadow: 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.3); transform: scale(1.05); z-index: 2; }
        
        .cm-q-icon { font-family: 'SquidGame'; font-size: 20px; opacity: 0.5; transition: 0.3s; margin-bottom: 4px; }
        .cm-q-btn.selected .cm-q-icon { opacity: 1; color: var(--cm-magenta); text-shadow: 0 0 10px var(--cm-magenta); }
        
        .cm-q-text { font-size: 9px; font-weight: 900; color: #aaa; letter-spacing: 1px; text-align: center; }
        .cm-q-btn.selected .cm-q-text { color: #fff; }
        
        .cm-q-odds { font-family: 'Space Grotesk'; font-size: 14px; font-weight: 900; color: var(--cm-green); margin-top: 5px; }
        .cm-q-btn.selected .cm-q-odds { text-shadow: 0 0 10px rgba(0,200,83,0.8); }

        .cm-q-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: #222 !important; box-shadow: none !important; }

        /* BOTÓN EJECUCIÓN */
        .cm-execute-btn { 
          width: 100%; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 30px; 
          font-family: 'SquidGame'; font-size: 24px; letter-spacing: 6px; color: #444; transition: 0.4s; 
          display: flex; align-items: center; justify-content: center; gap: 15px; 
        }
        .cm-execute-btn.ready { background: var(--cm-magenta); border-color: var(--cm-magenta); color: #fff; box-shadow: 0 0 40px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.4); cursor: pointer; }
        .cm-execute-btn.ready:hover { background: #fff; color: #000; transform: translateY(-2px); }

        /* CREDENCIAL VIP */
        .cm-vip-card { 
          background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); 
          border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 25px; 
          display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.1), 0 0 15px rgba(255,255,255,0.2);
        }
        .cm-vip-card::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background: #fff; box-shadow: 0 0 15px #fff; }
        .cm-vip-info { display: flex; flex-direction: column; gap: 5px; }
        .cm-vip-alias { font-family: 'Space Grotesk'; font-weight: 900; font-size: 20px; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.8); letter-spacing: 2px; }
        .cm-vip-id { font-family: 'Syncopate'; font-size: 9px; color: #ccc; letter-spacing: 3px; display: flex; align-items: center; gap: 8px; text-shadow: 0 0 5px rgba(255,255,255,0.3); }
        .cm-vip-lives { 
          width: 50px; height: 50px; border-radius: 50%; border: 2px solid #fff; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          font-family: 'SquidGame'; font-size: 22px; color: #fff; box-shadow: 0 0 15px rgba(255,255,255,0.8); 
          background: rgba(255,255,255,0.1); position: relative; text-shadow: 0 0 5px #fff;
        }

        /* PANEL LATERAL */
        .cm-side-panel { background: rgba(10,10,10,0.8); border: 1px solid var(--cm-magenta); border-radius: 12px; padding: 30px; border-top: 4px solid var(--cm-red); box-shadow: 0 0 20px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .cm-side-title { font-family: 'Syncopate'; font-size: 10px; color: #888; letter-spacing: 4px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
        .cm-side-row { margin-bottom: 25px; }
        .cm-side-lbl { font-family: 'Syncopate'; font-size: 8px; color: #666; letter-spacing: 2px; margin-bottom: 5px; display: block; }
        .cm-side-val { font-family: 'Space Grotesk'; font-weight: 900; font-size: 28px; color: var(--cm-magenta); }
        .cm-side-tag { display: inline-block; padding: 6px 12px; background: rgba(255,140,0,0.1); border: 1px solid rgba(255,140,0,0.3); color: var(--cm-orange); font-family: 'Syncopate'; font-size: 8px; letter-spacing: 2px; border-radius: 4px; }
        .cm-side-warning { background: rgba(255,0,51,0.1); border: 1px solid rgba(255,0,51,0.2); border-radius: 8px; padding: 20px; display: flex; gap: 15px; align-items: flex-start; }
        .cm-side-warning p { font-family: 'Syncopate'; font-size: 8px; color: #aaa; line-height: 1.6; letter-spacing: 1px; }

        /* ALERTAS Y ESTADOS DE REPOSO */
        .cm-live-alert { 
          position: fixed; top: 100px; left: 50%; transform: translateX(-50%); z-index: 600; 
          background: rgba(0,0,0,0.9); border: 1px solid; padding: 10px 30px; border-radius: 50px; 
          font-family: 'Syncopate'; font-size: 9px; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; 
        }

        .cm-reposo-container {
          display: flex; justify-content: center; align-items: center; height: 60vh;
        }
        .cm-reposo-box {
          background: rgba(255,0,51,0.05); border: 1px solid var(--cm-red); border-radius: 16px; padding: 60px 40px;
          text-align: center; box-shadow: 0 0 50px rgba(255,0,51,0.2); max-width: 600px;
        }

        @media (max-width: 1200px) {
          .cm-combat-grid { grid-template-columns: 1fr; }
          .cm-q-layout { grid-template-columns: 1fr; }
          .cm-jumbotron { flex-direction: column; gap: 40px; text-align: center; }
          .cm-jumbo-teams { flex-wrap: wrap; }
          .cm-header { flex-direction: column; gap: 20px; padding: 20px; }
          .cm-logo { display: none; }
          .cm-body { padding-top: 50px; }
        }
      `}} />

      {/* --- HEADER --- */}
      <header className="cm-header">
        <div className="cm-logo"><span>◯ △ ▢</span> CENTRO DE MANDO</div>
        
        {/* RADAR DE SUPERVIVENCIA */}
        <div className="cm-stats">
          <div className="cm-stat-box">
            <div className="cm-stat-val" style={{color: 'var(--cm-green)'}}><Activity size={18}/> {vivos.toLocaleString()}</div>
            <div className="cm-stat-lbl">SUPERVIVIENTES</div>
          </div>
          <div className="cm-stat-box">
            <div className="cm-stat-val" style={{color: 'var(--cm-red)'}}><Skull size={18}/> {muertos.toLocaleString()}</div>
            <div className="cm-stat-lbl">ELIMINADOS</div>
          </div>
          {/* DIRECTOR: Vidas en Header Periférico */}
          <div className="cm-stat-box hidden sm:block">
            <div className="cm-stat-val" style={{color: 'var(--cm-magenta)', textShadow: `0 0 10px ${primaryColor}`}}>
              <User size={18}/> {playerData.vidas}/5
            </div>
            <div className="cm-stat-lbl">VIDAS RESTANTES</div>
          </div>
        </div>

        {/* JACKPOT NEÓN ESQUINA DERECHA */}
        <div className="cm-jackpot-right hidden md:flex">
          <span className="cm-jackpot-lbl">PREMIO ACUMULADO</span>
          ${jackpot.toLocaleString()} PX
        </div>
      </header>

      {/* --- ALERTAS --- */}
      <AnimatePresence>
        {systemAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="cm-live-alert"
            style={{ 
              borderColor: systemAlert.type === 'death' ? 'var(--cm-red)' : systemAlert.type === 'coma' ? 'var(--cm-orange)' : systemAlert.type === 'life' ? 'var(--cm-green)' : 'var(--cm-magenta)',
              color: systemAlert.type === 'death' ? 'var(--cm-red)' : systemAlert.type === 'coma' ? 'var(--cm-orange)' : systemAlert.type === 'life' ? 'var(--cm-green)' : 'var(--cm-magenta)'
            }}
          >
            <Radio size={14} className="animate-pulse" /> {systemAlert.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO BANNER --- */}
      <section className="cm-hero">
        <div className="cm-hero-content">
          <motion.span initial={{x:-30, opacity:0}} animate={{x:0, opacity:1}} className="cm-hero-tag uppercase tracking-[4px]">
            ◯ △ ▢ OPERACIÓN ACTIVA: {currentMatch?.fase || 'MUNDIAL 2026'}
          </motion.span>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="cm-hero-desc">
            Sincroniza tus vectores, supera la fase de grupos y sella tu contrato de supervivencia antes de que el tiempo se agote.
          </motion.p>
        </div>
      </section>

      {/* --- CUERPO PRINCIPAL --- */}
      <main className="cm-body">
        
        {isLoadingData ? (
          <div className="text-center py-20 animate-pulse font-bold tracking-widest text-gray-500 uppercase">ESCANEANDO SATÉLITES...</div>
        ) : noMatches ? (
          /* PANTALLA ELEGANTE DE SISTEMA EN REPOSO */
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="cm-reposo-container">
            <div className="cm-reposo-box">
              <ShieldAlert size={64} color="var(--cm-red)" style={{ margin: '0 auto 20px', animation: 'pulse-fast 2s infinite' }} />
              <h1 style={{ fontFamily: 'Syncopate', fontSize: '24px', color: 'var(--cm-red)', letterSpacing: '4px', marginBottom: '15px', fontWeight: 700 }}>
                SISTEMA EN REPOSO
              </h1>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: '#aaa', letterSpacing: '2px' }}>
                ZONA DE COMBATE CERRADA. ESPERANDO NUEVOS OBJETIVOS (CHAMPIONS / MUNDIAL).
              </p>
            </div>
          </motion.div>
        ) : (
          /* INTERFAZ NORMAL SI HAY PARTIDOS */
          <>
            {/* TIMELINE DE OBJETIVOS EN ESPERA */}
            <section className="cm-timeline">
              <h2 className="cm-ops-title uppercase tracking-[4px]"><Target size={14} style={{marginRight: '8px'}} /> OBJETIVOS EN ESPERA</h2>
              <div className="cm-ops-scroll">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((m) => (
                    <div key={m.id} onClick={() => handleMatchSelect(m)} className={`cm-ops-card ${currentMatch?.id === m.id ? 'active' : ''}`}>
                      <div className="cm-ops-card-header font-bold uppercase">
                        <span style={{fontFamily: 'monospace'}}><Clock size={10} className="inline mr-1"/> {new Date(m.fecha_inicio).getHours()}:00 HRS</span>
                        <span className="cm-ops-status wait">EN ESPERA</span>
                      </div>
                      <div className="cm-ops-teams">
                        <div style={{textAlign: 'center'}}>
                          <img src={getFlagUrl(m.bandera_local)} alt={m.equipo_local} className="cm-ops-flag border border-white/10" />
                          <div className="text-[10px] font-bold uppercase">{m.equipo_local?.substring(0,3)}</div>
                        </div>
                        <div className="cm-ops-vs opacity-20" style={{fontFamily:'SquidGame'}}>VS</div>
                        <div style={{textAlign: 'center'}}>
                          <img src={getFlagUrl(m.bandera_visitante)} alt={m.equipo_visitante} className="cm-ops-flag border border-white/10" />
                          <div className="text-[10px] font-bold uppercase">{m.equipo_visitante?.substring(0,3)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{color: '#666', fontFamily: 'Syncopate', fontSize: '10px', padding: '20px'}}>NO HAY MÁS OBJETIVOS EN LA COLA.</div>
                )}
              </div>
            </section>

            <div className="cm-combat-grid">
              
              <div className="cm-combat-main">
                
                {/* CAPA DE BLOQUEO Y SEMÁFORO (ENVOLVENTE) */}
                <AnimatePresence>
                  {!hasStarted && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                      className="start-overlay"
                    >
                      {trafficLight === 'idle' && (
                        <button onClick={startOperation} className="btn-start-ops">
                          <Play size={28} /> INICIAR OPERACIÓN
                        </button>
                      )}
                      
                      {trafficLight !== 'idle' && (
                        <div className="traffic-light-container">
                          <div className={`tl-light tl-red ${trafficLight === 'red' ? 'active' : ''}`}></div>
                          <div className={`tl-light tl-yellow ${trafficLight === 'yellow' ? 'active' : ''}`}></div>
                          <div className={`tl-light tl-green ${trafficLight === 'green' ? 'active' : ''}`}></div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ENGRANAJE CENTRAL OSCURECIDO HASTA INICIAR */}
                <div className={!hasStarted ? 'is-not-started' : ''}>
                  
                  <div className={`cm-jumbotron ${isLocked && hasStarted ? 'is-locked' : ''}`} style={!hasStarted ? { borderColor: 'rgba(255,255,255,0.05)' } : {}}>
                    <div className="cm-jumbo-teams">
                      <div className="cm-jumbo-team">
                        <img src={getFlagUrl(currentMatch?.bandera_local)} alt="Local" className="cm-jumbo-flag shadow-2xl" />
                        <span className="cm-jumbo-name uppercase tracking-widest">{currentMatch?.equipo_local}</span>
                      </div>
                      <div className="cm-jumbo-vs opacity-20" style={{fontFamily:'SquidGame'}}>VS</div>
                      <div className="cm-jumbo-team">
                        <img src={getFlagUrl(currentMatch?.bandera_visitante)} alt="Visitante" className="cm-jumbo-flag shadow-2xl" />
                        <span className="cm-jumbo-name uppercase tracking-widest">{currentMatch?.equipo_visitante}</span>
                      </div>
                    </div>
                    
                    <div className={`cm-bomb-timer ${timeLeft > 0 && timeLeft < 60000 && hasStarted ? 'is-critical' : ''}`}>
                      <span className="cm-timer-lbl uppercase tracking-widest font-bold">
                        {isLocked && hasStarted ? <Lock size={12} color="var(--cm-red)" /> : <Timer size={12} className={timeLeft < 60000 && hasStarted ? 'text-[var(--cm-red)] animate-pulse' : 'text-gray-400'} />} 
                        {isLocked && hasStarted ? 'SISTEMA SELLADO' : !hasStarted ? 'TIEMPO BLOQUEADO' : 'TIEMPO RESTANTE'}
                      </span>
                      
                      <div className={`cm-time-display ${isLocked && hasStarted ? 'cm-state-locked' : timeLeft > 300000 ? 'cm-state-safe' : timeLeft > 60000 ? 'cm-state-warn' : 'cm-state-danger'}`}>
                        <span className="cm-time-main">{timeData.minutes}:{timeData.seconds}</span>
                        {(!isLocked || !hasStarted) && <span className="cm-time-ms">:{timeData.centiseconds}</span>}
                      </div>
                      
                      <div className="cm-fuse-container">
                        <div 
                          className="cm-fuse-bar" 
                          style={{
                            width: `${timePercent}%`,
                            backgroundColor: (isLocked && hasStarted) ? '#333' : timeLeft > 300000 ? 'var(--cm-green)' : timeLeft > 60000 ? 'var(--cm-orange)' : 'var(--cm-red)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="cm-q-layout">
                    {battleQuestions.map((q) => {
                      const isAnswered = !!selections[q.id];
                      return (
                        <div key={q.id} className={`cm-q-card ${isAnswered ? 'completed' : ''}`}>
                          <div className="cm-q-title uppercase tracking-widest font-bold">
                            <TrendingUp size={14} color={isAnswered ? 'var(--cm-green)' : 'var(--cm-magenta)'} /> {q.title}
                          </div>
                          <div className="cm-q-options">
                            {q.options.map((opt: any) => {
                              const isSelected = selections[q.id] === opt.id;
                              return (
                                <button key={opt.id} onClick={() => handleSelectOption(q.id, opt.id)} disabled={isLocked || !hasStarted} className={`cm-q-btn ${isSelected ? 'selected' : ''}`}>
                                  <span className="cm-q-icon">{opt.icon}</span>
                                  <span className="cm-q-text uppercase font-black">{opt.text}</span>
                                  <span className="cm-q-odds text-[var(--cm-green)] font-black">[{opt.odds}]</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={handleSubmit} disabled={!isFormComplete || isLocked || status !== 'idle' || !hasStarted} className={`cm-execute-btn ${isFormComplete && !isLocked && status === 'idle' && hasStarted ? 'ready' : ''}`}>
                    {isLocked && hasStarted ? <><Lock size={28} /> SISTEMA SELLADO</> : 
                     status === 'loading' ? <><Radio size={28} className="animate-pulse" /> ENCRIPTANDO DATOS...</> : 
                     isFormComplete && hasStarted ? <><Zap size={28} /> FIRMAR CONTRATO</> : 
                     <><ShieldAlert size={28} /> ESPERANDO VECTORES</>}
                  </button>

                </div>
              </div>

              <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* CREDENCIAL VIP BLANCO NEÓN */}
                <div className="cm-vip-card">
                  <div className="cm-vip-info">
                    <span className="cm-vip-alias uppercase tracking-tight">{playerData.alias}</span>
                    <span className="cm-vip-id uppercase font-bold tracking-widest"><User size={10} color="#fff"/> RECLUTA #{playerData.id}</span>
                  </div>
                  {/* DIRECTOR: Vidas en Credencial */}
                  <div className="cm-vip-lives" style={{borderColor: 'var(--cm-magenta)', boxShadow: `0 0 15px ${primaryColor}`}}>
                    {playerData.vidas}
                    <div style={{position: 'absolute', bottom: '-8px', background: '#000', padding: '2px 6px', fontSize: '6px', fontFamily: 'Syncopate', letterSpacing: '1px', border: '1px solid var(--cm-magenta)', borderRadius: '4px'}}>VIDAS</div>
                  </div>
                </div>

                <div className="cm-side-panel">
                  <div className="cm-side-title uppercase tracking-widest font-bold"><Database size={14} color="var(--cm-red)"/> REPORTE TÁCTICO</div>
                  <div className="cm-side-row">
                    <span className="cm-side-lbl uppercase font-bold tracking-widest">BÓVEDA DISPONIBLE</span>
                    <div className="cm-side-val tracking-tighter">{playerData.pitchx.toLocaleString()} <span style={{fontSize: '14px', color: '#666'}}>PX</span></div>
                  </div>
                  <div className="cm-side-row">
                    <span className="cm-side-lbl uppercase font-bold tracking-widest">RIESGO ESTIMADO</span>
                    <span className="cm-side-tag font-bold uppercase" style={{color: isChampions ? '#00AEEF' : 'var(--cm-orange)'}}>{isChampions ? 'FASE ELIMINATORIA' : 'FASE 1: PELIGRO MEDIO'}</span>
                  </div>
                  <div className="cm-side-warning">
                    <AlertTriangle size={24} color="var(--cm-red)" style={{flexShrink: 0}} />
                    <p className="uppercase tracking-tight font-bold">LA OMISIÓN DE UN CONTRATO EN CUALQUIER PARTIDO ABIERTO SE CONSIDERA DESERCIÓN Y RESULTARÁ EN LA PÉRDIDA DE 1 VIDA.</p>
                  </div>
                </div>
                
                <div style={{textAlign: 'center', padding: '40px 20px', background: 'rgba(10,10,10,0.5)', border: '1px dashed #333', borderRadius: '12px'}}>
                  <Gamepad2 size={32} color="#333" style={{margin: '0 auto 15px'}} />
                  <p style={{fontFamily: 'Syncopate', fontSize: '9px', color: '#555', lineHeight: '1.8', letterSpacing: '2px', fontWeight:'bold'}} className="uppercase">SISTEMA AUDITADO POR SMART CONTRACTS. DECISIONES IRREVERSIBLES.</p>
                </div>
              </aside>

            </div>
          </>
        )}
      </main>

      {/* --- OVERLAY DE ESTADO --- */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            style={{position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'}}
          >
            <div style={{
              background: '#000', padding: '60px 40px', borderRadius: '16px', textAlign: 'center', border: '1px solid', maxWidth: '500px', width: '90%',
              borderColor: status === 'success' ? 'var(--cm-green)' : status === 'fail' ? 'var(--cm-red)' : 'var(--cm-magenta)',
              boxShadow: `0 0 50px ${status === 'success' ? 'rgba(0,200,83,0.2)' : status === 'fail' ? 'rgba(255,0,51,0.2)' : 'rgba(255,20,147,0.2)'}`
            }}>
              {status === 'loading' ? <Radio size={60} color="var(--cm-magenta)" className="animate-pulse mx-auto mb-6"/> : 
               status === 'success' ? <ShieldCheck size={60} color="var(--cm-green)" className="mx-auto mb-6"/> : 
               <X size={60} color="var(--cm-red)" className="mx-auto mb-6"/>}
              <div style={{fontFamily: 'Syncopate', fontSize: '14px', fontWeight: 700, letterSpacing: '4px', lineHeight: '1.5'}} className="uppercase">
                {systemMsg}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}