<template>
  <div>
    <div class="ops-search-box">
      <span>渠道:</span>
      <el-select
        v-model="serverId"
        placeholder="请选择渠道"
        style="width: 180px"
        @change="getGameCronList"
      >
        <el-option
          v-for="item in platformData"
          :key="item.platformCode"
          :label="item.platformName"
          :value="Number(item.platformCode)"
        />
      </el-select>
    </div>

    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button icon="plus" @click="addGameActivityCron">新增</el-button>
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
        >
          <template #default="scope">
            {{ cronTypeName[scope.row.key] || "无" }}
          </template>
        </el-table-column>

        <el-table-column align="left" label="key" min-width="120" prop="key" />

        <el-table-column align="left" label="cron" min-width="120" prop="cron">
          <template #default="scope">
            <el-tag>{{ scope.row.cron }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              icon="edit"
              link
              @click="editGameActivityCron(scope.row)"
            >
              编辑
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
            <el-button type="primary" @click="enterDialog">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form
        ref="gameActivityCronForm"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="渠道" prop="serverId" style="width: 70%" required>
          <el-select
            v-model="form.serverId"
            placeholder="请选择"
            style="width: 100%"
            :disabled="type == 'edit'"
          >
            <el-option
              v-for="item in platformData"
              :key="item.platformCode"
              :label="item.platformName"
              :value="Number(item.platformCode)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="key" prop="key" style="width: 70%" required>
          <el-input v-model.trim="form.key" placeholder="请输入cron key" />
        </el-form-item>

        <el-form-item label="cronRule" prop="cron" style="width: 70%" required>
          <el-input
            v-model="form.cron"
            placeholder="请输入cron rule(* * * * * *)"
          />
          <!-- <pre>
*  *  *  *  *   *
|  |  |  |  |  └─── 星期几 (0 - 6, 星期天 = 0) OR sun,mon ...
|  |  |  |  └───── 月份 (1 - 12) OR jan,feb,mar,apr ...
|  |  |  └─────── 天数 (1 - 31)
|  |  └───────── 小时 (0 - 23)
|  └─────────── 分钟 (0 - 59)
└───────────── [可选] 秒 (0 - 59)
          </pre> -->
        </el-form-item>

        <!-- <div>
          <el-button icon="plus" link @click="addReward()">添加</el-button>
        </div> -->
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import GmGameCronApi, { type GmCron } from "@/api/gm/game-cron";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

const tableData = ref<GmCron[] | any>([]);
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

const getGameCronList = () => {
  GmGameCronApi.getGameCronList({
    serverId: Number(serverId.value),
  }).then((res: any) => {
    tableData.value = res.data;
  });
};

const cronTypeName = ref<Record<string, string>>({
  DYNAMICS_DUNGEON_START: "动态副本开启",
  PVP_MATCH_STOP: "论剑争玄结束",
  ZANG_MU_JIAN_START: "藏木剑开始",
  ZANG_MU_JIAN_BROADCAST: "藏木剑广播",
  ALLIANCE_PVP_STOP: "宗门pvp结束",
  WORLD_BOSS_START: "世界BOSS出没开始",
  PVP_MATCH_START: "论剑争玄开始",
  ZANG_MU_JIAN_END: "藏木剑结束",
  ALLIANCE_PVP_START: "宗门pvp开始",
  WORLD_ACTIVITY_BOSS_END: "世界BOSS活动结束",
  WORLD_ACTIVITY_BOSS_START: "世界BOSS活动开始",
  WORLD_BOSS_END: "世界BOSS出没结束",
});

const form = ref<GmCron | any>({
  serverId: "",
  key: "",
  cron: "",
  activityExtra: "",
});
const gameActivityCronForm = ref();

const initForm = () => {
  if (gameActivityCronForm.value) {
    gameActivityCronForm.value.resetFields();
  }
  form.value = {
    serverId: "",
    key: "",
    cron: "",
    activityExtra: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增活动任务";
      break;
    case "edit":
      dialogTitle.value = "编辑活动任务";
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

const addGameActivityCron = () => {
  openDialog("add");
};

const editGameActivityCron = (row: any) => {
  form.value = row;
  openDialog("edit");
};

const enterDialog = () => {
  // 提交表单
  gameActivityCronForm.value?.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          GmGameCronApi.setGameCron(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "添加成功!",
            });
            getTableData();
            closeDialog();
          });
          break;
        }
        case "edit": {
          GmGameCronApi.setGameCron(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "修改成功!",
            });
            getTableData();
            closeDialog();
          });
          break;
        }
      }
    }
  });
};
</script>
