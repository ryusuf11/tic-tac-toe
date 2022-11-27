import { BoardProps } from "../modules/gameEntity";
import { FaRegCircle, FaTimes } from "react-icons/fa";

const Board = ({ squares, handleClick }: BoardProps) => {
  const getIcon = (player: string | null) => {
    return player === "x" ? <FaTimes /> : player === "o" ? <FaRegCircle /> : "";
  };
  return (
    <>
      {squares.map((square, idx) => (
        <div className="square" key={idx} onClick={() => handleClick(idx)}>
          {getIcon(square)}
        </div>
      ))}
    </>
  );
};

export default Board;
