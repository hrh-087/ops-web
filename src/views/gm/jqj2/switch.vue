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
            <el-switch v-model="scope.row.state" />
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
  </div>
</template>

<script setup lang="ts">
import GmSwitchApi, { type GmSwitch } from "@/api/gm/switch";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

const tableData = ref<GmSwitch[] | any>([]);
const serverId = ref<number>();
const platformData = ref<Platform[] | any>([]);

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
