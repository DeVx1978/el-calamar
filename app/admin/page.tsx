"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MasterAdminPanel() {
  const [activeTab, setActiveTab] = useState<'torneos' | 'crear' | 'resolver'>('torneos');
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);

  const [newTournament, setNewTournament] = useState({
    name: '', slug: '', type: 'LEAGUE', bg_image: '/img/lobby.jpg', accent_color: '#00C853'
  });
  
  const [newMatch, setNewMatch] = useState({
    tournament_name: '', home_team: '', away_team: '', home_flag: '', away_flag: '',
    match_date: '', stadium: '', city: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const { data: TData } = await supabase.from('tournaments').select('*').order('name');
    if (TData) {
      setTournaments(TData);
      if (TData.length > 0 && !newMatch.tournament_name) setNewMatch(prev => ({ ...prev, tournament_name: TData[0].name }));
    }
    const { data: MData } = await supabase.from('matches').select('*').eq('status', 'PROXIMAMENTE').order('match_date', { ascending: true });
    if (MData) setPendingMatches(MData);
    setLoading(false);
  };

  const handleCreateTournament = async () => {
    if(!newTournament.name || !newTournament.slug) return alert("Faltan datos");
    setLoading(true);
    const { error } = await supabase.from('tournaments').insert([newTournament]);
    if (!error) {
      alert("TORNEO CREADO EXITOSAMENTE");
      setNewTournament({ name: '', slug: '', type: 'LEAGUE', bg_image: '/img/lobby.jpg', accent_color: '#00C853' });
      fetchData();
    }
    setLoading(false);
  };

  const handlePublishMatch = async () => {
    setLoading(true);
    const { error } = await supabase.from('matches').insert([{ ...newMatch, status: 'PROXIMAMENTE' }]);
    if (!error) {
      alert("PARTIDO PUBLICADO EN LA ARENA");
      setNewMatch(prev => ({ ...prev, home_team: '', away_team: '', home_flag: '', away_flag: '' }));
      fetchData();
    }
    setLoading(false);
  };

  const procesarResultado = async (matchId: string, result: string) => {
    if (!confirm(`¿Confirmar victoria de ${result}?`)) return;
    setLoading(true);
    const { error } = await supabase.from('matches').update({ status: 'FINALIZADO', result: result }).eq('id', matchId);
    if (!error) {
      alert("RESULTADO GRABADO");
      fetchData();
    }
    setLoading(false);
  };

  return (
    <main className="admin-wrapper">
      <div className="dynamic-bg" style={{ backgroundImage: "url('/img/lobby.jpg')" }}></div>
      <div className="dark-overlay"></div>
      
      <div className="admin-container">
        <header className="admin-header">
          <button onClick={() => router.push('/lobby')} className="back-btn">« VOLVER AL INICIO</button>
          <h1 className="neon-title">CENTRO DE MANDO_</h1>
          <div className="tab-switcher">
            <button className={activeTab === 'torneos' ? 'active' : ''} onClick={() => setActiveTab('torneos')}>1. CREAR TORNEO</button>
            <button className={activeTab === 'crear' ? 'active' : ''} onClick={() => setActiveTab('crear')}>2. AGREGAR PARTIDOS</button>
            <button className={activeTab === 'resolver' ? 'active' : ''} onClick={() => setActiveTab('resolver')}>3. DAR RESULTADOS</button>
          </div>
        </header>

        {/* PESTAÑA 1: TORNEOS */}
        {activeTab === 'torneos' && (
          <section className="glass-card animate-in">
            <h3>FUNDAR NUEVA COMPETENCIA</h3>
            <div className="grid-form">
              <div className="input-group full-width">
                <label>NOMBRE DEL TORNEO (EJ: MUNDIAL 2026)</label>
                <input type="text" className="elite-input" placeholder="Nombre que verán los usuarios" value={newTournament.name} onChange={(e) => setNewTournament({...newTournament, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>ENLACE WEB (EJ: LIGA-PRO)</label>
                <input type="text" className="elite-input" placeholder="Sin espacios, solo guiones" value={newTournament.slug} onChange={(e) => setNewTournament({...newTournament, slug: e.target.value})} />
              </div>
              <div className="input-group">
                <label>COLOR DEL NEÓN</label>
                <input type="color" className="elite-input color-pick" value={newTournament.accent_color} onChange={(e) => setNewTournament({...newTournament, accent_color: e.target.value})} />
              </div>
              <div className="input-group full-width">
                <label>IMAGEN DE FONDO (RUTA)</label>
                <input type="text" className="elite-input" placeholder="Ej: /img/lobby.jpg" value={newTournament.bg_image} onChange={(e) => setNewTournament({...newTournament, bg_image: e.target.value})} />
              </div>
            </div>
            <button className="submit-btn fundar" onClick={handleCreateTournament} disabled={loading}>
              {loading ? "CREANDO..." : "GRABAR TORNEO EN BASE DE DATOS"}
            </button>
          </section>
        )}

        {/* PESTAÑA 2: PARTIDOS */}
        {activeTab === 'crear' && (
          <section className="glass-card animate-in">
            <h3>DESPLEGAR PARTIDO EN LA ARENA</h3>
            <div className="grid-form">
              <div className="input-group full-width">
                <label>SELECCIONAR TORNEO PERTENECIENTE</label>
                <select className="elite-input" value={newMatch.tournament_name} onChange={(e) => setNewMatch({...newMatch, tournament_name: e.target.value})}>
                  {tournaments.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>EQUIPO LOCAL</label>
                <input type="text" className="elite-input" placeholder="Ej: Perú" value={newMatch.home_team} onChange={(e) => setNewMatch({...newMatch, home_team: e.target.value})} />
              </div>
              <div className="input-group">
                <label>EQUIPO VISITANTE</label>
                <input type="text" className="elite-input" placeholder="Ej: Bolivia" value={newMatch.away_team} onChange={(e) => setNewMatch({...newMatch, away_team: e.target.value})} />
              </div>
              <div className="input-group full-width">
                <label>FECHA Y HORA DEL PARTIDO</label>
                <input type="datetime-local" className="elite-input" value={newMatch.match_date} onChange={(e) => setNewMatch({...newMatch, match_date: e.target.value})} />
              </div>
              <div className="input-group">
                <label>ESTADIO</label>
                <input type="text" className="elite-input" placeholder="Ej: Monumental" value={newMatch.stadium} onChange={(e) => setNewMatch({...newMatch, stadium: e.target.value})} />
              </div>
              <div className="input-group">
                <label>CIUDAD</label>
                <input type="text" className="elite-input" placeholder="Ej: Lima" value={newMatch.city} onChange={(e) => setNewMatch({...newMatch, city: e.target.value})} />
              </div>
            </div>
            <button className="submit-btn desplegar" onClick={handlePublishMatch} disabled={loading}>
              {loading ? "PUBLICANDO..." : "PUBLICAR PARTIDO"}
            </button>
          </section>
        )}

        {/* PESTAÑA 3: RESULTADOS */}
        {activeTab === 'resolver' && (
          <section className="glass-card animate-in">
            <h3>DICTAR SENTENCIA FINAL</h3>
            <div className="results-list">
              {pendingMatches.map((m) => (
                <div key={m.id} className="match-result-row">
                  <div className="m-data">
                    <span className="t-name">{m.tournament_name}</span>
                    <p>{m.home_team} vs {m.away_team}</p>
                  </div>
                  <div className="btn-actions">
                    <button onClick={() => procesarResultado(m.id, 'LOCAL')} className="res-btn">GANÓ LOCAL</button>
                    <button onClick={() => procesarResultado(m.id, 'EMPATE')} className="res-btn">EMPATE</button>
                    <button onClick={() => procesarResultado(m.id, 'VISITANTE')} className="res-btn">GANÓ VISITA</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .admin-wrapper { min-height: 100vh; background: #000; color: white; position: relative; font-family: sans-serif; }
        .dynamic-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: 0.15; filter: blur(8px); }
        .dark-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, transparent, #000 95%); }
        .admin-container { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .neon-title { font-size: 2.5rem; font-weight: 900; text-align: center; letter-spacing: -1px; }
        .tab-switcher { display: flex; gap: 10px; justify-content: center; margin: 30px 0; }
        .tab-switcher button { background: #111; border: 1px solid #333; color: #666; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; }
        .tab-switcher button.active { background: #fff; color: #000; border-color: #fff; box-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 35px; backdrop-filter: blur(20px); }
        .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        .full-width { grid-column: span 2; }
        .input-group label { display: block; font-size: 0.7rem; color: #666; margin-bottom: 8px; font-weight: 900; letter-spacing: 1px; }
        .elite-input { background: #000 !important; border: 1px solid #222 !important; color: #fff !important; padding: 15px !important; border-radius: 10px; width: 100%; font-size: 0.9rem; }
        .color-pick { height: 50px; padding: 5px !important; cursor: pointer; }
        .submit-btn { width: 100%; margin-top: 30px; padding: 20px; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; }
        .fundar { background: #dc2626; color: #fff; }
        .desplegar { background: #00C853; color: #000; }
        .match-result-row { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #222; }
        .res-btn { background: #111; border: 1px solid #333; color: #fff; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 0.7rem; margin-left: 5px; }
        .res-btn:hover { background: #fff; color: #000; }
        .back-btn { background: none; border: none; color: #444; cursor: pointer; font-size: 0.7rem; margin-bottom: 20px; }
      `}</style>
    </main>
  );
}