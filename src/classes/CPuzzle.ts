import { CGame } from "@/classes/CGame";

export class CPuzzle extends CGame {
  constructor() {
    super(
      `${require("@/datas/defaults.json").serverDataSourcePuzzles}/puzzles`
    );
  }
}
