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
      <el-button
        v-if="excelName != ''"
        type="primary"
        link
        style="padding-left: 15px"
        @click="downloadLocalFile"
      >
        下载模板
      </el-button>
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
const props = defineProps({
  buttonName: {
    type: String,
    default: "上传文件",
  },
  sheetNames: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  excelName: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["onDataParsed"]);

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
    // const sheetName = workbook.SheetNames[0];
    // const worksheet = workbook.Sheets[sheetName];

    let sheetNames: string[] = [];
    let excelData: Record<string, ExcelRow[]> = {};

    // 根据props的sheetNames获取工作表
    if (props.sheetNames?.length <= 0) {
      sheetNames.push(workbook.SheetNames[0]);
    } else {
      sheetNames = props.sheetNames;
    }

    for (let i = 0; i < sheetNames.length; i++) {
      const worksheet = workbook.Sheets[sheetNames[i]];

      // 解析 Excel 数据
      let rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 移除第二行跟第三行
      rawData.splice(1, 2);

      // 格式化数据，合并空列名的数据
      excelData[sheetNames[i]] = formatExcelData(rawData);
    }

    // 触发事件，向父组件传递数据
    emit("onDataParsed", excelData);
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

const downloadLocalFile = () => {
  const fileUrl = `/excel/${props.excelName}`; // 确保 Excel 文件放在 public/excel 目录下
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = "排行榜.xlsx"; // 指定下载时的文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>
