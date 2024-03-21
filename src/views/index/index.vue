<script setup lang="tsx">
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { useColumns } from "./columns";
import CryptoJS from "crypto-js";
import Delete from "@iconify-icons/ep/delete";
import Upload from "@iconify-icons/ep/upload";
import View from "@iconify-icons/ep/view";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey, multipleTabsKey } from "@/utils/auth";
import cards, { type CardProps } from "./card.vue";
import { addDialog } from "@/components/ReDialog";
defineOptions({
  name: "PureIndex"
});
// 登录信息
const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
const { columns } = useColumns();
// 表格无限滚动
const tableData = reactive([]);
const data = ref([]);
const page = ref(0);
const total = ref(10);
const isBottom = ref(false);

const load = () => {
  if (isBottom.value) return;

  page.value++;
  if (page.value <= total.value) {
    data.value = data.value.concat(tableData);
  }

  if (page.value === total.value) {
    isBottom.value = true;
  }
};
// end 表格无限滚动

const show = ref(false);
const router = useRouter();
const { dataTheme, dataThemeChange } = useDataThemeChange();

const drawer = ref(false);
const fileInput = ref(null);

// 图片上传逻辑 - start
// 临时定义规则
const fileRule = [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "tif",
  "bmp",
  "ico",
  "psd",
  "webp"
];

function triggerFileInput() {
  fileInput.value.click(); // 触发input的click事件
}

function handleDrop(event) {
  event.preventDefault();
  processFiles(event.dataTransfer.files);
}

function handleFileChange(event) {
  processFiles(event.target.files);
}

async function processFiles(files) {
  const validFiles = Array.from(files).filter(
    file => isValidFileType(file) && isValidFileSize(file)
  );
  for (const file of validFiles) {
    try {
      const base64 = await readFileAsBase64(file);
      addToTableData(file, base64, "上传中");
    } catch ({ error, fileName }) {
      // 从reject中解构error和fileName
      message(`读取文件${fileName}时发生错误: ${error.message}`, {
        type: "error"
      });
    }
  }
}

function isValidFileType(file) {
  const fileType = file.name.split(".").pop().toLowerCase();
  if (!fileRule.includes(fileType)) {
    message(`${file.name}, 文件类型错误`, { type: "error" });
    return false;
  }
  return true;
}

function isValidFileSize(file) {
  if (file.size > 5 * 1024 * 1024) {
    message(`${file.name}, 文件大小超出限制`, { type: "error" });
    return false;
  }
  return true;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject({ error: reader.error, fileName: file.name }); // 将错误和文件名一起传递
    reader.readAsDataURL(file);
  });
}

async function addToTableData(file, base64, uploadStatus) {
  const fileName = file.name;
  const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";
  const md5 = await computeMD5(base64); // 假设这个函数异步计算并返回MD5值

  // 检查是否存在具有相同文件名和MD5值的文件
  const isDuplicate = tableData.some(
    item => item.fileName === fileName && item.md5 === md5
  );
  if (isDuplicate) {
    console.log(`文件 "${fileName}" (MD5: ${md5}) 已存在，将被忽略。`);
    return; // 如果存在重复项，则不添加到tableData中，并返回
  }

  // 直接使用tableData的长度作为index
  const index = tableData.length;
  tableData.push({
    index,
    image: base64,
    fileName,
    fileSize,
    md5,
    status: uploadStatus,
    file
  });
}
// 比对 MD5 值
async function computeMD5(data) {
  // 这里使用CryptoJS来计算MD5，具体实现依赖于你的环境
  return CryptoJS.MD5(data).toString();
}
// 删除
function handleDelete(row) {
  // 获取 row的md5
  const md5 = row.md5;
  // 从tableData中删除
  tableData.splice(
    tableData.findIndex(v => v.md5 === md5),
    1
  );
}
function triggerFileInputs() {
  console.log("上传全部");
}

function handleUpload(row) {
  // 根据 index 修改状态
  tableData[row.index].status = "成功";
}
// 图片上传逻辑 - end

// 清空 tableData
function removeAll() {
  tableData.splice(0, tableData.length);
}
// 获取标签类型
function getTagType(status) {
  console.log(status);
  switch (status) {
    case "上传中":
      return "primary"; // 蓝色
    case "成功":
      return "success"; // 绿色
    case "失败":
      return "danger"; // 红色
    default:
      return "info"; // 默认不设置类型，使用默认颜色
  }
}
const handleClose = async (done: () => void) => {
  if (tableData.length > 0) {
    try {
      await ElMessageBox.confirm("是否清空上传列表?");
      removeAll();
    } catch {
      // 用户取消或关闭对话框，不执行操作
    }
  }
  done();
};
// handLogin 跳转登录页
function handleLogin() {
  // 如果已经包含token，直接跳转到首页
  if (Cookies.get(multipleTabsKey) && userInfo) {
    router.push("/welcome");
    return;
  }
  router.push("/login");
}
// 查看详细信息的弹出框
function handleView(row) {
  addDialog({
    draggable: true,
    showClose: false,
    hideFooter: true,
    top: "10vh",
    contentRenderer: () => cards,
    props: {
      cardInline: {
        urlList: [row.image]
      }
    }
  });
}
</script>

<template>
  <div
    class="relative flex flex-col h-[100vh] items-center justify-center bg-white dark:bg-black transition-bg"
  >
    <div class="absolute top-0 right-0 m-4 z-10 dark:bg-black/40">
      <button
        class="px-3 py-1 border border-stone-200 rounded-lg drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/80 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400"
        @click="handleLogin"
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
      :before-close="handleClose"
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
          class="p-4 bg-white rounded-md shadow-custom w-full dark:text-white dark:bg-black/40"
          style="margin-bottom: 20px"
        >
          <h1
            class="tracking-wider text-2xl text-gray-700 mb-2 animate__bounceIn dark:text-white"
            style="text-shadow: -4px 4px 0 rgb(0 0 0 / 10%)"
          >
            Image Upload
          </h1>
          <p class="text-gray-500 text-sm">
            最大可上传 5.00 MB 的图片，上传队列最多 3 张。本站已托管 0 张图片。
          </p>
          <div
            id="picker-dnd"
            class="mt-3 rounded-md border-2 border-dotted border-stone-300 dark:bg-black/40"
            @click="triggerFileInput"
            @dragover.prevent
            @drop="handleDrop"
            @mouseenter="show = true"
            @mouseleave="show = false"
          >
            <div
              class="relative group flex flex-col justify-center items-center p-2 min-h-[150px] sm:min-h-[300px] text-gray-500 cursor-pointer"
            >
              <IconifyIconOnline
                v-if="show"
                icon="typcn:times"
                width="32px"
                height="32px"
                class="absolute top-1 right-1 flex justify-center items-center cursor-pointer text-xl text-center"
                style="color: #9baaa1"
                @click.stop="removeAll"
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
          <pure-table
            v-show="tableData.length > 0"
            v-el-table-infinite-scroll="load"
            :infinite-scroll-disabled="isBottom"
            table-layout="auto"
            class="mt-4"
            :data="tableData"
            :columns="columns"
            max-height="400"
          >
            <template #image="{ row, index }">
              <el-image
                preview-teleported
                loading="lazy"
                :src="row.image"
                :preview-src-list="tableData.map(v => v.image)"
                :initial-index="index"
                fit="cover"
                max-height="420px"
                class="w-[80px] h-[80px] rounded"
              />
            </template>
            <template #status="{ row }">
              <el-tag
                :type="getTagType(row.status)"
                :closable="false"
                size="large"
                disabled="disabled"
              >
                {{ row.status }}
              </el-tag>
            </template>
            <template #operation="{ row }">
              <div class="flex flex-col items-center justify-center space-y-1">
                <el-button
                  v-if="row.status === '成功'"
                  link
                  type="primary"
                  :icon="useRenderIcon(View)"
                  @click="handleView(row)"
                >
                  查看
                </el-button>
                <el-button
                  v-else
                  link
                  type="primary"
                  :icon="useRenderIcon(Upload)"
                  @click="handleUpload(row)"
                >
                  上传
                </el-button>
                <el-button
                  link
                  type="primary"
                  style="margin: 0"
                  :icon="useRenderIcon(Delete)"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </pure-table>
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
