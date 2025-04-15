<template>
  <div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button icon="plus" @click="addCloudProduce()">新增</el-button>
      </div>

      <el-table
        :data="tableData"
        row-key="ID"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column prop="ID" label="ID" min-width="100" />

        <el-table-column
          align="left"
          label="云商名称"
          min-width="120"
          prop="cloudName"
        />

        <el-table-column
          align="left"
          label="地域名称"
          min-width="120"
          prop="regionName"
        />

        <el-table-column
          align="left"
          label="地域ID"
          min-width="120"
          prop="regionId"
        />

        <el-table-column
          align="left"
          label="是否为云商"
          min-width="120"
          prop="isCloud"
        >
          <template #default="scope">
            <el-switch v-model="scope.row.isCloud" disabled />
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editCloudProduce(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteCloudProduce(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="ops-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <el-drawer
        v-model="dialogFormVisible"
        size="50%"
        :before-close="closeDialog"
        :show-close="false"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg">{{ dialogTitle }}</span>
            <div>
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="enterDialog">确 定</el-button>
            </div>
          </div>
        </template>
        <el-form
          ref="cloudProduceForm"
          :model="form"
          :rules="rules"
          label-width="20%"
        >
          <el-form-item
            label="云商名称"
            prop="cloudName"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.cloudName"
              autocomplete="off"
              placeholder="腾讯云"
            />
          </el-form-item>

          <el-form-item
            label="区域Id"
            prop="regionId"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.regionId"
              autocomplete="off"
              placeholder="ap-guangzhou"
            />
          </el-form-item>

          <el-form-item
            label="区域名称"
            prop="regionName"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.regionName"
              autocomplete="off"
              placeholder="广州"
            />
          </el-form-item>

          <el-form-item
            label="secretId"
            prop="secretId"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.secretId"
              autocomplete="off"
              placeholder="secretId"
            />
          </el-form-item>

          <el-form-item
            label="secretKey"
            prop="secretKey"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.secretKey"
              autocomplete="off"
              placeholder="secretKey"
            />
          </el-form-item>

          <el-form-item label="是否为云商" prop="isCloud" style="width: 70%">
            <el-switch v-model="form.isCloud" />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloudProduceApi from "@/api/game-config/cloud";

defineOptions({ name: "Cloud" });

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});

const rules = {
  cloudName: [{ required: true, message: "请输入云商名称", trigger: "blur" }],
  regionId: [{ required: true, message: "请输入区域Id", trigger: "blur" }],
  regionName: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
  secretId: [{ required: true, message: "请输入secretId", trigger: "blur" }],
  secretKey: [{ required: true, message: "请输入secretKey", trigger: "blur" }],
};

const getTableData = () => {
  CloudProduceApi.getCloudProduceList({
    page: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

getTableData();

const cloudProduceForm = ref();
const form = ref({
  cloudName: "",
  regionId: "",
  regionName: "",
  secretId: "",
  secretKey: "",
  isCloud: true,
});

const initForm = () => {
  if (cloudProduceForm.value) {
    cloudProduceForm.value.resetFields();
  }
  form.value = {
    cloudName: "",
    regionId: "",
    regionName: "",
    secretId: "",
    secretKey: "",
    isCloud: true,
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增云商";
      break;
    case "edit":
      dialogTitle.value = "编辑云商";
      break;
    default:
      break;
  }

  type.value = key;
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};

const enterDialog = () => {
  cloudProduceForm.value.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          CloudProduceApi.createCloudProduce(form.value).then(() => {
            ElMessage({
              type: "success",
              message: "添加成功!",
            });
            getTableData();
            closeDialog();
          });
          return;
        }

        case "edit": {
          CloudProduceApi.updateCloudProduce(form.value).then(() => {
            ElMessage({
              type: "success",
              message: "修改成功!",
            });
            getTableData();
            closeDialog();
            return;
          });
        }
      }
    }
  });
};

const addCloudProduce = () => {
  openDialog("add");
};

const editCloudProduce = (row: any) => {
  // console.log('编辑产商', row.ID)
  CloudProduceApi.getCloudProduceById(row.ID).then((res: any) => {
    form.value = res.data;
    openDialog("edit");
  });
};

const deleteCloudProduce = (row: any) => {
  CloudProduceApi.deleteCloudProduce({ id: row.ID }).then(() => {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getTableData();
  });
};

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableData();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  getTableData();
};
</script>
