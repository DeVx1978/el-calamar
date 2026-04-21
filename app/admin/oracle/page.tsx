"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Zap, Activity, ShieldAlert, Crosshair, ChevronRight, AlertTriangle, Database, Power, Target, TrendingUp, Filter } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  'https://gtioqzodmulbqbohdyet.supabase.co', 
  'sb_publishable_AitDo2hEkx8tA-rjchUUlA_TfI3sDjH'
);

export default function OracleEngine() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPartidos();
  }, []);

  const fetchPartidos = async () => {
    const { data } = await supabase
      .from('partidos')
      .select('*')
      .neq('status', 'finalizado')
      .order('fecha', { ascending: true });
    if (data) setPartidos(data);
    setLoading(false);
  };

  const sentenciarPartido = async (partido: any, marcadorLocal: number, marcadorVisitante: number) => {
    if (!confirm(`¿ESTÁ SEGURO DE DICTAR SENTENCIA? ESTA ACCIÓN DISTRIBUIRÁ CAPITAL Y ELIMINARÁ VIDAS.`)) return;
    
    setProcessingId(partido.id);
    try {
      // 1. OBTENER TODAS LAS PREDICCIONES
      const { data: predicciones } = await supabase.from('predicciones').select('*').eq('partido_id', partido.id);

      if (predicciones) {
        for (const pred of predicciones) {
          const gano = pred.prediccion_local === marcadorLocal && pred.prediccion_visitante === marcadorVisitante;
          const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', pred.user_id).single();

          if (perfil) {
            if (gano) {
              // PREMIO: 2x lo apostado + Racha
              await supabase.from('perfiles').update({
                racha_actual: (perfil.racha_actual || 0) + 1,
                pitchx_balance: perfil.pitchx_balance + (pred.monto_apostado * 2)
              }).eq('id', pred.user_id);
            } else {
              // CASTIGO: Pierde vida
              await supabase.from('perfiles').update({
                racha_actual: 0,
                vidas_restantes: Math.max(0, (perfil.vidas_restantes || 0) - 1)
              }).eq('id', pred.user_id);
            }
          }
        }
      }

      // 2. CERRAR PARTIDO
      await supabase.from('partidos').update({ 
        status: 'finalizado',
        marcador_local: marcadorLocal,
        marcador_visitante: marcadorVisitante
      }).eq('id', partido.id);

      fetchPartidos();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="oracle-terminal">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700;900&family=Space+Grotesk:wght@300;500;700;900&display=swap');
        
        .oracle-terminal {
          background: #000; min-height: 100vh; color: white; padding: 60px 8vw;
          font-family: 'Space Grotesk', sans-serif; position: relative; overflow-x: hidden;
        }

        /* VFX DE FONDO - RADAR DE EJECUCIÓN */
        .radar-vfx {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(0, 200, 83, 0.05) 0%, transparent 80%);
        }
        .grid-perspective {
          position: fixed; inset: 0; z-index: 1; opacity: 0.1;
          background-image: linear-gradient(#00C853 1px, transparent 1px), linear-gradient(90deg, #00C853 1px, transparent 1px);
          background-size: 50px 50px; transform: perspective(1000px) rotateX(65deg) translateY(-100px);
          animation: grid-move 20s linear infinite;
        }
        @keyframes grid-move { from { background-position: 0 0; } to { background-position: 0 100%; } }

        .header-command {
          position: relative; z-index: 10; margin-bottom: 80px;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .main-brand h1 {
          font-family: 'Syncopate'; font-size: 60px; font-weight: 900; letter-spacing: -4px;
          background: linear-gradient(to bottom, #fff, #00C853); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .status-tag { font-family: 'Syncopate'; font-size: 10px; color: #00C853; letter-spacing: 8px; border-left: 5px solid #00C853; padding-left: 20px; }

        /* LISTADO DE PARTIDOS TIPO FICHA CRIMINAL */
        .execution-grid {
          position: relative; z-index: 10; display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 30px;
        }

        .match-vault {
          background: rgba(10,10,10,0.85); border: 1px solid rgba(255,255,255,0.05);
          padding: 40px; border-radius: 4px; backdrop-filter: blur(20px);
          position: relative; transition: 0.4s;
        }
        .match-vault:hover { border-color: #FF0033; box-shadow: 0 0 40px rgba(255,0,51,0.1); transform: translateY(-5px); }

        .teams-arena {
          display: flex; justify-content: space-between; align-items: center; margin: 30px 0;
        }
        .team-block { text-align: center; width: 40%; }
        .team-name { font-family: 'Syncopate'; font-weight: 900; font-size: 20px; color: #fff; margin-bottom: 15px; }
        
        .score-input {
          background: #000 !important; color: #fff !important; border: 1px solid #222 !important;
          width: 80px; height: 80px; text-align: center; font-size: 32px; font-weight: 900;
          font-family: 'Syncopate'; border-radius: 4px; outline: none; transition: 0.3s;
        }
        .score-input:focus { border-color: #00C853; box-shadow: 0 0 20px rgba(0,200,83,0.3); }

        .vs-indicator { font-family: 'Syncopate'; font-size: 12px; color: #333; font-weight: 900; }

        .execute-btn {
          width: 100%; background: #FF0033; color: #fff; border: none; padding: 25px;
          font-family: 'Syncopate'; font-weight: 900; font-size: 11px; cursor: pointer;
          border-radius: 2px; display: flex; align-items: center; justify-content: center; gap: 15px;
          transition: 0.3s; letter-spacing: 3px;
        }
        .execute-btn:hover { background: #fff; color: #000; box-shadow: 0 0 50px rgba(255,255,255,0.3); }
        .execute-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .meta-info { font-size: 10px; font-family: 'Syncopate'; color: #444; letter-spacing: 2px; margin-top: 20px; text-align: center; }

        @media (max-width: 600px) { .execution-grid { grid-template-columns: 1fr; } }
      `}} />

      <div className="radar-vfx" />
      <div className="grid-perspective" />

      <header className="header-command">
        <div className="main-brand">
          <span className="status-tag">SYSTEM_ORACLE_v2.6</span>
          <h1>ORÁCULO</h1>
        </div>
        <div className="flex items-center gap-6">
          <Activity className="text-[#00C853] animate-pulse" size={40} />
        </div>
      </header>

      <div className="execution-grid">
        {loading ? (
          <div className="col-span-full text-center py-40">
            <TrendingUp className="animate-spin text-[#00C853] mx-auto mb-6" size={50} />
            <p className="font-['Syncopate'] text-xs tracking-[10px]">SINCRONIZANDO PARTIDOS ABIERTOS...</p>
          </div>
        ) : (
          partidos.map((partido) => {
            const [localS, setLocalS] = useState(0);
            const [visitS, setVisitS] = useState(0);

            return (
              <motion.div 
                key={partido.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="match-vault"
              >
                <div className="flex justify-between items-center opacity-30 font-['Syncopate'] text-[9px] tracking-widest">
                  <span>ID: {partido.id.slice(0, 8)}</span>
                  <span>{new Date(partido.fecha).toLocaleString()}</span>
                </div>

                <div className="teams-arena">
                  <div className="team-block">
                    <div className="team-name">{partido.equipo_local}</div>
                    <input 
                      type="number" className="score-input" 
                      value={localS} onChange={(e) => setLocalS(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="vs-indicator">VS</div>

                  <div className="team-block">
                    <div className="team-name">{partido.equipo_visitante}</div>
                    <input 
                      type="number" className="score-input" 
                      value={visitS} onChange={(e) => setVisitS(Number(e.target.value))}
                    />
                  </div>
                </div>

                <button 
                  className="execute-btn" 
                  disabled={processingId === partido.id}
                  onClick={() => sentenciarPartido(partido, localS, visitS)}
                >
                  {processingId === partido.id ? (
                    <Activity className="animate-spin" />
                  ) : (
                    <>
                      <Skull size={20} /> DICTAR SENTENCIA FINAL
                    </>
                  )}
                </button>

                <div className="meta-info">ADVERTENCIA: LA DISTRIBUCIÓN DE CAPITAL ES IRREVERSIBLE</div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}