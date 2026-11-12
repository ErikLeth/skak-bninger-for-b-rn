(function () {
  const { Game, sqName } = window.ChessLite;
  const app = document.getElementById('app');
  const confettiBox = document.getElementById('confetti');

  const GLYPHS = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
  const PRAISE = ['Godt gået! ⭐', 'Fantastisk! 🎉', 'Sådan! 💪', 'Super! 🌟', 'Yes! Du kan det! 🚀'];

  const state = {
    screen: 'home',
    playerColor: 'w',
    openingIdx: 0,
    game: null,
    ply: 0,
    selected: null,
    targets: [],
    mistakes: 0,
    hints: 0,
    mode: 'play',
    timer: null,
    sound: localStorage.getItem('skak-lyd') !== 'nej'
  };

  let stars = loadStars();

  function loadStars() {
    try { return JSON.parse(localStorage.getItem('skakeventyr-stjerner')) || {}; }
    catch (e) { return {}; }
  }
  function saveStars() { localStorage.setItem('skakeventyr-stjerner', JSON.stringify(stars)); }
  function starsFor(id, color) { return (stars[id] && stars[id][color]) || 0; }
  function starRow(n) { return '⭐'.repeat(n) + '☆'.repeat(3 - n); }

  let actx = null;
  function tone(freq, dur, type, vol, when) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + (when || 0);
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + (dur || 0.12));
      o.connect(g); g.connect(actx.destination);
      o.start(t0); o.stop(t0 + (dur || 0.12) + 0.03);
    } catch (e) { /* lyd er valgfri */ }
  }
  const sndMove = () => { tone(520, .1, 'triangle', .12); tone(780, .12, 'triangle', .1, .05); };
  const sndCapture = () => { tone(300, .12, 'sawtooth', .1); tone(180, .2, 'sawtooth', .1, .07); };
  const sndBad = () => tone(160, .22, 'square', .06);
  const sndClick = () => tone(700, .05, 'sine', .06);
  const sndWin = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .24, 'triangle', .14, i * .13));

  function clearTimer() { if (state.timer) { clearTimeout(state.timer); clearInterval(state.timer); state.timer = null; } }

  function header(title) {
    return `<div class="topbar">
      <button class="btn small ghost" id="btn-home" title="Menu">🏠</button>
      <h1>${title}</h1>
      <button class="btn small ghost" id="btn-sound" title="Lyd til/fra">${state.sound ? '🔊' : '🔇'}</button>
    </div>`;
  }

  function bindChrome() {
    const h = document.getElementById('btn-home');
    if (h) h.onclick = () => { sndClick(); clearTimer(); renderHome(); };
    const s = document.getElementById('btn-sound');
    if (s) s.onclick = () => {
      state.sound = !state.sound;
      localStorage.setItem('skak-lyd', state.sound ? 'ja' : 'nej');
      s.textContent = state.sound ? '🔊' : '🔇';
      if (state.sound) sndClick();
    };
  }

  function renderHome() {
    state.screen = 'home';
    clearTimer();
    const cards = OPENINGS.map((o, i) => `
      <button class="opening-card" data-i="${i}">
        <div class="emoji">${o.emoji}</div>
        <div class="name">${o.name}</div>
        <div class="stars">
          <span>⚪ Hvid ${starRow(starsFor(o.id, 'w'))}</span>
          <span>⚫ Sort ${starRow(starsFor(o.id, 'b'))}</span>
        </div>
      </button>`).join('');

    app.innerHTML = `${header('♟️ SkakEventyret')}
      <div class="panel">
        <p class="lead center" style="text-align:center">Lær de <b>5 bedste første træk</b> i de <b>10 mest populære skakåbninger</b> — både som <b>hvid ⚪</b> og <b>sort ⚫</b>! Se trækkene først, og spil dem bagefter selv. 🎉</p>
        <h2 style="text-align:center">Hvem spiller du?</h2>
        <div class="row">
          <button class="btn big white ${state.playerColor === 'w' ? 'sel' : ''}" id="pick-w">⚪ Jeg spiller HVID</button>
          <button class="btn big black ${state.playerColor === 'b' ? 'sel' : ''}" id="pick-b">⚫ Jeg spiller SORT</button>
        </div>
        <h2 style="text-align:center">Vælg en åbning:</h2>
        <div class="grid">${cards}</div>
      </div>`;
    bindChrome();
    document.getElementById('pick-w').onclick = () => { state.playerColor = 'w'; sndClick(); renderHome(); };
    document.getElementById('pick-b').onclick = () => { state.playerColor = 'b'; sndClick(); renderHome(); };
    document.querySelectorAll('.opening-card').forEach(el => {
      el.onclick = () => { sndClick(); renderOpening(Number(el.dataset.i)); };
    });
  }

  function renderOpening(i) {
    state.screen = 'opening';
    state.openingIdx = i;
    clearTimer();
    const o = OPENINGS[i];
    const me = state.playerColor === 'w' ? 'HVID ⚪' : 'SORT ⚫';
    app.innerHTML = `${header(o.emoji + ' ' + o.name)}
      <div class="panel center">
        <div class="big-emoji">${o.emoji}</div>
        <h2>${o.name}</h2>
        <p class="lead">${o.desc}</p>
        <p class="muted">Du spiller som <b>${me}</b>. Først ser du de 5 bedste træk — så spiller du dem selv!</p>
        <div class="stars"><span>⚪ Hvid ${starRow(starsFor(o.id, 'w'))}</span><span>⚫ Sort ${starRow(starsFor(o.id, 'b'))}</span></div>
        <div class="row">
          <button class="btn big orange" id="btn-lesson">👀 Se trækkene</button>
          <button class="btn big green" id="btn-play">🎮 Spil selv</button>
        </div>
        <div class="row"><button class="btn ghost" id="btn-back">← Tilbage til åbningerne</button></div>
      </div>`;
    bindChrome();
    document.getElementById('btn-lesson').onclick = () => { sndClick(); startLesson(); };
    document.getElementById('btn-play').onclick = () => { sndClick(); startPlay(); };
    document.getElementById('btn-back').onclick = () => { sndClick(); renderHome(); };
  }

  function squaresHTML() {
    let html = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cls = (r + c) % 2 ? 'dark' : 'light';
        const rank = c === 0 ? `<span class="coord rank">${8 - r}</span>` : '';
        const file = r === 7 ? `<span class="coord file">${'abcdefgh'[c]}</span>` : '';
        html += `<div class="sq ${cls}" data-r="${r}" data-c="${c}">${rank}${file}<span class="pc"></span></div>`;
      }
    }
    return html;
  }

  function renderBoardScreen() {
    const o = OPENINGS[state.openingIdx];
    state.screen = 'board';
    app.innerHTML = `${header(o.emoji + ' ' + o.name)}
      <div class="game-wrap">
        <div class="note-bubble" id="note">Tryk på en af dine brikker, og klik hvor den skal hen.</div>
        <div class="board-area">
          <div class="captured" id="cap-top"></div>
          <div class="board" id="board">${squaresHTML()}</div>
          <div class="captured" id="cap-bottom"></div>
        </div>
        <div class="side">
          <div class="dots" id="dots"></div>
          <div class="moves-list" id="moves"></div>
          <div class="row">
            <button class="btn orange" id="btn-hint">💡 Hint</button>
            <button class="btn ghost" id="btn-quit">✖ Afslut</button>
          </div>
          <div class="status" id="status"></div>
        </div>
      </div>`;
    bindChrome();
    document.getElementById('board').addEventListener('click', onBoardClick);
    document.getElementById('btn-hint').onclick = useHint;
    document.getElementById('btn-quit').onclick = () => { sndClick(); clearTimer(); renderOpening(state.openingIdx); };
    updateBoard();
    updateDots();
    updateMoves();
    updateCaptured();
    setStatus(state.mode === 'lesson' ? 'Vi ser åbningen sammen… 👀' : waitingText());
  }

  function updateBoard() {
    const g = state.game;
    const squares = app.querySelectorAll('.sq');
    squares.forEach(sq => {
      const r = Number(sq.dataset.r), c = Number(sq.dataset.c);
      const pc = sq.querySelector('.pc');
      const p = g.board[r][c];
      pc.textContent = p === '.' ? '' : GLYPHS[p.toUpperCase()];
      pc.className = 'pc' + (p === '.' ? '' : (g.colorOf(p) === 'w' ? ' w' : ' b'));
      sq.classList.remove('lastmove', 'selected');
      const dot = sq.querySelector('.dot'), ring = sq.querySelector('.ring');
      if (dot) dot.remove();
      if (ring) ring.remove();
    });
    if (g.lastMove) {
      for (const s of [g.lastMove.from, g.lastMove.to]) {
        const el = app.querySelector(`.sq[data-r="${8 - Number(s[1])}"][data-c="${'abcdefgh'.indexOf(s[0])}"]`);
        if (el) {
          el.classList.add('lastmove');
          const pc = el.querySelector('.pc');
          if (pc.textContent) pc.classList.add('pop');
        }
      }
    }
    if (state.selected) {
      const el = app.querySelector(`.sq[data-r="${state.selected.r}"][data-c="${state.selected.c}"]`);
      if (el) el.classList.add('selected');
      for (const t of state.targets) {
        const te = app.querySelector(`.sq[data-r="${t.r}"][data-c="${t.c}"]`);
        if (!te) continue;
        const piece = g.board[t.r][t.c];
        te.insertAdjacentHTML('beforeend', piece === '.' ? '<span class="dot"></span>' : '<span class="ring"></span>');
      }
    }
  }

  function updateDots() {
    const o = OPENINGS[state.openingIdx];
    const mineOffset = state.playerColor === 'w' ? 0 : 1;
    let html = '';
    for (let i = 0; i < o.moves.length; i++) {
      const cls = i < state.ply ? 'done' : '';
      const mine = i % 2 === mineOffset ? ' mine' : '';
      html += `<span class="d ${cls}${mine}"></span>`;
    }
    document.getElementById('dots').innerHTML = html;
  }

  function updateMoves() {
    const h = state.game.history;
    let html = '';
    for (let i = 0; i < h.length; i += 2) {
      html += `<b>${i / 2 + 1}.</b> ${h[i].san}${h[i + 1] ? ' ' + h[i + 1].san : ''} &nbsp;`;
    }
    document.getElementById('moves').innerHTML = html || '<span class="muted">Trækkene vises her…</span>';
  }

  function updateCaptured() {
    const g = state.game;
    const glyph = p => GLYPHS[p.toUpperCase()];
    document.getElementById('cap-top').innerHTML =
      g.captured.b.map(p => `<span class="cp-b">${glyph(p)}</span>`).join('');
    document.getElementById('cap-bottom').innerHTML =
      g.captured.w.map(p => `<span class="cp-w">${glyph(p)}</span>`).join('');
  }

  function setNote(html) { document.getElementById('note').innerHTML = html; }
  function setStatus(html) { document.getElementById('status').innerHTML = html; }

  function waitingText() {
    return state.playerColor === 'w' ? 'Din tur, HVID! 👇 Klik en brik, så vises de felter, den må gå til.' : 'Din tur, SORT! 👇 Klik en brik, så vises de felter, den må gå til.';
  }

  function startLesson() {
    state.mode = 'lesson';
    state.game = new Game();
    state.ply = 0;
    state.mistakes = 0;
    state.selected = null;
    state.targets = [];
    renderBoardScreen();
    setNote('Vi gennemgår åbningen sammen — <b>5 træk for hver spiller</b>! 👀');
    state.timer = setInterval(lessonStep, 1600);
  }

  function lessonStep() {
    const o = OPENINGS[state.openingIdx];
    if (state.ply >= o.moves.length) {
      clearTimer();
      setNote('🎉 <b>Sejt set!</b> Nu kender du åbningen. Vil du prøve at spille den selv?');
      setStatus('Tryk "Afslut" og derefter "🎮 Spil selv" — eller gå tilbage og vælg en ny åbning.');
      return;
    }
    playPly(state.ply);
  }

  function startPlay() {
    state.mode = 'play';
    state.game = new Game();
    state.ply = 0;
    state.mistakes = 0;
    state.hints = 0;
    state.selected = null;
    state.targets = [];
    renderBoardScreen();
    setNote('Nu er det <b>din tur</b>! Find de 5 bedste træk for ' + (state.playerColor === 'w' ? '<b>HVID ⚪</b>' : '<b>SORT ⚫</b>') + ' i denne åbning. 💪');
    afterPly();
  }

  function currentPlySide() {
    return state.ply % 2 === 0 ? 'w' : 'b';
  }

  function playPly(i) {
    const o = OPENINGS[state.openingIdx];
    const mv = o.moves[i];
    const res = state.game.play(mv.m.slice(0, 2), mv.m.slice(2, 4));
    if (!res) { setStatus('Noget gik galt — prøv at starte forfra.'); return; }
    res.capture ? sndCapture() : sndMove();
    const moveNo = Math.floor(i / 2) + 1;
    const side = i % 2 === 0 ? 'Hvid' : 'Sort';
    setNote(`<b>Træk ${moveNo} · ${side}: ${res.san}</b><br>${mv.note}`);
    state.ply++;
    state.selected = null;
    state.targets = [];
    updateBoard(); updateDots(); updateMoves(); updateCaptured();
  }

  function afterPly() {
    const o = OPENINGS[state.openingIdx];
    if (state.ply >= o.moves.length) {
      setStatus('…');
      state.timer = setTimeout(win, 650);
      return;
    }
    if (state.mode === 'play' && currentPlySide() !== state.playerColor) {
      setStatus((state.playerColor === 'w' ? 'Sort' : 'Hvid') + ' tænker… 🤔');
      state.timer = setTimeout(() => { playPly(state.ply); afterPly(); }, 800);
    } else if (state.mode === 'play') {
      setStatus(waitingText());
    }
  }

  function onBoardClick(e) {
    if (state.screen !== 'board' || state.mode !== 'play') return;
    const g = state.game;
    if (!g || g.turn !== state.playerColor) return;
    const o = OPENINGS[state.openingIdx];
    const mv = o.moves[state.ply];
    if (!mv) return;
    const sq = e.target.closest('.sq');
    if (!sq) return;
    const r = Number(sq.dataset.r), c = Number(sq.dataset.c);
    const piece = g.board[r][c];
    const sel = state.selected;

    if (!sel) {
      if (piece !== '.' && g.colorOf(piece) === state.playerColor) {
        state.selected = { r, c };
        state.targets = g.legalMovesFrom(r, c).map(m => m.to);
        sndClick();
        updateBoard();
      }
      return;
    }
    if (sel.r === r && sel.c === c) {
      state.selected = null; state.targets = []; updateBoard(); return;
    }
    if (piece !== '.' && g.colorOf(piece) === state.playerColor) {
      state.selected = { r, c };
      state.targets = g.legalMovesFrom(r, c).map(m => m.to);
      sndClick();
      updateBoard();
      return;
    }
    const isTarget = state.targets.some(t => t.r === r && t.c === c);
    if (!isTarget) {
      state.selected = null; state.targets = []; updateBoard(); return;
    }
    const from = sqName(sel.r, sel.c), to = sqName(r, c);
    if (from === mv.m.slice(0, 2) && to === mv.m.slice(2, 4)) {
      state.selected = null; state.targets = [];
      playPly(state.ply);
      if (state.ply < o.moves.length) {
        setStatus(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      }
      afterPly();
    } else {
      state.mistakes++;
      sndBad();
      const board = document.getElementById('board');
      board.classList.remove('shake');
      void board.offsetWidth;
      board.classList.add('shake');
      setStatus('Hmm — det er måske lovligt, men ikke det bedste træk i denne åbning. Prøv igen! 💪');
      state.selected = null; state.targets = [];
      updateBoard();
    }
  }

  function useHint() {
    if (state.screen !== 'board' || state.mode !== 'play') return;
    const g = state.game;
    if (!g || g.turn !== state.playerColor) return;
    const o = OPENINGS[state.openingIdx];
    const mv = o.moves[state.ply];
    if (!mv) return;
    state.hints++;
    const from = mv.m.slice(0, 2);
    const r = 8 - Number(from[1]), c = 'abcdefgh'.indexOf(from[0]);
    const el = app.querySelector(`.sq[data-r="${r}"][data-c="${c}"]`);
    if (el) {
      el.classList.add('hint');
      setTimeout(() => el.classList.remove('hint'), 2100);
    }
    setStatus('💡 Prøv brikken på <b>' + from + '</b> — hvor skal den hen?');
    sndClick();
  }

  function win() {
    const o = OPENINGS[state.openingIdx];
    const color = state.playerColor;
    const used = state.mistakes + state.hints;
    const earned = used === 0 ? 3 : used <= 2 ? 2 : 1;
    stars[o.id] = stars[o.id] || {};
    stars[o.id][color] = Math.max(starsFor(o.id, color), earned);
    saveStars();
    sndWin();
    confetti();

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="panel center win-panel">
      <div class="big-emoji">🏆</div>
      <h2>Godt gået!</h2>
      <p class="lead">Du har lært de <b>5 bedste træk</b> som <b>${color === 'w' ? 'HVID ⚪' : 'SORT ⚫'}</b> i <b>${o.name}</b>!</p>
      <div class="stars huge">${'⭐'.repeat(earned)}${'☆'.repeat(3 - earned)}</div>
      <p class="muted">${used === 0 ? 'Ingen fejl og ingen hints — du er en rigtig skakstjerne! 🌟' : used + (used === 1 ? ' forsøg' : ' forsøg') + ' ekstra — øvelse gør mester! 💪'}</p>
      <div class="row">
        <button class="btn green" id="w-replay">🔁 Spil igen</button>
        <button class="btn orange" id="w-home">🏠 Menu</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    document.getElementById('w-replay').onclick = () => { overlay.remove(); startPlay(); };
    document.getElementById('w-home').onclick = () => { overlay.remove(); renderHome(); };
  }

  function confetti() {
    const colors = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ff9800'];
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + 'vw';
      s.style.background = colors[i % colors.length];
      s.style.animationDuration = 2.2 + Math.random() * 1.8 + 's';
      s.style.animationDelay = Math.random() * 0.6 + 's';
      s.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      confettiBox.appendChild(s);
      setTimeout(() => s.remove(), 5000);
    }
  }

  renderHome();
})();
