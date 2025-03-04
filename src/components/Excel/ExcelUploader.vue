<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      action="#"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      accept=".xls, .xlsx"
      @change="handleFileUpload"
    >
      <template #trigger>
        <el-button type="primary">{{ buttonName || "上传文件" }}</el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip text-red">
          限制上传1个文件(新文件会覆盖旧文件)
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";

interface ExcelRow {
  [key: string]: string | string[] | number;
}

// defineComponent({name:"UploadFilled "});
const props = defineProps(["buttonName"]);
const emit = defineEmits(["onDataParsed", "checkDataFormat"]);

// const openDialog = () => {

// };

// const closeDialog = () => {
//   dialogVisible.value = false;
// };

// const dialogVisible = ref(false);

const upload = ref<UploadInstance>();
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const handleFileUpload = (uploadFile: any) => {
  const file = uploadFile.raw;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // 取第一个工作表
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 解析 Excel 数据
    let rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 触发检测数据格式
    emit("checkDataFormat", rawData.length > 0 ? rawData[0] : []);

    // 格式化数据，合并空列名的数据
    const formattedData: ExcelRow[] = formatExcelData(rawData);

    // 触发事件，向父组件传递数据
    emit("onDataParsed", formattedData);
  };

  reader.readAsArrayBuffer(file);
};

// 处理 Excel 数据，合并空列名的数据
const formatExcelData = (rawData: any[][]): ExcelRow[] => {
  if (rawData.length === 0) return [];

  const headers: string[] = rawData[0].map((header: any) =>
    header ? String(header).trim() : ""
  );
  const dataRows: any[][] = rawData.slice(1);

  let lastColumnKey: string | null = null; // 记录上一个有名称的列
  let formattedData: ExcelRow[] = dataRows.map((row) => {
    let rowData: ExcelRow = {};
    row.forEach((cell, index) => {
      let columnName = headers[index];

      if (columnName) {
        lastColumnKey = columnName;
        rowData[columnName] = cell;
      } else if (lastColumnKey) {
        // 如果列名为空，把数据追加到上一个非空列的数组中
        if (!Array.isArray(rowData[lastColumnKey])) {
          rowData[lastColumnKey] = [String(rowData[lastColumnKey])]; // 确保转换为字符串
        }
        (rowData[lastColumnKey] as string[]).push(String(cell));
      }
    });
    return rowData;
  });

  return formattedData;
};
</script>
