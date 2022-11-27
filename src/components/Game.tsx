import React from "react";
import Board from "./Board";
import "./Game.css";
import { player } from "../modules/gameConst";
import { useGetGameStatus, usePersistCounter } from "../modules/gameHooks";

const emptyBoard = () => new Array(9).fill(null);

export const Computer = () => {
  const [squares, setSquares] = React.useState(emptyBoard);
  const [enemyTurn, setEnemyTurn] = React.useState(false);
  const [counter, setCounter] = usePersistCounter();

  const { checkStatus, gameStatus } = useGetGameStatus(squares);

  const handleClick = (pos: number) => {
    const { isDraw, isWon } = checkStatus();
    if (isDraw || isWon) {
      doReset();
      return;
    }

    squares[pos] = player[enemyTurn ? "O" : "X"];
    setEnemyTurn((prevTurn) => !prevTurn);
    setSquares(squares);
  };

  React.useEffect(() => {
    const { isDraw, enemyWin, playerWin } = gameStatus;

    const newCounter = { ...counter };

    if (enemyWin) newCounter.enemy += 1;
    if (playerWin) newCounter.player += 1;
    if (isDraw) newCounter.tie += 1;

    setCounter(newCounter);

    // eslint-disable-next-line
  }, [gameStatus]);

  const doReset = () => {
    setEnemyTurn(false);
    setSquares(emptyBoard);
  };

  return (
    <div className="container">
      <div className="board">
        <Board squares={squares} handleClick={handleClick} />
      </div>

      <div className="statistic">
        <div>PLAYER 1 (X)</div>
        <div>TIE</div>
        <div>PLAYER 2 (O)</div>
        <div className="score">{counter.player}</div>
        <div className="score">{counter.tie}</div>
        <div className="score">{counter.enemy}</div>
      </div>
    </div>
  );
};

export default Computer;
