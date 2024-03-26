<script setup lang="ts">
import LandingHeader from '@/components/header/LandingHeader.vue'
</script>

<template>
  <div class="min-h-screen">
    <landing-header />
    <section id="hero" class="px-8 py-50 text-center">
      <h1
        class="tagline bg-[\-webkit-linear-gradient(315deg, #42d392 25%, #647eff)] mx-auto my-0 max-w-[960px] bg-clip-text text-[76px] font-black leading-tight tracking-[-1.5px] transition-colors duration-500"
      >
        Modern
        <span class="accent"> Precision </span>
        <br />
        Always On Time
      </h1>
      <p
        class="description mx-auto mb-10 mt-6 max-w-[960px] text-[22px] leading-normal text-[rgba(60,60,60,0.7)] transition-[color] duration-[0.5s] dark:text-[rgba(255,255,255,0.7)]"
      >
        Experience the epitome of modernity and precision with our cutting-edge attendance app,
        ensuring you're always on time, every time.
      </p>
    </section>
  </div>
</template>

<style scoped lang="postcss">
html:not(.dark) .accent,
.dark .tagline {
  @apply bg-clip-text;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@media (max-width: 960px) {
  .tagline {
    @apply text-[64px] tracking-[-0.5px];
  }
  .description {
    @apply mb-12 text-lg;
  }
}
@media (max-width: 768px) {
  .tagline {
    @apply text-5xl tracking-[-0.5px];
  }
}
@media (max-width: 576px) {
  #hero {
    @apply px-8 py-30;
  }
  .description {
    @apply mx-0 mb-[30px];
  }
}
@media (max-width: 370px) {
  .tagline {
    @apply text-4xl;
  }
}
</style>
