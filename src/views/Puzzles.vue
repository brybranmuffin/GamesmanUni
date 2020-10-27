<template>
  <AppPuzzles></AppPuzzles>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppPuzzles from "@/components/AppPuzzles.vue";

@Component({
  components: {
    AppPuzzles,
  },
  metaInfo: {
    title: "Puzzles",
  },
})
export default class Puzzles extends Vue {}
</script>
