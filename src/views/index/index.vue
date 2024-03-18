<script setup lang="ts">
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import { useRouter } from "vue-router";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { ref } from "vue";
defineOptions({
  name: "PureIndex"
});
const show = ref(false);
const router = useRouter();
const { dataTheme, dataThemeChange } = useDataThemeChange();

const drawer = ref(false);
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value.click(); // 触发input的click事件
}

function handleFileChange(event) {
  // 处理文件变更逻辑
  const files = event.target.files;
  console.log(files);
}
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  console.log(file);
}
function triggerFileInputs() {
  console.log("上传全部");
}
</script>

<template>
  <div
    class="relative flex flex-col h-[100vh] items-center justify-center bg-white dark:bg-black transition-bg"
  >
    <div class="absolute top-0 right-0 m-4 z-10">
      <button
        class="px-3 py-1 border border-stone-200 rounded-lg drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/80 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400"
        @click="router.push({ name: 'Login' })"
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
        @click="drawer = true"
      >
        Upload
      </button>
    </div>
    <el-drawer
      v-model="drawer"
      direction="ttb"
      :close-on-click-modal="true"
      :with-header="false"
      size="70%"
      class="remove-scrollbar"
    >
      <div
        class="h-full flex mx-auto container px-5 sm:px-10 md:px-10 lg:px-10 xl:px-10 2xl:px-60"
      >
        <input
          id="picker"
          ref="fileInput"
          type="file"
          name="file"
          class="hidden"
          accept=".jpeg,.jpg,.png,.gif,.tif,.bmp,.ico,.psd,.webp"
          multiple
          @change="handleFileChange"
        />
        <div
          class="p-4 bg-white rounded-md shadow-custom w-full"
          style="margin-bottom: 20px"
        >
          <h1
            class="tracking-wider text-2xl text-gray-700 mb-2 animate__bounceIn"
            style="text-shadow: -4px 4px 0 rgb(0 0 0 / 10%)"
          >
            Image Upload
          </h1>
          <p class="text-gray-500 text-sm">
            最大可上传 5.00 MB 的图片，上传队列最多 3 张。本站已托管 0 张图片。
          </p>
          <div
            id="picker-dnd"
            class="mt-3 rounded-md border-2 border-dotted border-stone-300"
            @click="triggerFileInput"
            @dragover.prevent
            @drop="handleDrop"
            @mouseenter="show = true"
            @mouseleave="show = false"
          >
            <div
              class="relative group flex flex-col justify-center items-center p-2 min-h-[150px] sm:min-h-[300px] space-y-4 text-gray-500 cursor-pointer"
            >
              <IconifyIconOnline
                v-if="show"
                icon="typcn:times"
                width="32px"
                height="32px"
                class="absolute top-1 right-1 flex justify-center items-center cursor-pointer text-xl text-center"
                style="color: #9baaa1"
                @click.stop="triggerFileInputs"
              />
              <p id="upload-all" title="点我上传全部">
                <!-- 图标 -->
                <IconifyIconOnline
                  icon="line-md:upload-outline-loop"
                  width="70px"
                  height="70px"
                  style="color: #52ffbd"
                  @click.stop="triggerFileInputs"
                />
              </p>
              <p class="text-md text-center">
                拖拽文件到这里，支持多文件同时上传<br />点击上面的图标上传全部已选择文件
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
@import url("@/style/css2.css");

:deep(.el-drawer__body) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
