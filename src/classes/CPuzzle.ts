import { CGame } from "@/classes/CGame";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGameData } from "@/types/external/TRawGameData";
import axios, { AxiosResponse } from "axios";
import { TVariantData } from "@/types/internal/TVariantData";

export class CPuzzle extends CGame {
  constructor() {
    super(
      `${require("@/datas/defaults.json").serverDataSourcePuzzles}/puzzles`
    );
  }

  protected processResponse(httpResponse: AxiosResponse): void {
    const rawData: TRawGameData | TRawErrorData = httpResponse.data;
    if (rawData.status === "ok" || rawData.status === "available") {
      this.name = rawData.response.name;
      this.variantDataArray = rawData.response.variants.map(
        (rawVariantData) => ({
          id: rawVariantData.variantId,
          description: rawVariantData.description,
          status: rawVariantData.status,
          startPosition: rawVariantData.startPosition,
        })
      );
      this.variantDataDictionary = new Map<string, TVariantData>();
      for (let i: number = 0; i < this.variantDataArray.length; i++) {
        this.variantDataDictionary.set(
          this.variantDataArray[i].id,
          this.variantDataArray[i]
        );
      }
      this.round.setVariantId(this.variantDataArray[0].id);
    }
  }
}
