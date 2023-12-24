import c from "./bet-button.module.scss";

interface IProps {
  active: boolean;
  onClick: () => void;
  select: {
    id: number;
    market: string;
    odds: string;
    type?: "small" | "";
  };
}

const BetButton = (props: IProps) => {
  const { active, select, onClick } = props;
  const {market, odds, type} = select;
  
  return (
    <button
      className={`${c.betBtn} ${type === "small" && c.small} ${
        active && c.active
      }`}
      onClick={onClick}
    >
      <span className={c.market}>{market}</span>
      <span className={c.odds}>{odds}</span>
    </button>
  );
};

export default BetButton;
