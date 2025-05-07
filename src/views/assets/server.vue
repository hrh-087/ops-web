<template>
  <div class="ops-search-box">
    <el-form ref="searchForm" :inline="true" :model="searchInfo">
      <el-form-item label="名称 ">
        <el-input v-model="searchInfo.name" placeholder="服务器名称" />
      </el-form-item>

      <el-form-item label="渠道">
        <el-select
          v-model="searchInfo.platformId"
          clearable
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="item in platformData"
            :key="item.ID"
            :label="item.platformName"
            :value="Number(item.ID)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="onSubmit">
          查询
        </el-button>
        <el-button icon="refresh" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="ops-table-box">
    <div class="ops-btn-list">
      <el-button type="primary" icon="plus" @click="addAssetsServer()">
        新增服务器
      </el-button>
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
        prop="platform.platformName"
      />

      <el-table-column align="left" label="云商名称" min-width="120">
        <template #default="scope">
          {{ scope.row.cloudProduce.cloudName }}-{{
            scope.row.cloudProduce.regionName
          }}
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="实例Id"
        min-width="120"
        prop="instanceId"
      />

      <el-table-column
        align="left"
        label="实例名称"
        min-width="120"
        prop="serverName"
      />

      <el-table-column align="left" label="连接地址" min-width="120">
        <template #default="scope">
          <p>外网:{{ scope.row.pubIp }}</p>
          <p>内网:{{ scope.row.privateIp }}</p>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="实例状态"
        min-width="120"
        prop="status"
      >
        <template #default="scope">
          {{ serverStatus[scope.row.status] }}
        </template>
      </el-table-column>

      <el-table-column align="left" label="系统信息" min-width="120">
        <template #default>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="暂无信息"
            placement="top-start"
          >
            查看详情
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            link
            icon="edit"
            @click="editAssetsServer(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            icon="delete"
            @click="deleteAssetsServer(scope.row)"
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
          ref="assetsServerForm"
          :model="form"
          :rules="rules"
          label-width="20%"
        >
          <el-form-item
            label="服务器名称"
            prop="serverName"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.serverName"
              autocomplete="off"
              placeholder="渠道名称-游戏服-编号: 887711-fight-0001"
            />
          </el-form-item>

          <el-form-item label="实例ID" prop="instanceId" style="width: 70%">
            <el-input
              v-model="form.instanceId"
              autocomplete="off"
              placeholder="实例ID"
            />
          </el-form-item>

          <el-form-item label="外网IP" prop="pubIp" style="width: 70%" required>
            <el-input
              v-model="form.pubIp"
              autocomplete="off"
              placeholder="127.0.0.1"
            />
          </el-form-item>

          <el-form-item
            label="内网IP"
            prop="privateIp"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.privateIp"
              autocomplete="off"
              placeholder="127.0.0.1"
            />
          </el-form-item>

          <el-form-item
            label="ssh端口"
            prop="sshPort"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.sshPort"
              autocomplete="off"
              placeholder="22"
            />
          </el-form-item>

          <el-form-item
            label="渠道"
            prop="platformId"
            style="width: 70%"
            required
          >
            <el-select
              v-model.number="form.platformId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in platformData"
                :key="item.ID"
                :label="item.platformName"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="云商"
            prop="cloudProduceId"
            style="width: 70%"
            required
          >
            <el-select
              v-model.number="form.cloudProduceId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in cloudProduceData"
                :key="item.ID"
                :label="item.regionName"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="服务器类型"
            prop="serverType"
            style="width: 70%"
            required
          >
            <el-select
              v-model.number="form.serverType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in serverTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssetsServerApi from "@/api/assets/server";
import PlatformApi, { type Platform } from "@/api/game-config/platform";
import CloudProduceApi, { type CloudProduce } from "@/api/game-config/cloud";

defineOptions({ name: "Server" });

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({
  name: "",
  platformId: "",
});
const platformData = ref<Platform[] | any>();
const cloudProduceData = ref<CloudProduce[] | any>();

const serverStatus = ref<Record<number, string>>({
  0: "待初始化",
  1: "正常运行",
  2: "待回收",
  3: "已删除",
});

const serverTypeOptions = ref([
  { value: 0, label: "----" },
  { value: 1, label: "游戏服" },
  { value: 2, label: "RIM服务" },
  { value: 3, label: "运维后台" },
]);

const rules = {
  serverName: [
    { required: true, message: "请输入服务器名称", trigger: "blur" },
  ],
  pubIp: [{ required: true, message: "请输入外网地址", trigger: "blur" }],
  privateIp: [{ required: true, message: "请输入内网地址", trigger: "blur" }],
  sshPort: [{ required: true, message: "请输入ssh端口", trigger: "blur" }],
  platformId: [{ required: true, message: "请选择渠道组", trigger: "blur" }],
  serverType: [
    { required: true, message: "请选择服务器类型", trigger: "blur" },
  ],
};

const getTableData = () => {
  AssetsServerApi.getAssetsServerList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res: any) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });

  // 获取所有渠道数据
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });
};

getTableData();

const assetsServerForm = ref();
const form = ref({
  serverName: "",
  pubIp: "",
  privateIp: "",
  sshPort: "22",
  platformId: "",
  cloudProduceId: "",
  instanceId: "",
  serverType: "",
});

const initForm = () => {
  if (assetsServerForm.value) {
    assetsServerForm.value.resetFields();
  }
  form.value = {
    serverName: "",
    pubIp: "",
    privateIp: "",
    sshPort: "22",
    platformId: "",
    cloudProduceId: "",
    instanceId: "",
    serverType: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  // 获取所有渠道数据
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });

  // 获取所有云商数据
  CloudProduceApi.getCloudProduceAll().then((res: any) => {
    cloudProduceData.value = res.data;
  });

  switch (key) {
    case "add":
      dialogTitle.value = "新增服务器";
      break;
    case "edit":
      dialogTitle.value = "编辑服务器";
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
  assetsServerForm.value.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          console.log(form.value);
          AssetsServerApi.createAssetsServer(form.value).then(() => {
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
          AssetsServerApi.updateAssetsServer(form.value).then(() => {
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
const addAssetsServer = () => {
  openDialog("add");
};

const editAssetsServer = (row: any) => {
  AssetsServerApi.getAssetsServerById(row.ID).then((res: any) => {
    form.value = res.data;
    openDialog("edit");
  });
};

const deleteAssetsServer = (row: any) => {
  AssetsServerApi.deleteAssetsServer({ id: row.ID }).then(() => {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getTableData();
  });
};

const onSubmit = () => {
  getTableData();
};

const onReset = () => {
  searchInfo.value = {
    name: "",
    platformId: "",
  };
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
