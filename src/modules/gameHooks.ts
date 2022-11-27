import React from "react";
import { player, WINNING_PATTERN } from "./gameConst";
import { BoardArray } from "./gameEntity";

export const useGetGameStatus = (board: BoardArray) => {
  const [gameStatus, setGameStatus] = React.useState({
    isWon: false,
    isDraw: false,
    enemyWin: false,
    playerWin: false,
  });

  const hasWinner = (player: string) =>
    WINNING_PATTERN.map((combination) =>
      combination.map((position) => board[position] === player).every(Boolean)
    ).some(Boolean);

  const checkStatus = () => {
    const playerWin = hasWinner(player.X);
    const enemyWin = hasWinner(player.O);
    const isWon = playerWin || enemyWin;
    const isDraw = board.filter(Boolean).length >= 9 && !isWon;

    const result = {
      isWon,
      isDraw,
      enemyWin,
      playerWin,
    };

    setGameStatus(result);
    return result;
  };

  return {
    gameStatus,
    checkStatus,
    hasWinner,
  };
};

const counterObj = {
  player: 0,
  tie: 0,
  enemy: 0,
};

export const usePersistCounter = () => {
  const countStorage = window.localStorage.getItem("counter");
  if (countStorage) {
    const { player, tie, enemy } = JSON.parse(countStorage);

    counterObj.player = player;
    counterObj.tie = tie;
    counterObj.enemy = enemy;
  }

  const counterState = React.useState(counterObj);
  const [counter] = counterState;

  React.useEffect(() => {
    window.localStorage.setItem("counter", JSON.stringify(counter));
  }, [counter]);

  return counterState;
};
