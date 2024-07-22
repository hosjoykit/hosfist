import { BetType, GameResult } from "@/types/baseType";

export const myGameResult = (myBetType: BetType, rivalBetType: BetType) => {
  if (myBetType === rivalBetType) return GameResult.Draw;
  if (
    (myBetType == BetType.Rock && rivalBetType == BetType.Scissors) ||
    (myBetType == BetType.Scissors && rivalBetType == BetType.Cloth) ||
    (myBetType == BetType.Cloth && rivalBetType == BetType.Rock)
  ) {
    return GameResult.Win
  }
  return GameResult.Lose
}
