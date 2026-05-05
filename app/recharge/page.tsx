<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Shield, Check, Activity, Database, Cpu, 
  Lock, X, Heart, Crown, Coins, Globe, ArrowRight, Calculator
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ─── CONEXIÓN A LA BÓVEDA FINANCIERA ───
const supabase = createBrowserClient(
  'https://gtioqzodmulbqbohdyet.supabase.co',
  'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
);

// ─── ECONOMÍA DE GUERRA (PRECIOS Y VIDAS ACTUALIZADOS) ───
const PACKAGES = [
  { id: 'pkg_5', amount: 500, lives: 5, priceUsd: 5, label: 'SUMINISTRO BÁSICO', color: '#00C853' },
  { id: 'pkg_12', amount: 1500, lives: 15, priceUsd: 12, label: 'MARGEN TÁCTICO', color: '#00AEEF' },
  { id: 'pkg_20', amount: 3000, lives: 30, priceUsd: 20, label: 'BLINDAJE ÉLITE', color: '#AA00FF' },
  { id: 'pkg_30', amount: 5000, lives: 50, priceUsd: 30, label: 'ARSENAL SUPREMO', color: '#FFD700', popular: true }
];

// ─── MOTOR DE CONVERSIÓN VIP (EXPANDIDO PARA LATAM/GLOBAL) ───
const EXCHANGE_RATES: Record<string, { label: string, rate: number, symbol: string }> = {
  USD: { label: 'US DÓLAR (USD)', rate: 1, symbol: '$' },
  COP: { label: 'PESO COL (COP)', rate: 3950, symbol: '$' },
  MXN: { label: 'PESO MEX (MXN)', rate: 16.8, symbol: '$' },
  ARS: { label: 'PESO ARG (ARS)', rate: 980, symbol: '$' },
  PEN: { label: 'SOL PERÚ (PEN)', rate: 3.75, symbol: 'S/' },
  CLP: { label: 'PESO CHI (CLP)', rate: 940, symbol: '$' },
  UYU: { label: 'PESO URU (UYU)', rate: 38.5, symbol: '$' },
  BOB: { label: 'BOLIVIANO (BOB)', rate: 6.9, symbol: 'Bs.' },
  VES: { label: 'BOLÍVAR (VES)', rate: 36.2, symbol: 'Bs.' },
  BRL: { label: 'REAL BRA (BRL)', rate: 5.0, symbol: 'R$' },
  EUR: { label: 'EURO (EUR)', rate: 0.92, symbol: '€' },
};

export default function VIPRechargeLounge() {
  const router = useRouter();
  
  // ESTADOS DE USUARIO
  const [balance, setBalance] = useState(0);
  const [vidas, setVidas] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  // ESTADOS DE LA TIENDA
  const [currency, setCurrency] = useState('COP');
  const [isSyncing, setIsSyncing] = useState(true);

  // ─── SINCRONIZACIÓN DE SUMINISTROS (MODO ÉLITE) ───
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUserId(session.user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('lives, pitchx_balance') // Ahora que la columna existe, funcionará
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("❌ Error al leer búnker:", error.message);
        }

        if (data) {
          console.log("💎 Datos recuperados:", data);
          setVidas(data.lives || 0); // AQUÍ APARECERÁ EL 35
          setBalance(data.pitchx_balance || 0);
        }
      }
      setIsSyncing(false);
    };

    fetchSession();
  }, [router]);

  // ─── FUNCIÓN DE REDIRECCIÓN A LA PASARELA (MODO ÉLITE) ───
  const proceedToCheckout = async (pkg: any) => {
    // Calculamos el precio local para el búnker de datos
    const rawLocalPrice = pkg.priceUsd * EXCHANGE_RATES[currency].rate;
    const localPriceFormatted = rawLocalPrice.toFixed(2);
    
    // REGISTRAMOS LA INTENCIÓN DE COMPRA EN SUPABASE (SEGURIDAD ANTI-HACKER)
    if (userId) {
      const { error } = await supabase.from('transactions').insert([{
        user_id: userId,
        amount_local: rawLocalPrice,
        currency_local: currency,
        amount_usd: pkg.priceUsd,
        lives_credited: pkg.lives,
        status: 'pending' 
      }]);
      
      if (error) console.error("⚠️ Error de registro en búnker:", error.message);
    }

    // LANZAMOS AL JUGADOR A LA CAJA
    router.push(`/checkout?id=${pkg.id}&val=${localPriceFormatted}&cur=${currency}&lives=${pkg.lives}`);
  };

  return (
    <div className="vip-lounge-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;700&family=Bebas+Neue&family=DM+Mono:wght@400;500;700&display=swap');

        :root {
          --vip-cyan: #00AEEF;
          --vip-gold: #FFD700;
          --vip-green: #00C853;
          --vip-bg: #000;
        }

        .vip-lounge-root {
          background: var(--vip-bg); min-height: 100vh; color: #fff;
          font-family: 'Space Grotesk', sans-serif; position: relative;
          overflow-x: hidden;
        }

        /* ── FONDO DE SALA VIP (LIMPIO) ── */
        .vip-bg-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image: 
            radial-gradient(circle at 50% -20%, rgba(0, 174, 239, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 100% 100%, 50px 50px, 50px 50px;
        }

        /* ── HEADER HUD VIP ── */
        .vip-nav {
          position: sticky; top: 0; z-index: 100;
          padding: 20px 5vw; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }

        .user-intel { display: flex; gap: 40px; }
        .intel-item { display: flex; flex-direction: column; align-items: flex-end; }
        .intel-lbl { font-family: 'Syncopate'; font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; }
        .intel-val { font-family: 'Syncopate'; font-size: 14px; font-weight: 900; color: var(--vip-cyan); display: flex; align-items: center; gap: 8px; margin-top: 4px; }

        /* ── CALCULADORA GLOBAL TOP ── */
        .currency-hub {
          background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15);
          padding: 12px 25px; border-radius: 4px; display: flex; align-items: center; gap: 20px;
          margin: 40px auto; width: fit-content; position: relative; z-index: 10;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }

        .hub-select {
          background: #050505; border: 1px solid var(--vip-cyan); color: var(--vip-gold);
          font-family: 'Syncopate'; font-size: 11px; font-weight: 700; padding: 8px 15px;
          outline: none; cursor: pointer; text-transform: uppercase; border-radius: 2px;
          box-shadow: 0 0 10px rgba(0, 174, 239, 0.2);
        }
        .hub-select option { background: #000; color: #fff; }

        /* ── TARJETAS DE SUMINISTRO (ELITE RACK PS5) ── */
        .rack-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          padding: 0 5vw 100px; max-width: 1300px; margin: 0 auto; position: relative; z-index: 10;
        }

        .rack-card {
          background: rgba(5,5,10,0.6); 
          /* Borde delgado y completo del color de la tarjeta */
          border: 1px solid rgba(var(--p-rgb), 0.6);
          border-radius: 6px; padding: 25px 20px; /* Reducido para compactar */
          transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column; position: relative;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }
        .rack-card:hover { 
          background: rgba(10,15,25,0.8); 
          border-color: rgba(var(--p-rgb), 1);
          box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 0 30px rgba(var(--p-rgb), 0.15), 0 0 15px rgba(var(--p-rgb), 0.3);
          transform: translateY(-6px);
        }

        .popular-tag {
          position: absolute; top: 0; left: 0; right: 0; background: var(--vip-gold);
          color: #000; font-family: 'Syncopate'; font-size: 8px; font-weight: 900;
          padding: 6px; text-align: center; letter-spacing: 2px;
          box-shadow: 0 4px 10px rgba(255, 215, 0, 0.2);
        }

        .card-lives { 
          font-family: 'Bebas Neue'; font-size: 52px; line-height: 1; color: #fff;
          display: flex; align-items: baseline; gap: 6px; margin-bottom: 5px;
        }
        .card-lives span { font-size: 16px; color: var(--p-color); font-family: 'Syncopate'; }

        .card-bonus { font-family: 'Space Grotesk'; font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 20px; letter-spacing: 1px; }

        .price-display { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 15px;}
        
        .price-usd-main { font-family: 'Bebas Neue'; font-size: 48px; color: var(--p-color); line-height: 1; text-shadow: 0 0 15px rgba(var(--p-rgb), 0.4); display: flex; justify-content: center; align-items: flex-start; gap: 4px; }
        .price-usd-symbol { font-family: 'Space Grotesk'; font-size: 20px; margin-top: 4px; opacity: 0.8; }

        /* ── PANTALLA LCD CALCULADORA ── */
        .ps5-calc-screen {
          background: #020a06; /* Fondo verde muy oscuro, casi negro */
          border: 1px solid rgba(0, 255, 102, 0.4);
          border-radius: 4px; padding: 10px 12px;
          display: flex; flex-direction: column; align-items: flex-end;
          box-shadow: inset 0 0 12px rgba(0,0,0,1), 0 0 8px rgba(0, 200, 83, 0.1);
          position: relative; overflow: hidden;
        }
        /* Reflejo de cristal sobre la pantalla LCD */
        .ps5-calc-screen::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent);
          pointer-events: none;
        }
        .lcd-lbl { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(0,200,83,0.6); letter-spacing: 2px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: flex-start;}
        .lcd-val { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: #00ff66; text-shadow: 0 0 8px rgba(0,255,102,0.6); letter-spacing: -0.5px; }

        .vip-btn {
          width: 100%; margin-top: 20px; padding: 14px;
          background: transparent; border: 1px solid var(--p-color);
          color: #fff; font-family: 'Syncopate'; font-size: 9px; font-weight: 900;
          letter-spacing: 2px; cursor: pointer; transition: 0.3s; border-radius: 2px;
          display: flex; justify-content: center; align-items: center;
        }
        .rack-card:hover .vip-btn { background: var(--p-color); color: #000; box-shadow: 0 0 15px var(--p-color); }

        @media (max-width: 1100px) { .rack-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { 
          .rack-grid { grid-template-columns: 1fr; }
          .vip-nav { flex-direction: column; gap: 20px; }
          .currency-hub { flex-direction: column; text-align: center; padding: 20px; }
        }
      `}} />

      <div className="vip-bg-grid" />

      {/* ── NAVEGACIÓN DE ÉLITE ── */}
      <nav className="vip-nav">
        <button className="intel-val" style={{background:'none', border:'none', color:'var(--vip-cyan)', cursor:'pointer', fontSize:'10px'}} onClick={() => router.push('/radar')}>
          <ChevronLeft size={16} /> REGRESAR AL RADAR
        </button>

        <div className="user-intel">
          <div className="intel-item">
            <span className="intel-lbl">VIDAS ACTIVAS</span>
            <span className="intel-val" style={{color: 'var(--vip-green)'}}>
              <Heart size={14} fill="var(--vip-green)"/> {vidas}
            </span>
          </div>
          <div className="intel-item">
            <span className="intel-lbl">BÓVEDA PITCHX</span>
            <span className="intel-val">
              <Coins size={14} /> {balance.toLocaleString()}
            </span>
          </div>
        </div>
      </nav>

      {/* ── CALCULADORA GLOBAL TÁCTICA ── */}
      <div className="currency-hub">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Calculator size={18} color="var(--vip-cyan)" />
          <span style={{fontFamily: 'DM Mono', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px'}}>DIVISA DE OPERACIÓN:</span>
        </div>
        <select className="hub-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.entries(EXCHANGE_RATES).map(([code, data]) => (
            <option key={code} value={code}>{data.label}</option>
          ))}
        </select>
      </div>

      <div style={{textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 10}}>
        <h1 style={{fontFamily: 'Syncopate', fontWeight: 900, fontSize: '32px', letterSpacing: '-1px'}}>SALA DE ABASTECIMIENTO</h1>
        <p style={{fontFamily: 'DM Mono', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '5px', marginTop: '10px'}}>ACCESO EXCLUSIVO • NIVEL DE SEGURIDAD 5</p>
      </div>

      {/* ── ARSENAL DE PAQUETES (CON CALCULADORA LCD Y BORDES DELGADOS) ── */}
      <main className="rack-grid">
        {PACKAGES.map((pkg) => {
          // Cálculo de conversión exacto
          const localPrice = (pkg.priceUsd * EXCHANGE_RATES[currency].rate).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
          
          return (
            <motion.div 
              key={pkg.id} 
              className={`rack-card ${pkg.popular ? 'is-popular' : ''}`}
              style={{ 
                '--p-color': pkg.color,
                '--p-rgb': pkg.color === '#00C853' ? '0,200,83' : pkg.color === '#00AEEF' ? '0,174,239' : pkg.color === '#AA00FF' ? '170,0,255' : '255,215,0'
              } as React.CSSProperties}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
            >
              {pkg.popular && <div className="popular-tag">RECOMENDACIÓN DEL DIRECTOR</div>}
              
              <div style={{marginBottom: '15px', color: pkg.color, marginTop: pkg.popular ? '20px' : '0'}}>
                {pkg.popular ? <Crown size={28} /> : <Shield size={24} />}
              </div>

              <div className="card-lives">
                {pkg.lives} <span>VIDAS</span>
              </div>
              <div className="card-bonus">
                +{pkg.amount.toLocaleString()} PITCHX INCLUIDOS
              </div>

              <div className="price-display">
                {/* PRECIO USD (SISTEMA BASE) */}
                <div className="price-usd-main">
                  <span className="price-usd-symbol">$</span>
                  {pkg.priceUsd}
                </div>
                
                {/* PANTALLA LCD CALCULADORA DE CONVERSIÓN */}
                <div className="ps5-calc-screen">
                  <span className="lcd-lbl"><Activity size={10}/> CÁLCULO LOCAL ({currency})</span>
                  <span className="lcd-val">
                    {EXCHANGE_RATES[currency].symbol} {localPrice}
                  </span>
                </div>
              </div>

              <button className="vip-btn" onClick={() => proceedToCheckout(pkg)}>
                PROCEDER A CAJA <ArrowRight size={12} style={{marginLeft: '8px', display: 'inline'}}/>
              </button>
            </motion.div>
          );
        })}
      </main>

      {/* FOOTER DE SEGURIDAD */}
      <footer style={{position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px', opacity: 0.3, borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px'}}>
          <Lock size={18} /> <Shield size={18} /> <Check size={18} />
        </div>
        <p style={{fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '2px'}}>TRANSACCIONES PROTEGIDAS POR ENCRIPTACIÓN DE GRADO MILITAR AES-256</p>
      </footer>
    </div>
  );
=======
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Shield, Check, Activity, Database, Cpu, 
  Lock, X, Heart, Crown, Coins, Globe, ArrowRight, Calculator
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ─── CONEXIÓN A LA BÓVEDA FINANCIERA ───
const supabase = createBrowserClient(
  'https://gtioqzodmulbqbohdyet.supabase.co',
  'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
);

// ─── ECONOMÍA DE GUERRA (PRECIOS Y VIDAS ACTUALIZADOS) ───
const PACKAGES = [
  { id: 'pkg_5', amount: 500, lives: 5, priceUsd: 5, label: 'SUMINISTRO BÁSICO', color: '#00C853' },
  { id: 'pkg_12', amount: 1500, lives: 15, priceUsd: 12, label: 'MARGEN TÁCTICO', color: '#00AEEF' },
  { id: 'pkg_20', amount: 3000, lives: 30, priceUsd: 20, label: 'BLINDAJE ÉLITE', color: '#AA00FF' },
  { id: 'pkg_30', amount: 5000, lives: 50, priceUsd: 30, label: 'ARSENAL SUPREMO', color: '#FFD700', popular: true }
];

// ─── MOTOR DE CONVERSIÓN VIP (EXPANDIDO PARA LATAM/GLOBAL) ───
const EXCHANGE_RATES: Record<string, { label: string, rate: number, symbol: string }> = {
  USD: { label: 'US DÓLAR (USD)', rate: 1, symbol: '$' },
  COP: { label: 'PESO COL (COP)', rate: 3950, symbol: '$' },
  MXN: { label: 'PESO MEX (MXN)', rate: 16.8, symbol: '$' },
  ARS: { label: 'PESO ARG (ARS)', rate: 980, symbol: '$' },
  PEN: { label: 'SOL PERÚ (PEN)', rate: 3.75, symbol: 'S/' },
  CLP: { label: 'PESO CHI (CLP)', rate: 940, symbol: '$' },
  UYU: { label: 'PESO URU (UYU)', rate: 38.5, symbol: '$' },
  BOB: { label: 'BOLIVIANO (BOB)', rate: 6.9, symbol: 'Bs.' },
  VES: { label: 'BOLÍVAR (VES)', rate: 36.2, symbol: 'Bs.' },
  BRL: { label: 'REAL BRA (BRL)', rate: 5.0, symbol: 'R$' },
  EUR: { label: 'EURO (EUR)', rate: 0.92, symbol: '€' },
};

export default function VIPRechargeLounge() {
  const router = useRouter();
  
  // ESTADOS DE USUARIO
  const [balance, setBalance] = useState(0);
  const [vidas, setVidas] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  // ESTADOS DE LA TIENDA
  const [currency, setCurrency] = useState('COP');
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUserId(session.user.id);
      
      const { data } = await supabase.from('perfiles').select('pitchx_balance, vidas_restantes').eq('id', session.user.id).single();
      if (data) {
        setBalance(Number(data.pitchx_balance || 0));
        setVidas(Number(data.vidas_restantes || 0));
      }
      setIsSyncing(false);
    };
    fetchSession();
  }, [router]);

  // FUNCIÓN DE REDIRECCIÓN A LA PASARELA
  const proceedToCheckout = (pkg: any) => {
    const localPrice = (pkg.priceUsd * EXCHANGE_RATES[currency].rate).toFixed(2);
    router.push(`/checkout?id=${pkg.id}&val=${localPrice}&cur=${currency}&lives=${pkg.lives}`);
  };

  return (
    <div className="vip-lounge-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;700&family=Bebas+Neue&family=DM+Mono:wght@400;500;700&display=swap');

        :root {
          --vip-cyan: #00AEEF;
          --vip-gold: #FFD700;
          --vip-green: #00C853;
          --vip-bg: #000;
        }

        .vip-lounge-root {
          background: var(--vip-bg); min-height: 100vh; color: #fff;
          font-family: 'Space Grotesk', sans-serif; position: relative;
          overflow-x: hidden;
        }

        /* ── FONDO DE SALA VIP (LIMPIO) ── */
        .vip-bg-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image: 
            radial-gradient(circle at 50% -20%, rgba(0, 174, 239, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 100% 100%, 50px 50px, 50px 50px;
        }

        /* ── HEADER HUD VIP ── */
        .vip-nav {
          position: sticky; top: 0; z-index: 100;
          padding: 20px 5vw; background: rgba(0,0,0,0.8);
          backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }

        .user-intel { display: flex; gap: 40px; }
        .intel-item { display: flex; flex-direction: column; align-items: flex-end; }
        .intel-lbl { font-family: 'Syncopate'; font-size: 8px; color: rgba(255,255,255,0.4); letter-spacing: 2px; }
        .intel-val { font-family: 'Syncopate'; font-size: 14px; font-weight: 900; color: var(--vip-cyan); display: flex; align-items: center; gap: 8px; margin-top: 4px; }

        /* ── CALCULADORA GLOBAL TOP ── */
        .currency-hub {
          background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15);
          padding: 12px 25px; border-radius: 4px; display: flex; align-items: center; gap: 20px;
          margin: 40px auto; width: fit-content; position: relative; z-index: 10;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }

        .hub-select {
          background: #050505; border: 1px solid var(--vip-cyan); color: var(--vip-gold);
          font-family: 'Syncopate'; font-size: 11px; font-weight: 700; padding: 8px 15px;
          outline: none; cursor: pointer; text-transform: uppercase; border-radius: 2px;
          box-shadow: 0 0 10px rgba(0, 174, 239, 0.2);
        }
        .hub-select option { background: #000; color: #fff; }

        /* ── TARJETAS DE SUMINISTRO (ELITE RACK PS5) ── */
        .rack-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          padding: 0 5vw 100px; max-width: 1300px; margin: 0 auto; position: relative; z-index: 10;
        }

        .rack-card {
          background: rgba(5,5,10,0.6); 
          /* Borde delgado y completo del color de la tarjeta */
          border: 1px solid rgba(var(--p-rgb), 0.6);
          border-radius: 6px; padding: 25px 20px; /* Reducido para compactar */
          transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column; position: relative;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }
        .rack-card:hover { 
          background: rgba(10,15,25,0.8); 
          border-color: rgba(var(--p-rgb), 1);
          box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 0 30px rgba(var(--p-rgb), 0.15), 0 0 15px rgba(var(--p-rgb), 0.3);
          transform: translateY(-6px);
        }

        .popular-tag {
          position: absolute; top: 0; left: 0; right: 0; background: var(--vip-gold);
          color: #000; font-family: 'Syncopate'; font-size: 8px; font-weight: 900;
          padding: 6px; text-align: center; letter-spacing: 2px;
          box-shadow: 0 4px 10px rgba(255, 215, 0, 0.2);
        }

        .card-lives { 
          font-family: 'Bebas Neue'; font-size: 52px; line-height: 1; color: #fff;
          display: flex; align-items: baseline; gap: 6px; margin-bottom: 5px;
        }
        .card-lives span { font-size: 16px; color: var(--p-color); font-family: 'Syncopate'; }

        .card-bonus { font-family: 'Space Grotesk'; font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 20px; letter-spacing: 1px; }

        .price-display { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 15px;}
        
        .price-usd-main { font-family: 'Bebas Neue'; font-size: 48px; color: var(--p-color); line-height: 1; text-shadow: 0 0 15px rgba(var(--p-rgb), 0.4); display: flex; justify-content: center; align-items: flex-start; gap: 4px; }
        .price-usd-symbol { font-family: 'Space Grotesk'; font-size: 20px; margin-top: 4px; opacity: 0.8; }

        /* ── PANTALLA LCD CALCULADORA ── */
        .ps5-calc-screen {
          background: #020a06; /* Fondo verde muy oscuro, casi negro */
          border: 1px solid rgba(0, 255, 102, 0.4);
          border-radius: 4px; padding: 10px 12px;
          display: flex; flex-direction: column; align-items: flex-end;
          box-shadow: inset 0 0 12px rgba(0,0,0,1), 0 0 8px rgba(0, 200, 83, 0.1);
          position: relative; overflow: hidden;
        }
        /* Reflejo de cristal sobre la pantalla LCD */
        .ps5-calc-screen::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent);
          pointer-events: none;
        }
        .lcd-lbl { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(0,200,83,0.6); letter-spacing: 2px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: flex-start;}
        .lcd-val { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: #00ff66; text-shadow: 0 0 8px rgba(0,255,102,0.6); letter-spacing: -0.5px; }

        .vip-btn {
          width: 100%; margin-top: 20px; padding: 14px;
          background: transparent; border: 1px solid var(--p-color);
          color: #fff; font-family: 'Syncopate'; font-size: 9px; font-weight: 900;
          letter-spacing: 2px; cursor: pointer; transition: 0.3s; border-radius: 2px;
          display: flex; justify-content: center; align-items: center;
        }
        .rack-card:hover .vip-btn { background: var(--p-color); color: #000; box-shadow: 0 0 15px var(--p-color); }

        @media (max-width: 1100px) { .rack-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { 
          .rack-grid { grid-template-columns: 1fr; }
          .vip-nav { flex-direction: column; gap: 20px; }
          .currency-hub { flex-direction: column; text-align: center; padding: 20px; }
        }
      `}} />

      <div className="vip-bg-grid" />

      {/* ── NAVEGACIÓN DE ÉLITE ── */}
      <nav className="vip-nav">
        <button className="intel-val" style={{background:'none', border:'none', color:'var(--vip-cyan)', cursor:'pointer', fontSize:'10px'}} onClick={() => router.push('/')}>
          <ChevronLeft size={16} /> REGRESAR AL CENTRO
        </button>

        <div className="user-intel">
          <div className="intel-item">
            <span className="intel-lbl">VIDAS ACTIVAS</span>
            <span className="intel-val" style={{color: 'var(--vip-green)'}}>
              <Heart size={14} fill="var(--vip-green)"/> {vidas}
            </span>
          </div>
          <div className="intel-item">
            <span className="intel-lbl">BÓVEDA PITCHX</span>
            <span className="intel-val">
              <Coins size={14} /> {balance.toLocaleString()}
            </span>
          </div>
        </div>
      </nav>

      {/* ── CALCULADORA GLOBAL TÁCTICA ── */}
      <div className="currency-hub">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Calculator size={18} color="var(--vip-cyan)" />
          <span style={{fontFamily: 'DM Mono', fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px'}}>DIVISA DE OPERACIÓN:</span>
        </div>
        <select className="hub-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.entries(EXCHANGE_RATES).map(([code, data]) => (
            <option key={code} value={code}>{data.label}</option>
          ))}
        </select>
      </div>

      <div style={{textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 10}}>
        <h1 style={{fontFamily: 'Syncopate', fontWeight: 900, fontSize: '32px', letterSpacing: '-1px'}}>SALA DE ABASTECIMIENTO</h1>
        <p style={{fontFamily: 'DM Mono', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '5px', marginTop: '10px'}}>ACCESO EXCLUSIVO • NIVEL DE SEGURIDAD 5</p>
      </div>

      {/* ── ARSENAL DE PAQUETES (CON CALCULADORA LCD Y BORDES DELGADOS) ── */}
      <main className="rack-grid">
        {PACKAGES.map((pkg) => {
          // Cálculo de conversión exacto
          const localPrice = (pkg.priceUsd * EXCHANGE_RATES[currency].rate).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
          
          return (
            <motion.div 
              key={pkg.id} 
              className={`rack-card ${pkg.popular ? 'is-popular' : ''}`}
              style={{ 
                '--p-color': pkg.color,
                '--p-rgb': pkg.color === '#00C853' ? '0,200,83' : pkg.color === '#00AEEF' ? '0,174,239' : pkg.color === '#AA00FF' ? '170,0,255' : '255,215,0'
              } as React.CSSProperties}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
            >
              {pkg.popular && <div className="popular-tag">RECOMENDACIÓN DEL DIRECTOR</div>}
              
              <div style={{marginBottom: '15px', color: pkg.color, marginTop: pkg.popular ? '20px' : '0'}}>
                {pkg.popular ? <Crown size={28} /> : <Shield size={24} />}
              </div>

              <div className="card-lives">
                {pkg.lives} <span>VIDAS</span>
              </div>
              <div className="card-bonus">
                +{pkg.amount.toLocaleString()} PITCHX INCLUIDOS
              </div>

              <div className="price-display">
                {/* PRECIO USD (SISTEMA BASE) */}
                <div className="price-usd-main">
                  <span className="price-usd-symbol">$</span>
                  {pkg.priceUsd}
                </div>
                
                {/* PANTALLA LCD CALCULADORA DE CONVERSIÓN */}
                <div className="ps5-calc-screen">
                  <span className="lcd-lbl"><Activity size={10}/> CÁLCULO LOCAL ({currency})</span>
                  <span className="lcd-val">
                    {EXCHANGE_RATES[currency].symbol} {localPrice}
                  </span>
                </div>
              </div>

              <button className="vip-btn" onClick={() => proceedToCheckout(pkg)}>
                PROCEDER A CAJA <ArrowRight size={12} style={{marginLeft: '8px', display: 'inline'}}/>
              </button>
            </motion.div>
          );
        })}
      </main>

      {/* FOOTER DE SEGURIDAD */}
      <footer style={{position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px', opacity: 0.3, borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px'}}>
          <Lock size={18} /> <Shield size={18} /> <Check size={18} />
        </div>
        <p style={{fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '2px'}}>TRANSACCIONES PROTEGIDAS POR ENCRIPTACIÓN DE GRADO MILITAR AES-256</p>
      </footer>
    </div>
  );
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
}