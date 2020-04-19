import axios, { AxiosResponse } from "axios";
import { TRawErrorData } from "@/types/external/TRawErrorData";
import { TRawGameData } from "@/types/external/TRawGameData";
import { TRawPositionData } from "@/types/external/TRawPositionData";
import { TMoveData } from "@/types/internal/TMoveData";
import { TVariantData } from "@/types/internal/TVariantData";
import { IGame } from "@/interfaces/IGame";
import { CHistory } from "@/classes/CHistory";
import { COptions } from "@/classes/COptions";
import { CRound } from "@/classes/CRound";

export class CGame implements IGame {
  private readonly serverDataSource: string;
  private id: string;
  private name: string;
  private variantDataArray: Array<TVariantData>;
  private variantDataDictionary: Map<string, TVariantData>;
  private currentVariantData: TVariantData;
  private turnNameDictionary: Map<number, string>;
  private readonly vvhSelectorId: string;
  private options: COptions;
  private round: CRound;
  private history: CHistory;

  constructor() {
    this.serverDataSource = require("@/datas/defaults.json").serverDataSource;
    this.id = "";
    this.name = "";
    this.variantDataArray = new Array<TVariantData>();
    this.variantDataDictionary = new Map<string, TVariantData>();
    this.currentVariantData = {
      id: "",
      description: "",
      status: "",
      startPosition: ""
    };
    this.turnNameDictionary = new Map([
      [0, require("@/datas/defaults.json").turn0Name],
      [1, require("@/datas/defaults.json").turn1Name]
    ]);
    this.vvhSelectorId = require("@/datas/defaults.json").vvhSelectorId;
    this.options = new COptions();
    this.round = new CRound();
    this.history = new CHistory();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getVariantDataArray(): Array<TVariantData> {
    return this.variantDataArray;
  }

  getVariantDataDictionary(): Map<string, TVariantData> {
    return this.variantDataDictionary;
  }

  getCurrentVariantData(): TVariantData {
    return this.currentVariantData;
  }

  getTurnNameDictionary(): Map<number, string> {
    return this.turnNameDictionary;
  }

  getVvhSelectorId(): string {
    return this.vvhSelectorId;
  }

  getOptions(): COptions {
    return this.options;
  }

  getRound(): CRound {
    return this.round;
  }

  getHistory(): CHistory {
    return this.history;
  }

  setId(id: string): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setCurrentVariantData(variantId: string): void {
    this.currentVariantData = this.variantDataDictionary.get(variantId) || {
      id: "",
      description: "",
      status: "",
      startPosition: ""
    };
  }

  setTurn0Name(turn0Name: string): void {
    this.turnNameDictionary.set(0, turn0Name);
  }

  setTurn1Name(turn1Name: string): void {
    this.turnNameDictionary.set(1, turn1Name);
  }

  setOptions(options: COptions): void {
    this.options = options;
  }

  private async loadDetailedGameData(): Promise<boolean> {
    let success: boolean = true;
    if (!this.currentVariantData.id) {
      const detailedGameDataSource: string = `${this.serverDataSource}/games/${this.id}`;
      try {
        const httpResponse: AxiosResponse = await axios.get(
          detailedGameDataSource
        );
        const rawData: TRawGameData | TRawErrorData = httpResponse.data;
        if (rawData.status === "ok") {
          this.name = rawData.response.name;
          this.variantDataArray = rawData.response.variants.map(
            rawVariantData => ({
              id: rawVariantData.variantId,
              description: rawVariantData.description,
              status: rawVariantData.status,
              startPosition: rawVariantData.startPosition
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
      } catch (errorMessage) {
        success = false;
        console.error(errorMessage);
        console.error("Error: Failed to load detailed game data from server.");
        return success;
      }
      console.info(
        `Successfully loaded detailed game data from: ${detailedGameDataSource}.`
      );
    }
    return success;
  }

  private async loadPositionData(): Promise<boolean> {
    let success: boolean = true;
    let positionDataSource: string = this.serverDataSource;
    positionDataSource += `/games/${this.id}`;
    positionDataSource += `/variants/${this.currentVariantData.id}`;
    positionDataSource += `/positions/${encodeURIComponent(
      this.round.getPosition()
    )}`;
    try {
      const httpResponse: AxiosResponse = await axios.get(positionDataSource);
      const rawData: TRawPositionData | TRawErrorData = httpResponse.data;
      if (rawData.status === "ok") {
        this.round.setPositionValue(rawData.response.positionValue);
        this.round.setRemoteness(rawData.response.remoteness);
        this.round.setNextMoveDataArray(rawData.response.moves);
        this.round.setNextMoveDataDictionary(this.round.getNextMoveDataArray());
      }
    } catch (errorMessage) {
      success = false;
      console.error(errorMessage);
      console.error("Error: Failed to load position data from server.");
      return success;
    }
    console.info(
      `Successfully loaded position data from: ${positionDataSource}.`
    );
    return success;
  }

  async initGame(gameId: string): Promise<boolean> {
    let success: boolean = true;
    this.id = gameId;
    success = await this.loadDetailedGameData();
    return success;
  }

  async startNewGame(variantId: string): Promise<boolean> {
    let success: boolean = true;
    this.setCurrentVariantData(variantId);
    this.round = new CRound();
    this.round.setVariantId(this.currentVariantData.id);
    this.round.setVariantDescription(this.currentVariantData.description);
    this.round.setTurnName(this.turnNameDictionary.get(0) as string);
    this.round.setPosition(this.currentVariantData.startPosition);
    success = await this.loadPositionData();
    this.history = new CHistory();
    this.history.updateHistory(this.round, "curr");
    // Make computer move if computer goes first
    if (this.isComputerMove()) {
      if (!(await this.makeComputerMove())) return false;
    }
    return success;
  }

  async runMove(): Promise<boolean> {
    // Validate move
    let validMove = false;
    for (let nextMove of this.round.getNextMoveDataArray()) {
      if (this.round.getMove() == nextMove.move) {
        validMove = true;
        break;
      }
    }
    if (!validMove) return false;

    // Report to parent frame
    postMessageToParent(this.round.getMove());

    this.round.setMoveValue(this.round.getMove());
    this.history.updateHistory(this.round, "last");
    const oldRound: CRound = this.round;
    this.round = new CRound(oldRound);
    this.round.setRoundNumber(oldRound.getRoundNumber() + 1);
    this.round.setTurnId((oldRound.getTurnId() + 1) % 2);
    this.round.setTurnName(
      this.turnNameDictionary.get(this.round.getTurnId()) as string
    );
    this.round.setPosition(
      (oldRound
        .getNextMoveDataDictionary()
        .get(oldRound.getMove()) as TMoveData).position
    );
    if (!(await this.loadPositionData())) return false;
    this.history.updateHistory(this.round, "curr");

    // Make computer move
    if (this.isComputerMove()) {
      if (!(await this.makeComputerMove())) return false;
    }

    return true;
  }

  isComputerMove(): boolean {
    // Computer makes the first move for connect 4 and sim
    if (this.id == "connect4" || this.id == "sim") {
      return this.round.getRoundNumber() % 2 == 1;
    }
    return this.round.getRoundNumber() % 2 == 0;
  }

  async makeComputerMove(): Promise<boolean> {
    // Always make the best move for now
    const nextMoves = this.round.getNextMoveDataArray();
    if (nextMoves.length == 0) return true; // No move to make

    // Figure out computer's move
    let bestMoveValue = nextMoves[0].moveValue;
    let computerMoves = [];
    for (let nextMove of nextMoves) {
      if (nextMove.deltaRemoteness != 0 || nextMove.moveValue != bestMoveValue)
        break;
      computerMoves.push(nextMove.move);
    }
    let computerMove =
      computerMoves[
        Math.min(
          computerMoves.length - 1,
          Math.floor(Math.random() * computerMoves.length)
        )
      ];

    // Override computer move for some special cases
    if (this.round.getRoundNumber() == 1 && this.id == "connect4") {
      computerMove = "A_X_20";
    }

    this.round.setMove(computerMove);
    return await this.runMove();
  }

  undoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() - 1) as CRound;
    this.history.updateHistory(this.round, "undo");
  }

  redoMove(): void {
    this.round = this.history
      .getRoundDictionary()
      .get(this.round.getRoundNumber() + 1) as CRound;
    this.history.updateHistory(this.round, "redo");
  }
}

function postMessageToParent(move: string) {
  console.log("function is being called");

  if (parent != window) {
    console.log("this is working");
    parent.postMessage(move, "*");
  } else {
    console.error("Should be in an iframe");
  }
}
