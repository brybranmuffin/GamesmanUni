<template>
  <div id="app">
    <AppHeader></AppHeader>
    <router-view />
    <AppFooter></AppFooter>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

@Component({
  components: {
    AppHeader,
    AppFooter
  },
  metaInfo: {
    title: "GamesmanUni",
    titleTemplate: "%s | GamesmanUni"
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@use "@/datas/styles/style";
</style>
