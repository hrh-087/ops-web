<template>
  <div>
    <div class="ops-search-box">
      <span>渠道:</span>
      <el-select
        v-model="serverId"
        placeholder="请选择渠道"
        style="width: 180px"
        @change="getSwitchList"
      >
        <el-option
          v-for="item in platformData"
          :key="item.platformCode"
          :label="item.platformName"
          :value="item.platformCode"
        />
      </el-select>
    </div>

    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button icon="plus" @click="openDialog">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="typeKey"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          align="left"
          label="渠道名称"
          min-width="120"
          prop="platform.platformName"
        >
          <template #default="scope">
            {{
              platformData.find(
                (item: Platform) => item.platformCode == scope.row.serverId
              )?.platformName
            }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="类型名称"
          min-width="120"
          prop="typeName"
        />

        <el-table-column
          align="left"
          label="类型key"
          min-width="120"
          prop="typeKey"
        />

        <el-table-column align="left" label="状态" min-width="120" prop="state">
          <template #default="scope">
            <el-switch v-model="scope.row.state" disabled />
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              icon="rank"
              link
              @click="setSwitchState(scope.row)"
            >
              {{ scope.row.state ? "关闭" : "开启" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
            <el-button type="primary" @click="addSwitchType">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form
        ref="switchForm"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="渠道" prop="serverId" style="width: 70%" required>
          <el-select
            v-model="form.serverId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in platformData"
              :key="item.platformCode"
              :label="item.platformName"
              :value="item.platformCode"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="类型key"
          prop="typeKey"
          style="width: 70%"
          required
        >
          <el-input v-model.trim="form.typeKey" placeholder="请输入类型key" />
        </el-form-item>

        <el-form-item label="类型状态" prop="state" style="width: 70%">
          <el-switch v-model="form.state" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import GmSwitchApi, { type GmSwitch } from "@/api/gm/switch";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

const tableData = ref<GmSwitch[] | any>([]);
const serverId = ref<number>();
const platformData = ref<Platform[] | any>([]);

const rules = {
  serverId: [{ required: true, message: "请选择渠道", trigger: "blur" }],
  typeKey: [{ required: true, message: "请输入类型key", trigger: "blur" }],
};

const getTableData = () => {
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });
};

getTableData();

const getSwitchList = () => {
  GmSwitchApi.getSwitchList({
    serverId: Number(serverId.value),
  }).then((res: any) => {
    tableData.value = res.data;
  });
};

const form = ref<GmSwitch | any>({
  serverId: "",
  typeKey: "",
  state: false,
});
const switchForm = ref();

const initForm = () => {
  if (switchForm.value) {
    switchForm.value.resetFields();
  }
  form.value = {
    serverId: "",
    typeKey: "",
    state: false,
  };
};

const dialogTitle = ref("新增");
const dialogFormVisible = ref(false);

const openDialog = () => {
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};

const addSwitchType = () => {
  GmSwitchApi.setSwitch({
    serverId: Number(form.value.serverId),
    typeKey: form.value.typeKey,
    state: form.value.state,
  }).then(() => {
    ElMessage({
      type: "success",
      message: "添加成功",
    });
  });
};

const setSwitchState = (row: any) => {
  ElMessageBox.confirm(
    `确定要${row.state ? "关闭" : "开启"} ${row.typeName}吗?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    GmSwitchApi.setSwitch({
      serverId: Number(serverId.value),
      typeKey: row.typeKey,
      state: !row.state,
    }).then(() => {
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      getSwitchList();
    });
  });
};
</script>
