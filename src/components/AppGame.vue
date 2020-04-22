<template>
  <div id="app-game">
    <div id="app-game-header">
      <h2 id="app-game-title">
        {{ game.getId() == "0ton" ? "0-to-10 by 1-or-2" : game.getName() }}
      </h2>
      <h3>{{ game.getRound().getVariantDescription() }}</h3>
    </div>
    <div id="app-game-body">
      <div id="app-game-body-main">
        <div id="app-game-body-main-instructions">
          <h3>How to play?</h3>
          <ExternalMarkdown
            class="c-markdown"
            :relativePath="`gameInstructions/${game.getId()}.md`"
          ></ExternalMarkdown>
        </div>
        <div id="app-game-body-main-board">
          <GameBoard></GameBoard>
        </div>
        <div id="app-game-body-main-results">
          <template v-if="game.getRound().getRemoteness() == 0">
            <p>
              Game over.
              <template v-if="game.getRound().getPositionValue() == 'lose'">
                <template v-if="game.isComputerMove()">
                  <!-- Computer's turn -->
                  🎉 You won!
                </template>
                <template v-else>
                  <!-- The player's turn -->
                  🤖 The computer won.
                </template>
              </template>
              <template v-else-if="game.getRound().getPositionValue() == 'win'">
                <template v-if="game.isComputerMove()">
                  <!-- Computer's turn -->
                  🤖 The computer won.
                </template>
                <template v-else>
                  <!-- The player's turn -->
                  🎉 You won!
                </template>
              </template>
              <template v-else-if="game.getRound().getPositionValue() == 'tie'"
                >👌 It's a tie!</template
              >
              <template v-else>👌 It's a draw!</template>
            </p>
            <p>{{ formatHumanMovesSummary(game.getHumanMovesSummary()) }}</p>
          </template>
          <template v-else>
            <p>The game's not wrapped up yet... Who'll win? 🤔</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import moment from "moment";
import { CGame } from "@/classes/CGame";
import { COptions } from "@/classes/COptions";
import GameBoard from "@/components/GameBoard.vue";
import GameInstruction from "@/components/GameInstruction.vue";
import GameOptions from "@/components/GameOptions.vue";
import GameVvh from "@/components/GameVvh.vue";
import ExternalMarkdown from "@/components/ExternalMarkdown.vue";

@Component({
  components: {
    GameBoard,
    GameInstruction,
    GameOptions,
    GameVvh,
    ExternalMarkdown
  }
})
export default class AppGame extends Vue {
  interval = setInterval(() => this.updateInterval(), 1000);
  dateTime = moment();
  timer = moment().startOf("day");

  get date(): string {
    return this.dateTime.format("LL");
  }

  get time(): string {
    return this.dateTime.format("LTS");
  }

  get game(): CGame {
    return this.$store.getters.game;
  }

  get options(): COptions {
    return this.$store.getters.options;
  }

  get vvhVisibility(): boolean {
    return this.$store.getters.vvhVisibility;
  }

  metaInfo(): { title: string } {
    return {
      title:
        this.game.getName() +
        " Game: " +
        this.game.getCurrentVariantData().description
    };
  }

  formatHumanMovesSummary(humanMovesSummary: {
    [key: string]: number;
  }): string {
    // "\xa0" is equivalent to &nbsp; in HTML
    let str = "";
    str += `${humanMovesSummary.win}\xa0winning\xa0move`;
    if (humanMovesSummary.win > 1) str += "s";
    str += `, ${humanMovesSummary.tie}\xa0tie\xa0move`;
    if (humanMovesSummary.tie > 1) str += "s";
    str += `, and ${humanMovesSummary.lose}\xa0losing\xa0move`;
    if (humanMovesSummary.lose > 1) str += "s";
    return `You made ${str}.`;
  }

  initInterval(): void {
    clearInterval(this.interval);
    this.timer = moment().startOf("day");
    this.interval = setInterval(() => this.updateInterval(), 1000);
  }

  updateInterval(): void {
    this.dateTime = moment();
    this.timer.add(1, "s");
  }

  async created(): Promise<void> {
    this.initInterval();
    await this.$store.dispatch("initGame", this.$route.params.gameId);
    await this.$store.dispatch("startNewGame", this.$route.params.variantId);
  }

  get isInvalidUndo(): boolean {
    return this.game.getHistory().getCurrentRoundNumber() === 1;
  }

  undid(): void {
    this.$store.commit("undoMove");
  }

  restarted(): void {
    this.initInterval();
    this.$store.dispatch("startNewGame", this.$route.params.variantId);
  }

  get isInvalidRedo(): boolean {
    return (
      this.game.getHistory().getCurrentRoundNumber() >=
      this.game.getHistory().getRoundArray().length
    );
  }

  redid(): void {
    this.$store.commit("redoMove");
  }

  @Watch("vvhVisibility")
  async onShowVvh(): Promise<void> {
    if (this.vvhVisibility) {
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      this.$store.commit("drawVvh");
    }
  }
}
</script>

<style scoped lang="scss">
@mixin flexItem(
  $flexDirection: row,
  $flexWrap: nowrap,
  $justifyContent: flex-start,
  $alignItems: stretch,
  $alignContent: stretch
) {
  display: flex;
  flex-direction: $flexDirection;
  flex-wrap: $flexWrap;
  justify-content: $justifyContent;
  align-items: $alignItems;
  align-content: $alignContent;
}

@mixin flexContent($flexGrow: 0, $flexShrink: 1, $flexBasis: auto) {
  flex-grow: $flexGrow;
  flex-shrink: $flexShrink;
  flex-basis: $flexBasis;
}

#app-game {
  @include flexItem(column, nowrap, flex-start, stretch, stretch);
}

#app-game-body {
  @include flexItem(row, wrap, space-between, flex-end, stretch);
  > * {
    @include flexContent(1, 1, 0);
  }
}

#app-game-body-main {
  @include flexItem(column, nowrap, flex-start, space-between, stretch);
  margin: 0.25em;
  padding: 0.25em;
}

#app-game-body-main-instructions {
  border: 2px solid var(--neutralColor);
  border-radius: 0.5em 0.5em 0 0;
  padding: 0.5em 1em;
}

#app-game-body-main-board {
  border: 2px solid var(--neutralColor);
  padding: 1em;
  margin-top: -2px;
}

#app-game-body-main-results {
  border: 2px solid var(--neutralColor);
  border-radius: 0 0 0.5em 0.5em;
  padding: 0.5em 1em;
  margin-top: -2px;
}
</style>
