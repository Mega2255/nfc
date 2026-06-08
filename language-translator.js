/* ═══════════════════════════════════════════════════════════════
   Navy Federal — AI Language Translator
   Drop this <script> tag before </body> in your HTML, AFTER the
   existing <script> block.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const LANGUAGES = [
    { code: 'en',    label: 'English',    flag: '🇺🇸' },
    { code: 'es',    label: 'Español',    flag: '🇪🇸' },
    { code: 'fr',    label: 'Français',   flag: '🇫🇷' },
    { code: 'de',    label: 'Deutsch',    flag: '🇩🇪' },
    { code: 'pt',    label: 'Português',  flag: '🇧🇷' },
    { code: 'ar',    label: 'العربية',    flag: '🇸🇦' },
    { code: 'zh',    label: '中文',        flag: '🇨🇳' },
    { code: 'ja',    label: '日本語',      flag: '🇯🇵' },
    { code: 'ko',    label: '한국어',      flag: '🇰🇷' },
    { code: 'it',    label: 'Italiano',   flag: '🇮🇹' },
    { code: 'ru',    label: 'Русский',    flag: '🇷🇺' },
    { code: 'hi',    label: 'हिन्दी',      flag: '🇮🇳' },
    { code: 'yo',    label: 'Yorùbá',     flag: '🇳🇬' },
    { code: 'ha',    label: 'Hausa',      flag: '🇳🇬' },
    { code: 'ig',    label: 'Igbo',       flag: '🇳🇬' },
  ];

  /* ── CSS ──────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .lang-selector-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.22);
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      padding: 0.38rem 0.7rem;
      border-radius: 7px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      white-space: nowrap;
      line-height: 1;
    }
    .lang-btn:hover {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.45);
    }
    .lang-btn .lang-arrow {
      font-size: 0.55rem;
      opacity: 0.6;
      transition: transform 0.2s;
    }
    .lang-selector-wrap.open .lang-arrow { transform: rotate(180deg); }
    .lang-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: rgba(0,18,40,0.97);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      min-width: 180px;
      z-index: 9999;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
      overflow: hidden;
      padding: 4px 0;
    }
    .lang-selector-wrap.open .lang-dropdown { display: block; }
    .lang-option {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 0.55rem 1rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      color: rgba(255,255,255,0.78);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .lang-option:hover { background: rgba(255,255,255,0.07); color: white; }
    .lang-option.active {
      color: #00A896;
      background: rgba(0,133,124,0.12);
      font-weight: 600;
    }
    .lang-flag { font-size: 1rem; line-height: 1; }
    .lang-divider {
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.25);
      padding: 0.35rem 1rem 0.2rem;
    }

    /* ── Loading overlay ──────────────────────────────────────── */
    #lang-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0,18,40,0.82);
      backdrop-filter: blur(6px);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
    }
    #lang-overlay.show { display: flex; }
    .lang-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(0,133,124,0.25);
      border-top-color: #00857C;
      border-radius: 50%;
      animation: langSpin 0.8s linear infinite;
    }
    @keyframes langSpin { to { transform: rotate(360deg); } }
    .lang-overlay-text {
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.04em;
    }
    .lang-overlay-sub {
      color: rgba(255,255,255,0.45);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      margin-top: -0.5rem;
    }

    /* ── Mobile lang selector ──────────────────────────────────── */
    .mob-lang-wrap {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .mob-lang-label {
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      margin-bottom: 0.5rem;
      padding: 0 0;
    }
    .mob-lang-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .mob-lang-opt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 7px 4px;
      cursor: pointer;
      transition: background 0.15s;
      font-family: 'DM Sans', sans-serif;
      color: rgba(255,255,255,0.7);
      font-size: 0.68rem;
      font-weight: 500;
      text-align: center;
    }
    .mob-lang-opt:hover { background: rgba(255,255,255,0.1); color: white; }
    .mob-lang-opt.active {
      background: rgba(0,133,124,0.18);
      border-color: rgba(0,133,124,0.4);
      color: #00A896;
    }
    .mob-lang-opt .mob-flag { font-size: 1.1rem; }
  `;
  document.head.appendChild(style);

  /* ── Loading overlay ──────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'lang-overlay';
  overlay.innerHTML = `
    <div class="lang-spinner"></div>
    <div class="lang-overlay-text" id="lang-overlay-text">Translating page…</div>
    <div class="lang-overlay-sub">Powered by Claude AI</div>
  `;
  document.body.appendChild(overlay);

  /* ── Build desktop selector ─────────────────────────────── */
  const wrap = document.createElement('div');
  wrap.className = 'lang-selector-wrap';
  wrap.innerHTML = `
    <button class="lang-btn" id="langToggle" aria-haspopup="listbox" aria-expanded="false">
      <span id="langBtnFlag">🇺🇸</span>
      <span id="langBtnLabel">EN</span>
      <span class="lang-arrow">▼</span>
    </button>
    <div class="lang-dropdown" role="listbox" id="langDropdown">
      <div class="lang-divider">Select Language</div>
      ${LANGUAGES.map(l => `
        <div class="lang-option${l.code === 'en' ? ' active' : ''}"
             data-code="${l.code}" role="option">
          <span class="lang-flag">${l.flag}</span>
          <span>${l.label}</span>
        </div>
      `).join('')}
    </div>
  `;

  /* Insert before the nav-actions "Log In" button */
  const navActions = document.querySelector('.nav-actions');
  if (navActions) navActions.insertBefore(wrap, navActions.firstChild);

  /* ── Build mobile selector ─────────────────────────────── */
  const mobWrap = document.createElement('div');
  mobWrap.className = 'mob-lang-wrap';
  mobWrap.innerHTML = `
    <div class="mob-lang-label">Language</div>
    <div class="mob-lang-grid">
      ${LANGUAGES.map(l => `
        <div class="mob-lang-opt${l.code === 'en' ? ' active' : ''}" data-code="${l.code}">
          <span class="mob-flag">${l.flag}</span>
          <span>${l.label}</span>
        </div>
      `).join('')}
    </div>
  `;
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.appendChild(mobWrap);

  /* ── Toggle desktop dropdown ─────────────────────────── */
  const langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
    langToggle.setAttribute('aria-expanded', wrap.classList.contains('open'));
  });
  document.addEventListener('click', () => wrap.classList.remove('open'));

  /* ── State ──────────────────────────────────────────── */
  let currentLang = 'en';
  let originalTexts = null; // snapshot of all original English text nodes

  /* ── Collect all translatable text nodes ──────────────── */
  function getTranslatableNodes() {
    const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE']);
    const skipClasses = ['lang-btn', 'lang-dropdown', 'lang-option', 'mob-lang-wrap',
                         'lang-overlay', 'cursor-dot', 'cursor-ring', 'ticker-wrap',
                         'phone-frame', 'fb-phone-frame', 'sfp-frame', 'save-floating-phone'];

    const nodes = [];
    const walker = document.createTreeWalker(
      document.getElementById('site') || document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          // skip if ancestor has skip class
          let el = parent;
          while (el && el !== document.body) {
            if (skipClasses.some(c => el.classList && el.classList.contains(c)))
              return NodeFilter.FILTER_REJECT;
            el = el.parentElement;
          }
          const text = node.textContent.trim();
          if (!text) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    return nodes;
  }

  /* ── Save originals ─────────────────────────────────── */
  function saveOriginals() {
    const nodes = getTranslatableNodes();
    originalTexts = nodes.map(n => ({
      node: n,
      text: n.textContent,
    }));
  }

  /* ── Restore English ─────────────────────────────────── */
  function restoreEnglish() {
    if (!originalTexts) return;
    originalTexts.forEach(({ node, text }) => {
      if (node.isConnected) node.textContent = text;
    });
  }

  /* ── Translate via Claude API (batched) ──────────────── */
  async function translatePage(langCode, langLabel) {
    // Gather current nodes
    const nodes = getTranslatableNodes();
    if (!nodes.length) return;

    // Build a numbered list of strings to translate
    const texts = nodes.map(n => n.textContent);

    // Deduplicate for efficiency
    const unique = [...new Set(texts)];
    const BATCH = 150; // strings per API call

    overlay.classList.add('show');
    document.getElementById('lang-overlay-text').textContent =
      `Translating to ${langLabel}…`;

    const translationMap = {};

    try {
      for (let i = 0; i < unique.length; i += BATCH) {
        const chunk = unique.slice(i, i + BATCH);
        const numbered = chunk.map((t, idx) => `${idx + 1}. ${t}`).join('\n');

        document.getElementById('lang-overlay-text').textContent =
          `Translating to ${langLabel}… (${Math.min(i + BATCH, unique.length)}/${unique.length})`;

        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: `Translate the following numbered list of UI text strings from English to ${langLabel}.
Rules:
- Keep the EXACT same numbered format: "1. text"
- Preserve any special characters, symbols (%, $, ★, +, etc.) and numbers
- Keep brand names (Navy Federal, NCUA, VA, SEPA, IBAN, ATM, IRA, ETF) untranslated
- Return ONLY the translated numbered list, nothing else
- Do not add explanations

${numbered}`
            }]
          })
        });

        const data = await resp.json();
        const raw = data.content?.[0]?.text || '';

        // Parse numbered list back
        const lines = raw.split('\n').filter(l => /^\d+\./.test(l.trim()));
        lines.forEach(line => {
          const match = line.match(/^(\d+)\.\s*(.+)$/);
          if (match) {
            const idx = parseInt(match[1]) - 1;
            if (chunk[idx] !== undefined) {
              translationMap[chunk[idx]] = match[2].trim();
            }
          }
        });
      }

      // Apply translations
      nodes.forEach(node => {
        const original = node.textContent;
        if (translationMap[original]) {
          node.textContent = translationMap[original];
        }
      });

    } catch (err) {
      console.error('Translation error:', err);
      alert('Translation failed. Please try again.');
    } finally {
      overlay.classList.remove('show');
    }
  }

  /* ── Handle language selection ───────────────────────── */
  async function selectLanguage(code) {
    const lang = LANGUAGES.find(l => l.code === code);
    if (!lang || code === currentLang) {
      wrap.classList.remove('open');
      return;
    }

    // Save originals on first non-English selection
    if (!originalTexts) saveOriginals();

    // Update UI
    currentLang = code;
    document.getElementById('langBtnFlag').textContent = lang.flag;
    document.getElementById('langBtnLabel').textContent = code.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.code === code);
    });
    document.querySelectorAll('.mob-lang-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.code === code);
    });
    wrap.classList.remove('open');

    if (code === 'en') {
      restoreEnglish();
      return;
    }

    await translatePage(code, lang.label);
  }

  /* ── Event listeners ─────────────────────────────────── */
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectLanguage(opt.dataset.code);
    });
  });

  document.querySelectorAll('.mob-lang-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      // close mobile menu
      document.getElementById('hamburger')?.classList.remove('open');
      document.getElementById('mobileMenu')?.classList.remove('open');
      selectLanguage(opt.dataset.code);
    });
  });

})();
