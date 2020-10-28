<template>
  <PuzzleVariants></PuzzleVariants>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PuzzleVariants from "@/components/PuzzleVariants.vue";

@Component({
  components: {
    PuzzleVariants,
  },
})
export default class VariantsPuzzles extends Vue {}
</script>
