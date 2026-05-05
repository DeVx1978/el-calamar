<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, ChevronLeft, CreditCard,
  CheckCircle, Activity, AlertTriangle,
  Bitcoin, Landmark, Copy, ExternalLink, Ticket, Zap, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// ✅ CORRECCIÓN: Cliente centralizado — sin keys hardcodeadas
import { supabase } from '@/lib/supabase';

// ============================================================
// ✅ PAQUETES — Editar aquí para cambiar precios y beneficios
// ============================================================
const PACKAGES_DB: Record<string, { id: string; lives: number; px: number; usd: number; name: string }> = {
  pkg_5:  { id: 'pkg_5',  lives: 5,  px: 500,  usd: 5,  name: 'SUMINISTRO BASICO'  },
  pkg_12: { id: 'pkg_12', lives: 15, px: 1500, usd: 12, name: 'MARGEN TACTICO'      },
  pkg_20: { id: 'pkg_20', lives: 30, px: 3000, usd: 20, name: 'BLINDAJE ELITE'      },
  pkg_30: { id: 'pkg_30', lives: 50, px: 5000, usd: 30, name: 'ARSENAL SUPREMO'     },
};

// ============================================================
// ✅ LINKS DE PASARELA — Reemplazar con links reales de Wompi/Kushki
// ============================================================
const GATEWAY_LINKS: Record<string, string> = {
  pkg_5:  'https://checkout.wompi.co/l/PENDIENTE_5',
  pkg_12: 'https://checkout.wompi.co/l/PENDIENTE_12',
  pkg_20: 'https://checkout.wompi.co/l/PENDIENTE_20',
  pkg_30: 'https://checkout.wompi.co/l/PENDIENTE_30',
};

// ============================================================
// ✅ DATOS BANCARIOS — Editar desde aquí sin tocar el resto
// ============================================================
const VAULT_DATA = {
  bank:    'NEQUI / BANCOLOMBIA',
  number:  '300 123 4567',
  titular: 'EL CALAMAR CORP.',
};

export default function SecureCheckout() {
  const router = useRouter();

  const [orderId, setOrderId]           = useState('');
  const [localPrice, setLocalPrice]     = useState('');
  const [currency, setCurrency]         = useState('USD');
  const [pkgData, setPkgData]           = useState(PACKAGES_DB['pkg_5']);
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'gateway' | 'crypto' | 'pin'>('gateway');
  const [referenceNum, setReferenceNum] = useState('');
  const [pinCode, setPinCode]           = useState('');
  const [copied, setCopied]             = useState(false);
  const [status, setStatus]             = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [termLog, setTermLog]           = useState('ESPERANDO AUTORIZACION...');
  const [userId, setUserId]             = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || 'pkg_5';
      setLocalPrice(params.get('val') || '5.00');
      setCurrency(params.get('cur') || 'USD');
      if (PACKAGES_DB[id]) setPkgData(PACKAGES_DB[id]);
      setOrderId(`OP-${Math.floor(Math.random() * 900000) + 100000}-SEC`);
    }

    // ✅ Verificar autenticación con getUser (más seguro que getSession)
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else setUserId(user.id);
    };
    checkAuth();
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Transferencia manual — guarda en transactions para que admin valide
  const processDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceNum.trim().length < 4) {
      setTermLog('ERROR: NUMERO DE COMPROBANTE INVALIDO');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    setStatus('processing');
    setTermLog('ENVIANDO REFERENCIA AL ALTO MANDO...');

    try {
      await supabase.from('transactions').insert({
        user_id:    userId,
        type:       'RECHARGE',
        amount_usd: pkgData.usd,
        amount_px:  pkgData.px,
        method:     'TRANSFERENCIA_MANUAL',
        reference:  referenceNum,
        status:     'PENDING',
        gateway_response: { package_id: pkgData.id, lives: pkgData.lives, order_id: orderId },
      });
    } catch (err) {
      console.warn('Tabla transactions aun no existe:', err);
    }

    setStatus('success');
    setTermLog('¡SOLICITUD RECIBIDA! VALIDAREMOS TU PAGO EN BREVE.');
    setTimeout(() => router.push('/radar'), 4000);
  };

  // ✅ PIN — valida contra tabla pins en Supabase y acredita saldo real
  const redeemPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 8) {
      setTermLog('ERROR: FORMATO DE PIN NO RECONOCIDO');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('processing');

    const logs = [
      'DECODIFICANDO SECUENCIA ALFANUMERICA...',
      'VERIFICANDO FIRMA DIGITAL DEL PIN...',
      'AUTENTICANDO DISPONIBILIDAD EN LA RED...',
      'INYECTANDO VIDAS Y PITCHX...',
    ];
    for (const log of logs) {
      setTermLog(log);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      // Buscar PIN en base de datos
      const { data: pin, error } = await supabase
        .from('pins')
        .select('*')
        .eq('code', pinCode.trim().toUpperCase())
        .eq('status', 'DISPONIBLE')
        .single();

      if (error || !pin) {
        setTermLog('ERROR: PIN INVALIDO O YA CANJEADO');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }

      // Marcar PIN como canjeado
      await supabase.from('pins').update({
        status:      'CANJEADO',
        redeemed_by: userId,
        redeemed_at: new Date().toISOString(),
      }).eq('id', pin.id);

      // Acreditar saldo y vidas al perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('pitchx_balance, lives')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase.from('profiles').update({
          pitchx_balance: (profile.pitchx_balance || 0) + pin.value_px,
          lives:          (profile.lives || 0) + pin.value_lives,
        }).eq('id', userId);
      }

      // Registrar transacción
      await supabase.from('transactions').insert({
        user_id:    userId,
        type:       'REDEEM_PIN',
        amount_usd: pin.value_usd,
        amount_px:  pin.value_px,
        method:     'PIN',
        reference:  pinCode,
        status:     'APPROVED',
      });

      setStatus('success');
      setTermLog(`PIN VALIDADO. +${pin.value_px} PX Y +${pin.value_lives} VIDAS ACREDITADOS.`);
      setTimeout(() => router.push('/radar'), 3000);

    } catch (err: any) {
      setTermLog('ERROR DE CONEXION. INTENTA DE NUEVO.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // ✅ Pasarelas externas — redirige a Wompi o Binance
  const redirectToExternalGateway = (type: string) => {
    setStatus('processing');
    if (type === 'gateway') {
      setTermLog('ENRUTANDO A SERVIDOR BANCARIO EXTERNO...');
      setTimeout(() => {
        const link = GATEWAY_LINKS[pkgData.id] || 'https://wompi.co';
        window.open(link, '_blank');
        setStatus('success');
        setTermLog('REDIRECCION EXITOSA. COMPLETE EL PAGO EN LA NUEVA PESTANA.');
        setTimeout(() => setStatus('idle'), 3000);
      }, 2000);
    } else if (type === 'crypto') {
      setTermLog('ENRUTANDO A RED BLOCKCHAIN...');
      setTimeout(() => {
        window.open('https://pay.binance.com', '_blank');
        setStatus('success');
        setTermLog('REDIRECCION EXITOSA. COMPLETE EL CONTRATO INTELIGENTE.');
        setTimeout(() => setStatus('idle'), 3000);
      }, 2000);
    }
  };

  return (
    <div className="checkout-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .checkout-root { background: #000; min-height: 100vh; color: #fff; font-family: 'Space Grotesk', sans-serif; position: relative; }
        .check-bg { position: fixed; inset: 0; z-index: 0; background: radial-gradient(circle at 50% -20%, rgba(0,200,83,0.08) 0%, transparent 60%); }
        .check-nav { position: relative; z-index: 10; padding: 20px 5vw; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); }
        .nav-brand { font-family: 'Syncopate'; font-size: 16px; font-weight: 900; letter-spacing: 2px; }
        .nav-brand span { color: #00C853; }
        .checkout-container { position: relative; z-index: 10; max-width: 1200px; margin: 40px auto; padding: 0 5vw; display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }
        .order-panel { background: rgba(10,10,10,0.8); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 40px; height: fit-content; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .o-title { font-family: 'Syncopate'; font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 3px; margin-bottom: 30px; }
        .o-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-family: 'DM Mono'; font-size: 13px; }
        .o-val { font-family: 'Syncopate'; color: #00C853; font-weight: 900; }
        .o-total-box { background: #000; border: 1px solid #00C853; padding: 20px; border-radius: 4px; text-align: center; margin-top: 30px; box-shadow: inset 0 0 15px rgba(0,200,83,0.1); }
        .o-total-val { font-family: 'Syncopate'; font-size: 28px; font-weight: 900; margin: 10px 0; }
        .route-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 25px; }
        .r-tab { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); padding: 15px 5px; cursor: pointer; transition: 0.3s; border-radius: 4px; display: flex; flex-direction: column; align-items: center; gap: 8px; font-family: 'Syncopate'; font-size: 7px; font-weight: 700; }
        .r-tab.active { background: rgba(0,200,83,0.1); border-color: #00C853; color: #00C853; }
        .pay-module { background: #050505; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 40px; position: relative; }
        .pay-module::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: #00C853; box-shadow: 0 0 15px #00C853; }
        .secure-bridge { text-align: center; padding: 20px 0; }
        .bridge-icons { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px; }
        .bridge-icons .icon-circle { width: 60px; height: 60px; border-radius: 50%; background: rgba(0,200,83,0.05); border: 1px solid rgba(0,200,83,0.2); display: flex; align-items: center; justify-content: center; }
        .ssl-badge { background: rgba(0,200,83,0.05); border: 1px dashed rgba(0,200,83,0.3); padding: 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 30px; }
        .vault-card { background: #000; border: 1px dashed rgba(255,255,255,0.1); padding: 25px; border-radius: 6px; margin-bottom: 25px; }
        .v-number { font-family: 'DM Mono'; font-size: 24px; color: #00C853; display: flex; align-items: center; gap: 15px; margin-top: 10px; }
        .elite-input { background: #000 !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1) !important; padding: 18px 20px !important; border-radius: 4px !important; font-family: 'DM Mono' !important; font-size: 16px !important; outline: none !important; width: 100%; margin-top: 10px; }
        .elite-input:focus { border-color: #00C853 !important; box-shadow: 0 0 20px rgba(0,200,83,0.2) !important; }
        .btn-pay { width: 100%; background: #00C853; color: #000; border: none; padding: 20px; margin-top: 25px; font-family: 'Syncopate'; font-size: 14px; font-weight: 900; letter-spacing: 2px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .btn-pay:hover { background: #fff; box-shadow: 0 0 30px rgba(0,200,83,0.4); }
        .processing-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; }
        .processing-box { border: 1px solid #00C853; background: #000; padding: 50px; text-align: center; border-radius: 8px; width: 90%; max-width: 500px; }
        .term-log { font-family: 'DM Mono'; color: #00C853; margin-top: 30px; font-size: 13px; }
        @media (max-width: 900px) { .checkout-container { grid-template-columns: 1fr; } .route-tabs { grid-template-columns: repeat(2, 1fr); } }
      `}} />

      <div className="check-bg" />

      <nav className="check-nav">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#00C853', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Syncopate', fontSize: '10px' }}>
          <ChevronLeft size={16} /> CANCELAR
        </button>
        <div className="nav-brand">BOVEDA <span>ELITE</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00C853', fontFamily: 'DM Mono', fontSize: '10px' }}>
          <Lock size={12} /> ENCRIPTADO
        </div>
      </nav>

      <main className="checkout-container">
        {/* RESUMEN DE ORDEN */}
        <aside className="order-panel">
          <h2 className="o-title">DETALLE DE SUMINISTROS</h2>
          <div className="o-item"><span>PAQUETE</span><span className="o-val">{pkgData.name}</span></div>
          <div className="o-item"><span>CREDITOS PITCHX</span><span className="o-val">+{pkgData.px}</span></div>
          <div className="o-item"><span>VIDAS</span><span className="o-val">+{pkgData.lives}</span></div>
          <div className="o-total-box">
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>TOTAL A PAGAR</p>
            <div className="o-total-val">{currency} {localPrice}</div>
            <p style={{ fontSize: '9px', color: '#00C853', fontFamily: 'DM Mono' }}>{orderId}</p>
          </div>
        </aside>

        {/* PASARELA HÍBRIDA */}
        <section>
          <div className="route-tabs">
            {[
              { key: 'gateway', icon: <CreditCard size={20} />, label: 'TARJETA / PSE' },
              { key: 'direct',  icon: <Landmark size={20} />,   label: 'MANUAL'       },
              { key: 'crypto',  icon: <Bitcoin size={20} />,    label: 'CRIPTO'       },
              { key: 'pin',     icon: <Ticket size={20} />,     label: 'PIN / TICKET' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`r-tab ${paymentMethod === tab.key ? 'active' : ''}`}
                onClick={() => setPaymentMethod(tab.key as any)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="pay-module">
            <AnimatePresence mode="wait">

              {/* PASARELA EXTERNA */}
              {paymentMethod === 'gateway' && (
                <motion.div key="gateway" className="secure-bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bridge-icons">
                    <div className="icon-circle"><CreditCard size={24} color="#00C853" /></div>
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <ArrowRight size={24} color="rgba(255,255,255,0.3)" />
                    </motion.div>
                    <div className="icon-circle"><ShieldCheck size={28} color="#00C853" /></div>
                  </div>
                  <h3 style={{ fontFamily: 'Syncopate', fontSize: '16px', marginBottom: '15px' }}>TUNEL DE PAGO EXTERNO</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: '1.5' }}>
                    Por seguridad PCI-DSS, el procesamiento se realiza en servidores cifrados de nuestro proveedor de pagos.
                  </p>
                  <div className="ssl-badge">
                    <Lock size={14} color="#00C853" />
                    <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: '#00C853', letterSpacing: '1px' }}>CONEXION 256-BIT SSL ESTABLECIDA</span>
                  </div>
                  <button className="btn-pay" onClick={() => redirectToExternalGateway('gateway')}>
                    ABRIR CAJA FUERTE <ExternalLink size={18} style={{ marginLeft: '10px' }} />
                  </button>
                </motion.div>
              )}

              {/* CRIPTO */}
              {paymentMethod === 'crypto' && (
                <motion.div key="crypto" className="secure-bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bridge-icons">
                    <div className="icon-circle" style={{ borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.05)' }}>
                      <Bitcoin size={28} color="#FFD700" />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: 'Syncopate', fontSize: '16px', marginBottom: '15px', color: '#FFD700' }}>RED BLOCKCHAIN</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '30px', lineHeight: '1.5' }}>
                    Pagos en USDT sin fronteras. Seras redirigido a Binance Pay.
                  </p>
                  <button className="btn-pay" onClick={() => redirectToExternalGateway('crypto')} style={{ background: '#FFD700', color: '#000' }}>
                    ABRIR BINANCE PAY <ExternalLink size={18} style={{ marginLeft: '10px' }} />
                  </button>
                </motion.div>
              )}

              {/* TRANSFERENCIA DIRECTA */}
              {paymentMethod === 'direct' && (
                <motion.div key="direct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="vault-card">
                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Syncopate' }}>BOVEDA ACTIVA PARA TRANSFERENCIA</p>
                    <div className="v-number">
                      {VAULT_DATA.number}
                      <button onClick={() => copyToClipboard(VAULT_DATA.number)} style={{ background: 'none', border: 'none', color: copied ? '#00C853' : '#666', cursor: 'pointer' }}>
                        <Copy size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: '11px', marginTop: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      {VAULT_DATA.bank} — {VAULT_DATA.titular}
                    </p>
                  </div>
                  <form onSubmit={processDirectPayment}>
                    <label style={{ fontFamily: 'Syncopate', fontSize: '9px', color: '#00C853' }}>NUMERO DE REFERENCIA / COMPROBANTE</label>
                    <input type="text" className="elite-input" placeholder="Referencia de pago" value={referenceNum} onChange={e => setReferenceNum(e.target.value)} />
                    <button type="submit" className="btn-pay">NOTIFICAR TRANSFERENCIA</button>
                  </form>
                </motion.div>
              )}

              {/* CANJE DE PIN */}
              {paymentMethod === 'pin' && (
                <motion.div key="pin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 style={{ fontFamily: 'Syncopate', fontSize: '14px', marginBottom: '15px' }}>CANJEAR PIN DIGITAL</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '25px' }}>
                    Ingresa el PIN de tu distribuidor autorizado para acreditar vidas y PitchX al instante.
                  </p>
                  <form onSubmit={redeemPin}>
                    <label style={{ fontFamily: 'Syncopate', fontSize: '9px', color: '#00C853' }}>CODIGO DE ACCESO</label>
                    <input
                      type="text"
                      className="elite-input"
                      placeholder="CALAMAR-XXXX-XXXX-XXXX"
                      value={pinCode}
                      onChange={e => setPinCode(e.target.value.toUpperCase())}
                    />
                    <button type="submit" className="btn-pay">
                      <Zap size={18} style={{ marginRight: '8px' }} /> VALIDAR Y CANJEAR
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* OVERLAY DE PROCESAMIENTO */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="processing-overlay">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="processing-box" style={{ borderColor: status === 'error' ? '#FF0033' : '#00C853' }}>
              {status === 'processing' && <Activity size={60} color="#00C853" className="animate-spin mx-auto" />}
              {status === 'success'    && <CheckCircle size={60} color="#00C853" className="mx-auto" />}
              {status === 'error'      && <AlertTriangle size={60} color="#FF0033" className="mx-auto" />}
              <div className="term-log">&gt;_ {termLog}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
=======
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, ChevronLeft, CreditCard, Cpu, 
  CheckCircle, Activity, Server, AlertTriangle, Fingerprint, Heart,
  Bitcoin, Landmark, Wallet, QrCode, FileDigit, Check, Copy, ExternalLink, Ticket, Zap, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ─── CONEXIÓN A LA BÓVEDA FINANCIERA ───
const supabase = createBrowserClient(
  'https://gtioqzodmulbqbohdyet.supabase.co',
  'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
);

// ─── VERIFICACIÓN DE PAQUETES ───
const PACKAGES_DB: Record<string, { id: string, lives: number, px: number, usd: number, name: string }> = {
  'pkg_5': { id: 'pkg_5', lives: 5, px: 500, usd: 5, name: 'SUMINISTRO BÁSICO' },
  'pkg_12': { id: 'pkg_12', lives: 15, px: 1500, usd: 12, name: 'MARGEN TÁCTICO' },
  'pkg_20': { id: 'pkg_20', lives: 30, px: 3000, usd: 20, name: 'BLINDAJE ÉLITE' },
  'pkg_30': { id: 'pkg_30', lives: 50, px: 5000, usd: 30, name: 'ARSENAL SUPREMO' }
};

// ─── ENLACES DE PASARELA (AGREGADOR DE PAGOS) ───
const GATEWAY_LINKS: Record<string, string> = {
  'pkg_5': 'https://link-de-pago-vacio.com/basico',
  'pkg_12': 'https://link-de-pago-vacio.com/tactico',
  'pkg_20': 'https://link-de-pago-vacio.com/elite',
  'pkg_30': 'https://link-de-pago-vacio.com/supremo'
};

export default function SecureCheckout() {
  const router = useRouter();

  // ─── ESTADOS DE LA ORDEN ───
  const [orderId, setOrderId] = useState<string>('');
  const [localPrice, setLocalPrice] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [pkgData, setPkgData] = useState(PACKAGES_DB['pkg_5']);

  // ─── ESTADOS DE ENRUTAMIENTO HÍBRIDO ───
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'gateway' | 'crypto' | 'pin'>('gateway'); // Por defecto pasarela
  
  // ─── ESTADOS DE FORMULARIOS ───
  const [referenceNum, setReferenceNum] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // ─── ESTADOS DEL SISTEMA ───
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [termLog, setTermLog] = useState<string>('ESPERANDO AUTORIZACIÓN...');
  const [userId, setUserId] = useState<string | null>(null);

  // ─── BÓVEDA ACTIVA (SISTEMA ROTATIVO) ───
  const activeVault = {
    bank: "NEQUI / BANCOLOMBIA",
    number: "300 123 4567",
    titular: "EL CALAMAR CORP."
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || 'pkg_5';
      setLocalPrice(params.get('val') || '5.00');
      setCurrency(params.get('cur') || 'USD');
      if (PACKAGES_DB[id]) setPkgData(PACKAGES_DB[id]);
      setOrderId(`OP-${Math.floor(Math.random() * 900000) + 100000}-SEC`);
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else setUserId(session.user.id);
    };
    checkAuth();
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── PROTOCOLO DE PAGO DIRECTO ───
  const processDirectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceNum.trim().length < 4) {
      setTermLog('ERROR: NÚMERO DE COMPROBANTE INVÁLIDO');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    setStatus('processing');
    setTermLog("ENVIANDO REFERENCIA AL ALTO MANDO...");
    await new Promise(r => setTimeout(r, 2000));
    setStatus('success');
    setTermLog('¡SOLICITUD RECIBIDA! VALIDAREMOS TU PAGO EN BREVE.');
    setTimeout(() => router.push('/radar'), 4000);
  };

  // ─── PROTOCOLO DE CANJE DE PIN ───
  const redeemPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 8) {
      setTermLog('ERROR: FORMATO DE PIN NO RECONOCIDO');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('processing');
    const logs = [
      "DECODIFICANDO SECUENCIA ALFANUMÉRICA...",
      "VERIFICANDO FIRMA DIGITAL DEL PIN...",
      "AUTENTICANDO DISPONIBILIDAD EN LA RED...",
      "INYECTANDO VIDAS Y PITCHX..."
    ];

    for (const log of logs) {
      setTermLog(log);
      await new Promise(r => setTimeout(r, 700));
    }

    setStatus('success');
    setTermLog('PIN VALIDADO. RECURSOS AÑADIDOS A TU PERFIL.');
    setTimeout(() => router.push('/radar'), 3000);
  };

  // ─── PROTOCOLO DE REDIRECCIÓN A PASARELAS ───
  const redirectToExternalGateway = (type: string) => {
    setStatus('processing');
    if (type === 'gateway') {
      setTermLog(`ENRUTANDO A SERVIDOR BANCARIO EXTERNO...`);
      setTimeout(() => {
        const link = GATEWAY_LINKS[pkgData.id] || 'https://wompi.com';
        window.open(link, '_blank');
        setStatus('success');
        setTermLog(`REDIRECCIÓN EXITOSA. COMPLETE EL PAGO EN LA NUEVA PESTAÑA.`);
        setTimeout(() => setStatus('idle'), 3000);
      }, 2000);
    } else if (type === 'crypto') {
      setTermLog(`ENRUTANDO A RED BLOCKCHAIN...`);
      setTimeout(() => {
        window.open('https://pay.binance.com', '_blank');
        setStatus('success');
        setTermLog(`REDIRECCIÓN EXITOSA. COMPLETE EL CONTRATO INTELIGENTE.`);
        setTimeout(() => setStatus('idle'), 3000);
      }, 2000);
    }
  };

  return (
    <div className="checkout-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .checkout-root { background: #000; min-height: 100vh; color: #fff; font-family: 'Space Grotesk', sans-serif; position: relative; }
        .check-bg { position: fixed; inset: 0; z-index: 0; background: radial-gradient(circle at 50% -20%, rgba(0,200,83,0.08) 0%, transparent 60%); }
        
        .check-nav { position: relative; z-index: 10; padding: 20px 5vw; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); }
        .nav-brand { font-family: 'Syncopate'; font-size: 16px; font-weight: 900; letter-spacing: 2px; }
        .nav-brand span { color: #00C853; }
        
        .checkout-container { position: relative; z-index: 10; max-width: 1200px; margin: 40px auto; padding: 0 5vw; display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }

        .order-panel { background: rgba(10,10,10,0.8); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 40px; height: fit-content; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .o-title { font-family: 'Syncopate'; font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 3px; margin-bottom: 30px; }
        .o-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-family: 'DM Mono'; font-size: 13px; }
        .o-val { font-family: 'Syncopate'; color: #00C853; font-weight: 900; }
        
        .o-total-box { background: #000; border: 1px solid #00C853; padding: 20px; border-radius: 4px; text-align: center; margin-top: 30px; box-shadow: inset 0 0 15px rgba(0,200,83,0.1); }
        .o-total-val { font-family: 'Syncopate'; font-size: 28px; font-weight: 900; margin: 10px 0; }

        .route-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 25px; }
        .r-tab { 
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); 
          padding: 15px 5px; cursor: pointer; transition: 0.3s; border-radius: 4px;
          display: flex; flex-direction: column; align-items: center; gap: 8px; font-family: 'Syncopate'; font-size: 7px; font-weight: 700;
        }
        .r-tab.active { background: rgba(0,200,83,0.1); border-color: #00C853; color: #00C853; }

        .pay-module { background: #050505; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 40px; position: relative; }
        .pay-module::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: #00C853; box-shadow: 0 0 15px #00C853; }

        /* PUENTE DE SEGURIDAD (REEMPLAZA TARJETA) */
        .secure-bridge { text-align: center; padding: 20px 0; }
        .bridge-icons { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px; }
        .bridge-icons .icon-circle { width: 60px; height: 60px; border-radius: 50%; background: rgba(0,200,83,0.05); border: 1px solid rgba(0,200,83,0.2); display: flex; align-items: center; justify-content: center; }
        .ssl-badge { background: rgba(0,200,83,0.05); border: 1px dashed rgba(0,200,83,0.3); padding: 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 10px; margin-bottom: 30px; }

        .vault-card { background: #000; border: 1px dashed rgba(255,255,255,0.1); padding: 25px; border-radius: 6px; margin-bottom: 25px; }
        .v-number { font-family: 'DM Mono'; font-size: 24px; color: #00C853; display: flex; align-items: center; gap: 15px; margin-top: 10px; }

        .elite-input {
          background: #000 !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1) !important;
          padding: 18px 20px !important; border-radius: 4px !important; font-family: 'DM Mono' !important;
          font-size: 16px !important; outline: none !important; width: 100%; margin-top: 10px;
        }
        .elite-input:focus { border-color: #00C853 !important; box-shadow: 0 0 20px rgba(0,200,83,0.2) !important; }

        .btn-pay {
          width: 100%; background: #00C853; color: #000; border: none; padding: 20px; margin-top: 25px;
          font-family: 'Syncopate'; font-size: 14px; font-weight: 900; letter-spacing: 2px; cursor: pointer; border-radius: 4px;
          display: flex; align-items: center; justify-content: center; transition: 0.3s;
        }
        .btn-pay:hover { background: #fff; box-shadow: 0 0 30px rgba(0,200,83,0.4); }

        .processing-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; }
        .processing-box { border: 1px solid #00C853; background: #000; padding: 50px; text-align: center; border-radius: 8px; width: 90%; max-width: 500px; }
        .term-log { font-family: 'DM Mono'; color: #00C853; margin-top: 30px; font-size: 13px; }

        @media (max-width: 900px) { .checkout-container { grid-template-columns: 1fr; } .route-tabs { grid-template-columns: repeat(2, 1fr); } }
      `}} />

      <div className="check-bg" />

      <nav className="check-nav">
        <button onClick={() => router.back()} style={{background:'none', border:'none', color:'var(--vip-cyan)', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', fontFamily:'Syncopate', fontSize:'10px'}}>
          <ChevronLeft size={16} /> CANCELAR
        </button>
        <div className="nav-brand">BOVEDA <span>ELITE</span></div>
        <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#00C853', fontFamily:'DM Mono', fontSize:'10px'}}>
          <Lock size={12}/> ENCRIPTADO
        </div>
      </nav>

      <main className="checkout-container">
        {/* RESUMEN */}
        <aside className="order-panel">
          <h2 className="o-title">DETALLE DE SUMINISTROS</h2>
          <div className="o-item"><span>PAQUETE</span><span className="o-val">{pkgData.name}</span></div>
          <div className="o-item"><span>CRÉDITOS PITCHX</span><span className="o-val">+{pkgData.px}</span></div>
          <div className="o-item"><span>VIDAS</span><span className="o-val">+{pkgData.lives}</span></div>
          <div className="o-total-box">
            <p style={{fontSize:'10px', color:'rgba(255,255,255,0.4)'}}>TOTAL A PAGAR</p>
            <div className="o-total-val">{currency} {localPrice}</div>
            <p style={{fontSize:'9px', color:'#00C853', fontFamily:'DM Mono'}}>{orderId}</p>
          </div>
        </aside>

        {/* PASARELA HÍBRIDA */}
        <section>
          <div className="route-tabs">
            <button className={`r-tab ${paymentMethod === 'gateway' ? 'active' : ''}`} onClick={() => setPaymentMethod('gateway')}>
              <CreditCard size={20}/> TARJETA / PSE
            </button>
            <button className={`r-tab ${paymentMethod === 'direct' ? 'active' : ''}`} onClick={() => setPaymentMethod('direct')}>
              <Landmark size={20}/> MANUAL
            </button>
            <button className={`r-tab ${paymentMethod === 'crypto' ? 'active' : ''}`} onClick={() => setPaymentMethod('crypto')}>
              <Bitcoin size={20}/> CRIPTO
            </button>
            <button className={`r-tab ${paymentMethod === 'pin' ? 'active' : ''}`} onClick={() => setPaymentMethod('pin')}>
              <Ticket size={20}/> PIN / TICKET
            </button>
          </div>

          <div className="pay-module">
            <AnimatePresence mode="wait">
              
              {/* PASARELA EXTERNA (PUENTE VISUAL ELITE) */}
              {paymentMethod === 'gateway' && (
                <motion.div key="gateway" className="secure-bridge" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                  <div className="bridge-icons">
                    <div className="icon-circle"><CreditCard size={24} color="#00C853" /></div>
                    <motion.div animate={{x: [0, 10, 0]}} transition={{repeat: Infinity, duration: 1.5}}>
                      <ArrowRight size={24} color="rgba(255,255,255,0.3)" />
                    </motion.div>
                    <div className="icon-circle"><ShieldCheck size={28} color="#00C853" /></div>
                  </div>
                  
                  <h3 style={{fontFamily:'Syncopate', fontSize:'16px', marginBottom:'15px'}}>TÚNEL DE PAGO EXTERNO</h3>
                  <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'20px', lineHeight:'1.5'}}>
                    Por regulaciones de seguridad financiera PCI-DSS, el procesamiento de tarjetas y métodos locales se realiza en los servidores cifrados de nuestro proveedor de pagos.
                  </p>

                  <div className="ssl-badge">
                    <Lock size={14} color="#00C853" />
                    <span style={{fontFamily:'DM Mono', fontSize:'10px', color:'#00C853', letterSpacing:'1px'}}>CONEXIÓN 256-BIT SSL ESTABLECIDA</span>
                  </div>

                  <button className="btn-pay" onClick={() => redirectToExternalGateway('gateway')}>
                    ABRIR CAJA FUERTE <ExternalLink size={18} style={{marginLeft:'10px'}}/>
                  </button>
                </motion.div>
              )}

              {/* CRIPTO */}
              {paymentMethod === 'crypto' && (
                <motion.div key="crypto" className="secure-bridge" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                  <div className="bridge-icons">
                    <div className="icon-circle" style={{borderColor:'rgba(255,215,0,0.3)', background:'rgba(255,215,0,0.05)'}}><Bitcoin size={28} color="#FFD700" /></div>
                  </div>
                  <h3 style={{fontFamily:'Syncopate', fontSize:'16px', marginBottom:'15px', color:'#FFD700'}}>RED BLOCKCHAIN</h3>
                  <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'30px', lineHeight:'1.5'}}>
                    Pagos descentralizados sin fronteras. Serás redirigido a Binance Pay para firmar el contrato inteligente en USDT.
                  </p>
                  <button className="btn-pay" onClick={() => redirectToExternalGateway('crypto')} style={{background:'#FFD700', color:'#000', boxShadow:'0 0 20px rgba(255,215,0,0.2)'}}>
                    ABRIR BINANCE PAY <ExternalLink size={18} style={{marginLeft:'10px'}}/>
                  </button>
                </motion.div>
              )}

              {/* TRANSFERENCIA DIRECTA (SISTEMA ROTATIVO) */}
              {paymentMethod === 'direct' && (
                <motion.div key="direct" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                  <div className="vault-card">
                    <p style={{fontSize:'9px', color:'rgba(255,255,255,0.4)', fontFamily:'Syncopate'}}>BOVEDA ACTIVA PARA TRANSFERENCIA</p>
                    <div className="v-number">
                      {activeVault.number}
                      <button onClick={() => copyToClipboard(activeVault.number)} style={{background:'none', border:'none', color:'#00C853', cursor:'pointer'}}><Copy size={16}/></button>
                    </div>
                    <p style={{fontSize:'11px', marginTop:'10px', color:'rgba(255,255,255,0.6)'}}>{activeVault.bank} - {activeVault.titular}</p>
                  </div>
                  <form onSubmit={processDirectPayment}>
                    <label style={{fontFamily:'Syncopate', fontSize:'9px', color:'#00C853'}}>NÚMERO DE REFERENCIA / COMPROBANTE</label>
                    <input type="text" className="elite-input" placeholder="Referencia de pago" value={referenceNum} onChange={(e) => setReferenceNum(e.target.value)} />
                    <button type="submit" className="btn-pay">NOTIFICAR TRANSFERENCIA</button>
                  </form>
                </motion.div>
              )}

              {/* CANJE DE PIN */}
              {paymentMethod === 'pin' && (
                <motion.div key="pin" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                  <h3 style={{fontFamily:'Syncopate', fontSize:'14px', marginBottom:'15px'}}>CANJEAR PIN DIGITAL</h3>
                  <p style={{fontSize:'13px', color:'rgba(255,255,255,0.4)', marginBottom:'25px'}}>
                    Si compraste un PIN a un distribuidor autorizado, ingrésalo aquí para liberar tus suministros al instante.
                  </p>
                  <form onSubmit={redeemPin}>
                    <label style={{fontFamily:'Syncopate', fontSize:'9px', color:'#00C853'}}>CÓDIGO DE ACCESO</label>
                    <input 
                      type="text" 
                      className="elite-input" 
                      placeholder="GURU-XXXX-XXXX" 
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                    />
                    <button type="submit" className="btn-pay">
                      <Zap size={18} style={{display:'inline', marginRight:'8px'}}/> VALIDAR Y CANJEAR
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* OVERLAY PROCESAMIENTO */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="processing-overlay">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} className="processing-box" style={{borderColor: status === 'error' ? '#FF0033' : '#00C853'}}>
              {status === 'processing' && <Activity size={60} color="#00C853" className="animate-spin mx-auto" />}
              {status === 'success' && <CheckCircle size={60} color="#00C853" className="mx-auto" />}
              {status === 'error' && <AlertTriangle size={60} color="#FF0033" className="mx-auto" />}
              <div className="term-log">&gt;_ {termLog}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
>>>>>>> a6a391750b7574b0d4f3b6b2274d6dac7f5e09b3
}