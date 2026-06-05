/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrandThemeId = 'classic-navy' | 'burgundy-red' | 'deep-coal' | 'forest-green';

export interface BrandTheme {
  id: BrandThemeId;
  name: string;
  primary: string;       // BG for header/footer, e.g. Navy #004165
  primaryLight: string;  // Light tint for background overlays
  accent: string;        // Maroon/Burgundy for key accents, e.g. Maroon #772432
  highlight: string;     // Yellow/Gold accent, e.g. Gold #F2DF74
  bodyBg: string;        // Light gray background, e.g. #F2F1E8 or #FFFFFF
  textColor: string;     // Primary print text color, e.g. #004165
}

export interface PosterData {
  clubName: string;
  clubTagline: string;
  clubDetails: string;
  sinceYear: string;
  roleTitle: string;
  meetingNumber: string;
  speakerName: string;
  themeLabel: string;
  themeTitle: string;
  speakerImage: string; // base64 or URL
  speakerImageScale: number; // 1.0 - 3.0
  speakerImageX: number; // translation x in %
  speakerImageY: number; // translation y in %
  venueLabel: string;
  venueText: string;
  dateText: string;
  timeText: string;
  qrUrl: string;
  lecternText: string;
  instagram: string;
  website: string;
  phone: string;
  themeId: BrandThemeId;
}

export interface PosterSize {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  label: string;
  description: string;
}
