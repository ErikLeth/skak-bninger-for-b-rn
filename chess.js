window.ChessLite = (function () {
  const FILES = 'abcdefgh';

  function sqName(r, c) { return FILES[c] + (8 - r); }
  function parseSq(s) { return { r: 8 - Number(s[1]), c: FILES.indexOf(s[0]) }; }

  class Game {
    constructor() { this.reset(); }

    reset() {
      this.board = [
        'rnbqkbnr'.split(''),
        'pppppppp'.split(''),
        '........'.split(''),
        '........'.split(''),
        '........'.split(''),
        '........'.split(''),
        'PPPPPPPP'.split(''),
        'RNBQKBNR'.split('')
      ];
      this.turn = 'w';
      this.castling = { K: true, Q: true, k: true, q: true };
      this.lastMove = null;
      this.history = [];
      this.captured = { w: [], b: [] };
    }

    colorOf(p) {
      if (!p || p === '.') return null;
      return p === p.toUpperCase() ? 'w' : 'b';
    }

    pseudoMoves(r, c) {
      const p = this.board[r][c];
      if (!p || p === '.') return [];
      const color = this.colorOf(p);
      const moves = [];
      const add = (tr, tc, flag) => {
        if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return;
        const t = this.board[tr][tc];
        if (t === '.' || this.colorOf(t) !== color) {
          moves.push({ from: { r, c }, to: { r: tr, c: tc }, piece: p, capture: t !== '.', flag: flag || null });
        }
      };
      const type = p.toUpperCase();

      if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        const one = r + dir;
        if (one >= 0 && one <= 7 && this.board[one][c] === '.') {
          const promo = (one === 0 || one === 7) ? 'promo' : null;
          add(one, c, promo);
          const two = r + 2 * dir;
          if (r === startRow && this.board[two][c] === '.') add(two, c, 'double');
        }
        for (const dc of [-1, 1]) {
          const tr = r + dir, tc = c + dc;
          if (tr >= 0 && tr <= 7 && tc >= 0 && tc <= 7) {
            const t = this.board[tr][tc];
            if (t !== '.' && this.colorOf(t) !== color) {
              add(tr, tc, (tr === 0 || tr === 7) ? 'promo' : null);
            }
          }
        }
      } else if (type === 'N') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r + dr, c + dc);
      } else if (type === 'K') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r + dr, c + dc);
        const homeRow = color === 'w' ? 7 : 0;
        if (r === homeRow && c === 4) {
          const kr = color === 'w' ? 'K' : 'k';
          const qr = color === 'w' ? 'Q' : 'q';
          if (this.castling[kr] && this.board[homeRow][5] === '.' && this.board[homeRow][6] === '.' &&
              this.board[homeRow][7].toUpperCase() === 'R') add(homeRow, 6, 'castleK');
          if (this.castling[qr] && this.board[homeRow][3] === '.' && this.board[homeRow][2] === '.' &&
              this.board[homeRow][1] === '.' && this.board[homeRow][0].toUpperCase() === 'R') add(homeRow, 2, 'castleQ');
        }
      } else {
        const dirs = [];
        if (type === 'B' || type === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
        if (type === 'R' || type === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
        for (const [dr, dc] of dirs) {
          let tr = r + dr, tc = c + dc;
          while (tr >= 0 && tr <= 7 && tc >= 0 && tc <= 7) {
            const t = this.board[tr][tc];
            if (t === '.') add(tr, tc);
            else { if (this.colorOf(t) !== color) add(tr, tc); break; }
            tr += dr; tc += dc;
          }
        }
      }
      return moves;
    }

    legalMovesFrom(r, c) { return this.pseudoMoves(r, c); }

    san(mv) {
      const p = mv.piece, type = p.toUpperCase();
      if (mv.flag === 'castleK') return 'O-O';
      if (mv.flag === 'castleQ') return 'O-O-O';
      const to = sqName(mv.to.r, mv.to.c);
      let s = '';
      if (type === 'P') {
        if (mv.capture) s += FILES[mv.from.c] + 'x';
      } else {
        s += type;
        const others = [];
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
          if (r === mv.from.r && c === mv.from.c) continue;
          if (this.board[r][c] === p &&
              this.pseudoMoves(r, c).some(m => m.to.r === mv.to.r && m.to.c === mv.to.c)) {
            others.push({ r, c });
          }
        }
        if (others.length) {
          const sameFile = others.some(o => o.c === mv.from.c);
          const sameRank = others.some(o => o.r === mv.from.r);
          if (!sameFile) s += FILES[mv.from.c];
          else if (!sameRank) s += String(8 - mv.from.r);
          else s += sqName(mv.from.r, mv.from.c);
        }
        if (mv.capture) s += 'x';
      }
      s += to;
      if (mv.flag === 'promo') s += '=Q';
      return s;
    }

    play(fromName, toName) {
      const from = parseSq(fromName), to = parseSq(toName);
      const p = this.board[from.r][from.c];
      if (!p || p === '.' || this.colorOf(p) !== this.turn) return null;
      const mv = this.pseudoMoves(from.r, from.c)
        .find(m => m.to.r === to.r && m.to.c === to.c);
      if (!mv) return null;
      const san = this.san(mv);
      const color = this.colorOf(p);
      const target = this.board[to.r][to.c];
      if (target !== '.') this.captured[color].push(target);
      this.board[to.r][to.c] = p;
      this.board[from.r][from.c] = '.';
      if (mv.flag === 'castleK') { this.board[from.r][5] = this.board[from.r][7]; this.board[from.r][7] = '.'; }
      if (mv.flag === 'castleQ') { this.board[from.r][3] = this.board[from.r][0]; this.board[from.r][0] = '.'; }
      if (p.toUpperCase() === 'K') {
        if (color === 'w') { this.castling.K = this.castling.Q = false; }
        else { this.castling.k = this.castling.q = false; }
      }
      if (p.toUpperCase() === 'R') {
        const homeRow = color === 'w' ? 7 : 0;
        if (from.r === homeRow && from.c === 0) { if (color === 'w') this.castling.Q = false; else this.castling.q = false; }
        if (from.r === homeRow && from.c === 7) { if (color === 'w') this.castling.K = false; else this.castling.k = false; }
      }
      if (mv.flag === 'promo') this.board[to.r][to.c] = color === 'w' ? 'Q' : 'q';
      this.lastMove = { from: fromName, to: toName };
      this.history.push({ from: fromName, to: toName, san });
      this.turn = color === 'w' ? 'b' : 'w';
      return { san, capture: mv.capture, flag: mv.flag };
    }
  }

  return { Game, sqName, parseSq, FILES };
})();
