<template>
  <div>
    <div>
      <el-button type="danger" @click="openDialog('add')">
        同步云服务资源
      </el-button>
      <el-button type="danger" @click="openDialog('rsyncListener')">
        同步监听器信息
      </el-button>
      <el-button type="danger" @click="openDialog('writeRedis')">
        写入Redis
      </el-button>
    </div>
    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column
        align="left"
        label="实例id"
        min-width="200"
        prop="instanceId"
      >
        <template #default="scope">
          <el-link :underline="false" @click="viewAssetsLb(scope.row)">
            {{ scope.row.instanceId }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column align="left" label="名称" min-width="120" prop="name" />

      <el-table-column align="left" label="渠道名称" min-width="120">
        <template #default="scope">
          {{ scope.row.platform.platformName || "-" }}
        </template>
      </el-table-column>

      <el-table-column align="left" label="云商名称" min-width="120">
        <template #default="scope">
          {{ scope.row.cloudProduce.regionName || "-" }}
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="连接地址"
        min-width="120"
        prop="host"
      >
        <template #default="scope">
          内网地址:
          <span>{{ scope.row.privateIp || "-" }}</span>
          <br />
          外网地址:
          <span>{{ scope.row.pubIp || "-" }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="danger"
            link
            icon="delete"
            @click="deleteAssetsLb(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500px">
      <el-form
        :model="form"
        :rules="rules"
        ref="assetsLbForm"
        label-width="10px"
      >
        <el-form-item label="渠道:" label-width="140px" prop="platformId">
          <el-select v-model.number="form.platformId" placeholder="请选择渠道">
            <el-option label="----" :value="-1" />
            <el-option
              v-for="item in platformOptions"
              :key="item.ID"
              :label="item.platformName"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="云商:" label-width="140px" prop="cloudProduceId">
          <el-select
            v-model.number="form.cloudProduceId"
            placeholder="请选择云商"
          >
            <el-option label="----" :value="-1" />
            <el-option
              v-for="item in cloudProduceOptions"
              :key="item.ID"
              :label="item.regionName"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="rsyncCloudResource">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import LbApi from "@/api/assets/lb";
import PlatformApi from "@/api/game-config/platform";
import CloudProduceApi from "@/api/game-config/cloud";

defineOptions({ name: "Lb" });

const router = useRouter();

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});

const platformOptions = ref([]);
const cloudProduceOptions = ref([]);

const rules = {
  platformId: [
    { required: true, message: "请选择渠道", trigger: "blur" },
    {
      validator(rule: any, value: any, callback: any) {
        if (value <= 0) {
          return callback(new Error("请选择云商"));
        }
        callback();
      },
    },
  ],
  cloudProduceId: [
    { required: true, message: "请选择云商", trigger: "blur" },
    {
      validator(rule: any, value: any, callback: any) {
        if (value <= 0) {
          return callback(new Error("请选择云商"));
        }
        callback();
      },
    },
  ],
};

const viewAssetsLb = (row: any) => {
  router.push({ name: "loadbalance-info", params: { id: row.ID } });
};

const getTableData = () => {
  LbApi.getAssetsLbList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res: any) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

getTableData();

const assetsLbForm = ref();
const form = ref({
  platformId: "",
  cloudProduceId: "",
});

const initForm = () => {
  if (assetsLbForm.value) {
    assetsLbForm.value.resetFields();
  }
  form.value = {
    platformId: "",
    cloudProduceId: "",
  };
};

const dialogTitle = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "同步云服务资源";
      PlatformApi.getPlatformAll()
        .then((res: any) => {
          platformOptions.value = res.data;
        })
        .catch(() => {
          ElMessage({
            type: "error",
            message: "获取渠道列表失败",
          });
          return;
        });
      CloudProduceApi.getCloudProduceAll()
        .then((res: any) => {
          cloudProduceOptions.value = res.data;
        })
        .catch(() => {
          ElMessage({
            type: "error",
            message: "获取云商列表失败",
          });
          return;
        });
      dialogFormVisible.value = true;
      break;
    case "writeRedis":
      ElMessageBox.confirm("此操作将同步redis数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        LbApi.writeRedis().then(() => {
          ElMessage({
            type: "success",
            message: "同步成功",
          });
        });
      });
      break;
    case "rsyncListener":
      ElMessageBox.confirm("此操作将同步监听器数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        LbApi.rsyncLbListener().then(() => {
          ElMessage({
            type: "success",
            message: "同步成功",
          });
        });
      });
      break;
    default:
      break;
  }
};

const closeDialog = () => {
  dialogFormVisible.value = false;
  initForm();
  platformOptions.value = [];
  cloudProduceOptions.value = [];
};

const rsyncCloudResource = () => {
  ElMessageBox.confirm("此操作将同步云服务资源, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    LbApi.rsyncAssetsLb(form.value).then(() => {
      ElMessage({
        type: "success",
        message: "同步成功",
      });
      closeDialog();
      getTableData();
    });
  });
};

const deleteAssetsLb = (row: any) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    LbApi.deleteAssetsLb({ id: row.ID }).then(() => {
      getTableData();
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    });
  });
};
</script>

<style lang="scss" scoped></style>
