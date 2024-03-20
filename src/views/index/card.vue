<script setup lang="ts">
import { ref } from "vue";
import { Select } from "@element-plus/icons-vue";
import type { TabsPaneContext } from "element-plus";

// 声明 props 类型
export interface CardProps {
  cardInline: {
    user: string;
    region: string;
  };
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
const props = withDefaults(defineProps<CardProps>(), {
  cardInline: () => ({ user: "", region: "" })
});

const newCardInline = ref(props.cardInline);

function handleTabsEdit() {
  alert("复制全部内容");
}
const tabs = ref([
  {
    label: "URL",
    name: "url",
    content: "http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif"
  },
  {
    label: "HTML",
    name: "html",
    content:
      '<img src="http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif" alt="medium.gif" title="medium.gif"/>'
  },
  {
    label: "Markdown",
    name: "markdown",
    content:
      "![medium.gif](http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif)"
  },
  {
    label: "BBCode",
    name: "BBCode",
    content:
      "[img]http://100.109.89.30:8089/i/2024/03/20/65faa14993de4.gif[/img]"
  },
  {
    label: "Thumbnail",
    name: "thumbnail",
    content:
      "http://100.109.89.30:8089/thumbnails/726bfe9bde28a7bc94f854d3349ac488.png"
  },
  { label: "DelUrl", name: "delUrl", content: "http://del-url" }
]);
</script>

<template>
  <el-tabs :model="tabs" model-value="url" class="demo-tabs">
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
      ><div class="h-20 space-y-2 flex">
        <p
          class="h-full items-center text-lg leading-relaxed whitespace-nowrap select-all mt-1 bg-gray-50 hover:bg-gray-300 text-gray-900 rounded px-2 py-1 cursor-pointer"
        >
          {{ tab.content }}
        </p>
      </div></el-tab-pane
    >
  </el-tabs>
</template>

<style lang="scss" scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
