import { TRawGamesData } from "@/types/external/TRawGamesData";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { CGames } from "@/classes/CGames";
import { AxiosResponse } from "axios";

export class CPuzzles extends CGames {
  constructor() {
    super(
      `${require("@/datas/defaults.json").serverDataSourcePuzzles}/puzzles`
    );
  }

  // In case the format is different in puzzles case
  protected processResponse(httpResponse: AxiosResponse): void {
    const rawData: TRawGamesData | TRawErrorData = httpResponse.data;
    if (rawData.status === "ok") {
      this.gameDataArray = rawData.response.map((rawGameData) => ({
        id: rawGameData.gameId,
        name: rawGameData.name,
        status: rawGameData.status,
      }));
    }
  }
}
