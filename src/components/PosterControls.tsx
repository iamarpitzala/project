/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  SlidersHorizontal, Sparkles, MapPin, 
  Settings, User, Landmark, HelpCircle, 
  Download, Image, ArrowRightLeft, RefreshCw, Layers
} from 'lucide-react';
import { PosterData, PosterSize, BrandTheme } from '../types';

interface PosterControlsProps {
  data: PosterData;
  onChange: (newData: PosterData) => void;
  sizes: PosterSize[];
  selectedSize: PosterSize;
  onSizeChange: (size: PosterSize) => void;
  themes: BrandTheme[];
  selectedTheme: BrandTheme;
  onThemeChange: (themeId: string) => void;
  onExport: (format: 'png' | 'jpeg', scaleMultiplier: number) => void;
  isExporting: boolean;
  onUploadImage: (file: File) => void;
  onReset: () => void;
}

export const PosterControls: React.FC<PosterControlsProps> = ({
  data,
  onChange,
  sizes,
  selectedSize,
  onSizeChange,
  themes,
  selectedTheme,
  onThemeChange,
  onExport,
  isExporting,
  onUploadImage,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('design');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    speaker: true,
    club: false,
    venue: false,
    rsvp: false,
    contact: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFieldChange = (field: keyof PosterData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', val: number) => {
    const minVal = 300;
    const maxVal = 3000;
    const cleanVal = Math.min(Math.max(val, minVal), maxVal);
    onSizeChange({
      ...selectedSize,
      id: 'custom',
      name: 'Custom Dimensions',
      [dimension]: cleanVal,
      aspectRatio: '1:1', // dynamic fallback
      description: 'Custom set dimensions by user.'
    });
  };

  return (
    <div className="bg-[#1a1a1a] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full font-sans">
      
      {/* HEADER CONTROLS TABS */}
      <div className="flex border-b border-white/10 bg-[#121212]">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-4 px-4 text-center font-bold text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
            activeTab === 'design' 
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-[#1a1a1a]' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          Layout & Design
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-4 px-4 text-center font-bold text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
            activeTab === 'content' 
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-[#1a1a1a]' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Poster Content
        </button>
      </div>

      {/* CORE CONTROLLER BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* ======================================= */}
        {/* DESIGN TAB: COVERING SIZES AND THEMES */}
        {/* ======================================= */}
        {activeTab === 'design' && (
          <div className="space-y-6 animate-fade-in text-white">
            {/* BRAND THEMES */}
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">
                1. Select Brand Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => {
                  const isSelected = t.id === selectedTheme.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onThemeChange(t.id)}
                      className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-[85px] leading-snug group ${
                        isSelected 
                          ? 'border-indigo-500 ring-1 ring-indigo-500/30 bg-indigo-650/10' 
                          : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-black/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: t.primary }} />
                        <span className="font-extrabold text-[11px] text-white leading-none">{t.name}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <span className="w-5 h-3.5 rounded-sm shadow-inner" style={{ backgroundColor: t.primary }} title="Primary Theme Color" />
                        <span className="w-5 h-3.5 rounded-sm shadow-inner" style={{ backgroundColor: t.accent }} title="Accent Burgundy Color" />
                        <span className="w-5 h-3.5 rounded-sm shadow-inner" style={{ backgroundColor: t.highlight }} title="Highlight Yellow Color" />
                        <span className="w-5 h-3.5 rounded-sm shadow-inner" style={{ backgroundColor: t.bodyBg }} title="Cream Backdrop" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRESET DIMENSIONS */}
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">
                2. Poster Preset Sizes
              </label>
              <div className="space-y-2.5">
                {sizes.map((s) => {
                  const isSelected = selectedSize.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSizeChange(s)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                        isSelected 
                          ? 'border-indigo-500 bg-[#252529]/60 ring-1 ring-indigo-500/20' 
                          : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-[#252529]/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/65'} shrink-0`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex justify-between items-center leading-none">
                          <span className="font-bold text-xs text-white">{s.name}</span>
                          <span className="text-[9px] font-mono text-white/60 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-black">
                            {s.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-1 leading-normal">{s.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM DIMENSIONS WORKSHOP */}
            <div className="bg-[#121212] border border-white/10 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  Custom Dimensions Editor
                </span>
                <span className="text-[10px] text-white/40 font-medium">Auto-responsive scaling</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold tracking-wider text-white/40 mb-1">Width (Pixels)</label>
                  <input
                    type="number"
                    value={selectedSize.width}
                    onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-white/20 rounded bg-black/40 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="300"
                    max="3000"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold tracking-wider text-white/40 mb-1">Height (Pixels)</label>
                  <input
                    type="number"
                    value={selectedSize.height}
                    onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-white/20 rounded bg-black/40 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="300"
                    max="3000"
                  />
                </div>
              </div>
              <p className="text-[9px] text-white/30 leading-normal italic text-center">
                Min: 300px, Max: 3000px. Proportional design matches elements automatically.
              </p>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* CONTENT TAB: MODIFY POSTER INFORMATION */}
        {/* ======================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4 animate-fade-in text-white/90">
            
            {/* SECTION 1: SPEAKER DETAILS */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-sm">
              <button
                onClick={() => toggleSection('speaker')}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-wide">
                  <User className="w-4 h-4 text-indigo-400" />
                  Speaker & Topic
                </div>
                <span className="text-white/40 text-md leading-none">{openSections.speaker ? '−' : '+'}</span>
              </button>

              {openSections.speaker && (
                <div className="p-4 border-t border-white/10 space-y-4 bg-transparent">
                  {/* Photo Workspace */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">
                      Speaker Portrait Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative overflow-hidden w-14 h-14 bg-black/30 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/40 group cursor-pointer hover:border-indigo-500 transition-colors">
                        {data.speakerImage ? (
                          <img src={data.speakerImage} className="w-full h-full object-cover rounded-xl" alt="Preview" referrerPolicy="no-referrer" />
                        ) : (
                          <Image className="w-4 h-4 opacity-70 group-hover:scale-105 transition" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="relative inline-block">
                          <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold rounded hover:border-indigo-500 transition flex items-center gap-1.5 shrink-0">
                            <Image className="w-3.5 h-3.5 text-indigo-400" />
                            Upload Photo
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">Upload portrait image (Square aspects work great)</p>
                      </div>
                    </div>

                    {/* Cropping sliders setup */}
                    {data.speakerImage && (
                      <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-2.5">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Image Fine-Tuning</span>
                        
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1">
                            <span>Zoom Magnify</span>
                            <span className="text-indigo-400">{data.speakerImageScale.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="1.0"
                            max="3.0"
                            step="0.1"
                            value={data.speakerImageScale}
                            onChange={(e) => handleFieldChange('speakerImageScale', parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none accent-indigo-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1">
                            <span>X Translation Offset</span>
                            <span className="text-indigo-400">{data.speakerImageX > 0 ? `+${data.speakerImageX}` : data.speakerImageX}%</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={data.speakerImageX}
                            onChange={(e) => handleFieldChange('speakerImageX', parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none accent-indigo-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1">
                            <span>Y Translation Offset</span>
                            <span className="text-indigo-400">{data.speakerImageY > 0 ? `+${data.speakerImageY}` : data.speakerImageY}%</span>
                          </div>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            step="1"
                            value={data.speakerImageY}
                            onChange={(e) => handleFieldChange('speakerImageY', parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none accent-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Speaker Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Speaker Name
                    </label>
                    <input
                      type="text"
                      value={data.speakerName}
                      onChange={(e) => handleFieldChange('speakerName', e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-extrabold"
                      placeholder="e.g. SATYAJIT JENA"
                    />
                  </div>

                  {/* Theme Category Label */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Theme Section Title
                    </label>
                    <input
                      type="text"
                      value={data.themeLabel}
                      onChange={(e) => handleFieldChange('themeLabel', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                      placeholder="e.g. THEME:"
                    />
                  </div>

                  {/* Theme Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Theme / Topic Text
                    </label>
                    <textarea
                      value={data.themeTitle}
                      onChange={(e) => handleFieldChange('themeTitle', e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors h-16 uppercase leading-relaxed resize-none font-bold"
                      placeholder="e.g. THE TRAVELS THROUGH..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: CLUB & ROLES */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-sm">
              <button
                onClick={() => toggleSection('club')}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-wide">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  Club Branding Details
                </div>
                <span className="text-white/40 text-md leading-none">{openSections.club ? '−' : '+'}</span>
              </button>

              {openSections.club && (
                <div className="p-4 border-t border-white/10 space-y-4 bg-transparent">
                  {/* Club Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 font-sans">
                      Toastmasters Club Name
                    </label>
                    <input
                      type="text"
                      value={data.clubName}
                      onChange={(e) => handleFieldChange('clubName', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-extrabold"
                    />
                  </div>

                  {/* Slogan Tagline */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Club Tagline
                    </label>
                    <input
                      type="text"
                      value={data.clubTagline}
                      onChange={(e) => handleFieldChange('clubTagline', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-bold"
                    />
                  </div>

                  {/* Toastmaster Role */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Role Headline
                    </label>
                    <input
                      type="text"
                      value={data.roleTitle}
                      onChange={(e) => handleFieldChange('roleTitle', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Club Details tag */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Club Registration/Territory Info
                    </label>
                    <input
                      type="text"
                      value={data.clubDetails}
                      onChange={(e) => handleFieldChange('clubDetails', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Double numerical metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Meeting ID #
                      </label>
                      <input
                        type="text"
                        value={data.meetingNumber}
                        onChange={(e) => handleFieldChange('meetingNumber', e.target.value)}
                        className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                        Founded Since
                      </label>
                      <input
                        type="text"
                        value={data.sinceYear}
                        onChange={(e) => handleFieldChange('sinceYear', e.target.value)}
                        className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-bold"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: VENUE & SCHEDULE */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-sm">
              <button
                onClick={() => toggleSection('venue')}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  Venue & Schedule Details
                </div>
                <span className="text-white/40 text-md leading-none">{openSections.venue ? '−' : '+'}</span>
              </button>

              {openSections.venue && (
                <div className="p-4 border-t border-white/10 space-y-4 bg-transparent">
                  {/* Venue label */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Venue Header Label
                    </label>
                    <input
                      type="text"
                      value={data.venueLabel}
                      onChange={(e) => handleFieldChange('venueLabel', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Venue Text area */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Venue Address Location (use newline for splits)
                    </label>
                    <textarea
                      value={data.venueText}
                      onChange={(e) => handleFieldChange('venueText', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors h-20 leading-relaxed resize-none"
                      placeholder="e.g. Training Room, GIFT City Fire Station..."
                    />
                  </div>

                  {/* Scheduled date */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Meeting Date
                    </label>
                    <input
                      type="text"
                      value={data.dateText}
                      onChange={(e) => handleFieldChange('dateText', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-bold"
                    />
                  </div>

                  {/* Scheduled timing */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Meeting Time Slot
                    </label>
                    <input
                      type="text"
                      value={data.timeText}
                      onChange={(e) => handleFieldChange('timeText', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: RSVP & LECTERN */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-sm">
              <button
                onClick={() => toggleSection('rsvp')}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-wide">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  RSVP QR Link & Lectern Text
                </div>
                <span className="text-white/40 text-md leading-none">{openSections.rsvp ? '−' : '+'}</span>
              </button>

              {openSections.rsvp && (
                <div className="p-4 border-t border-white/10 space-y-4 bg-transparent">
                  {/* Lectern Text */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 font-sans">
                      Lectern Plate Text
                    </label>
                    <input
                      type="text"
                      value={data.lecternText}
                      onChange={(e) => handleFieldChange('lecternText', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors font-bold"
                      maxLength={15}
                    />
                  </div>

                  {/* QR Link */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      QR Target URL (For Scan RSVP)
                    </label>
                    <input
                      type="url"
                      value={data.qrUrl}
                      onChange={(e) => handleFieldChange('qrUrl', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors text-white/90"
                    />
                    <p className="text-[10px] text-white/40 mt-1 leading-normal">
                      The scan box inside the lectern updates instantly to direct smartphones to this scan target.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: CONTACTS FOOTER */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 shadow-sm">
              <button
                onClick={() => toggleSection('contact')}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2 text-white font-bold text-[12px] uppercase tracking-wide">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  Footer Contacts / Socials
                </div>
                <span className="text-white/40 text-md leading-none">{openSections.contact ? '−' : '+'}</span>
              </button>

              {openSections.contact && (
                <div className="p-4 border-t border-white/10 space-y-4 bg-transparent">
                  {/* Instagram handle */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Instagram Handle
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-white/25 bg-white/5 text-white/60 text-xs">@</span>
                      <input
                        type="text"
                        value={data.instagram}
                        onChange={(e) => handleFieldChange('instagram', e.target.value)}
                        className="flex-1 min-w-0 bg-black/40 border border-white/20 text-white rounded-r px-3 py-2 text-xs focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Website link */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 font-sans">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={data.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Call phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
                      Contact Phone Node
                    </label>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="w-full bg-black/40 border border-white/20 text-white rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ======================================= */}
      {/* EXPORT WORKSHOP ACTION PANEL */}
      {/* ======================================= */}
      <div className="p-5 bg-[#121212] border-t border-white/10 space-y-3.5">
        <label className="block text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">
          3. Download & Export Settings
        </label>
        
        {/* Export trigger Multipliers (1x normal, 2x Crisp retina, 3x Print Ready) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onExport('png', 2)}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg shadow-lg hover:shadow-indigo-550/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            Download PNG (2x)
          </button>
          
          <button
            onClick={() => onExport('jpeg', 3)}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-white text-black hover:bg-indigo-400 hover:text-white font-extrabold text-xs rounded-lg shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download JPEG (3x)
          </button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onReset}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <span className="text-[9px] text-white/40 font-medium">Auto-ready rendering output.</span>
        </div>
      </div>

    </div>
  );
};
