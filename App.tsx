import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronLeft, 
  Activity, 
  Youtube, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Wand2,
  Save,
  X,
  Filter,
  ArrowRight,
  Globe,
  Ruler,
  Database,
  Edit,
  Trash2,
  Footprints,
  Image as ImageIcon,
  Upload,
  Star,
  Trophy,
  Video,
  FileVideo
} from 'lucide-react';
import { Player, Position, INITIAL_STATS, SeasonStat, Nationality, PlayerStats } from './types';
import { PitchVisualization } from './components/PitchVisualization';
import { StatsRadar } from './components/StatsRadar';
import { generatePlayerProfile } from './services/geminiService';

// --- CONSTANTS ---
const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF' }, { name: 'Afrique du Sud', code: 'ZA' }, { name: 'Albanie', code: 'AL' }, { name: 'Algérie', code: 'DZ' },
  { name: 'Allemagne', code: 'DE' }, { name: 'Angleterre', code: 'GB-ENG' }, { name: 'Angola', code: 'AO' }, { name: 'Arabie saoudite', code: 'SA' },
  { name: 'Argentine', code: 'AR' }, { name: 'Arménie', code: 'AM' }, { name: 'Australie', code: 'AU' }, { name: 'Autriche', code: 'AT' },
  { name: 'Belgique', code: 'BE' }, { name: 'Bénin', code: 'BJ' }, { name: 'Bolivie', code: 'BO' }, { name: 'Bosnie-Herzégovine', code: 'BA' },
  { name: 'Brésil', code: 'BR' }, { name: 'Bulgarie', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Cameroun', code: 'CM' },
  { name: 'Canada', code: 'CA' }, { name: 'Cap-Vert', code: 'CV' }, { name: 'Chili', code: 'CL' }, { name: 'Chine', code: 'CN' },
  { name: 'Colombie', code: 'CO' }, { name: 'Comores', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Corée du Sud', code: 'KR' },
  { name: 'Costa Rica', code: 'CR' }, { name: 'Côte d\'Ivoire', code: 'CI' }, { name: 'Croatie', code: 'HR' }, { name: 'Danemark', code: 'DK' },
  { name: 'Écosse', code: 'GB-SCT' }, { name: 'Égypte', code: 'EG' }, { name: 'Équateur', code: 'EC' }, { name: 'Espagne', code: 'ES' },
  { name: 'États-Unis', code: 'US' }, { name: 'Finlande', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'Gabon', code: 'GA' },
  { name: 'Gambie', code: 'GM' }, { name: 'Géorgie', code: 'GE' }, { name: 'Ghana', code: 'GH' }, { name: 'Grèce', code: 'GR' },
  { name: 'Guinée', code: 'GN' }, { name: 'Guinée-Bissau', code: 'GW' }, { name: 'Guinée équatoriale', code: 'GQ' }, { name: 'Haïti', code: 'HT' },
  { name: 'Honduras', code: 'HN' }, { name: 'Hongrie', code: 'HU' }, { name: 'Iran', code: 'IR' }, { name: 'Irlande', code: 'IE' },
  { name: 'Islande', code: 'IS' }, { name: 'Italie', code: 'IT' }, { name: 'Jamaïque', code: 'JM' }, { name: 'Japon', code: 'JP' },
  { name: 'Mali', code: 'ML' }, { name: 'Maroc', code: 'MA' }, { name: 'Mexique', code: 'MX' }, { name: 'Monténégro', code: 'ME' },
  { name: 'Nigeria', code: 'NG' }, { name: 'Norvège', code: 'NO' }, { name: 'Nouvelle-Zélande', code: 'NZ' }, { name: 'Paraguay', code: 'PY' },
  { name: 'Pays-Bas', code: 'NL' }, { name: 'Pays de Galles', code: 'GB-WLS' }, { name: 'Pérou', code: 'PE' }, { name: 'Pologne', code: 'PL' },
  { name: 'Portugal', code: 'PT' }, { name: 'Rép. Dém. du Congo', code: 'CD' }, { name: 'République tchèque', code: 'CZ' }, { name: 'Roumanie', code: 'RO' },
  { name: 'Russie', code: 'RU' }, { name: 'Sénégal', code: 'SN' }, { name: 'Serbie', code: 'RS' }, { name: 'Slovaquie', code: 'SK' },
  { name: 'Slovénie', code: 'SI' }, { name: 'Suède', code: 'SE' }, { name: 'Suisse', code: 'CH' }, { name: 'Tunisie', code: 'TN' },
  { name: 'Turquie', code: 'TR' }, { name: 'Ukraine', code: 'UA' }, { name: 'Uruguay', code: 'UY' }, { name: 'Venezuela', code: 'VE' }
].sort((a, b) => a.name.localeCompare(b.name));

// --- MOCK DATA ---
const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    firstName: 'Lamine',
    lastName: 'Yamal',
    age: 17,
    height: 180,
    nationalities: [{ country: 'Espagne', code: 'ES' }, { country: 'Maroc', code: 'MA' }, { country: 'Guinée équatoriale', code: 'GQ' }],
    strongFoot: 'Gauche',
    primaryPosition: Position.RW,
    secondaryPositions: [Position.CAM, Position.LW],
    club: 'FC Barcelona',
    description: "Un talent générationnel pur. Lamine possède une capacité de dribble déconcertante et une maturité tactique bien au-dessus de son âge. Il peut éliminer n'importe quel défenseur en un contre un.",
    strengths: ['Dribble explosif', 'Vision du jeu', 'Agilité', 'Sang-froid'],
    weaknesses: ['Physique encore léger', 'Jeu de tête'],
    progressionArea: 'Doit gagner en masse musculaire pour résister aux duels en Premier League ou compétitions intenses.',
    potential: 5,
    stats: { pace: 92, shooting: 78, passing: 85, dribbling: 96, defending: 35, physical: 55 },
    nationalStats: { caps: 14, goals: 3, assists: 7 },
    seasonStats: [
        { season: '23/24', club: 'FC Barcelona', competition: 'La Liga', appearances: 37, goals: 5, assists: 8 },
        { season: '24/25', club: 'FC Barcelona', competition: 'La Liga', appearances: 10, goals: 3, assists: 5 }
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    firstName: 'Habib',
    lastName: 'Diarra',
    age: 20,
    height: 179,
    nationalities: [{ country: 'France', code: 'FR' }, { country: 'Sénégal', code: 'SN' }],
    strongFoot: 'Droit',
    primaryPosition: Position.CM,
    secondaryPositions: [Position.CDM, Position.CAM],
    club: 'RC Strasbourg',
    description: "Milieu box-to-box dynamique avec une excellente capacité de projection. Habib Diarra excelle dans la transition et possède un gros volume de jeu.",
    strengths: ['Percussion', 'Endurance', 'Polyvalence'],
    weaknesses: ['Discipline tactique', 'Dernier geste'],
    progressionArea: 'Doit stabiliser son poste et gagner en régularité dans la distribution.',
    potential: 4,
    stats: { pace: 82, shooting: 68, passing: 76, dribbling: 79, defending: 70, physical: 80 },
    nationalStats: { caps: 0, goals: 0, assists: 0 },
    seasonStats: [
        { season: '23/24', club: 'RC Strasbourg', competition: 'Ligue 1', appearances: 31, goals: 3, assists: 2 }
    ],
    imageUrl: 'https://picsum.photos/400/400?random=3'
  }
];

// --- UTILS ---
const Flag: React.FC<{ code: string, className?: string }> = ({ code, className = "w-5 h-3.5" }) => (
  <img 
    src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} 
    alt={code} 
    className={`inline-block object-cover rounded-sm shadow-sm ${className}`}
  />
);

const getYouTubeId = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getTop3Stats = (stats: PlayerStats) => {
    const map = [
      { key: 'pace', label: 'VIT', value: stats.pace },
      { key: 'shooting', label: 'TIR', value: stats.shooting },
      { key: 'passing', label: 'PAS', value: stats.passing },
      { key: 'dribbling', label: 'DRI', value: stats.dribbling },
      { key: 'defending', label: 'DEF', value: stats.defending },
      { key: 'physical', label: 'PHY', value: stats.physical },
    ];
    return map.sort((a, b) => b.value - a.value).slice(0, 3);
};

const StarRating = ({ rating, onChange, readOnly = false }: { rating: number, onChange?: (r: number) => void, readOnly?: boolean }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onChange && onChange(star)}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                    disabled={readOnly}
                >
                    <Star 
                        size={readOnly ? 16 : 24} 
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} transition-colors`} 
                    />
                </button>
            ))}
        </div>
    );
};

// --- COMPONENTS ---

// 0. Landing Page (Unchanged)
const LandingPage = ({ onEnter }: { onEnter: () => void }) => (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col font-display">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg transform rotate-3 flex items-center justify-center">
                   <Zap className="text-white w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter text-white">Next<span className="text-brand-accent">Wave</span></h1>
            </div>
            <button onClick={onEnter} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Connexion Agent
            </button>
        </header>

        {/* Hero */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md animate-fade-in-up">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                <span className="text-xs font-medium text-brand-accent tracking-wide uppercase">Nouvelle Génération U21</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
                Le Futur du Football <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">Détecté Aujourd'hui</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                Accédez à la base de données la plus avancée pour les talents de moins de 21 ans. 
                Statistiques détaillées, analyses IA et visualisations tactiques pour les scouts modernes.
            </p>

            <button 
                onClick={onEnter}
                className="group relative px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg flex items-center space-x-3 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1"
            >
                <span>Accéder à la Base de Données</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
        </main>
    </div>
);

// 1. Sidebar (Unchanged)
const Sidebar = ({ activeTab, setActiveTab, onGoHome }: { activeTab: string, setActiveTab: (t: string) => void, onGoHome: () => void }) => (
  <div className="hidden md:flex flex-col w-64 glass-panel border-r-0 h-screen fixed z-20">
    <div className="p-8 flex items-center space-x-3 cursor-pointer group" onClick={onGoHome}>
      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
        <Zap className="text-white w-5 h-5" />
      </div>
      <h1 className="text-xl font-bold text-white tracking-tight font-display group-hover:text-brand-accent transition-colors">Next<span className="text-brand-accent group-hover:text-white">Wave</span></h1>
    </div>
    <nav className="flex-1 px-4 space-y-2 mt-4">
      <button 
        onClick={() => setActiveTab('roster')}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all border ${activeTab === 'roster' ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-accent' : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
      >
        <Database size={18} />
        <span className="font-medium">Base de Données</span>
      </button>
      <button 
        onClick={() => setActiveTab('add')}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all border ${activeTab === 'add' ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-accent' : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
      >
        <Plus size={18} />
        <span className="font-medium">Ajouter Talent</span>
      </button>
    </nav>
  </div>
);

// 2. Filter Bar (Unchanged)
const FilterBar = ({ onFilterChange, availableCountries }: { onFilterChange: (filters: any) => void, availableCountries: string[] }) => {
    const [position, setPosition] = useState('');
    const [foot, setFoot] = useState('');
    const [country, setCountry] = useState('');
    
    useEffect(() => {
        onFilterChange({ position, foot, country });
    }, [position, foot, country]);

    return (
        <div className="flex flex-wrap gap-3 mb-6 p-4 glass-panel rounded-xl">
             <div className="flex items-center text-slate-400 mr-2">
                <Filter size={18} className="mr-2"/>
                <span className="text-sm font-medium">Filtres</span>
             </div>
             
             <select 
                value={position} 
                onChange={(e) => setPosition(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-accent"
             >
                <option value="">Tous les postes</option>
                {Object.values(Position).map(p => <option key={p} value={p}>{p}</option>)}
             </select>

             <select 
                value={foot} 
                onChange={(e) => setFoot(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-accent"
             >
                <option value="">Pied Fort</option>
                <option value="Droit">Droit</option>
                <option value="Gauche">Gauche</option>
                <option value="Ambidextre">Ambidextre</option>
             </select>

             <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-accent"
             >
                <option value="">Toutes nationalités</option>
                {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
             </select>

             {(position || foot || country) && (
                 <button 
                    onClick={() => {setPosition(''); setFoot(''); setCountry('');}}
                    className="text-xs text-red-400 hover:text-red-300 ml-auto flex items-center"
                 >
                    <X size={12} className="mr-1"/> Effacer
                 </button>
             )}
        </div>
    );
};

// 3. Player Detail View
const PlayerDetail = ({ player, onBack, onEdit }: { player: Player, onBack: () => void, onEdit: (p: Player) => void }) => {
  
  const videoId = getYouTubeId(player.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Retour à la liste</span>
          </button>
          
          <button onClick={() => onEdit(player)} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
             <Edit size={16} />
             <span>Modifier le profil</span>
          </button>
      </div>

      {/* Header Section */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex-shrink-0 mx-auto md:mx-0 relative z-10">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
             <img src={player.imageUrl} alt={player.lastName} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <div>
            <div className="flex flex-col md:flex-row md:items-end gap-3 justify-center md:justify-start">
               <h1 className="text-5xl font-bold text-white font-display tracking-tight">{player.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">{player.lastName}</span></h1>
               <span className="px-3 py-1 mb-2 bg-white/10 backdrop-blur-md rounded-lg text-sm text-white border border-white/10 self-center md:self-auto uppercase tracking-wide">{player.club}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-slate-300">
               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Globe size={16} className="text-brand-accent"/>
                    <div className="flex space-x-2">
                        {player.nationalities.map((n, i) => (
                            <span key={i} className="flex items-center space-x-1">
                                <Flag code={n.code} />
                                <span className="text-sm">{n.country}</span>
                            </span>
                        ))}
                    </div>
               </div>
               
               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Activity size={16} className="text-brand-accent"/>
                    <span className="text-sm">{player.age} ans</span>
               </div>

               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Ruler size={16} className="text-brand-accent"/>
                    <span className="text-sm">{player.height} cm</span>
               </div>
               
               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Footprints size={16} className="text-brand-accent" />
                    <span className="text-sm font-bold">{player.strongFoot}</span>
               </div>

               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-white">{player.potential}/5</span>
               </div>
               
               <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-sm font-bold text-brand-accent">{player.primaryPosition}</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-green-900/20 to-transparent p-4 rounded-xl border border-green-500/20">
                <h3 className="text-green-400 font-semibold mb-2 flex items-center text-sm uppercase tracking-wide"><Zap size={14} className="mr-2"/> Atouts Majeurs</h3>
                <div className="flex flex-wrap gap-2">
                    {player.strengths.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs font-medium rounded border border-green-500/20">{s}</span>
                    ))}
                </div>
            </div>
             <div className="bg-gradient-to-br from-orange-900/20 to-transparent p-4 rounded-xl border border-orange-500/20">
                <h3 className="text-orange-400 font-semibold mb-2 flex items-center text-sm uppercase tracking-wide"><AlertTriangle size={14} className="mr-2"/> Axes de travail</h3>
                <div className="flex flex-wrap gap-2">
                    {player.weaknesses.map((w, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-300 text-xs font-medium rounded border border-orange-500/20">{w}</span>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Pitch */}
        <div className="space-y-6">
           {/* Radar Chart */}
           <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center font-display"><Activity className="mr-2 text-brand-accent"/> Profil Radar</h3>
              <StatsRadar stats={player.stats} />
           </div>

           {/* Pitch Position */}
           <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 font-display">Zone d'influence</h3>
              <PitchVisualization primaryPosition={player.primaryPosition} secondaryPositions={player.secondaryPositions} className="mx-auto w-full max-w-[250px]" />
           </div>
        </div>

        {/* Center/Right Column: Description & Progression */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Scouting Report */}
            <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
                <h3 className="text-xl font-bold text-white mb-6 font-display">Rapport du Scout</h3>
                <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{player.description}</p>
                
                <div className="mt-8 pt-6 border-t border-white/5 bg-brand-primary/5 -mx-8 -mb-8 p-8">
                    <h4 className="text-lg font-semibold text-brand-accent mb-2 flex items-center font-display"><TrendingUp className="mr-2"/> Potentiel & Trajectoire</h4>
                    <p className="text-slate-300 italic">"{player.progressionArea}"</p>
                </div>
            </div>

             {/* National & Season Stats Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* National Stats */}
                <div className="glass-panel rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/20">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center font-display"><Trophy className="mr-2 text-yellow-400" size={18}/> Sélection Nationale</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <span className="text-slate-400 text-sm">Sélections</span>
                             <span className="text-xl font-bold text-white">{player.nationalStats?.caps || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <span className="text-slate-400 text-sm">Buts</span>
                             <span className="text-xl font-bold text-green-400">{player.nationalStats?.goals || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-slate-400 text-sm">Passes Dé.</span>
                             <span className="text-xl font-bold text-blue-400">{player.nationalStats?.assists || 0}</span>
                        </div>
                     </div>
                </div>

                {/* Season Stats Table */}
                <div className="md:col-span-2 glass-panel rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-display"><Database className="mr-2 text-brand-accent" size={18}/> Statistiques Saisons</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase border-b border-slate-700">
                                    <th className="pb-3 font-semibold">Saison</th>
                                    <th className="pb-3 font-semibold">Club</th>
                                    <th className="pb-3 font-semibold text-center">M</th>
                                    <th className="pb-3 font-semibold text-center">B</th>
                                    <th className="pb-3 font-semibold text-center">P</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {player.seasonStats && player.seasonStats.length > 0 ? (
                                    player.seasonStats.map((stat, idx) => (
                                        <tr key={idx} className="border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-2 text-white font-mono text-xs">{stat.season}</td>
                                            <td className="py-2 text-slate-300 text-xs">{stat.club}</td>
                                            <td className="py-2 text-center text-white">{stat.appearances}</td>
                                            <td className="py-2 text-center text-green-400 font-bold">{stat.goals}</td>
                                            <td className="py-2 text-center text-blue-400 font-bold">{stat.assists}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-slate-500 italic">Aucune statistique disponible</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Video Analysis */}
            <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center font-display"><Video className="mr-2 text-red-500"/> Highlights</h3>
                
                {/* Priority to uploaded video */}
                {player.uploadedVideo ? (
                    <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black shadow-2xl">
                        <video 
                            src={player.uploadedVideo} 
                            controls 
                            className="absolute top-0 left-0 w-full h-full"
                        />
                    </div>
                ) : embedUrl ? (
                    <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black shadow-2xl">
                        <iframe 
                            src={embedUrl} 
                            className="absolute top-0 left-0 w-full h-full"
                            title="Player Video"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="border border-red-900/30 bg-red-900/10 p-4 rounded-xl">
                        <p className="text-red-300">Aucune vidéo disponible pour ce joueur.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// 4. Add/Edit Player Form
const AddPlayerForm = ({ player, onSave, onCancel }: { player?: Player | null, onSave: (p: Player) => void, onCancel: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [videoMode, setVideoMode] = useState<'url' | 'upload'>('url');

  const [formData, setFormData] = useState<Partial<Player>>({
    firstName: '',
    lastName: '',
    age: 16,
    height: 175,
    nationalities: [],
    strongFoot: 'Droit',
    primaryPosition: Position.CM,
    secondaryPositions: [],
    club: '',
    description: '',
    strengths: [],
    weaknesses: [],
    progressionArea: '',
    potential: 3,
    stats: { ...INITIAL_STATS },
    seasonStats: [],
    nationalStats: { caps: 0, goals: 0, assists: 0 },
    videoUrl: '',
    uploadedVideo: '',
    imageUrl: ''
  });
  
  // Initialize form if editing
  useEffect(() => {
    if (player) {
        setFormData({ ...player });
        if(player.strengths) setStrStrengths(player.strengths.join(', '));
        if(player.weaknesses) setStrWeaknesses(player.weaknesses.join(', '));
        if(player.uploadedVideo) setVideoMode('upload');
    }
  }, [player]);

  const [strStrengths, setStrStrengths] = useState('');
  const [strWeaknesses, setStrWeaknesses] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  const handleAiFill = async () => {
    if (!formData.firstName || !formData.lastName) {
        alert("Veuillez entrer au moins le prénom et le nom du joueur.");
        return;
    }
    setLoading(true);
    try {
        const data = await generatePlayerProfile(formData.firstName, formData.lastName);
        setFormData(prev => ({ ...prev, ...data }));
        
        if(data.strengths) setStrStrengths(data.strengths.join(', '));
        if(data.weaknesses) setStrWeaknesses(data.weaknesses.join(', '));
        // Note: Nationalities from AI are objects, handled automatically by state merge

    } catch (e) {
        alert("Erreur lors de la génération IA. " + e);
    } finally {
        setLoading(false);
    }
  };

  const handleAddNationality = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const code = e.target.value;
      if (!code) return;

      const country = COUNTRIES.find(c => c.code === code);
      if (!country) return;

      const current = formData.nationalities || [];
      if (current.length >= 4) {
          alert("Maximum 4 nationalités autorisées.");
          setSelectedCountryCode('');
          return;
      }

      if (current.some(n => n.code === code)) {
          setSelectedCountryCode('');
          return;
      }

      setFormData({
          ...formData,
          nationalities: [...current, { country: country.name, code: country.code }]
      });
      setSelectedCountryCode('');
  };

  const removeNationality = (code: string) => {
      setFormData({
          ...formData,
          nationalities: (formData.nationalities || []).filter(n => n.code !== code)
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, imageUrl: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Limit file size to prevent localStorage issues (optional but recommended for web containers)
        if (file.size > 5000000) { // ~5MB
            if(!confirm("Attention : Cette vidéo est volumineuse (> 5MB). La sauvegarde automatique pourrait échouer. Continuer ?")) {
                return;
            }
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, uploadedVideo: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlayer: Player = {
        id: player ? player.id : Date.now().toString(),
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        age: Number(formData.age),
        height: Number(formData.height),
        nationalities: formData.nationalities || [],
        strongFoot: formData.strongFoot as any,
        primaryPosition: formData.primaryPosition as Position,
        secondaryPositions: formData.secondaryPositions || [],
        club: formData.club || 'Sans Club',
        description: formData.description || '',
        strengths: strStrengths.split(',').map(s => s.trim()).filter(Boolean),
        weaknesses: strWeaknesses.split(',').map(s => s.trim()).filter(Boolean),
        progressionArea: formData.progressionArea || '',
        videoUrl: videoMode === 'url' ? formData.videoUrl : '',
        uploadedVideo: videoMode === 'upload' ? formData.uploadedVideo : '',
        potential: formData.potential || 3,
        stats: formData.stats || INITIAL_STATS,
        seasonStats: formData.seasonStats || [],
        nationalStats: formData.nationalStats || { caps: 0, goals: 0, assists: 0 },
        imageUrl: formData.imageUrl || `https://picsum.photos/400/400?random=${Date.now()}`
    };
    onSave(newPlayer);
  };

  const updateStat = (key: keyof typeof INITIAL_STATS, val: number) => {
      setFormData(prev => ({
          ...prev,
          stats: { ...prev.stats!, [key]: Number(val) }
      }));
  };
  
  const toggleSecondaryPosition = (pos: Position) => {
      const current = formData.secondaryPositions || [];
      if (current.includes(pos)) {
          setFormData({ ...formData, secondaryPositions: current.filter(p => p !== pos) });
      } else {
          setFormData({ ...formData, secondaryPositions: [...current, pos] });
      }
  };

  const addSeasonStat = () => {
      const newStat: SeasonStat = { season: '24/25', club: formData.club || '', competition: 'League', appearances: 0, goals: 0, assists: 0 };
      setFormData({ ...formData, seasonStats: [...(formData.seasonStats || []), newStat] });
  };

  const updateSeasonStat = (index: number, field: keyof SeasonStat, value: string | number) => {
      const updatedStats = [...(formData.seasonStats || [])];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      setFormData({ ...formData, seasonStats: updatedStats });
  };

  const removeSeasonStat = (index: number) => {
      const updatedStats = [...(formData.seasonStats || [])];
      updatedStats.splice(index, 1);
      setFormData({ ...formData, seasonStats: updatedStats });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 glass-panel rounded-2xl my-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 relative z-10">
            <h2 className="text-2xl font-bold text-white font-display">{player ? 'Modifier le Profil' : 'Nouveau Talent'}</h2>
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><X /></button>
        </div>

        {/* AI Generator Header */}
        <div className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/10 p-6 rounded-xl border border-brand-primary/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center space-x-4">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shadow-brand-primary/30"><Wand2 className="text-white" size={24}/></div>
                <div>
                    <h3 className="font-bold text-white text-lg">Assistant Scout IA</h3>
                    <p className="text-sm text-brand-accent/80">Entrez le nom du joueur, l'IA remplit le reste.</p>
                </div>
            </div>
            <button 
                type="button"
                onClick={handleAiFill}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-white text-brand-dark hover:bg-slate-200 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
                {loading ? (
                    <span className="flex items-center"><span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin mr-2"></span> Analyse...</span>
                ) : 'Générer Profil'}
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider">Identité</label>
                    <input placeholder="Prénom" required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
                    <input placeholder="Nom" required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
                    
                    {/* Photo Upload Section */}
                    <div>
                         <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Photo du joueur</label>
                         <div className="space-y-2">
                             {/* URL Input */}
                             <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-white focus:ring-2 focus:ring-brand-primary outline-none text-sm" placeholder="URL ou téléverser..." />
                             </div>
                             
                             {/* Buttons */}
                             <div className="flex gap-2">
                                 <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs flex items-center justify-center gap-1 border border-slate-700 cursor-pointer">
                                     <Upload size={14}/> Téléverser Fichier
                                     <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                 </label>
                             </div>

                             {/* Preview */}
                             {formData.imageUrl && (
                                 <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                                     <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                 </div>
                             )}
                         </div>
                    </div>
                </div>
                <div className="space-y-4">
                     <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider">Physique & Info</label>
                     <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Age" required type="number" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none" />
                        <input placeholder="Taille (cm)" required type="number" value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none" />
                     </div>
                     <input placeholder="Club Actuel" type="text" value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none" />
                     
                     {/* Potential Stars */}
                     <div>
                         <label className="block text-xs uppercase text-yellow-500 font-semibold tracking-wider mb-2">Potentiel (Étoiles)</label>
                         <StarRating rating={formData.potential || 0} onChange={(r) => setFormData({...formData, potential: r})} />
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Pied Fort & Poste Principal</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Footprints className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16}/>
                            <select value={formData.strongFoot} onChange={e => setFormData({...formData, strongFoot: e.target.value as any})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-white focus:ring-2 focus:ring-brand-primary outline-none">
                                <option value="Droit">Droit</option>
                                <option value="Gauche">Gauche</option>
                                <option value="Ambidextre">Ambidextre</option>
                            </select>
                        </div>
                        <select value={formData.primaryPosition} onChange={e => setFormData({...formData, primaryPosition: e.target.value as Position})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none">
                            {Object.values(Position).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                     <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Nationalités (Max 4)</label>
                     <div className="space-y-3">
                        <select 
                            value={selectedCountryCode} 
                            onChange={handleAddNationality}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none"
                        >
                            <option value="">Ajouter un pays...</option>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>

                        <div className="flex flex-wrap gap-2">
                            {formData.nationalities?.map((n) => (
                                <div key={n.code} className="flex items-center space-x-2 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1">
                                    <Flag code={n.code} />
                                    <span className="text-sm text-slate-200">{n.country}</span>
                                    <button type="button" onClick={() => removeNationality(n.code)} className="text-slate-400 hover:text-red-400"><X size={14}/></button>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            <div>
                 <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Postes Secondaires (Zones Jaunes)</label>
                 <div className="flex flex-wrap gap-2">
                     {Object.values(Position).map(p => (
                         p !== formData.primaryPosition && (
                            <button
                                key={p}
                                type="button"
                                onClick={() => toggleSecondaryPosition(p)}
                                className={`px-3 py-1 rounded-lg text-sm border transition-all ${formData.secondaryPositions?.includes(p) ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-slate-900/50 border-slate-700 text-slate-400'}`}
                            >
                                {p}
                            </button>
                         )
                     ))}
                 </div>
            </div>

            <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Rapport de Scouting</label>
                <textarea placeholder="Description détaillée du style de jeu..." required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-brand-primary outline-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs uppercase text-green-400 font-semibold tracking-wider mb-2">Points Forts</label>
                    <input placeholder="Séparés par des virgules" type="text" value={strStrengths} onChange={e => setStrStrengths(e.target.value)} className="w-full bg-slate-900/50 border border-green-900/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                    <label className="block text-xs uppercase text-orange-400 font-semibold tracking-wider mb-2">Points Faibles</label>
                    <input placeholder="Séparés par des virgules" type="text" value={strWeaknesses} onChange={e => setStrWeaknesses(e.target.value)} className="w-full bg-slate-900/50 border border-orange-900/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs uppercase text-purple-400 font-semibold tracking-wider mb-2">Axe de Progression</label>
                <input type="text" value={formData.progressionArea} onChange={e => setFormData({...formData, progressionArea: e.target.value})} className="w-full bg-slate-900/50 border border-purple-900/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Season Stats Editor */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs uppercase text-blue-400 font-semibold tracking-wider">Stats Club (Saisons)</label>
                        <button type="button" onClick={addSeasonStat} className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-500">Ajouter</button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                        {formData.seasonStats?.map((stat, idx) => (
                            <div key={idx} className="grid grid-cols-7 gap-1 items-center">
                                <input type="text" placeholder="Sais." value={stat.season} onChange={(e) => updateSeasonStat(idx, 'season', e.target.value)} className="bg-slate-800 rounded p-1 text-xs text-white border border-slate-700 w-full"/>
                                <input type="text" placeholder="Club" value={stat.club} onChange={(e) => updateSeasonStat(idx, 'club', e.target.value)} className="col-span-2 bg-slate-800 rounded p-1 text-xs text-white border border-slate-700 w-full"/>
                                <input type="number" placeholder="M" value={stat.appearances} onChange={(e) => updateSeasonStat(idx, 'appearances', Number(e.target.value))} className="bg-slate-800 rounded p-1 text-xs text-white border border-slate-700 w-full"/>
                                <input type="number" placeholder="B" value={stat.goals} onChange={(e) => updateSeasonStat(idx, 'goals', Number(e.target.value))} className="bg-slate-800 rounded p-1 text-xs text-white border border-slate-700 w-full"/>
                                <input type="number" placeholder="P" value={stat.assists} onChange={(e) => updateSeasonStat(idx, 'assists', Number(e.target.value))} className="bg-slate-800 rounded p-1 text-xs text-white border border-slate-700 w-full"/>
                                <button type="button" onClick={() => removeSeasonStat(idx)} className="text-red-400 hover:text-red-300 flex justify-center"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* National Stats Editor */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                    <div className="mb-4">
                        <label className="block text-xs uppercase text-blue-400 font-semibold tracking-wider flex items-center"><Trophy size={14} className="mr-1"/> Stats Sélection Nationale</label>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Sélections (Caps)</span>
                            <input type="number" value={formData.nationalStats?.caps || 0} onChange={(e) => setFormData({...formData, nationalStats: {...formData.nationalStats!, caps: Number(e.target.value)}})} className="bg-slate-800 rounded p-2 text-white border border-slate-700 w-20 text-center"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Buts</span>
                            <input type="number" value={formData.nationalStats?.goals || 0} onChange={(e) => setFormData({...formData, nationalStats: {...formData.nationalStats!, goals: Number(e.target.value)}})} className="bg-slate-800 rounded p-2 text-white border border-slate-700 w-20 text-center"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Passes Décisives</span>
                            <input type="number" value={formData.nationalStats?.assists || 0} onChange={(e) => setFormData({...formData, nationalStats: {...formData.nationalStats!, assists: Number(e.target.value)}})} className="bg-slate-800 rounded p-2 text-white border border-slate-700 w-20 text-center"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div>
                <label className="block text-xs uppercase text-red-400 font-semibold tracking-wider mb-2">Vidéo Highlights</label>
                
                {/* Toggle Buttons */}
                <div className="flex gap-4 mb-3">
                    <button 
                        type="button" 
                        onClick={() => setVideoMode('url')}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${videoMode === 'url' ? 'bg-red-900/40 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                    >
                        <Youtube size={16}/> Lien YouTube
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setVideoMode('upload')}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${videoMode === 'upload' ? 'bg-red-900/40 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                    >
                        <FileVideo size={16}/> Téléverser Vidéo
                    </button>
                </div>

                {videoMode === 'url' ? (
                    <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={16}/>
                        <input 
                            type="text" 
                            value={formData.videoUrl || ''} 
                            onChange={e => setFormData({...formData, videoUrl: e.target.value, uploadedVideo: ''})} 
                            className="w-full bg-slate-900/50 border border-red-900/50 rounded-xl py-3 pl-10 pr-3 text-white focus:ring-2 focus:ring-red-500 outline-none" 
                            placeholder="https://youtube.com/watch?v=..." 
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="w-full h-12 bg-slate-900/50 border border-dashed border-red-900/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                            <span className="flex items-center text-slate-400 gap-2 text-sm"><Upload size={16}/> Choisir un fichier vidéo (MP4, WebM)</span>
                            <input 
                                type="file" 
                                accept="video/*" 
                                className="hidden" 
                                onChange={handleVideoUpload}
                            />
                        </label>
                        {formData.uploadedVideo && (
                            <p className="text-xs text-green-400 flex items-center gap-1"><Video size={12}/> Vidéo sélectionnée prête à l'enregistrement.</p>
                        )}
                        <p className="text-[10px] text-slate-500 italic">* Les gros fichiers peuvent ralentir la sauvegarde.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-900/80 p-6 rounded-xl border border-white/5">
                <h3 className="text-white font-semibold mb-4 flex items-center"><Activity className="mr-2 text-brand-accent"/> Note Globale (0-100)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {Object.keys(INITIAL_STATS).map(stat => (
                        <div key={stat} className="flex flex-col items-center">
                            <label className="block text-[10px] uppercase text-slate-500 mb-2">{stat}</label>
                            <div className="relative w-full h-32 bg-slate-800 rounded-full overflow-hidden flex items-end justify-center pb-2 group">
                                <div 
                                    className="w-full absolute bottom-0 bg-brand-primary group-hover:bg-brand-accent transition-colors duration-300"
                                    style={{ height: `${formData.stats![stat as keyof typeof INITIAL_STATS]}%` }}
                                ></div>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={formData.stats![stat as keyof typeof INITIAL_STATS]} 
                                    onChange={e => updateStat(stat as keyof typeof INITIAL_STATS, Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title={stat}
                                />
                                <span className="relative z-0 text-white font-bold text-sm pointer-events-none drop-shadow-md">{formData.stats![stat as keyof typeof INITIAL_STATS]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-lg flex items-center shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-[1.02]">
                    <Save className="mr-2" size={20}/> {player ? 'Mettre à jour' : 'Enregistrer dans la Base'}
                </button>
            </div>
        </form>
    </div>
  );
};


// 5. Main App Container
export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('roster');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null); // For edit mode
  
  // Persistence Logic: Initialize from localStorage, fallback to MOCK_PLAYERS
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
        const saved = localStorage.getItem('nextwave_players');
        return saved ? JSON.parse(saved) : MOCK_PLAYERS;
    } catch (e) {
        console.error("Failed to load from local storage", e);
        return MOCK_PLAYERS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ position: '', foot: '', country: '' });

  // Persistence Logic: Save to localStorage whenever players change
  useEffect(() => {
    try {
        localStorage.setItem('nextwave_players', JSON.stringify(players));
    } catch (e) {
        // This usually happens if quota is exceeded (e.g. video too big)
        console.error("Failed to save to local storage (likely quota exceeded)", e);
        alert("Attention: Impossible de sauvegarder automatiquement (espace de stockage plein). Essayez de réduire la taille des vidéos/images.");
    }
  }, [players]);

  // Extract unique countries for filter based on updated list
  const availableCountries = Array.from(new Set(players.flatMap(p => p.nationalities.map(n => n.country)) as string[])).sort();

  const handleSavePlayer = (savedPlayer: Player) => {
    if (editingPlayer) {
        // Update existing
        setPlayers(players.map(p => p.id === savedPlayer.id ? savedPlayer : p));
        setEditingPlayer(null);
        setSelectedPlayer(savedPlayer); // Go back to detail view
    } else {
        // Add new
        setPlayers([savedPlayer, ...players]);
    }
    setActiveTab('roster');
  };

  const handleEditClick = (player: Player) => {
      setEditingPlayer(player);
      setActiveTab('add'); // Reuse the add tab/form
  };

  const filteredPlayers = players.filter(p => {
      const matchesSearch = p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.club.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filters.position ? (p.primaryPosition === filters.position || p.secondaryPositions?.includes(filters.position as Position)) : true;
      const matchesFoot = filters.foot ? p.strongFoot === filters.foot : true;
      const matchesCountry = filters.country ? p.nationalities.some(n => n.country === filters.country) : true;
      
      return matchesSearch && matchesPosition && matchesFoot && matchesCountry;
  });

  if (view === 'landing') {
      return <LandingPage onEnter={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-brand-accent/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => {
            setActiveTab(t);
            setSelectedPlayer(null);
            setEditingPlayer(null);
        }} 
        onGoHome={() => setView('landing')}
      />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        {/* Top Bar (Mobile mostly) */}
        <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
           <h1 className="text-lg font-bold text-white font-display">Next<span className="text-brand-accent">Wave</span></h1>
           <button onClick={() => setActiveTab(activeTab === 'add' ? 'roster' : 'add')} className="p-2 bg-slate-800 rounded-lg">
             {activeTab === 'add' ? <Users size={20}/> : <Plus size={20}/>}
           </button>
        </div>

        {/* Content Switcher */}
        <div className="p-4 md:p-8 relative z-10">
            
            {/* VIEW: ADD / EDIT FORM */}
            {activeTab === 'add' && (
                <AddPlayerForm 
                    player={editingPlayer} 
                    onSave={handleSavePlayer} 
                    onCancel={() => {
                        setActiveTab('roster');
                        setEditingPlayer(null);
                    }} 
                />
            )}

            {/* VIEW: ROSTER & DETAIL */}
            {activeTab === 'roster' && (
                <>
                   {selectedPlayer ? (
                       <PlayerDetail 
                            player={selectedPlayer} 
                            onBack={() => setSelectedPlayer(null)} 
                            onEdit={handleEditClick}
                       />
                   ) : (
                       <div className="animate-fade-in space-y-6">
                           {/* Header & Search */}
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                               <div>
                                   <h2 className="text-4xl font-bold text-white font-display tracking-tight">Base <span className="text-brand-accent">U21</span></h2>
                                   <p className="text-slate-400 mt-2">Découvrez les futures icônes avant tout le monde.</p>
                               </div>
                               <div className="w-full md:w-[400px]">
                                   <div className="relative group">
                                       <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={20} />
                                       <input 
                                          type="text" 
                                          placeholder="Rechercher (Nom, Club)..." 
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-inner"
                                       />
                                   </div>
                               </div>
                           </div>

                           <FilterBar onFilterChange={setFilters} availableCountries={availableCountries} />

                           {/* Cards Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                               {filteredPlayers.map(player => (
                                   <div 
                                      key={player.id} 
                                      onClick={() => setSelectedPlayer(player)}
                                      className="group glass-panel rounded-2xl p-0 hover:border-brand-primary/50 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
                                   >
                                       {/* Image Top */}
                                       <div className="h-48 relative overflow-hidden">
                                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                                           <img src={player.imageUrl || `https://ui-avatars.com/api/?name=${player.firstName}+${player.lastName}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                           <div className="absolute top-4 right-4 z-20 flex space-x-1">
                                                {player.nationalities.slice(0, 2).map((n, i) => (
                                                    <Flag key={i} code={n.code} className="shadow-lg border border-white/20" />
                                                ))}
                                           </div>
                                           <div className="absolute bottom-4 left-4 z-20">
                                               <h3 className="font-bold text-2xl text-white font-display tracking-tight leading-none">{player.firstName} <br/> {player.lastName}</h3>
                                           </div>
                                       </div>
                                       
                                       <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-slate-400 text-sm truncate max-w-[150px]">{player.club}</span>
                                                <div className="flex space-x-2">
                                                    <span className="px-2 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded text-xs text-brand-accent font-bold">{player.primaryPosition}</span>
                                                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{player.age} ans</span>
                                                </div>
                                            </div>

                                            {/* Stars & Stats Mini */}
                                            <div className="flex justify-between items-center mb-4 px-2">
                                                <div className="flex space-x-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < (player.potential || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />
                                                    ))}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono">
                                                    {player.nationalStats?.goals || 0}B (Sel.)
                                                </div>
                                            </div>
                                       
                                            {/* Mini Stats Preview (Top 3) */}
                                            <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                                                    {getTop3Stats(player.stats).map((stat) => (
                                                        <div key={stat.key} className="text-center">
                                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</div>
                                                            <div className="font-bold text-white text-lg">{stat.value}</div>
                                                        </div>
                                                    ))}
                                            </div>
                                       </div>
                                   </div>
                               ))}
                           </div>

                           {filteredPlayers.length === 0 && (
                               <div className="text-center py-20 text-slate-500 glass-panel rounded-2xl">
                                   <Users size={48} className="mx-auto mb-4 opacity-30"/>
                                   <p className="text-lg">Aucun joueur ne correspond à vos critères.</p>
                                   <button onClick={() => {setSearchTerm(''); setFilters({position: '', foot: '', country: ''})}} className="mt-4 text-brand-accent hover:underline">Réinitialiser les filtres</button>
                               </div>
                           )}
                       </div>
                   )}
                </>
            )}
        </div>
      </main>
    </div>
  );
}