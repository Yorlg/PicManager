<script setup lang="ts">
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import { useRouter } from "vue-router";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
defineOptions({
  name: "Index"
});

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const uploadImages = () => {
  alert("Upload Images");
};
const router = useRouter();
// 跳转到登录页
const toLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div
    class="relative flex flex-col h-[100vh] items-center justify-center bg-white dark:bg-black transition-bg"
  >
    <div class="absolute top-0 right-0 m-4 z-10">
      <button
        class="px-3 py-1 border border-stone-200 rounded-lg drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/80 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400"
        @click="toLogin()"
      >
        Login
      </button>
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        class="ml-2"
        @change="dataThemeChange"
      />
    </div>
    <div class="absolute inset-0 overflow-hidden">
      <div class="jumbo absolute -inset-[10px] opacity-50" />
    </div>
    <h1
      class="relative flex items-center text-5xl font-bold text-gray-800 dark:text-white dark:opacity-80 transition-colors"
    >
      Pic
      <span class="ml-1 rounded-xl bg-current p-2 text-[0.7em] leading-none">
        <span class="text-white dark:text-black">Manager</span>
      </span>
    </h1>
    <div class="mt-4">
      <button
        class="px-3 py-1 border border-stone-200 rounded-full drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/40 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400"
        @click="uploadImages()"
      >
        Upload
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");

body {
  font-family: Inter, sans-serif;
}

@keyframes jumbo {
  from {
    background-position:
      50% 50%,
      50% 50%;
  }

  to {
    background-position:
      350% 50%,
      350% 50%;
  }
}

@keyframes jumbo {
  from {
    background-position:
      50% 50%,
      50% 50%;
  }

  to {
    background-position:
      350% 50%,
      350% 50%;
  }
}

.jumbo {
  --stripes: repeating-linear-gradient(
    100deg,
    #fff 0%,
    #fff 7%,
    transparent 10%,
    transparent 12%,
    #fff 16%
  );
  --stripes-dark: repeating-linear-gradient(
    100deg,
    #000 0%,
    #000 7%,
    transparent 10%,
    transparent 12%,
    #000 16%
  );
  --rainbow: repeating-linear-gradient(
    100deg,
    #60a5fa 10%,
    #e879f9 15%,
    #60a5fa 20%,
    #5eead4 25%,
    #60a5fa 30%
  );

  pointer-events: none;
  background-image: var(--stripes), var(--rainbow);
  filter: blur(10px) invert(100%);
  background-position:
    50% 50%,
    50% 50%;
  background-size: 300%, 200%;
  mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);
}

.jumbo::after {
  position: absolute;
  inset: 0;
  content: "";
  background-image: var(--stripes), var(--rainbow);
  background-attachment: fixed;
  background-size: 200%, 100%;
  mix-blend-mode: difference;
  animation: jumbo 60s linear infinite;
}

.dark .jumbo {
  background-image: var(--stripes-dark), var(--rainbow);
  filter: blur(10px) opacity(50%) saturate(200%);
}

.dark .jumbo::after {
  background-image: var(--stripes-dark), var(--rainbow);
}
</style>
