import React from "react";
import "./App.css";

type BoardArray = Array<string | null>;

type BoardProps = {
  squares: BoardArray;
  handleClick: (idx: number) => void;
};

const Board = ({ squares, handleClick }: BoardProps) => {
  return (
    <>
      {squares.map((square, idx) => (
        <div className="square" key={idx} onClick={() => handleClick(idx)}>
          {square}
        </div>
      ))}
    </>
  );
};

const WINNING_PATTERN = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const moves = {
  X: "x",
  O: "o",
  None: null,
};

const emptyBoard = () => new Array(9).fill(null);
export const Computer = () => {
  const [squares, setSquares] = React.useState(emptyBoard);
  const [round, setRound] = React.useState(0);
  const [enemyTurn, setEnemyTurn] = React.useState(false);
  const playerCounter = React.useRef(0);
  const enemyCounter = React.useRef(0);
  const tieCounter = React.useRef(0);

  const checkGameState = (board: BoardArray) => {
    const hasWinner = (player: string) =>
      WINNING_PATTERN.map((combination) =>
        combination.map((position) => board[position] === player).every(Boolean)
      ).some(Boolean);

    const playerWin = hasWinner(moves.X);
    const enemyWin = hasWinner(moves.O);
    const isWon = playerWin || enemyWin;
    const isDraw = board.filter(Boolean).length >= 9 && !isWon;

    return {
      isWon,
      isDraw,
      enemyWin,
      playerWin,
    };
  };

  const makeMove = (board: BoardArray, player: string, move: number) => {
    const copy = [...board];
    copy[move] = player;
    return copy;
  };

  const getBestMove = (
    board: BoardArray,
    depth: number,
    isMaximizingPlayer: Boolean
  ) => {
    const { isDraw, isWon, playerWin, enemyWin } = checkGameState(board);

    let score = 0;
    if (playerWin) score = (10 - depth) * 1;
    if (enemyWin) score = (10 - depth) * -1;
    if (isWon || isDraw) return { move: -1, score };

    const player = isMaximizingPlayer ? moves.X : moves.O;
    const bestMove = {
      score: isMaximizingPlayer ? -Infinity : Infinity,
      move: -1,
    };

    for (const [move, cell] of board.entries()) {
      if (cell !== moves.None) continue;

      const newBoard = makeMove(board, player, move);
      setSquares(newBoard);
      const currentMove = getBestMove(newBoard, depth + 1, !isMaximizingPlayer);
      if (
        (isMaximizingPlayer && currentMove.score > bestMove.score) ||
        (!isMaximizingPlayer && currentMove.score < bestMove.score)
      ) {
        bestMove.move = move;
        bestMove.score = currentMove.score;
      }
    }

    return bestMove;
  };

  const handleClick = (pos: number) => {
    const { isDraw, isWon } = checkGameState(squares);
    if (isDraw || isWon) {
      doReset();
      return;
    }
    if (squares[pos] !== moves.None) return;

    // Player move.
    squares[pos] = moves.X;
    setRound((prevRound) => (prevRound += 1));
    setEnemyTurn((prevTurn) => !prevTurn);
    setSquares(squares);

    // Enemy move.
    setTimeout(() => {
      const { move } = getBestMove(squares, round, false);
      squares[move] = moves.O;
      setRound((prevRound) => (prevRound += 1));
      setEnemyTurn((prevTurn) => !prevTurn);
      setSquares(squares);
    }, 100);
  };

  React.useEffect(() => {
    const { isDraw, enemyWin, playerWin } = checkGameState(squares);

    if (enemyWin) enemyCounter.current++;
    if (playerWin) playerCounter.current++;
    if (isDraw) tieCounter.current++;
  }, [enemyTurn, squares]);

  const doReset = () => {
    setRound(0);
    setEnemyTurn(false);
    setSquares(emptyBoard);
  };

  return (
    <div className="App">
      <div className="board">
        <Board squares={squares} handleClick={handleClick} />
      </div>

      <div>Player (X) : {playerCounter.current}</div>
      <div>Tie : {tieCounter.current}</div>
      <div>Enemy (O) : {enemyCounter.current}</div>

      <button onClick={doReset}>rest</button>
    </div>
  );
};

export default Computer;
