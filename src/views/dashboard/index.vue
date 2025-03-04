<template>
  <div class="app-container">
    <h1>南天门</h1>
    <!-- <ExcelUploader @onDataParsed="handleParsedData"/> -->
  </div>
</template>

<script setup lang="ts">
import ExcelUploader from "@/components/Excel/ExcelUploader.vue";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const jsonData = ref([]); // 存储 Excel 解析后的数据

const handleParsedData = (data: any) => {
  jsonData.value = data;
  console.log("Excel 解析结果:", data);
};
</script>

<style lang="scss" scoped></style>
