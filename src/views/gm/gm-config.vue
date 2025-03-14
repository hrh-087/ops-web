<template>
  <div class="ops-btn-list">
    <ExcelUploader
      @on-data-parsed="handleParsedData"
      :sheetNames="sheetNames"
      buttonName="批量导入"
      excelName="item.xlsx"
      excel-type="item"
    />
  </div>
</template>

<script setup lang="ts">
import ExcelUploader from "@/components/Excel/ExcelUploader.vue";
import GmRankApi from "@/api/gm/ranking-list";

const sheetNames = ["rank", "item"];

const handleParsedData = (data: Record<string, []>) => {
  GmRankApi.updateGameConfig({ data }).then(() => {
    ElMessage({
      type: "success",
      message: "更新成功",
    });
  });
};
</script>
