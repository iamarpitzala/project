/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Sparkles, SlidersHorizontal, Image as ImageIcon, RotateCcw, Monitor, RefreshCw, Smartphone } from 'lucide-react';
import { PosterData, PosterSize, BrandTheme } from './types';
import { PosterPreview } from './components/PosterPreview';
import { PosterControls } from './components/PosterControls';

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#143147"/>
      <stop offset="100%" stop-color="#4B121C"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)"/>
  <g opacity="0.15">
    <circle cx="250" cy="250" r="230" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="250" cy="250" r="180" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="250" y1="20" x2="250" y2="480" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="20" y1="250" x2="480" y2="250" stroke="#FFFFFF" stroke-width="1.5"/>
  </g>
  <circle cx="250" cy="185" r="68" fill="#FFFFFF" opacity="0.9"/>
  <path d="M120,410 C120,310 180,285 250,285 C320,285 380,310 380,410 C380,440 320,440 250,440 C180,440 120,440 120,410 Z" fill="#F2DF74" opacity="0.95"/>
</svg>
`)}`;

const BRAND_THEMES: BrandTheme[] = [
  {
    id: 'classic-navy',
    name: 'Classic Navy',
    primary: '#004165',
    primaryLight: '#E6F0F6',
    accent: '#772432',
    highlight: '#F2DF74',
    bodyBg: '#FAF9F6',
    textColor: '#004165'
  },
  {
    id: 'burgundy-red',
    name: 'Royal Burgundy',
    primary: '#772432',
    primaryLight: '#FAF0F2',
    accent: '#004165',
    highlight: '#F2DF74',
    bodyBg: '#FAF9F6',
    textColor: '#772432'
  },
  {
    id: 'deep-coal',
    name: 'Slate Tech',
    primary: '#0F172A',
    primaryLight: '#F1F5F9',
    accent: '#EF4444',
    highlight: '#FAFBFD',
    bodyBg: '#FFFFFF',
    textColor: '#0F172A'
  },
  {
    id: 'forest-green',
    name: 'Forest Runner',
    primary: '#14532D',
    primaryLight: '#F0FDF4',
    accent: '#854D0E',
    highlight: '#FEF08A',
    bodyBg: '#FCFCF6',
    textColor: '#14532D'
  }
];

const POSTER_SIZES: PosterSize[] = [
  {
    id: 'instagram-portrait',
    name: 'Instagram / WhatsApp Post',
    width: 1000,
    height: 1250, // Matches exact proportions of the screenshot
    aspectRatio: '4:5',
    label: '4:5 (Standard Flyer)',
    description: 'Perfect for general Instagram feeds, WhatsApp broadcasts and email flyers.'
  },
  {
    id: 'instagram-square',
    name: 'Square Feed Post',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    label: '1:1 Square',
    description: 'Great format for LinkedIn feeds, Facebook posts, and general square posts.'
  },
  {
    id: 'story',
    name: 'Instagram Story / Status',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    label: '9:16 Story',
    description: 'Optimized for full-screen viewing, Instagram Stories and WhatsApp statuses.'
  },
  {
    id: 'landscape',
    name: 'LinkedIn Banner / Slide',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    label: '16:9 Landscape',
    description: 'Ideal for horizontal slide decks, web banners, and LinkedIn landscape shares.'
  }
];

const INITIAL_POSTER_DATA: PosterData = {
  clubName: "CRG Toastmasters",
  clubTagline: "Run by Runners",
  clubDetails: "Club #28678751, Area J3, District 98",
  sinceYear: "1924",
  roleTitle: "TOYASTMASTER OF THE DAY", // or SPEECH EVALUATOR
  meetingNumber: "55",
  speakerName: "SATYAJIT JENA",
  themeLabel: "THEME:",
  themeTitle: "A JOURNEY THROUGH THE QUEEN OF THE HILLS",
  speakerImage: DEFAULT_AVATAR,
  speakerImageScale: 1.0,
  speakerImageX: 0,
  speakerImageY: 0,
  venueLabel: "Venue:",
  venueText: "GIFT City Fire Station,\nTraining Room, First Floor,\nGIFT City.",
  dateText: "SUNDAY 24TH MAY 2026",
  timeText: "10:30 AM - 12:30 PM",
  qrUrl: "https://www.toastmasters.org",
  lecternText: "CRG",
  instagram: "crg_toastmasters",
  website: "toastmasters.org",
  phone: "91-84693-65643",
  themeId: "classic-navy",
};

export default function App() {
  const [data, setData] = useState<PosterData>(() => {
    const saved = localStorage.getItem('tm_poster_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_POSTER_DATA;
      }
    }
    return INITIAL_POSTER_DATA;
  });

  const [selectedSize, setSelectedSize] = useState<PosterSize>(POSTER_SIZES[0]);
  const [selectedTheme, setSelectedTheme] = useState<BrandTheme>(BRAND_THEMES[0]);
  const [qrCodeBase64, setQrCodeBase64] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(0.5);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Sync theme selection when state's themeId changes
  useEffect(() => {
    const theme = BRAND_THEMES.find(t => t.id === data.themeId) || BRAND_THEMES[0];
    setSelectedTheme(theme);
  }, [data.themeId]);

  // Persist edits to local storage
  useEffect(() => {
    localStorage.setItem('tm_poster_data', JSON.stringify(data));
  }, [data]);

  // Dynamically load RSVP QR code to DataURL to support clean high-fidelity captures
  useEffect(() => {
    let active = true;
    const fetchQR = async () => {
      if (!data.qrUrl.trim()) return;
      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.qrUrl)}`;
        const response = await fetch(url);
        const blob = await response.blob();
        if (!active) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active) setQrCodeBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Failed fetching dynamic QR block: ", err);
      }
    };

    fetchQR();
    return () => {
      active = false;
    };
  }, [data.qrUrl]);

  // Dynamic ResizeObserver updates layout scale factor of preview canvas
  useEffect(() => {
    if (!previewContainerRef.current) return;
    
    const handleResize = () => {
      if (!previewContainerRef.current) return;
      
      const parentWidth = previewContainerRef.current.clientWidth;
      const parentHeight = previewContainerRef.current.clientHeight;
      
      const targetWidth = selectedSize.width;
      const targetHeight = selectedSize.height;
      
      const padding = 32; // padding around preview
      const widthScale = (parentWidth - padding) / targetWidth;
      const heightScale = (parentHeight - padding) / targetHeight;
      
      // We want to fit it both horizontally and vertically, maxing scaling out at 1.0
      const optimalScale = Math.min(widthScale, heightScale, 1.0);
      setPreviewScale(optimalScale > 0.1 ? optimalScale : 0.5);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(previewContainerRef.current);
    handleResize(); // immediate kick-off

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedSize]);

  // File loading mechanism converts file streams instantly to standard base64 data blobs
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setData(prev => ({
          ...prev,
          speakerImage: e.target?.result as string,
          speakerImageScale: 1.0,
          speakerImageX: 0,
          speakerImageY: 0,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert exact DOM layouts to PNG or JPEG with high device ratios
  const handleExport = async (format: 'png' | 'jpeg', scaleMultiplier: number) => {
    const elementId = selectedSize.aspectRatio === '4:5' ? 'poster-canvas-portrait' :
                      selectedSize.aspectRatio === '1:1' ? 'poster-canvas-square' :
                      selectedSize.aspectRatio === '9:16' ? 'poster-canvas-story' :
                      'poster-canvas-landscape';
    
    const node = document.getElementById(elementId);
    if (!node) {
      alert("Error: Rendering workspace not found. Please try again.");
      return;
    }

    setIsExporting(true);

    try {
      // Import html-to-image dynamically to ensure safe compilation execution blocks
      const htmlToImage = await import('html-to-image');
      
      const options = {
        pixelRatio: scaleMultiplier,
        quality: 0.95,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${selectedSize.width}px`,
          height: `${selectedSize.height}px`,
        }
      };

      let url = '';
      if (format === 'png') {
        url = await htmlToImage.toPng(node, options);
      } else {
        url = await htmlToImage.toJpeg(node, options);
      }

      // Safe anchor simulation
      const link = document.createElement('a');
      const cleanName = data.speakerName.trim().replace(/\s+/g, '_') || 'Toastmaster_Speaker';
      link.download = `${cleanName}_Poster_${selectedSize.aspectRatio.replace(':', 'x')}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failure occurred: ", error);
      alert("An error occurred during high-quality export. Please verify the photo size and format.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Restore poster details to original Satyajit Jena brand layout?")) {
      setData(INITIAL_POSTER_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans select-none antialiased">
      
      {/* GLOBAL NAVBAR BRANDING */}
      <header className="bg-[#121212] text-white py-3.5 px-6 border-b border-white/10 sticky top-0 z-40 select-none shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-indigo-600 flex items-center justify-center text-white shadow shadow-indigo-500/50">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-sm tracking-widest uppercase leading-none text-white">Toastmasters</span>
              <span className="text-[9px] text-[#818cf8] font-mono font-bold tracking-widest uppercase mt-1">High-Quality Poster Workspace</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 text-[10px] font-mono text-white/50 bg-[#1e1e1e] px-3 py-1.5 rounded border border-white/10">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>STUDIO LIVE PREVIEW</span>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-[#1e1e1e] hover:bg-white/10 border border-white/15 text-white text-xs font-bold rounded transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            Reset Defaults
          </button>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
        
        {/* LEFT COMPONENT COLUMN: LIVE WORKSPACE CANVAS SCREEN */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[500px] lg:min-h-0">
          <div className="bg-[#121212] border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden relative p-4 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]">
            
            {/* WORKSPACE PREVIEW TOOLBAR */}
            <div className="flex items-center justify-between mb-4 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-sm z-10 text-white">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Active Ratio</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-black border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                  {selectedSize.label}
                </span>
                <span className="text-[11px] text-white/50 font-mono hidden md:inline">
                  ({selectedSize.width} × {selectedSize.height} px)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/15 rounded text-[10px] font-mono font-bold text-white/60">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Fit Scale: {(previewScale * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* GROWING INNER CANVAS WRAPPER */}
            <div 
              ref={previewContainerRef}
              className="flex-1 flex items-center justify-center overflow-auto min-h-0 bg-transparent rounded-lg"
            >
              {/* Actual structured live render template */}
              <div className="relative transform-gpu">
                <PosterPreview
                  data={data}
                  theme={selectedTheme}
                  width={selectedSize.width}
                  height={selectedSize.height}
                  scale={previewScale}
                  qrCodeBase64={qrCodeBase64}
                />
              </div>
            </div>

            {/* CORE STATUS MATRICES PANEL */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-white/5 gap-2.5">
              <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-white/40 tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400">RENDER READY</span>
                </div>
                <span>/</span>
                <span>DPI LIMIT: 300</span>
                <span>/</span>
                <span className="hidden sm:inline">COLORSPACE: sRGB / RGB AUTO</span>
                <span className="hidden sm:inline">/</span>
                <span className="text-white/30">COMPILATION: ACTIVE</span>
              </div>
              
              <p className="text-[10px] text-white/40 font-medium">
                💡 Tip: Click inputs in the "Poster Content" sidebar to customize fields.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL CONTROL STATION */}
        <div className="lg:col-span-5 xl:col-span-4 h-full flex flex-col">
          <PosterControls
            data={data}
            onChange={setData}
            sizes={POSTER_SIZES}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            themes={BRAND_THEMES}
            selectedTheme={selectedTheme}
            onThemeChange={(themeId) => setData(prev => ({ ...prev, themeId: themeId as any }))}
            onExport={handleExport}
            isExporting={isExporting}
            onUploadImage={handleUploadImage}
            onReset={handleReset}
          />
        </div>

      </main>

    </div>
  );
}
