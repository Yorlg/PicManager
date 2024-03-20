<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@/layout/hooks/useClipboard";
import { message } from "@/utils/message";
import { debounce } from "@pureadmin/utils";

// 声明 props 类型
export interface CardProps {
  cardInline: {
    user: string;
    region: string;
  };
}
const props = withDefaults(defineProps<CardProps>(), {
  cardInline: () => ({ user: "", region: "" })
});
const newCardInline = ref(props.cardInline);
const { copyTextToClipboard } = useClipboard();

const copyContent = (content: string) => {
  copyTextToClipboard(content);
  message("复制成功", { type: "success" });
};
const handleCopyContent = debounce(copyContent, 500, true);
function setHoverState(index, state) {
  items.value[index].state = state;
}
const items = ref([
  {
    name: "url",
    content: "http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif",
    state: false
  },
  {
    name: "html",
    content:
      '<img src="http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif" alt="medium.gif" title="medium.gif"/>',
    state: false
  },
  {
    name: "markdown",
    content:
      "![medium.gif](http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif)",
    state: false
  },
  {
    name: "BBCode",
    content:
      "[img]http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif[/img]",
    state: false
  },
  {
    name: "thumbnail",
    content:
      "http://100.109.89.30:8089/thumbnails/726bfe9bde28a7bc94f854d3349ac488.png",
    state: false
  },
  { label: "DelUrl", name: "delUrl", content: "http://del-url", state: false }
]);
</script>

<template>
  <div class="dark:text-white dark:bg-black/40 mb-4">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="dark:text-white dark:bg-black/40"
    >
      <span class="font-semibold text-xl">{{ item.name }}</span>
      <div class="relative w-full mt-2">
        <p
          class="text-lg leading-relaxed whitespace-nowrap select-all mb-2 bg-gray-50 hover:bg-gray-300 text-gray-900 rounded px-2 py-1 cursor-pointer"
        >
          {{ item.content }}
        </p>
        <IconifyIconOnline
          icon="ep:document-copy"
          width="32px"
          height="32px"
          class="absolute top-1 right-1 flex justify-center items-center cursor-pointer text-xl text-center"
          :style="{ color: items[index].state ? '#55EA8B' : '#a1d3b3' }"
          @mouseenter="setHoverState(index, true)"
          @mouseleave="setHoverState(index, false)"
          @click="handleCopyContent"
        />
      </div>
    </div>
  </div>
</template>
