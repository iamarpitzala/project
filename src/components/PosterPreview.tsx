/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Calendar, Clock, Instagram, Globe, Phone } from 'lucide-react';
import { PosterData, BrandTheme } from '../types';

interface PosterPreviewProps {
  data: PosterData;
  theme: BrandTheme;
  width: number;
  height: number;
  scale: number; // css scale factor to fit standard panels
  qrCodeBase64: string;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  data,
  theme,
  width,
  height,
  scale,
  qrCodeBase64,
}) => {
  // Styles based on active theme
  const primaryBg = { backgroundColor: theme.primary };
  const accentText = { color: theme.accent };
  const accentBg = { backgroundColor: theme.accent };
  const highlightText = { color: theme.highlight };
  const borderHighlight = { borderColor: theme.highlight };
  const bodyStyle = { backgroundColor: theme.bodyBg, color: theme.textColor };
  const primaryText = { color: theme.primary };

  // Helper to split venue or other multi-line content
  const venueLines = data.venueText.split('\n').filter(Boolean);

  // Default elegant SVG logo or uploaded custom logo
  const renderLogo = () => (
    <svg viewBox="0 0 120 120" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md shrink-0 select-none">
      <circle cx="60" cy="60" r="54" fill={theme.primary} stroke={theme.highlight} strokeWidth="3" />
      {/* Globe grid lines */}
      <path d="M60,6 A54,54 0 0,0 60,114 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M60,6 A27,54 0 0,0 60,114 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M60,6 A80,54 0 0,0 60,114 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.2" />
      <path d="M6,60 A54,27 0 0,0 114,60 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M6,60 A54,12 0 0,0 114,60 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
      
      {/* Center banner plate */}
      <rect x="8" y="46" width="104" height="28" fill="#FFFFFF" rx="2" stroke={theme.accent} strokeWidth="1.5" />
      <text x="60" y="58" textAnchor="middle" fill={theme.accent} fontSize="7" fontWeight="bold" fontFamily="Montserrat, sans-serif" letterSpacing="0.4">
        TOASTMASTERS
      </text>
      <text x="60" y="68" textAnchor="middle" fill={theme.primary} fontSize="5" fontWeight="semibold" fontFamily="Montserrat, sans-serif" letterSpacing="0.5">
        INTERNATIONAL
      </text>
    </svg>
  );

  // Render a responsive speaker photo component with custom scale / translation offset sliders
  const renderSpeakerPhoto = () => {
    return (
      <div 
        className="relative w-full h-full border-4 rounded-3xl overflow-hidden shadow-md flex items-center justify-center bg-slate-100"
        style={borderHighlight}
      >
        {data.speakerImage ? (
          <img
            src={data.speakerImage}
            alt={data.speakerName || 'Speaker'}
            className="absolute max-w-none origin-center pointer-events-none select-none transition-all duration-100"
            style={{
              transform: `scale(${data.speakerImageScale}) translate(${data.speakerImageX}%, ${data.speakerImageY}%)`,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full">
            <svg className="w-16 h-16 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs font-semibold text-slate-500 font-sans">No Photo Uploaded</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[80%] font-sans">Click upload control on the sidebar to add a speaker photo</p>
          </div>
        )}
      </div>
    );
  };

  // Render Lectern SVG with Dynamic embedded QR code
  const renderLecternAndQR = () => {
    return (
      <div className="relative w-full h-full max-w-[155px] mx-auto flex items-end">
        <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-md">
          {/* Gooseneck microphone */}
          <path d="M115,40 Q122,22 108,18" fill="none" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M115,40 L118,52" fill="none" stroke="#2D3748" strokeWidth="3.5" />
          <rect x="104" y="14" width="7" height="5" rx="1.5" fill="#1A202C" transform="rotate(15, 107, 16)" />
          
          {/* Podium Top Slanted Plate */}
          <path d="M20,53 L130,53 L120,44 L30,44 Z" fill={theme.primary} />
          
          {/* Podium Header Panel where Club title is written */}
          <path d="M22,53 L128,53 L122,76 L28,76 Z" fill={theme.primary} />
          {/* Custom label written on the Lectern */}
          <text 
            x="75" 
            y="69" 
            textAnchor="middle" 
            fill="#FFFFFF" 
            fontWeight="bold" 
            fontSize="11" 
            letterSpacing="1" 
            fontFamily="Outfit"
          >
            {data.lecternText.toUpperCase()}
          </text>
          
          {/* Podium Columns Main Body (Burgundy Wood columns style) */}
          <path d="M35,76 L115,76 L110,180 L40,180 Z" fill={theme.accent} />
          
          {/* Decorative vertical columns left/right */}
          <path d="M28,76 L35,76 L40,180 L30,180 Z" fill={theme.primary} opacity="0.9" />
          <path d="M115,76 L122,76 L120,180 L110,180 Z" fill={theme.primary} opacity="0.9" />
          
          {/* Base Platform */}
          <path d="M15,180 L135,180 L130,195 L20,195 Z" fill={theme.primary} />
          
          {/* QR Code Background Screen */}
          <rect x="42" y="84" width="66" height="66" rx="3" fill="#FFFFFF" stroke={theme.primary} strokeWidth="1.5" />
        </svg>

        {/* Floating QR Code image inside the rect above */}
        {qrCodeBase64 ? (
          <img 
            src={qrCodeBase64} 
            alt="Dynamic RSVP Link QR code"
            className="absolute rounded"
            style={{
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '56px',
              height: '56px',
            }}
          />
        ) : (
          /* High-quality vector mock QR code while offline or loading */
          <div 
            className="absolute rounded bg-slate-100 flex flex-wrap p-1 gap-0.5 justify-center items-center"
            style={{
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '56px',
              height: '56px',
            }}
          >
            <div className="w-5 h-5 border-2 border-slate-700 m-0.5 rounded-sm flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 bg-slate-700"></div>
            </div>
            <div className="w-5 h-5 border-2 border-slate-700 m-0.5 rounded-sm flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 bg-slate-700"></div>
            </div>
            <div className="w-5 h-5 border-2 border-slate-700 m-0.5 rounded-sm flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 bg-slate-700"></div>
            </div>
            <div className="w-2 h-2 bg-slate-700 self-center"></div>
          </div>
        )}
      </div>
    );
  };

  // 1. Dynamic layout configuration based on aspect ratio selector
  // 4:5 Poster / Flyer Layout
  const renderPortraitLayout = () => (
    <div id="poster-canvas-portrait" className="flex flex-col h-full w-full select-none" style={bodyStyle}>
      {/* MAIN TOP HEADER BAND */}
      <div className="p-8 pb-7 flex items-center justify-between text-white border-b-4 border-amber-300" style={primaryBg}>
        <div className="flex items-center gap-6">
          {renderLogo()}
          <div className="h-14 w-[1px] bg-white/20"></div>
          <div className="flex flex-col text-white">
            <span className="font-serif italic text-[14px] leading-tight opacity-90 select-none">Since</span>
            <span className="font-outfit font-black text-2xl tracking-tight leading-none text-slate-100">{data.sinceYear}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-sm select-none leading-none mb-1">
            {data.clubName}
          </h2>
          <div className="px-3.5 py-1 text-[11px] font-black rounded-md tracking-wider shadow-sm uppercase shrink-0" style={{ backgroundColor: theme.highlight, color: theme.primary }}>
            {data.clubTagline}
          </div>
          <p className="text-[10px] font-outfit mt-2 opacity-80 font-medium tracking-wide">
            {data.clubDetails}
          </p>
        </div>
      </div>

      {/* DOUBLE DECORATIVE THIN STRIP */}
      <div className="h-1.5 w-full" style={{ backgroundColor: theme.highlight }}></div>

      {/* BODY WORKSPACE AREA */}
      <div className="flex-1 px-10 py-10 flex flex-col justify-between">
        {/* UPPER MAIN COMPONENT - ROLE AND SPEAKER */}
        <div className="flex flex-col">
          {/* TITLE HEADER BRAND LINE */}
          <div className="mb-8 select-none">
            <h1 className="font-montserrat font-extrabold text-3xl tracking-[0.2em] uppercase leading-tight select-all" style={primaryText}>
              {data.roleTitle}
            </h1>
            <p className="font-outfit font-black text-[17px] tracking-wide mt-2" style={accentText}>
              Meeting #{data.meetingNumber}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8 items-stretch min-h-[340px]">
            {/* PHOTO LEFT */}
            <div className="col-span-6 flex flex-col h-full">
              <div className="aspect-[4/4.2] w-full flex-1">
                {renderSpeakerPhoto()}
              </div>
            </div>

            {/* SPEAKER DETAILS RIGHT */}
            <div className="col-span-6 flex flex-col justify-center py-2">
              <div className="mb-5 select-all">
                <h3 className="font-montserrat font-black text-3xl tracking-tight uppercase leading-snug" style={primaryText}>
                  {data.speakerName}
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-start">
                <span className="font-outfit font-black text-[11px] tracking-[0.25em] uppercase" style={accentText}>
                  {data.themeLabel}
                </span>
                <span className="font-montserrat font-extrabold text-xl sm:text-2xl tracking-normal uppercase leading-tight mt-2 select-all" style={primaryText}>
                  {data.themeTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE LOGICAL DIVIDER */}
        <div className="my-8 flex items-center justify-center gap-4">
          <div className="h-[1.5px] flex-1 bg-slate-300 opacity-80"></div>
          <div className="w-2.5 h-2.5 rotate-45" style={primaryBg}></div>
          <div className="h-[1.5px] flex-1 bg-slate-300 opacity-80"></div>
        </div>

        {/* BOTTOM METADATA - VENUE/DATE & LECTERN */}
        <div className="grid grid-cols-12 gap-8 items-end">
          {/* CONTACT VENUE AND TIMING */}
          <div className="col-span-8 flex flex-col gap-6 font-outfit select-all">
            {/* VENUE BOX */}
            <div className="flex gap-4 items-start">
              <div className="p-3.5 rounded-2xl shadow-sm text-white flex items-center justify-center" style={primaryBg}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="font-black text-[13px] tracking-wider uppercase mb-1" style={primaryText}>
                  {data.venueLabel}
                </span>
                {venueLines.map((line, i) => (
                  <span key={i} className="text-sm font-medium tracking-wide text-slate-700 leading-tight">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            {/* DATE & TIME BOX */}
            <div className="flex gap-4 items-start">
              <div className="p-3.5 rounded-2xl shadow-sm text-white flex items-center justify-center" style={accentBg}>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="font-black text-[13px] tracking-wider uppercase text-slate-800" style={accentText}>
                  {data.dateText}
                </span>
                <span className="text-sm font-semibold tracking-wide text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> {data.timeText}
                </span>
              </div>
            </div>
          </div>

          {/* BRADDED LECTERN WITH QR CODE */}
          <div className="col-span-4 h-[190px] flex items-end justify-center">
            {renderLecternAndQR()}
          </div>
        </div>
      </div>

      {/* LOWER FOOTER BRAND BAR */}
      <footer className="px-8 py-5 flex items-center justify-between text-white text-[11px] font-bold select-none border-t border-white/10" style={primaryBg}>
        <div className="flex items-center gap-1.5">
          <Instagram className="w-4 h-4 text-amber-200" />
          <span className="tracking-wide text-slate-200">@{data.instagram}</span>
        </div>
        <div className="w-[1.5px] h-4 bg-white/20"></div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-amber-200" />
          <span className="tracking-wide text-slate-200">{data.website}</span>
        </div>
        <div className="w-[1.5px] h-4 bg-white/20"></div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-amber-200" />
          <span className="tracking-wide text-slate-200">{data.phone}</span>
        </div>
      </footer>
    </div>
  );

  // 1:1 Social Feed Layout
  const renderSquareLayout = () => (
    <div id="poster-canvas-square" className="flex flex-col h-full w-full select-none" style={bodyStyle}>
      {/* HEADER BAND */}
      <div className="p-6 flex items-center justify-between text-white border-b-2 border-amber-300" style={primaryBg}>
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 120 120" className="w-12 h-12 drop-shadow-md">
            <circle cx="60" cy="60" r="54" fill={theme.primary} stroke={theme.highlight} strokeWidth="3" />
            <path d="M60,6 A54,54 0 0,0 60,114 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
            <path d="M6,60 A54,27 0 0,0 114,60 Z" fill="none" stroke={theme.highlight} strokeWidth="1" strokeOpacity="0.4" />
            <rect x="10" y="48" width="100" height="24" fill="#FFFFFF" rx="1.5" stroke={theme.accent} strokeWidth="1.2" />
            <text x="60" y="58" textAnchor="middle" fill={theme.accent} fontSize="6" fontWeight="extrabold" fontFamily="Montserrat">TM</text>
            <text x="60" y="66" textAnchor="middle" fill={theme.primary} fontSize="4" fontWeight="bold" fontFamily="Montserrat">GLOBAL</text>
          </svg>
          <div className="flex flex-col">
            <h2 className="font-outfit font-black text-2xl text-white tracking-tight leading-none">
              {data.clubName}
            </h2>
            <p className="text-[9px] font-outfit text-amber-300 font-bold tracking-wider uppercase mt-1">
              {data.clubTagline}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[9px] opacity-75 font-serif italic">Organized since {data.sinceYear}</span>
          <span className="text-[9px] tracking-wide text-slate-300 font-outfit mt-0.5">{data.clubDetails}</span>
        </div>
      </div>

      {/* MAIN CONTAINER GRID */}
      <div className="flex-1 px-8 py-5 flex flex-col justify-between">
        {/* UPPER TITLE */}
        <div className="mb-4">
          <h1 className="font-montserrat font-extrabold text-xl tracking-[0.15em] uppercase leading-none" style={primaryText}>
            {data.roleTitle}
          </h1>
          <p className="font-outfit font-black text-xs tracking-wider mt-1" style={accentText}>
            Meeting #{data.meetingNumber}
          </p>
        </div>

        {/* MID CONTENT GRID */}
        <div className="grid grid-cols-12 gap-5 items-center my-auto flex-1">
          {/* PHOTO */}
          <div className="col-span-5 h-[190px]">
            {renderSpeakerPhoto()}
          </div>

          {/* SPEAKER METADATA */}
          <div className="col-span-7 flex flex-col justify-center pl-2">
            <h3 className="font-montserrat font-black text-2xl tracking-tight uppercase leading-snug" style={primaryText}>
              {data.speakerName}
            </h3>
            <div className="mt-3 flex flex-col">
              <span className="font-outfit font-black text-[9px] tracking-[0.2em] uppercase" style={accentText}>
                {data.themeLabel}
              </span>
              <span className="font-montserrat font-extrabold text-base tracking-normal uppercase leading-tight mt-1 text-slate-800" style={primaryText}>
                {data.themeTitle}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM VENUE & LECTERN */}
        <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-4 items-center">
          <div className="col-span-9 flex flex-col gap-2 font-outfit text-xs">
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" style={primaryText} />
              <span className="text-slate-700 leading-tight font-medium">
                <strong>{data.venueLabel}</strong> {data.venueText.replace(/\n/g, ', ')}
              </span>
            </div>
            <div className="flex gap-2.5 items-start">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" style={accentText} />
              <span className="font-bold shrink-0" style={accentText}>
                {data.dateText} | <span className="font-semibold text-slate-600">{data.timeText}</span>
              </span>
            </div>
          </div>

          {/* QR/LECTERN RIGHT COLS */}
          <div className="col-span-3 h-[110px] flex items-end justify-center">
            {renderLecternAndQR()}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-3 flex items-center justify-between text-white text-[9px] font-bold" style={primaryBg}>
        <span>@{data.instagram}</span>
        <span>{data.website}</span>
        <span>{data.phone}</span>
      </footer>
    </div>
  );

  // 9:16 Tall Story Layout
  const renderStoryLayout = () => (
    <div id="poster-canvas-story" className="flex flex-col h-full w-full select-none" style={bodyStyle}>
      {/* TALL HEADER */}
      <div className="p-8 pt-12 pb-8 flex flex-col items-center justify-center text-center text-white border-b-4 border-amber-300" style={primaryBg}>
        {renderLogo()}
        <h2 className="font-outfit font-black text-2xl tracking-tight text-white mt-4 leading-none">
          {data.clubName}
        </h2>
        <span className="px-3 py-0.5 text-[9px] font-black rounded uppercase mt-2 tracking-widest leading-none shadow-sm" style={{ backgroundColor: theme.highlight, color: theme.primary }}>
          {data.clubTagline}
        </span>
        <p className="text-[9px] opacity-75 font-outfit mt-2 tracking-wide">
          {data.clubDetails} | Since {data.sinceYear}
        </p>
      </div>

      {/* DOUBLE DECORATIVE THIN STRIP */}
      <div className="h-1.5 w-full" style={{ backgroundColor: theme.highlight }}></div>

      {/* STORY MAIN FLOW */}
      <div className="flex-grow px-8 py-10 flex flex-col justify-between">
        {/* ROLE AND TITLE */}
        <div className="text-center select-none">
          <h1 className="font-montserrat font-extrabold text-2xl tracking-[0.16em] uppercase leading-tight" style={primaryText}>
            {data.roleTitle}
          </h1>
          <div className="h-0.5 w-12 bg-amber-500 mx-auto my-3" style={accentBg}></div>
          <p className="font-outfit font-black text-sm tracking-widest uppercase" style={accentText}>
            Meeting #{data.meetingNumber}
          </p>
        </div>

        {/* PHOTO AND CARD - CENTER STAGE */}
        <div className="flex flex-col items-center my-6 flex-1 justify-center max-h-[380px]">
          <div className="aspect-square w-full max-w-[240px]">
            {renderSpeakerPhoto()}
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="text-center px-4 mb-4">
          <h3 className="font-montserrat font-black text-2xl tracking-normal uppercase text-slate-800 leading-snug mb-2" style={primaryText}>
            {data.speakerName}
          </h3>
          <span className="font-outfit font-black text-[9px] tracking-[0.25em] uppercase text-slate-400 block mb-1">
            {data.themeLabel}
          </span>
          <h4 className="font-montserrat font-extrabold text-base tracking-tight uppercase leading-snug text-slate-700" style={primaryText}>
            {data.themeTitle}
          </h4>
        </div>

        {/* METADATA ACCENTS */}
        <div className="grid grid-cols-12 gap-2 border-t border-slate-200/60 pt-6 items-end">
          <div className="col-span-8 flex flex-col gap-3 text-left font-outfit text-xs">
            <div className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={primaryText} />
              <div className="flex flex-col">
                <span className="font-bold text-[10px] tracking-wider uppercase mb-0.5" style={primaryText}>{data.venueLabel}</span>
                <span className="text-[11px] text-slate-600 font-medium leading-tight">{data.venueText.replace(/\n/g, ', ')}</span>
              </div>
            </div>
            <div className="flex gap-2 items-start mt-1">
              <Calendar className="w-4 h-4 mt-0.5 shrink-0" style={accentText} />
              <div className="flex flex-col">
                <span className="font-bold text-[11px] uppercase tracking-wide" style={accentText}>{data.dateText}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{data.timeText}</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 h-[120px] flex items-end justify-center">
            {renderLecternAndQR()}
          </div>
        </div>
      </div>

      {/* STORY FOOTER */}
      <footer className="px-8 py-5 flex items-center justify-between text-white text-[9px] font-bold" style={primaryBg}>
        <span>@{data.instagram}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-300"></div>
        <span>{data.website}</span>
      </footer>
    </div>
  );

  // 16:9 Landscape Layout
  const renderLandscapeLayout = () => (
    <div id="poster-canvas-landscape" className="flex flex-col h-full w-full select-none" style={bodyStyle}>
      {/* HEADER BAR */}
      <div className="p-5 px-8 flex items-center justify-between text-white border-b-2 border-amber-300" style={primaryBg}>
        <div className="flex items-center gap-4">
          {renderLogo()}
          <div className="flex flex-col pl-4 border-l border-white/20">
            <h2 className="font-outfit font-black text-2xl text-white tracking-tight leading-none">
              {data.clubName}
            </h2>
            <p className="text-[10px] font-bold tracking-wider uppercase text-amber-300 mt-1">
              {data.clubTagline}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-outfit opacity-80 leading-relaxed font-semibold">
            {data.clubDetails} | Since {data.sinceYear}
          </p>
        </div>
      </div>

      {/* CORE WORKSPACE COLS */}
      <div className="flex-1 px-8 py-5 grid grid-cols-12 gap-6 items-stretch">
        {/* COLUMN 1: PHOTO */}
        <div className="col-span-3 flex flex-col justify-center">
          <div className="aspect-[4/4.5] w-full max-h-[190px]">
            {renderSpeakerPhoto()}
          </div>
        </div>

        {/* COLUMN 2: SPEAKER & TITLE DETAILS */}
        <div className="col-span-5 flex flex-col justify-center border-r border-slate-200/80 pr-4">
          <div className="mb-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.12em] text-slate-400 block">ROLE PROFILE</span>
            <h1 className="font-montserrat font-extrabold text-lg tracking-wider uppercase leading-none" style={primaryText}>
              {data.roleTitle}
            </h1>
            <p className="font-outfit font-black text-xs text-rose-700 mt-0.5" style={accentText}>
              Meeting #{data.meetingNumber}
            </p>
          </div>

          <div className="my-2 h-[1px] bg-slate-100"></div>

          <div>
            <h3 className="font-montserrat font-black text-xl tracking-tight uppercase leading-snug" style={primaryText}>
              {data.speakerName}
            </h3>
            <div className="mt-2.5 flex flex-col">
              <span className="font-outfit font-bold text-[9px] tracking-[0.15em] uppercase text-slate-400 leading-none" style={accentText}>
                {data.themeLabel}
              </span>
              <span className="font-montserrat font-bold text-sm tracking-normal uppercase leading-tight mt-1 text-slate-800" style={primaryText}>
                {data.themeTitle}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: METADATA & LECTERN */}
        <div className="col-span-4 grid grid-cols-12 gap-3 items-end">
          <div className="col-span-7 flex flex-col gap-3 font-outfit text-xs self-center">
            <div className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" style={primaryText} />
              <div className="flex flex-col">
                <span className="font-black text-[9px] uppercase tracking-wider mb-0.5" style={primaryText}>{data.venueLabel}</span>
                <span className="text-[10px] text-slate-600 leading-tight font-medium">{data.venueText.replace(/\n/g, ', ')}</span>
              </div>
            </div>
            <div className="flex gap-2 items-start mt-1">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" style={accentText} />
              <div className="flex flex-col">
                <span className="font-extrabold text-[10px] uppercase text-slate-800 leading-none" style={accentText}>{data.dateText}</span>
                <span className="text-[9px] text-slate-500 font-semibold mt-1">{data.timeText}</span>
              </div>
            </div>
          </div>

          <div className="col-span-5 h-[140px] flex items-end justify-center">
            {renderLecternAndQR()}
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <footer className="p-3 px-8 flex items-center justify-between text-white text-[9px] font-bold mt-auto" style={primaryBg}>
        <div className="flex gap-1 items-center">
          <Instagram className="w-3.5 h-3.5 text-amber-200" />
          <span>@{data.instagram}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Globe className="w-3.5 h-3.5 text-amber-200" />
          <span>{data.website}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Phone className="w-3.5 h-3.5 text-amber-200" />
          <span>{data.phone}</span>
        </div>
      </footer>
    </div>
  );

  // Auto route rendering to selected layout
  const renderSelectedLayout = () => {
    // Check dimensions to choose correct layout algorithm
    const ratio = width / height;
    if (Math.abs(ratio - (4/5)) < 0.1) {
      return renderPortraitLayout();
    } else if (Math.abs(ratio - (1/1)) < 0.1) {
      return renderSquareLayout();
    } else if (Math.abs(ratio - (9/16)) < 0.1) {
      return renderStoryLayout();
    } else {
      return renderLandscapeLayout();
    }
  };

  return (
    <div 
      className="relative shadow-2xl rounded-2xl overflow-hidden origin-top-left transition-all duration-300 pointer-events-auto select-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        margin: '0 auto',
      }}
    >
      {renderSelectedLayout()}
    </div>
  );
};
