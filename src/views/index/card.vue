<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@/layout/hooks/useClipboard";
import { message } from "@/utils/message";

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
  <el-tabs :model="tabs" model-value="url">
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
      ><div class="relative flex h-10 items-center space-y-2">
        <div class="relative w-full">
          <p
            class="text-lg leading-relaxed whitespace-nowrap select-all mt-1 bg-gray-50 hover:bg-gray-300 text-gray-900 rounded px-2 py-1 cursor-pointer"
          >
            {{ tab.content }}
          </p>
          <IconifyIconOnline
            icon="ep:document-copy"
            width="32px"
            height="32px"
            class="absolute top-1 right-1 flex justify-center items-center cursor-pointer text-xl text-center"
            style="color: #a1d3b3"
            @click="copyContent(tab.content)"
          />
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
