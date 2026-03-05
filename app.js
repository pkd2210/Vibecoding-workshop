const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('new-game');

const game = new Chess();

const pieceMap = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
  P: '♙',
  R: '♖',
  N: '♘',
  B: '♗',
  Q: '♕',
  K: '♔',
};

let selectedSquare = null;
let legalTargets = [];

function squareColor(file, rank) {
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
}

function squareName(file, rank) {
  const files = 'abcdefgh';
  return files[file] + (8 - rank);
}

function getPieceChar(square) {
  const piece = game.get(square);
  if (!piece) return '';

  const symbol = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
  return pieceMap[symbol];
}

function render() {
  boardEl.innerHTML = '';

  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const sq = squareName(file, rank);
      const square = document.createElement('button');
      square.className = `square ${squareColor(file, rank)}`;
      square.dataset.square = sq;
      square.type = 'button';
      square.textContent = getPieceChar(sq);

      if (selectedSquare === sq) {
        square.classList.add('selected');
      }
      if (legalTargets.includes(sq)) {
        square.classList.add('hint');
      }

      square.addEventListener('click', onSquareClick);
      boardEl.append(square);
    }
  }

  updateStatus();
}

function updateStatus() {
  if (game.isCheckmate()) {
    statusEl.textContent = game.turn() === 'w' ? 'Checkmate — computer wins.' : 'Checkmate — you win!';
    return;
  }

  if (game.isDraw()) {
    statusEl.textContent = 'Draw game.';
    return;
  }

  if (game.turn() === 'w') {
    statusEl.textContent = game.inCheck() ? 'Your king is in check.' : 'Your move.';
  } else {
    statusEl.textContent = game.inCheck() ? 'Computer is in check.' : 'Computer is thinking...';
  }
}

function clearSelection() {
  selectedSquare = null;
  legalTargets = [];
}

function onSquareClick(event) {
  if (game.turn() !== 'w' || game.isGameOver()) return;

  const clicked = event.currentTarget.dataset.square;

  if (!selectedSquare) {
    const piece = game.get(clicked);
    if (!piece || piece.color !== 'w') return;

    selectedSquare = clicked;
    legalTargets = game.moves({ square: clicked, verbose: true }).map((move) => move.to);
    render();
    return;
  }

  const move = game.move({ from: selectedSquare, to: clicked, promotion: 'q' });

  if (move) {
    clearSelection();
    render();
    window.setTimeout(computerMove, 300);
    return;
  }

  const piece = game.get(clicked);
  if (piece && piece.color === 'w') {
    selectedSquare = clicked;
    legalTargets = game.moves({ square: clicked, verbose: true }).map((m) => m.to);
    render();
  }
}

function computerMove() {
  if (game.turn() !== 'b' || game.isGameOver()) {
    render();
    return;
  }

  const moves = game.moves({ verbose: true });
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  game.move(randomMove);
  render();
}

newGameBtn.addEventListener('click', () => {
  game.reset();
  clearSelection();
  render();
});

render();
