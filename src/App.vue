<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <SpeedInsights />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { ReDialog } from "@/components/ReDialog";
import { SpeedInsights } from "@vercel/speed-insights/vue";
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
