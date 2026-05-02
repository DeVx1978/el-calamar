"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Skull, Zap, Lock, Crosshair, Clock, AlertTriangle, BatteryWarning, ShieldAlert, Target, Server, ShieldCheck, Gamepad2, Database, MapPin, Radio, Check, X, Timer, Play, User, TrendingUp, Cpu, Globe, Star, Shield
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// 📡 PROTOCOLO DE CARGA TÁCTICA: "PULSO PS5" (ESTILO GRANULADO ÉLITE)
const ProtocoloAccesoPS5 = ({ etapa }: { etapa: 'rojo' | 'amarillo' | 'verde' }) => {
  const config = {
    rojo: { glifo: '◯', color: '#FF0033', msg: 'SISTEMA_BLOQUEADO' },
    amarillo: { glifo: '△', color: '#FFD700', msg: 'SINC_RED_TÁCTICA' },
    verde: { glifo: '▢', color: '#00C853', msg: 'ACCESO_CONCEDIDO' }
  };
  const actual = config[etapa];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      {/* 🌪️ CAPA DE GRANULADO CINEMATOGRÁFICO PS5 */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3FeclfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* GLIFO TÁCTICO CON EFECTO BLOOM */}
      <motion.div 
        key={etapa}
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        style={{ 
          fontFamily: 'SquidGame', fontSize: '180px', color: actual.color,
          textShadow: `0 0 70px ${actual.color}, 0 0 120px ${actual.color}44` 
        }}
      >
        {actual.glifo}
      </motion.div>

      {/* SCANNER LINE (LÍNEA DE ESCANEO LÁSER) */}
      <motion.div 
        animate={{ top: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: actual.color, opacity: 0.3, zIndex: 10000 }}
      />

      <div style={{ 
        fontFamily: 'Syncopate', fontSize: '10px', letterSpacing: '10px', 
        marginTop: '50px', color: actual.color, fontWeight: 'bold'
      }}>
        {actual.msg}_
      </div>
    </motion.div>
  );
};

// PROTOCOLO ANTI-ERRORES DE IMAGEN (VERSIÓN INTELIGENTE)
const getFlagUrl = (code: string | undefined | null) => {
  if (!code) return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; 
  if (code.startsWith('http')) return code;
  return `https://flagcdn.com/w160/${code.toLowerCase()}.png`;
};

// DATOS DE EMERGENCIA
const MOCK_MATCHES = [
  { id: 'm1', fecha_inicio: new Date(Date.now() + 3600000).toISOString(), equipo_local: 'COLOMBIA', bandera_local: 'co', equipo_visitante: 'ECUADOR', bandera_visitante: 'ec', tiempo_limite: 360, costo_ingreso: 500 },
  { id: 'm2', fecha_inicio: new Date(Date.now() + 86400000).toISOString(), equipo_local: 'ARGENTINA', bandera_local: 'ar', equipo_visitante: 'URUGUAY', bandera_visitante: 'uy', tiempo_limite: 540, costo_ingreso: 500 },
  { id: 'm3', fecha_inicio: new Date(Date.now() + 172800000).toISOString(), equipo_local: 'BRASIL', bandera_local: 'br', equipo_visitante: 'CHILE', bandera_visitante: 'cl', tiempo_limite: 720, costo_ingreso: 500 }
];

export default function CampoDeBatalla() {
  // Esta función evalúa las vidas y devuelve el nombre de la clase CSS que daña la pantalla
  const getDegradationStyle = (vidas: number) => {
    switch (vidas) {
      case 3: return "";                     // Operación limpia, sin efectos
      case 2: return "state-interference";   // Interferencia leve
      case 1: return "state-critical";       // Glitch, pantalla roja y desaturación
      case 0: return "state-coma";           // Bloqueo total (escala de grises)
      default: return "";
    }
  };

  
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // 🛡️ CORRECCIÓN DE ELITE: Estados movidos dentro del componente para evitar Error de Hooks
  const [etapaCarga, setEtapaCarga] = useState<'rojo' | 'amarillo' | 'verde' | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gtioqzodmulbqbohdyet.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aW9xem9kbXVsYnFib2hkeWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjkyMzUsImV4cCI6MjA5MTE0NTIzNX0.OuK_ueIdYZEmUvU4jexr4dclRhHGBPglQ96pntN4v9o";
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  // ESTADOS DEL SISTEMA
  const [jackpot, setJackpot] = useState(5404357);
  const [vivos, setVivos] = useState(142502);
  const [muertos, setMuertos] = useState(45623);
  const [coma, setComa] = useState(1241);
  const [playerData, setPlayerData] = useState({ alias: "CONECTANDO...", id: "----", vidas: 0, pitchx: 0 });
// Calculamos el estado actual. Si playerData aún no carga, asumimos 3 vidas por seguridad.
  const currentStatusClass = getDegradationStyle(playerData?.vidas ?? 3);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'fail'>('idle');
  const [systemMsg, setSystemMsg] = useState("");

  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [battleQuestions, setBattleQuestions] = useState<any[]>([
    { 
      id: 'q1', title: 'MERCADO: LÍNEA DE DINERO (1X2)', 
      options: [
        { id: 'L', text: 'LOCAL', icon: '△', odds: '2.10' }, 
        { id: 'E', text: 'EMPATE', icon: '◯', odds: '3.40' }, 
        { id: 'V', text: 'VISITANTE', icon: '✕', odds: '3.10' }, 
        { id: 'D', text: 'NO BET', icon: '▢', odds: '1.00' }
      ] 
    },
    { 
      id: 'q2', title: 'MERCADO: TOTAL GOLES O/U 2.5', 
      options: [
        { id: 'o1', text: 'OVER 2.5', icon: '△', odds: '1.85' }, 
        { id: 'u1', text: 'UNDER 2.5', icon: '◯', odds: '1.95' }, 
        { id: 'o2', text: 'OVER 3.5', icon: '✕', odds: '3.20' }, 
        { id: 'u2', text: 'UNDER 1.5', icon: '▢', odds: '3.50' }
      ] 
    }
  ]);
  
  const [noMatches, setNoMatches] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isChampions, setIsChampions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(540);
  const [isLocked, setIsLocked] = useState(true);   
  const [hasStarted, setHasStarted] = useState(false); 
  const [trafficLight, setTrafficLight] = useState<'idle' | 'red' | 'yellow' | 'green'>('idle'); 
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [systemAlert, setSystemAlert] = useState<{msg: string, type: 'system' | 'death' | 'life' | 'coma'} | null>(null);

  useEffect(() => {
    const sincronizarSectorReal = async () => {
      try {
        setIsLoadingData(true);
        const { data: torneo, error: tError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('name', 'UEFA CHAMPIONS LEAGUE') 
          .single();

        if (tError || !torneo) {
          setIsChampions(true); 
        } else {
          setIsChampions(true);
        }

        const { data: partidos, error: mError } = await supabase
          .from('matches')
          .select('*')
          .eq('tournament_name', 'UEFA Champions League')
          .eq('status', 'PROXIMAMENTE')
          .order('match_date', { ascending: true });

        if (partidos && partidos.length > 0) {
          setAllMatches(partidos);
          setCurrentMatch({
            id: partidos[0].id,
            equipo_local: partidos[0].home_team,
            bandera_local: partidos[0].home_flag,
            equipo_visitante: partidos[0].away_team,
            bandera_visitante: partidos[0].away_flag,
            fecha_inicio: partidos[0].match_date,
            stadium: partidos[0].stadium,
            city: partidos[0].city,
            fase: 'UEFA Champions League',
            tiempo_limite: 540,
            costo_ingreso: 100
          });
          setNoMatches(false);
        } else {
          setNoMatches(true);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          const { data: perfil } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', 'Jose_Recluta')
            .single();

          if (perfil) {
            setPlayerData({
              alias: perfil.username,
              id: perfil.id?.substring(0, 4),
              vidas: perfil.lives,
              pitchx: perfil.pitchx_balance
            });
          }
        }
      } catch (err) {
        console.error("FALLA EN LA RED TÁCTICA:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (slug) sincronizarSectorReal();
  }, [slug]);

  const loadMatchDetails = async (match: any) => {
    setCurrentMatch(match);
    setSelections({});
    setIsLocked(true); 
    setHasStarted(false); 
    setTrafficLight('idle');

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
        setBattleQuestions([
          { 
            id: 'q1', title: 'MERCADO: LÍNEA DE DINERO (1X2)', 
            options: [
              { id: 'L', text: 'LOCAL', icon: '△', odds: '2.10' }, 
              { id: 'E', text: 'EMPATE', icon: '◯', odds: '3.40' }, 
              { id: 'V', text: 'VISITANTE', icon: '✕', odds: '3.10' }, 
              { id: 'D', text: 'NO BET', icon: '▢', odds: '1.00' }
            ] 
          },
          { 
            id: 'q2', title: 'MERCADO: TOTAL GOLES O/U 2.5', 
            options: [
              { id: 'o1', text: 'OVER 2.5', icon: '△', odds: '1.85' }, 
              { id: 'u1', text: 'UNDER 2.5', icon: '◯', odds: '1.95' }, 
              { id: 'o2', text: 'OVER 3.5', icon: '✕', odds: '3.20' }, 
              { id: 'u2', text: 'UNDER 1.5', icon: '▢', odds: '3.50' }
            ] 
          },
          { 
            id: 'q3', title: 'MERCADO: BTTS (AMBOS ANOTAN)', 
            options: [
              { id: 'y1', text: 'SÍ (YES)', icon: '△', odds: '1.75' }, 
              { id: 'n1', text: 'NO (NO)', icon: '◯', odds: '2.05' }, 
              { id: 'f1', text: '1ER TIEMPO', icon: '✕', odds: '4.50' }, 
              { id: 's2', text: '2DO TIEMPO', icon: '▢', odds: '3.10' }
            ] 
          },
          { 
            id: 'q4', title: 'MERCADO: DOBLE OPORTUNIDAD', 
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

  const startOperation = () => {
    if (hasStarted) return;
    setTrafficLight('red');
    setTimeout(() => setTrafficLight('yellow'), 1000);
    setTimeout(() => {
      setTrafficLight('green');
      setTimeout(() => {
        setTimeLeft((currentMatch?.tiempo_limite || 540) * 1000); 
        setHasStarted(true);
        setIsLocked(false);
        setTrafficLight('idle');
      }, 1000);
    }, 2000);
  };

  useEffect(() => {
    if (hasStarted === true && isLocked === false && timeLeft > 0) {
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
  }, [hasStarted, isLocked, currentMatch?.id]);

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
    if (!currentMatch) {
      setSystemMsg("ERROR: PARTIDO NO SELECCIONADO.");
      setStatus('fail');
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
      const prediccionData = {
        respuestas: selections,
        timestamp: new Date().toISOString()
      };
      const newBalance = playerData.pitchx - costo;
      await supabase.from('profiles').update({ pitchx_coins: newBalance }).eq('id', userId);
      await supabase.from('predicciones').insert({ 
        user_id: userId, 
        partido_id: currentMatch.id, 
        resultado: prediccionData 
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

  const primaryColor = isChampions ? '#00AEEF' : '#FF1493'; 
  const secondaryColor = isChampions ? '#FFFFFF' : '#FF1493';

  return (
    <>
      {/* 1. OVERLAY DE COMA - Solo se activa con 0 vidas */}
      <AnimatePresence>
        {playerData?.vidas === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <Skull size={80} color="#FF004D" className="mb-6 animate-pulse" />
            <h2 className="text-4xl font-black text-white tracking-[10px] mb-4 text-center">ESTADO DE COMA</h2>
            <p className="text-gray-500 tracking-[3px] text-center max-w-md uppercase text-sm">
              SISTEMA BLOQUEADO POR DESERCIÓN O FALLO TÁCTICO. 
              <br /><br />REANIMACIÓN DISPONIBLE EN:
            </p>
            <div className="text-5xl font-mono text-white mt-8 tracking-tighter">
              11:59:59
            </div>
            <div className="mt-12 opacity-50 text-[10px] tracking-widest uppercase text-center">
              Smart Contract: ID-REF-2026-COMA
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CONTENEDOR PRINCIPAL CON LA CLASE DINÁMICA INYECTADA */}
      <div className={`cm-viewport ${currentStatusClass}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700;900&family=Syncopate:wght@400;700&display=swap');
        @font-face { font-family: 'SquidGame'; src: url('https://fonts.cdnfonts.com/s/76251/GameOfSquids.woff') format('woff'); }
        
        :root {
          --cm-magenta: ${primaryColor};
          --cm-green: #00C853;
          --cm-red: #FF0033;
          --cm-orange: #FF8C00;
          --cm-bg: #000; 
          --ps5-neon: #00AEEF; 
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .cm-viewport { 
          background-color: var(--cm-bg); min-height: 100vh; color: #fff; font-family: 'Space Grotesk', sans-serif; position: relative; overflow-x: hidden; 
        }

        .master-battle-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('/img/arena-batalla.jpg');
          background-size: cover; background-position: center;
          filter: brightness(0.3) contrast(1.1);
        }

        .cm-header { 
          position: fixed; top: 0; width: 100%; z-index: 500; 
          background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(15px); 
          border-bottom: 1px solid rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.3); 
          padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; 
        }
        .cm-logo { font-family: 'Syncopate'; font-size: 14px; font-weight: 700; letter-spacing: 4px; display: flex; align-items: center; gap: 15px; }
        .cm-logo span { font-family: 'SquidGame'; color: var(--cm-magenta); font-size: 24px; letter-spacing: 6px; }
        
        .cm-stats { display: flex; gap: 30px; align-items: center; }
        .cm-stat-box { text-align: center; }
        .cm-stat-val { font-family: 'SquidGame'; font-size: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .cm-stat-lbl { font-family: 'Syncopate'; font-size: 8px; letter-spacing: 2px; margin-top: 5px; opacity: 0.7; }
        
        .cm-jackpot-right {
          font-family: 'SquidGame'; font-size: 24px; color: var(--cm-green);
          text-shadow: 0 0 15px rgba(0,200,83,0.6); display: flex; flex-direction: column; align-items: flex-end;
        }
        .cm-jackpot-lbl { font-family: 'Syncopate'; font-size: 8px; color: #aaa; letter-spacing: 2px; margin-bottom: 5px; }

        .cm-hero { 
          height: 65vh; width: 100%; position: relative; display: flex; align-items: center; padding: 0 8%; margin-bottom: 30px;
        }
        .cm-hero::before { 
          content: ''; position: absolute; inset: 0; 
          background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%); 
        }
        .cm-hero-content { position: relative; z-index: 10; max-width: 900px; }
        .cm-hero-tag { font-family: 'SquidGame'; color: var(--cm-magenta); font-size: 12px; letter-spacing: 5px; margin-bottom: 20px; display: block; text-shadow: 0 0 10px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.5); }
        .cm-hero-desc { color: rgba(255,255,255,0.7); font-size: 16px; max-width: 500px; line-height: 1.6; border-left: 3px solid var(--cm-magenta); padding-left: 20px; }

        .cm-body { position: relative; z-index: 20; padding: 0 5% 100px; max-width: 1500px; margin: 0 auto; }

        .cm-timeline { margin-bottom: 60px; }
        .cm-ops-title { font-family: 'Syncopate'; font-size: 10px; color: var(--cm-magenta); letter-spacing: 6px; margin-bottom: 25px; display: flex; align-items: center; }
        .cm-ops-scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .cm-ops-scroll::-webkit-scrollbar { display: none; }
        .cm-ops-card { 
          min-width: 280px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px); border-radius: 8px; padding: 20px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden;
        }
        .cm-ops-card:hover { border-color: rgba(255,255,255,0.3); transform: translateY(-3px); }
        .cm-ops-card.active { border-color: var(--cm-magenta); box-shadow: 0 0 20px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .cm-ops-card-header { display: flex; justify-content: space-between; font-size: 10px; color: #888; margin-bottom: 15px; }
        .cm-ops-status { font-family: 'Syncopate'; font-size: 8px; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px; }
        .cm-ops-status.wait { background: rgba(255,255,255,0.05); color: #aaa; }
        .cm-ops-teams { display: flex; justify-content: space-between; align-items: center; font-family: 'Syncopate'; font-size: 11px; font-weight: 700; }
        .cm-ops-flag { width: 45px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px; }
        .cm-ops-vs { font-family: 'SquidGame'; color: #555; font-size: 16px; }

        .cm-combat-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 40px; align-items: start; }
        .cm-combat-main { display: flex; flex-direction: column; gap: 40px; position: relative; }
        
        .cm-jumbotron { 
          background: rgba(0,0,0,0.5); border: 1px solid var(--cm-magenta); border-radius: 12px; 
          backdrop-filter: blur(10px); padding: 40px; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden;
          box-shadow: 0 0 25px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.4), inset 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.1);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
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
        
        .cm-bomb-timer { 
          background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); padding: 25px 30px; 
          backdrop-filter: blur(10px); border-radius: 12px; text-align: center; min-width: 260px; position: relative; overflow: hidden; z-index: 10;
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
        
        .is-not-started { opacity: 0.5; filter: grayscale(0.8); pointer-events: none; transition: 0.5s; }
        
        .start-overlay {
          position: absolute; inset: -20px; z-index: 50; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border-radius: 16px; 
          overflow: hidden;
        }

        .start-overlay::before {
          content: ''; position: absolute; width: 150%; height: 150%;
          background: conic-gradient(transparent, transparent, transparent, var(--cm-magenta));
          animation: border-rotate 4s linear infinite; z-index: -1;
        }

        .start-overlay::after {
          content: ''; position: absolute; inset: 4px;
          background: rgba(0,0,0,0.85); border-radius: 14px; z-index: -1;
        }

        @keyframes border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .btn-start-ops {
          background: rgba(255,20,147,0.1); border: 1px solid var(--cm-magenta); padding: 25px 50px; border-radius: 8px;
          font-family: 'SquidGame'; font-size: 24px; color: #fff; letter-spacing: 6px; cursor: pointer;
          box-shadow: inset 0 0 20px rgba(255,20,147,0.2), 0 0 40px rgba(255,20,147,0.4);
          transition: 0.3s; display: flex; align-items: center; gap: 15px;
        }
        .btn-start-ops:hover { background: var(--cm-magenta); color: #fff; transform: scale(1.05); }

        .traffic-light-container {
          display: flex; gap: 20px; background: #050505; padding: 20px 40px; border-radius: 50px; border: 1px solid #333;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        .tl-light { width: 40px; height: 40px; border-radius: 50%; background: #111; border: 2px solid #222; transition: 0.2s; }
        .tl-red.active { background: var(--cm-red); border-color: var(--cm-red); box-shadow: 0 0 40px var(--cm-red); }
        .tl-yellow.active { background: var(--cm-orange); border-color: var(--cm-orange); box-shadow: 0 0 40px var(--cm-orange); }
        .tl-green.active { background: var(--cm-green); border-color: var(--cm-green); box-shadow: 0 0 40px var(--cm-green); }

        .cm-q-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .cm-q-card { background: rgba(0,0,0,0.5); border: 1px solid var(--cm-magenta); backdrop-filter: blur(8px); border-radius: 8px; padding: 25px; transition: 0.3s; box-shadow: 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .is-not-started .cm-q-card { border-color: rgba(255,255,255,0.05); box-shadow: none; }
        .cm-q-card.completed { border-color: rgba(0,200,83,0.5); background: rgba(0,200,83,0.1); box-shadow: 0 0 20px rgba(0,200,83,0.3); }
        .cm-q-title { font-family: 'Syncopate'; font-size: 10px; color: #fff; letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; text-shadow: 0 0 5px rgba(255,255,255,0.5); }
        
        .cm-q-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .cm-q-btn { 
          background: rgba(0,0,0,0.7); border: 1px solid #333; border-radius: 6px; padding: 15px 10px; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; 
          cursor: pointer; transition: 0.2s; position: relative; color: #fff;
        }
        .cm-q-btn:hover:not(:disabled) { border-color: var(--cm-magenta); background: rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.1); }
        .cm-q-btn.selected { border-color: var(--cm-magenta); background: rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); box-shadow: 0 0 15px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.3); transform: scale(1.05); z-index: 2; }
        
        .cm-q-icon { font-family: 'SquidGame'; font-size: 20px; opacity: 0.5; transition: 0.3s; margin-bottom: 4px; }
        .cm-q-btn.selected .cm-q-icon { opacity: 1; color: var(--cm-magenta); text-shadow: 0 0 10px var(--cm-magenta); }
        
        .cm-q-text { font-size: 9px; font-weight: 900; color: #aaa; letter-spacing: 1px; text-align: center; }
        .cm-q-btn.selected .cm-q-text { color: #fff; }
        
        .cm-q-odds { font-family: 'Space Grotesk'; font-size: 14px; font-weight: 900; color: var(--cm-green); margin-top: 5px; }
        .cm-q-btn.selected .cm-q-odds { text-shadow: 0 0 10px rgba(0,200,83,0.8); }

        .cm-q-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: #222 !important; box-shadow: none !important; }

        .smart-audit-neon {
          text-align: center; padding: 40px 20px; 
          background: rgba(0,0,0,0.7); border: 2px solid var(--ps5-neon); border-radius: 12px; 
          backdrop-filter: blur(10px);
          box-shadow: 0 0 25px rgba(0, 174, 239, 0.4), inset 0 0 15px rgba(0, 174, 239, 0.2);
          animation: audit-breath 3s infinite alternate;
        }
        .smart-audit-neon p {
          font-family: 'Syncopate'; font-size: 9px; color: #fff; 
          line-height: 1.8; letter-spacing: 2px; font-weight: bold;
          text-shadow: 0 0 10px var(--ps5-neon);
        }
        @keyframes audit-breath {
          from { border-color: var(--ps5-neon); box-shadow: 0 0 20px rgba(0, 174, 239, 0.3); }
          to { border-color: #fff; box-shadow: 0 0 35px rgba(0, 174, 239, 0.7); }
        }

        .cm-execute-btn { 
          width: 100%; background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 12px; padding: 30px; 
          font-family: 'SquidGame'; font-size: 24px; letter-spacing: 6px; color: #444; transition: 0.4s; 
          display: flex; align-items: center; justify-content: center; gap: 15px; 
        }
        .cm-execute-btn.ready { background: var(--cm-magenta); border-color: var(--cm-magenta); color: #fff; box-shadow: 0 0 40px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.4); cursor: pointer; }
        .cm-execute-btn.ready:hover { background: #fff; color: #000; transform: translateY(-2px); }

        .cm-vip-card { 
          background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); 
          border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 25px; 
          display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.05), 0 0 15px rgba(0,0,0,0.3);
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

        .cm-side-panel { background: rgba(0,0,0,0.5); border: 1px solid var(--cm-magenta); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; border-top: 4px solid var(--cm-red); box-shadow: 0 0 20px rgba(${isChampions ? '0, 174, 239' : '255, 20, 147'}, 0.2); }
        .cm-side-title { font-family: 'Syncopate'; font-size: 10px; color: #888; letter-spacing: 4px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
        .cm-side-row { margin-bottom: 25px; }
        .cm-side-lbl { font-family: 'Syncopate'; font-size: 8px; color: #666; letter-spacing: 2px; margin-bottom: 5px; display: block; }
        .cm-side-val { font-family: 'Space Grotesk'; font-weight: 900; font-size: 28px; color: var(--cm-magenta); }
        .cm-side-tag { display: inline-block; padding: 6px 12px; background: rgba(255,140,0,0.1); border: 1px solid rgba(255,140,0,0.3); color: var(--cm-orange); font-family: 'Syncopate'; font-size: 8px; letter-spacing: 2px; border-radius: 4px; }
        .cm-side-warning { background: rgba(255,0,51,0.1); border: 1px solid rgba(255,0,51,0.2); border-radius: 8px; padding: 20px; display: flex; gap: 15px; align-items: flex-start; }
        .cm-side-warning p { font-family: 'Syncopate'; font-size: 8px; color: #aaa; line-height: 1.6; letter-spacing: 1px; }

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

        .site-footer { position: relative; z-index: 20; background: #000; border-top: 1px solid rgba(255,0,51,0.2); overflow: hidden; width: 100%; margin-top: 100px; }
        .warning-tape { width: 100%; height: 18px; background: repeating-linear-gradient(45deg, #000, #000 14px, var(--cm-red) 14px, var(--cm-red) 28px); }
        .footer-ops-bar { background: var(--cm-red); padding: 8px 0; overflow: hidden; white-space: nowrap; border-top: 1px solid rgba(255,255,255,0.2); border-bottom: 1px solid rgba(255,255,255,0.2); }
        .ops-ticker { display: inline-block; white-space: nowrap; animation: ticker 25s linear infinite; font-family: monospace; font-size: 10px; font-weight: bold; letter-spacing: 2px; }
        .ticker-item { margin-right: 40px; color: #fff; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        
        .footer-main { padding: 60px 5vw 30px; background: rgba(0,0,0,0.5); position: relative; z-index: 10; width: 100%; backdrop-filter: blur(10px); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; margin-bottom: 60px; }
        .footer-logo { font-family: 'SquidGame'; font-size: 42px; line-height: 0.9; margin-bottom: 8px; color: #fff; }
        .footer-logo-red { color: var(--cm-red); }
        .footer-tagline { font-family: 'Syncopate'; font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 3px; margin-bottom: 24px; }
        
        .footer-status-panel { background: rgba(0,200,83,0.05); border: 1px solid rgba(0,200,83,0.2); padding: 16px; display: flex; flex-direction: column; gap: 10px; max-width: 280px; }
        .status-row { display: flex; align-items: center; gap: 8px; }
        .status-text { font-family: 'Syncopate'; font-size: 8px; color: rgba(255,255,255,0.6); }
        
        .footer-col-title { font-family: 'Syncopate'; font-size: 12px; color: var(--cm-red); margin-bottom: 20px; }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-link { font-size: 12px; color: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; }
        .footer-link:hover { color: var(--cm-red); padding-left: 5px; }
        
        .footer-sys-stats { display: flex; flex-direction: column; gap: 12px; }
        .sys-stat-row { display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 10px; }
        .sys-stat-label { color: rgba(255,255,255,0.4); flex: 1; }
        
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { font-family: 'Syncopate'; font-size: 9px; color: rgba(255,255,255,0.3); }
        .footer-badges { display: flex; gap: 15px; }
        .footer-badge { display: flex; align-items: center; gap: 6px; font-family: monospace; font-size: 9px; color: rgba(255,255,255,0.5); }
        
        .footer-symbols { position: absolute; bottom: -30px; right: 5vw; display: flex; gap: 20px; opacity: 0.03; font-family: 'Syncopate'; font-size: 150px; pointer-events: none; user-select: none; }

        @media (max-width: 1200px) {
          .cm-combat-grid { grid-template-columns: 1fr; }
          .cm-q-layout { grid-template-columns: 1fr; }
          .cm-jumbotron { flex-direction: column; gap: 40px; text-align: center; }
          .cm-jumbo-teams { flex-wrap: wrap; }
          .cm-header { flex-direction: column; gap: 20px; padding: 20px; }
          .cm-logo { display: none; }
          .cm-body { padding-top: 50px; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* FONDO DE BATALLA FIJO */}
      <div className="master-battle-bg" />

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
          <div className="cm-stat-box hidden sm:block">
            <div className="cm-stat-val" style={{color: 'var(--cm-magenta)', textShadow: `0 0 10px ${primaryColor}`}}>
              <User size={18}/> {playerData.vidas}
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
          <>
            <section className="cm-timeline">
              <h2 className="cm-ops-title uppercase tracking-[4px]"><Target size={14} style={{marginRight: '8px'}} /> OBJETIVOS EN ESPERA</h2>
              <div className="cm-ops-scroll">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((m) => (
                    <div key={m.id} onClick={() => handleMatchSelect(m)} className={`cm-ops-card ${currentMatch?.id === m.id ? 'active' : ''}`}>
                      <div className="cm-ops-card-header font-bold uppercase">
                        <span style={{fontFamily: 'monospace'}}><Clock size={10} className="inline mr-1"/> {m.match_date ? new Date(m.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'} HRS</span>
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
                        {isLocked && hasStarted ? 'VECTORES SELLADOS' : !hasStarted ? 'ESPERANDO ACTIVACIÓN' : 'TIEMPO DE OPERACIÓN'}
                      </span>
                      
                      <div className={`cm-time-display ${(isLocked && hasStarted) ? 'cm-state-locked' : (!hasStarted) ? 'cm-state-safe' : (timeLeft > 300000) ? 'cm-state-safe' : (timeLeft > 60000) ? 'cm-state-warn' : 'cm-state-danger'}`}>
                        <span className="cm-time-main">{timeData.minutes}:{timeData.seconds}</span>
                        <span className="cm-time-ms">:{timeData.centiseconds}</span>
                      </div>
                      
                      <div className="cm-fuse-container">
                        <div 
                          className="cm-fuse-bar" 
                          style={{
                            width: `${timePercent}%`,
                            backgroundColor: (isLocked && hasStarted) ? '#333' : !hasStarted ? 'var(--cm-green)' : (timeLeft > 300000) ? 'var(--cm-green)' : (timeLeft > 60000) ? 'var(--cm-orange)' : 'var(--cm-red)'
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
                <div className="cm-vip-card">
                  <div className="cm-vip-info">
                    <span className="cm-vip-alias uppercase tracking-tight">{playerData.alias}</span>
                    <span className="cm-vip-id uppercase font-bold tracking-widest"><User size={10} color="#fff"/> RECLUTA #{playerData.id}</span>
                  </div>
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
                
                <div className="smart-audit-neon">
                  <Gamepad2 size={32} color="var(--ps5-neon)" style={{margin: '0 auto 15px'}} />
                  <p className="uppercase">SISTEMA AUDITADO POR SMART CONTRACTS. DECISIONES IRREVERSIBLES.</p>
                </div>
              </aside>

            </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="warning-tape" />
        <div className="footer-ops-bar">
          <div className="ops-ticker">
            {[
              '■ SISTEMA OPERATIVO', '○ ARENAS ACTIVAS: 5', '△ JUGADORES EN LÍNEA: 142,500', '□ JACKPOT GLOBAL: $15,900,000', '■ PRÓXIMO CIERRE: 11 JUN 2026', '○ RED CIFRADA • BLOCKCHAIN VERIFICADO', '■ SISTEMA OPERATIVO', '○ ARENAS ACTIVAS: 5', '△ JUGADORES EN LÍNEA: 142,500', '□ JACKPOT GLOBAL: $15,900,000', '■ PRÓXIMO CIERRE: 11 JUN 2026', '○ RED CIFRADA • BLOCKCHAIN VERIFICADO'
            ].map((t, i) => (
              <span key={i} className="ticker-item">{t}</span>
            ))}
          </div>
        </div>

        <div className="footer-main">
          <div className="max-w-7xl mx-auto" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <div className="footer-grid">
              <div className="footer-brand-col">
                <div className="footer-logo">EL CALAMAR<br /><span className="footer-logo-red">MUNDIALISTA</span></div>
                <p className="footer-tagline">CENTRO DE MANDO • 2026</p>
                <div className="footer-status-panel">
                  <div className="status-row">
                    <span className="status-dot green-dot" style={{ width: '8px', height: '8px', background: 'var(--cm-green)', borderRadius: '50%' }} />
                    <span className="status-text">RED SEGURA • OPERATIVA</span>
                  </div>
                  <div className="status-row">
                    <Database size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <span className="status-text">{vivos.toLocaleString()} JUGADORES CONECTADOS</span>
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
              <p className="footer-copy">© 2026 EL CALAMAR DEL MUNDIAL. LA SUPERVIVENCIA NO ESTÁ GARANTIZADA.</p>
              <div className="footer-badges">
                <span className="footer-badge"><Lock size={11} /> CONEXIÓN CIFRADA</span>
                <span className="footer-badge"><Shield size={11} /> BLOCKCHAIN AUDITADO</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-symbols">
          {['◯', '△', '□'].map((s, i) => (
            <span key={i} className="footer-symbol">{s}</span>
          ))}
        </div>
      </footer>

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

      {/* 🚀 ACTIVADOR DEL PROTOCOLO PS5 GRANULADO */}
      <AnimatePresence>
        {isLaunching && etapaCarga && <ProtocoloAccesoPS5 etapa={etapaCarga} />}
      </AnimatePresence>

    </div>
    </>
  );
}