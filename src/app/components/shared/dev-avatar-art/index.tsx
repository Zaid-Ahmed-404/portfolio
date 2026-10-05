/**
 * An animated SVG of the developer avatar (the same character as three/dev-avatar):
 * he blinks, his head sways, the code window behind him scrolls and glyphs float.
 * Used in About and as the hero's fallback when WebGL is unavailable.
 * Decorative only; motion stops under prefers-reduced-motion (see globals.css).
 */

const SKIN = "#c98d68";
const HAIR = "#1c1512";
const HOODIE = "#26262c";
const DARK = "#0e0e10";

/** [x, width, color] per token, one row per line of "code". */
const CODE: [number, number, string][][] = [
  [[0, 34, "var(--accent)"], [40, 60, "#fafaf9"]],
  [[14, 44, "#ffb347"], [64, 30, "#a8a29e"], [100, 40, "#fafaf9"]],
  [[14, 70, "#fcd9b6"]],
  [[28, 40, "var(--accent)"], [74, 64, "#ffb347"]],
  [[28, 30, "#fafaf9"], [64, 52, "#a8a29e"]],
  [[14, 24, "var(--accent)"]],
  [[0, 50, "#ffb347"], [56, 44, "#fafaf9"], [106, 30, "#fcd9b6"]],
  [[14, 60, "#a8a29e"]],
];

const DevAvatarArt = ({ className = "" }: { className?: string }) => (
  <div aria-hidden className={`dev-art ${className}`}>
    <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid meet" className="h-full w-full overflow-visible">
      <defs>
        <clipPath id="dev-art-code-clip">
          <rect x="52" y="78" width="196" height="104" />
        </clipPath>
        <radialGradient id="dev-art-glow" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="330" rx="190" ry="150" fill="url(#dev-art-glow)" />

      {/* Code window behind him */}
      <g className="dev-art-panel">
        <rect x="40" y="40" width="220" height="152" rx="14" fill="rgba(14,11,10,0.86)" stroke="var(--accent)" strokeWidth="2" />
        <rect x="41" y="41" width="218" height="24" rx="13" fill="rgba(234,88,12,0.18)" />
        <circle cx="58" cy="53" r="4.5" fill="#ff5f57" />
        <circle cx="73" cy="53" r="4.5" fill="#febc2e" />
        <circle cx="88" cy="53" r="4.5" fill="#28c840" />
        <g clipPath="url(#dev-art-code-clip)">
          <g className="dev-art-code">
            {[0, 1].map((copy) =>
              CODE.map((row, i) =>
                row.map(([x, w, c], j) => (
                  <rect key={`${copy}-${i}-${j}`} x={56 + x} y={82 + (copy * CODE.length + i) * 16} width={w} height="7" rx="3.5" fill={c} opacity="0.85" />
                ))
              )
            )}
          </g>
        </g>
      </g>

      {/* Body: hoodie, hood, drawstrings */}
      <path d="M70 480 C70 382 128 338 200 338 C272 338 330 382 330 480 Z" fill={HOODIE} />
      <path d="M132 350 C150 330 250 330 268 350 C250 372 150 372 132 350 Z" fill="#1d1d22" />
      <path d="M186 362 L183 410 M214 362 L217 410" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      <rect x="176" y="296" width="48" height="56" rx="18" fill={SKIN} />

      {/* Head */}
      <g className="dev-art-head">
        <ellipse cx="129" cy="246" rx="11" ry="18" fill={SKIN} />
        <ellipse cx="271" cy="246" rx="11" ry="18" fill={SKIN} />
        <ellipse cx="200" cy="238" rx="72" ry="80" fill={SKIN} />
        {/* Hair */}
        <path d="M127 236 C110 158 150 120 204 122 C260 122 296 160 274 236 C270 210 262 192 246 184 C222 194 178 194 156 182 C140 194 132 210 127 236 Z" fill={HAIR} />
        <path d="M146 176 C156 128 236 112 266 160 C238 144 192 146 146 176 Z" fill="#2a201b" />
        {/* Beard + moustache + smile */}
        <path d="M129 248 C132 306 168 322 200 322 C232 322 268 306 271 248 C262 280 240 292 200 292 C160 292 138 280 129 248 Z" fill={HAIR} />
        <path d="M182 270 C192 264 208 264 218 270 C208 268 192 268 182 270 Z" fill={HAIR} stroke={HAIR} strokeWidth="3" strokeLinejoin="round" />
        <path className="dev-art-smile" d="M180 280 C190 295 210 295 220 280" stroke="#7d3a2b" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <path d="M200 236 C196 250 194 256 202 258" stroke="#a46f50" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Brows + eyes */}
        <path d="M155 208 Q170 198 187 205 M213 205 Q230 198 245 208" stroke={HAIR} strokeWidth="6" strokeLinecap="round" />
        <ellipse className="dev-art-eye" cx="172" cy="232" rx="6" ry="7" fill={DARK} />
        <ellipse className="dev-art-eye" cx="228" cy="232" rx="6" ry="7" fill={DARK} />
        {/* Glasses */}
        <circle cx="172" cy="232" r="21" stroke={DARK} strokeWidth="5" fill="rgba(255,217,184,0.12)" />
        <circle cx="228" cy="232" r="21" stroke={DARK} strokeWidth="5" fill="rgba(255,217,184,0.12)" />
        <path d="M193 230 C197 226 203 226 207 230 M151 228 L131 224 M249 228 L269 224" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Headphones */}
        <path d="M120 250 C112 132 288 132 280 250" stroke="var(--accent)" strokeWidth="11" fill="none" strokeLinecap="round" />
        <rect x="106" y="222" width="26" height="54" rx="11" fill={DARK} />
        <rect x="268" y="222" width="26" height="54" rx="11" fill={DARK} />
        <rect x="126" y="232" width="5" height="34" rx="2.5" fill="var(--accent)" />
        <rect x="269" y="232" width="5" height="34" rx="2.5" fill="var(--accent)" />
      </g>

      {/* Desk, mug, laptop (seen from behind) */}
      <rect x="20" y="430" width="360" height="14" rx="4" fill="#1d1613" />
      <g transform="translate(318 392)">
        <rect width="30" height="38" rx="6" fill="var(--accent)" />
        <path d="M30 10 C42 10 42 28 30 28" stroke="var(--accent)" strokeWidth="5" fill="none" />
        <path className="dev-art-steam" d="M10 -6 C4 -16 16 -22 10 -34 M20 -6 C14 -16 26 -22 20 -34" stroke="#a8a29e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
      <path d="M110 432 L126 336 L274 336 L290 432 Z" fill="#3a3c44" />
      <path d="M126 336 L274 336 L276 346 L124 346 Z" fill="#4a4c55" />
      <text className="dev-art-logo" x="200" y="392" textAnchor="middle" dominantBaseline="middle" fontFamily="ui-monospace, Menlo, Consolas, monospace" fontWeight="700" fontSize="30" fill="#ff7a2f">
        {"</>"}
      </text>

      {/* Floating glyphs */}
      <g fontFamily="ui-monospace, Menlo, Consolas, monospace" fontWeight="700" fill="#ffb347">
        <text className="dev-art-glyph" x="318" y="120" fontSize="34">{"</>"}</text>
        <text className="dev-art-glyph [animation-delay:-2s]" x="22" y="300" fontSize="26">{"{ }"}</text>
        <text className="dev-art-glyph [animation-delay:-4s]" x="330" y="300" fontSize="22">{"=>"}</text>
      </g>
    </svg>
  </div>
);

export default DevAvatarArt;
