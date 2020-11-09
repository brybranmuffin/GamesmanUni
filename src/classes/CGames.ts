import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGamesData } from "@/types/external/TRawGamesData";
import { TGameData } from "@/types/internal/TGameData";
import { IGames } from "@/interfaces/IGames";

export class CGames implements IGames {
  private readonly serverDataSource: string;
  protected gameDataArray: Array<TGameData>;

  constructor(serverDataSource?: string) {
    if (typeof serverDataSource == "undefined") {
      this.serverDataSource = `${
        require("@/datas/defaults.json").serverDataSource
      }/games`;
    } else {
      this.serverDataSource = serverDataSource;
    }
    this.gameDataArray = new Array<TGameData>();
  }

  getGameDataArray(): Array<TGameData> {
    return this.gameDataArray;
  }

  private async loadGameDataArray(): Promise<boolean> {
    let success: boolean = true;
    const gamesDataSource: string = `${this.serverDataSource}`;

    try {
      const httpResponse: AxiosResponse = await axios.get(gamesDataSource);
      this.processResponse(httpResponse);
    } catch (errorMessage) {
      success = false;
      console.error(errorMessage);
      console.error("Error: Failed to load games from server.");
      return success;
    }
    console.info(
      `Successfully loaded game data array from: ${gamesDataSource}.`
    );
    return success;
  }

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

  async initGames(): Promise<boolean> {
    let success: boolean = true;
    success = await this.loadGameDataArray();
    return success;
  }
}
