/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { PosterData, BrandTheme } from '../types';

import portraitTemplate  from '../poster-template.html?raw';
import squareTemplate    from '../poster-template-square.html?raw';
import storyTemplate     from '../poster-template-story.html?raw';
import landscapeTemplate from '../poster-template-landscape.html?raw';

// Import the SVG as a raw string, then encode to a data URI so it works
// inside the sandboxed iframe (which has null origin and cannot fetch files).
import tmLogoRaw from '../../assets/TMLogo.svg?raw';
const tmLogoUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(tmLogoRaw)))}`;


interface PosterPreviewProps {
  data: PosterData;
  theme: BrandTheme;
  width: number;
  height: number;
  scale: number;
  qrCodeBase64: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function selectTemplate(width: number, height: number): string {
  const r = width / height;
  if (Math.abs(r - 4 / 5)  < 0.1) return portraitTemplate;
  if (Math.abs(r - 1 / 1)  < 0.1) return squareTemplate;
  if (Math.abs(r - 9 / 16) < 0.1) return storyTemplate;
  return landscapeTemplate;
}

/** Build every variable value we expose to the template. */
function buildVars(
  data: PosterData,
  theme: BrandTheme,
  qrCodeBase64: string,
): Record<string, string> {
  const venueInline = data.venueText.replace(/\n/g, ', ');
  const venueLines  = data.venueText
    .split('\n').filter(Boolean)
    .map((l) => `<span>${l}</span>`).join('\n');
  const qrSrc = qrCodeBase64 ||
    (data.qrUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.qrUrl)}`
      : '');
  const speakerImageTransform =
    `scale(${data.speakerImageScale}) translate(${data.speakerImageX}%, ${data.speakerImageY}%)`;

  return {
    clubName: data.clubName, clubTagline: data.clubTagline,
    clubDetails: data.clubDetails, sinceYear: data.sinceYear,
    roleTitle: data.roleTitle, meetingNumber: data.meetingNumber,
    speakerName: data.speakerName, speakerImage: data.speakerImage || '',
    speakerImageTransform,
    themeLabel: data.themeLabel, themeTitle: data.themeTitle,
    venueLabel: data.venueLabel, venueTextFormatted: venueLines,
    venueInline, dateText: data.dateText, timeText: data.timeText,
    lecternText: data.lecternText.toUpperCase(),
    qrCodeUrl: qrSrc,
    instagram: data.instagram, website: data.website, phone: data.phone,
    // theme colours
    primaryColor: theme.primary, accentColor: theme.accent,
    highlightColor: theme.highlight, bodyBgColor: theme.bodyBg,
    textColor: theme.textColor,
    // static assets
    tmLogoUrl,
  };
}

/** Replace {{tokens}} in a template string with values from the vars map. */
function applyVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

/** Build the full initial HTML — tokens replaced + theme injected. */
function buildInitialHtml(
  template: string,
  vars: Record<string, string>,
  theme: BrandTheme,
): string {
  // ① Patch hard-coded SVG colours on the RAW template FIRST —
  //    before vars are substituted, so the base64 data-URI for the
  //    logo image is never touched by these regexes.
  let patched = template
    .replace(/fill="#004165"/g,   `fill="${theme.primary}"`)
    .replace(/fill="#772432"/g,   `fill="${theme.accent}"`)
    .replace(/stroke="#004165"/g, `stroke="${theme.primary}"`)
    .replace(/stroke="#772432"/g, `stroke="${theme.accent}"`)
    .replace(/fill="#F2DF74"/g,   `fill="${theme.highlight}"`)
    .replace(/stroke="#F2DF74"/g, `stroke="${theme.highlight}"`)
    .replace(/color: var\(--highlight\)/g, `color:${theme.highlight}`);

  // ② Now substitute {{token}} values (including the large logo data-URI)
  let html = applyVars(patched, vars);

  // Theme CSS-variable override block
  const themeStyle = `<style id="theme-override">:root{` +
    `--primary:${theme.primary};--accent:${theme.accent};` +
    `--highlight:${theme.highlight};--body-bg:${theme.bodyBg};` +
    `--text:${theme.textColor};}</style>`;

  // Live-patch script — receives postMessage({type:'patch', vars, theme}) and
  // updates only the changed DOM nodes without reloading the page.
  const patchScript = `<script id="patch-bridge">
(function(){
  // Map token name → list of [element selector, attribute|'innerHTML'|'style.xxx']
  var TEXT_NODES = {
    clubName:    [['[data-var="clubName"]',    'innerHTML']],
    clubTagline: [['[data-var="clubTagline"]', 'innerHTML']],
    clubDetails: [['[data-var="clubDetails"]', 'innerHTML']],
    sinceYear:   [['[data-var="sinceYear"]',   'innerHTML']],
    roleTitle:   [['[data-var="roleTitle"]',   'innerHTML']],
    meetingNumber:[['[data-var="meetingNumber"]','innerHTML']],
    speakerName: [['[data-var="speakerName"]', 'innerHTML']],
    themeLabel:  [['[data-var="themeLabel"]',  'innerHTML']],
    themeTitle:  [['[data-var="themeTitle"]',  'innerHTML']],
    venueLabel:  [['[data-var="venueLabel"]',  'innerHTML']],
    venueTextFormatted:[['[data-var="venueTextFormatted"]','innerHTML']],
    venueInline: [['[data-var="venueInline"]', 'innerHTML']],
    dateText:    [['[data-var="dateText"]',    'innerHTML']],
    timeText:    [['[data-var="timeText"]',    'innerHTML']],
    lecternText: [['[data-var="lecternText"]', 'innerHTML'],
                  ['[data-var="lecternTextSvg"]','innerHTML']],
    instagram:   [['[data-var="instagram"]',   'innerHTML']],
    website:     [['[data-var="website"]',     'innerHTML']],
    phone:       [['[data-var="phone"]',       'innerHTML']],
  };

  window.addEventListener('message', function(e){
    if (!e.data || e.data.type !== 'patch') return;
    var v = e.data.vars;
    var t = e.data.theme;

    // --- text / html nodes ---
    Object.keys(TEXT_NODES).forEach(function(key){
      if (!(key in v)) return;
      TEXT_NODES[key].forEach(function(pair){
        var el = document.querySelector(pair[0]);
        if (el) el.innerHTML = v[key];
      });
    });

    // --- speaker photo ---
    if ('speakerImage' in v) {
      var img = document.querySelector('[data-var="speakerImage"]');
      if (img) img.setAttribute('src', v.speakerImage);
    }

    // --- photo transform (zoom + offset) ---
    if ('speakerImageTransform' in v) {
      var pImg = document.querySelector('[data-var="speakerImage"]');
      if (pImg) pImg.style.transform = v.speakerImageTransform;
    }

    // --- QR code ---
    if ('qrCodeUrl' in v) {
      var qr = document.querySelector('[data-var="qrCodeUrl"]');
      if (qr) qr.setAttribute('src', v.qrCodeUrl);
    }

    // --- theme CSS variables ---
    if (t) {
      var root = document.documentElement;
      root.style.setProperty('--primary',   t.primary);
      root.style.setProperty('--accent',    t.accent);
      root.style.setProperty('--highlight', t.highlight);
      root.style.setProperty('--body-bg',   t.bodyBg);
      root.style.setProperty('--text',      t.textColor);
      // Also repaint SVG elements that use hard-coded hex colours
      document.querySelectorAll('[data-theme-primary]').forEach(function(el){
        el.setAttribute('fill', t.primary);
      });
      document.querySelectorAll('[data-theme-accent]').forEach(function(el){
        el.setAttribute('fill', t.accent);
      });
      document.querySelectorAll('[data-theme-highlight]').forEach(function(el){
        el.setAttribute('fill',   t.highlight);
        el.setAttribute('stroke', t.highlight);
      });
    }

    // Signal readiness back to parent
    window.parent.postMessage({type:'patch-done'}, '*');
  });
})();
<\/script>`;

  html = html.replace('</head>', `${themeStyle}\n${patchScript}\n</head>`);
  return html;
}

// ─── Add data-var attributes to every template token so the patch script
//     can find them without parsing HTML. We do this by converting
//     each interpolated value into a wrapper span with data-var.
//
//     IMPORTANT: this must happen BEFORE applyVars so the attributes are
//     present in the final HTML.  We wrap with a <span data-var="key">value</span>
//     for text tokens, and add data-var="key" directly on img/svg attributes.
function wrapTokensWithDataAttrs(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const val = vars[key] ?? '';
    // For src attributes we can't wrap in a span — emit the value plus a sibling attr
    // Instead we convert to a different pattern handled below.
    return val;
  });
}

// ─── Annotate template HTML so runtime patching can target nodes.
//     We add data-var attributes to elements that carry dynamic text,
//     and to img/svg elements for src / transform attributes.
function annotateTemplate(template: string): string {
  // Text containers — wrap content between token markers with data-var spans
  // We do this by rewriting the template BEFORE token substitution.
  return template
    // Text-content tokens: replace {{key}} that appear as element content
    // with a <span data-var="key">{{key}}</span> wrapper
    .replace(
      /(<(?:span|div|p|h[1-6]|text)[^>]*>)\s*\{\{(clubName|clubTagline|clubDetails|sinceYear|roleTitle|meetingNumber|speakerName|themeLabel|themeTitle|venueLabel|venueTextFormatted|venueInline|dateText|timeText|lecternText|instagram|website|phone)\}\}\s*(<\/)/g,
      (_, open, key, close) => `${open}<span data-var="${key}">{{${key}}}</span>${close}`,
    )
    // SVG <text> content (can't nest <span> in SVG text)
    .replace(
      /(<text[^>]*>)\s*\{\{(lecternText)\}\}\s*(<\/text>)/g,
      (_, open, key, close) =>
        `${open}<tspan data-var="${key}Svg">{{${key}}}</tspan>${close}`,
    )
    // img src attribute
    .replace(
      /(<img\b[^>]*)\bsrc=["']\{\{speakerImage\}\}["']/g,
      '$1src="{{speakerImage}}" data-var="speakerImage"',
    )
    // img style transform
    .replace(
      /(<img\b[^>]*)\bstyle=["']transform:\s*\{\{speakerImageTransform\}\};["']/g,
      '$1style="transform:{{speakerImageTransform}};" data-var="speakerImage"',
    )
    // QR img src
    .replace(
      /(<img\b[^>]*class=["']qr-img["'][^>]*)\bsrc=["']\{\{qrCodeUrl\}\}["']/g,
      '$1src="{{qrCodeUrl}}" data-var="qrCodeUrl"',
    );
}

// ─── Component ───────────────────────────────────────────────────────────────
export const PosterPreview: React.FC<PosterPreviewProps> = ({
  data, theme, width, height, scale, qrCodeBase64,
}) => {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const mountedRef = useRef(false); // true once iframe has loaded for the first time
  const prevKeyRef = useRef('');    // tracks template key (ratio) to detect template switches

  // Key that identifies which template is active — changes on ratio switch
  const templateKey = `${width}x${height}`;

  // Full initial HTML — rebuilt only when the template itself changes (ratio switch)
  // or on first render.
  const initialHtml = useMemo(() => {
    const template  = selectTemplate(width, height);
    const annotated = annotateTemplate(template);
    const vars      = buildVars(data, theme, qrCodeBase64);
    return buildInitialHtml(annotated, vars, theme);
    // Intentionally NOT listing data/theme/qrCodeBase64 — those are handled via postMessage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // Patch function — sends only vars + theme to the live iframe
  const sendPatch = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !mountedRef.current) return;
    const vars = buildVars(data, theme, qrCodeBase64);
    iframe.contentWindow.postMessage({ type: 'patch', vars, theme }, '*');
  }, [data, theme, qrCodeBase64]);

  // When the template key changes we need a full reload (srcDoc swap).
  // Reset mountedRef so we don't try to patch before the new page is ready.
  useEffect(() => {
    if (prevKeyRef.current !== templateKey) {
      mountedRef.current = false;
      prevKeyRef.current = templateKey;
    }
  }, [templateKey]);

  // After each data/theme change, send a patch — but only if already mounted.
  useEffect(() => {
    if (mountedRef.current) {
      sendPatch();
    }
  }, [sendPatch]);

  // When the iframe finishes loading (either initial or after srcDoc swap),
  // mark as mounted and do an immediate patch to sync current state.
  const handleLoad = useCallback(() => {
    mountedRef.current = true;
    sendPatch();
  }, [sendPatch]);

  const scaledWidth  = width  * scale;
  const scaledHeight = height * scale;

  return (
    <div style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px`, flexShrink: 0 }}>
      <div
        style={{
          width: `${width}px`, height: `${height}px`,
          transform: `scale(${scale})`, transformOrigin: 'top left',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        <iframe
          ref={iframeRef}
          key={templateKey}       // forces DOM remount only on ratio switch
          title="poster-preview"
          srcDoc={initialHtml}
          onLoad={handleLoad}
          style={{ width: `${width}px`, height: `${height}px`, border: 'none', display: 'block' }}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};
