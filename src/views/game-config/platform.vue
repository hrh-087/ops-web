<template>
  <div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button icon="plus" @click="addPlatform()">新增</el-button>
      </div>

      <el-table
        :data="tableData"
        row-key="ID"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column prop="ID" label="ID" min-width="100" />

        <el-table-column
          align="left"
          label="渠道名称"
          min-width="120"
          prop="platformName"
        />

        <el-table-column
          align="left"
          label="渠道代码"
          min-width="120"
          prop="platformCode"
        />

        <el-table-column
          align="left"
          label="镜像tag"
          min-width="120"
          prop="imageTag"
        />

        <el-table-column
          align="left"
          label="渠道描述"
          min-width="120"
          prop="platformDescribe"
        />

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editPlatform(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deletePlatform(scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="danger"
              link
              icon="rank"
              @click="kickPlatform(scope.row)"
            >
              踢人
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
          ref="platformForm"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item
            label="渠道名称"
            prop="platformName"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.platformName"
              autocomplete="off"
              placeholder="简体"
            />
          </el-form-item>

          <el-form-item
            label="渠道代号"
            prop="platformCode"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.platformCode"
              autocomplete="off"
              placeholder="887711"
            />
          </el-form-item>

          <el-form-item
            label="镜像地址"
            prop="imageUri"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.imageUri"
              autocomplete="off"
              placeholder="swr.cn-south-1.myhuaweicloud.com/dc2gz/"
            />
          </el-form-item>

          <el-form-item
            label="镜像tag"
            prop="imageTag"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.imageTag"
              autocomplete="off"
              placeholder="pt"
            />
          </el-form-item>

          <el-form-item
            label="日志组ID"
            prop="ltsLogGroupId"
            style="width: 70%"
          >
            <el-input v-model="form.ltsLogGroupId" autocomplete="off" />
          </el-form-item>

          <el-form-item
            label="日志流ID"
            prop="ltsLogStreamId"
            style="width: 70%"
          >
            <el-input v-model="form.ltsLogStreamId" autocomplete="off" />
          </el-form-item>

          <el-form-item label="gm地址" prop="gmUrl" style="width: 70%">
            <el-input v-model="form.gmUrl" autocomplete="off" />
          </el-form-item>

          <el-form-item
            label="网关地址"
            prop="gatewayUrl"
            style="width: 70%"
            required
          >
            <el-input v-model="form.gatewayUrl" autocomplete="off" />
          </el-form-item>

          <el-form-item
            label="渠道描述"
            prop="platformDescribe"
            style="width: 70%"
          >
            <el-input
              type="textarea"
              :rows="5"
              v-model="form.platformDescribe"
              autocomplete="off"
              placeholder="渠道描述"
            />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlatformAPI, { type Platform } from "@/api/game-config/platform";

defineOptions({ name: "Platform" });

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<Platform[]>([]);
const searchInfo = ref({});

const rules = {
  platformName: [
    { required: true, message: "请输入渠道名称", trigger: "blur" },
  ],
  platformCode: [{ required: true, message: "请输入渠道Id", trigger: "blur" }],
  imageUri: [
    { required: true, message: "请输入镜像地址(需要以/结尾)", trigger: "blur" },
  ],
  imageTag: [{ required: true, message: "请输入镜像tag", trigger: "blur" }],
};

const getTableData = () => {
  PlatformAPI.getPlatformList({
    page: page.value,
    pageSize: pageSize.value,
  }).then((res: any) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  });
};

getTableData();

const platformForm = ref();
const form = ref<Platform>({
  platformName: "",
  platformCode: "",
  platformDescribe: "",
  imageTag: "",
  imageUri: "",
  gatewayUrl: "",
  gmUrl: "",
  ltsLogGroupId: "",
  ltsLogStreamId: "",
});

const initForm = () => {
  if (platformForm.value) {
    platformForm.value.resetFields();
  }
  form.value = {
    platformName: "",
    platformCode: "",
    platformDescribe: "",
    imageTag: "",
    imageUri: "",
    gatewayUrl: "",
    gmUrl: "",
    ltsLogGroupId: "",
    ltsLogStreamId: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增渠道";
      break;
    case "edit":
      dialogTitle.value = "编辑渠道";
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
  platformForm.value.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          PlatformAPI.createPlatform(form.value).then(() => {
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
          PlatformAPI.updatePlatform(form.value).then(() => {
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

const addPlatform = () => {
  openDialog("add");
};

const editPlatform = (row: any) => {
  PlatformAPI.getPlatformById(row.ID).then((res: any) => {
    form.value = res.data;
    openDialog("edit");
  });
};

const deletePlatform = (row: any) => {
  PlatformAPI.deletePlatform({ id: row.ID }).then(() => {
    ElMessage({
      type: "success",
      message: "删除成功!",
    });
    getTableData();
  });
};

const kickPlatform = (row: any) => {
  ElMessageBox.confirm(`确定要踢出${row.platformName}渠道玩家吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    PlatformAPI.kickServer(row).then(() => {
      ElMessage({
        type: "success",
        message: "已踢出该玩家!",
      });
    });
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
