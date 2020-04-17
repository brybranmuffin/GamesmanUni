<template>
  <div id="app-header"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppHeader extends Vue {
  get themeDictionary(): Map<string, string> {
    return this.$store.getters.themeDictionary;
  }

  get theme(): string {
    return this.$store.getters.theme;
  }

  get layoutDictionary(): Map<string, string> {
    return this.$store.getters.layoutDictionary;
  }

  get layout(): string {
    return this.$store.getters.layout;
  }

  get languageDictionary(): Map<string, string> {
    return this.$store.getters.languageDictionary;
  }

  get language(): string {
    return this.$store.getters.language;
  }

  created(): void {
    document.body.classList.add(`c-theme-${this.theme}`);
    document.body.classList.add(`c-layout-${this.layout}`);
  }

  changeTheme(theme: string): void {
    document.body.classList.remove(`c-theme-${this.theme}`);
    document.body.classList.add(`c-theme-${theme}`);
    this.$store.commit("theme", theme);
  }

  changeLayout(layout: string): void {
    document.body.classList.remove(`c-layout-${this.layout}`);
    document.body.classList.add(`c-layout-${layout}`);
    this.$store.commit("layout", layout);
  }

  changeLanguage(language: string): void {
    this.$root.$i18n.locale = language;
    this.$store.commit("language", language);
  }
}
</script>
