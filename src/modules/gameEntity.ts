export type BoardArray = Array<string | null>;

export type BoardProps = {
  squares: BoardArray;
  handleClick: (idx: number) => void;
};
