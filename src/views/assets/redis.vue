<template>
  <div>
    <div>
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
              :value="item.ID"
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

    <div>
      <el-button type="primary" icon="plus" @click="addAssetsRedis()">
        新增
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

      <el-table-column align="left" label="名称" min-width="120" prop="name" />

      <el-table-column
        align="left"
        label="连接地址"
        min-width="120"
        prop="host"
        show-overflow-tooltip
      />

      <el-table-column
        align="left"
        label="连接端口"
        min-width="120"
        prop="port"
      />

      <el-table-column align="left" label="是否为集群" min-width="120">
        <template #default="scope">
          <el-switch v-model="scope.row.isCluster" disabled />
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
            @click="editAssetsRedis(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            icon="delete"
            @click="deleteAssetsRedis(scope.row)"
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
          ref="assetsRedisForm"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="名称" prop="name" style="width: 70%" required>
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="渠道名称-服务类型-编号: 887711-redis-0001"
            />
          </el-form-item>

          <el-form-item
            label="连接地址"
            prop="host"
            style="width: 70%"
            required
          >
            <el-input
              v-model="form.host"
              autocomplete="off"
              placeholder="127.0.0.1"
            />
          </el-form-item>

          <el-form-item
            label="连接端口"
            prop="port"
            style="width: 70%"
            required
          >
            <el-input
              v-model.number="form.port"
              autocomplete="off"
              placeholder="6379"
            />
          </el-form-item>

          <el-form-item label="认证信息" prop="password" style="width: 70%">
            <el-input
              v-model="form.password"
              autocomplete="off"
              placeholder="密码"
            />
          </el-form-item>

          <el-form-item
            label="渠道"
            prop="platformId"
            style="width: 70%"
            required
          >
            <el-cascader
              v-model="form.platformId"
              style="width: 100%"
              :options="platformData"
              :props="{
                checkStrictly: true,
                label: 'platformName',
                value: 'ID',
                disabled: 'disabled',
                emitPath: false,
              }"
              :show-all-levels="false"
              filterable
            />
          </el-form-item>

          <el-form-item label="是否为集群" prop="isCluster" style="width: 70%">
            <el-switch v-model="form.isCluster" />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssetsRedisApi, { AssetsRedis } from "@/api/assets/redis";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

defineOptions({ name: "Redis" });

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({
  name: "",
  platformId: "",
});
const platformData = ref<Platform[]>();

const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  host: [{ required: true, message: "请输入连接地址", trigger: "blur" }],
  port: [{ required: true, message: "请输入连接端口", trigger: "blur" }],
  // password: [{ required: true, message: '请输入认证密码', trigger: 'blur' },],
  platformId: [{ required: true, message: "请选择渠道组", trigger: "blur" }],
};

const getTableData = () => {
  AssetsRedisApi.getAssetsRedisList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res: any) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });

  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });
};

getTableData();

const assetsRedisForm = ref();

const onSubmit = () => {
  getTableData();
};

const form = ref<AssetsRedis | any>({
  name: "",
  host: "",
  port: 0,
  password: "",
  platformId: 0,
});

const initForm = () => {
  if (assetsRedisForm.value) {
    assetsRedisForm.value.resetFields();
  }
  form.value = {
    name: "",
    host: "",
    port: 0,
    password: "",
    platformId: 0,
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增";
      break;
    case "edit":
      dialogTitle.value = "编辑";
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

const onReset = () => {
  searchInfo.value = {
    name: "",
    platformId: "",
  };
};

const enterDialog = () => {
  assetsRedisForm.value.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          console.log(form.value);
          AssetsRedisApi.createAssetsRedis(form.value).then(() => {
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
          AssetsRedisApi.updateAssetsRedis(form.value).then(() => {
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

const addAssetsRedis = () => {
  openDialog("add");
};

const editAssetsRedis = (row: any) => {
  AssetsRedisApi.getAssetsRedisById(row.ID).then((res: any) => {
    form.value = res.data;
    openDialog("edit");
  });
};

const deleteAssetsRedis = (row: any) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    AssetsRedisApi.deleteAssetsRedis({ id: row.ID }).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getTableData();
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
