<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@/layout/hooks/useClipboard";
import { message } from "@/utils/message";
import { debounce } from "@pureadmin/utils";

// 声明 props 类型
export interface CardProps {
  cardInline: {
    urlList: Array<string>;
  };
}
const props = withDefaults(defineProps<CardProps>(), {
  cardInline: () => ({ urlList: [] })
});
const newCardInline = ref(props.cardInline);
const { copyTextToClipboard } = useClipboard();

const handleCopyContent: any = debounce(
  content => {
    copyTextToClipboard(content);
    message("复制成功", { type: "success" });
  },
  500,
  true
);

const handleCopyAllContent: any = debounce(
  type => {
    const content = items.value
      .filter(item => item.name === type)
      .map(item => item.content)
      .join("\n");
    copyTextToClipboard(content);
    message("复制成功", { type: "success" });
  },
  500,
  true
);

function setHoverState(index, state) {
  items.value[index].state = state;
}
const items = ref([
  {
    name: "图片链接",
    content: "http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif",
    state: false
  },
  {
    name: "Html元素",
    content:
      '<img src="http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif" alt="medium.gif" title="medium.gif"/>',
    state: false
  },
  {
    name: "Markdown",
    content:
      "![medium.gif](http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif)",
    state: false
  },
  {
    name: "BBCode论坛",
    content:
      "[img]http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif[/img]",
    state: false
  },
  {
    name: "Thumbnail缩略图",
    content:
      "http://100.109.89.30:8089/thumbnails/726bfe9bde28a7bc94f854d3349ac488.png",
    state: false
  },
  { name: "删除地址", content: "http://del-url", state: false }
]);
</script>

<template>
  <div class="dark:text-white dark:bg-bg_color mb-4 relative w-full h-full">
    <el-dropdown style="position: absolute; top: 0; right: 0">
      <span class="text-cyan-700 hover:text-cyan-400">全部图片 </span>
      <template #dropdown>
        <el-dropdown-men v-for="(item, index) in items" :key="index">
          <el-dropdown-item @click="handleCopyAllContent(item.name)">{{
            item.name
          }}</el-dropdown-item>
        </el-dropdown-men>
      </template>
    </el-dropdown>
    <div
      v-for="(item, index) in items"
      :key="index"
      class="dark:text-white dark:bg-bg_color space-y-2"
    >
      <!-- 适应小屏幕尺寸的文字大小 -->
      <span class="font-medium text-sm sm:text-xl">{{ item.name }}</span>
      <div class="relative w-full mt-2 dark:bg-bg_color">
        <p
          class="dark:bg-bg_color dark:text-white scrollable-p text-base sm:text-lg leading-relaxed whitespace-normal sm:whitespace-nowrap select-all mb-2 bg-gray-100 hover:bg-gray-300 text-gray-900 rounded px-2 py-1 cursor-pointer"
        >
          {{ item.content }}
        </p>
        <IconifyIconOnline
          icon="ep:document-copy"
          width="24px"
          height="24px"
          sm:width="32px"
          sm:height="32px"
          class="absolute top-1 right-1 flex justify-center items-center cursor-pointer text-xl text-center"
          :style="{ color: items[index].state ? '#55EA8B' : '#A3E4BA' }"
          @mouseenter="setHoverState(index, true)"
          @mouseleave="setHoverState(index, false)"
          @click="handleCopyContent(item.content)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scrollable-p {
  overflow-x: auto; /* 启用横向滚动 */
  white-space: nowrap; /* 确保内容不会折行 */
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollable-p::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和 Opera */
}
</style>
