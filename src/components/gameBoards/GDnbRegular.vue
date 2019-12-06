<template>
  <div id="app-game-board-dnb-regular">
    <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="line0">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line1">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line2">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line3">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line4">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line5">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line6">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line7">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line8">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line9">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line10">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="line11">
          <line x1="5" y1="5" x2="33" y2="5" stroke="black" width="1" />
        </g>
        <g id="board">
          <circle id="dot" cx="5" cy="5" r="1" />
          <use xlink:href="#dot" transform="translate(0 28)" />
          <use xlink:href="#dot" transform="translate(0 56)" />
          <use xlink:href="#dot" transform="translate(28 0)" />
          <use xlink:href="#dot" transform="translate(28 28)" />
          <use xlink:href="#dot" transform="translate(28 56)" />
          <use xlink:href="#dot" transform="translate(56 0)" />
          <use xlink:href="#dot" transform="translate(56 28)" />
          <use xlink:href="#dot" transform="translate(56 56)" />
        </g>
        <g id="turn-0-token">
          <circle id="blue" cx="17" cy="17" r="3" />
        </g>
        <g id="turn-1-token">
          <circle id="red" cx="17" cy="17" r="3" />
        </g>
        <circle
          id="hint"
          x1="5"
          y1="5"
          x2="33"
          y2="5"
          stroke="black"
          width="1"
        />
        <line
          id="move0"
          x1="5"
          y1="5"
          x2="33"
          y2="5"
          stroke="black"
          width="1"
        />
        <!-- <line id="move1" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move2" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move3" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move4" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move5" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move6" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move7" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move8" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move9" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move10" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" />
        <line id="move11" x1="5" y1="5" x2="33" y2="5" stroke="blue" width="1" /> -->
      </defs>
      <use xlink:href="#line0" x="0" y="0" />
      <use xlink:href="#line1" x="28" y="0" />
      <use xlink:href="#line2" x="0" y="28" />
      <use xlink:href="#line3" x="28" y="28" />
      <use xlink:href="#line4" x="0" y="56" />
      <use xlink:href="#line5" x="28" y="56" />
      <use xlink:href="#line6" x="0" y="-10" transform="rotate(90)" />
      <use xlink:href="#line7" x="28" y="-10" transform="rotate(90)" />
      <use xlink:href="#line8" x="0" y="-38" transform="rotate(90)" />
      <use xlink:href="#line9" x="28" y="-38" transform="rotate(90)" />
      <use xlink:href="#line10" x="0" y="-66" transform="rotate(90)" />
      <use xlink:href="#line11" x="28" y="-66" transform="rotate(90)" />
      <use xlink:href="#board" x="0" y="0" />

      <g v-for="line in lineCount" :key="line">
        <use
          v-if="boardData[line].token === '1'"
          xlink:href="#turn-0-token"
          :x="((line - 1) % 2) * 33"
          :y="Math.floor((line - 1) / 2) * 33"
        />
        <use
          v-else-if="boardData[line].token === 'o'"
          xlink:href="#turn-1-token"
          :x="((line - 1) % 2) * 33"
          :y="Math.floor((line - 1) / 2) * 33"
        />
        <g v-else>
          <use
            v-if="boardData[line].hint"
            :class="'hint-' + boardData[line].hint"
            xlink:href="#hint"
          />
          <use
            :class="remoteness && 'move-pointer'"
            @click="remoteness && runMove((line - 1).toString())"
            xlink:href="#move0"
          />
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class GDnbRegular extends Vue {
  lineCount = 12;
  boardData: {
    [line: number]: { token: string; hint: string };
  } = this.initBoardData();

  get loadingStatus() {
    return this.$store.getters.loadingStatus;
  }

  get roundNumber() {
    return this.$store.getters.roundNumber;
  }

  get position() {
    return this.$store.getters.position;
  }

  get remoteness() {
    return this.$store.getters.remoteness;
  }

  get nextMoveDataArray() {
    return this.$store.getters.nextMoveDataArray;
  }

  initBoardData(): { [line: number]: { token: string; hint: string } } {
    let boardData: { [line: number]: { token: string; hint: string } } = {};
    for (let line: number = 1; line <= this.lineCount; line++) {
      boardData[line] = { token: "", hint: "" };
    }
    return boardData;
  }

  updateBoardData(): void {
    console.log(this.position);
    if (!this.loadingStatus) {
      this.boardData = this.initBoardData();
      for (let line: number = 1; line <= this.lineCount; line++) {
        this.boardData[line].token = this.position[line];
        console.log(this.boardData[line].token);
      }
      for (let nextMoveData of this.nextMoveDataArray) {
        this.boardData[+nextMoveData.move].hint = nextMoveData.moveValue;
      }
    }
    console.log(this.boardData);
  }

  runMove(move: string): void {
    this.$store.dispatch("runMove", move);
  }

  created() {
    this.boardData = this.initBoardData();
  }

  mounted() {
    this.updateBoardData();
  }

  @Watch("loadingStatus")
  onAsyncRoundChange(): void {
    !this.loadingStatus && this.updateBoardData();
  }

  @Watch("roundNumber")
  onSyncRoundChange(): void {
    this.updateBoardData();
  }
}
</script>

<style lang="scss" scoped>
svg {
  height: 15em;
  width: 15em;
  margin: auto;
  vertical-align: middle;
  > * {
    fill: none;
    stroke: var(--neutralColor);
    stroke-width: 2;
  }
}

#turn- {
  &0-token {
    stroke: var(--turn0Color);
  }
  &1-token {
    stroke: var(--turn1Color);
  }
}

.hint- {
  &win {
    stroke: var(--winColor);
  }
  &draw {
    stroke: var(--drawColor);
  }
  &tie {
    stroke: var(--tieColor);
  }
  &lose {
    stroke: var(--loseColor);
  }
}

#move {
  fill: var(--backgroundColor);
  fill-opacity: 0;
  stroke-opacity: 0;
}

.move-pointer {
  cursor: pointer;
}
</style>
