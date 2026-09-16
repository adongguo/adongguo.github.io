<script setup lang="ts">
// Stands in for the default theme's VPHomeHero (aliased in config.mts) so a
// page can set `heroScope: true` to show the constant scope in the hero image
// slot. The default layout decides whether the hero has an image by checking
// its slots once, which does not update on client-side navigation in
// production builds, so this wrapper provides that decision from frontmatter.
import { computed, provide } from 'vue'
import { useData } from 'vitepress'
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue'

import ConstantScope from './ConstantScope.vue'

const { frontmatter: fm } = useData()
const showScope = computed(() => fm.value.heroScope === true)

provide('hero-image-slot-exists', showScope)
</script>

<template>
  <VPHero
    v-if="fm.hero"
    class="VPHomeHero"
    :name="fm.hero.name"
    :text="fm.hero.text"
    :tagline="fm.hero.tagline"
    :image="fm.hero.image"
    :actions="fm.hero.actions"
  >
    <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
    <template #home-hero-info><slot name="home-hero-info" /></template>
    <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
    <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
    <template #home-hero-image>
      <ConstantScope v-if="showScope" />
      <slot v-else name="home-hero-image" />
    </template>
  </VPHero>
</template>
