<template>
  <el-row type="flex" justify="space-between" :gutter="10">
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">基础信息</div>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <p>
              <strong>更新名称:</strong>
              {{ updateInfo.name }}
            </p>
            <p>
              <strong>更新类型:</strong>
              {{
                updateTypeOpteions.find(
                  (item) => item.value === updateInfo.updateType
                )?.label
              }}
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <strong>创建时间:</strong>
              {{ updateInfo.CreatedAt }}
            </p>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">更新信息</div>
          </div>
        </template>
        <template #default>
          <el-row>
            <el-col>
              <template v-if="updateInfo.updateType === 1">
                <p>
                  <strong>版号:</strong>
                  {{ updateInfo.gameVersion }}
                </p>
              </template>
              <template v-else-if="updateInfo.updateType === 2">
                <p>
                  <strong>热更类型:</strong>
                  {{
                    serverTypeOptions.find(
                      (item) => item.value === updateInfo.hotServerType
                    )?.label
                  }}
                </p>
                <p>
                  <strong>热更文件:</strong>
                  {{ updateInfo.sourceHotFile }}
                </p>
                <p><strong>热更服务:</strong></p>
                <p
                  v-for="item in hotUpdateObjInfo as GameServer[]"
                  :key="item.ID"
                  style="color: red"
                >
                  {{
                    updateInfo.hotServerType == 1
                      ? `${item.gameType.code}_${item.vmid}`
                      : item.name
                  }}
                </p>
              </template>

              <template v-else-if="updateInfo.updateType === 3">
                <pre class="output">{{ svnInfo }}</pre>
                <!-- <el-table :data="svnInfo" row-key="revision" style="width: 100%; margin-top: 16px;">
                  <el-table-column label="版本号" prop="revision" min-width="40px"/>
                  <el-table-column label="提交人" prop="author" min-width="40px"/>
                  <el-table-column label="时间" prop="date" min-width="40px" />
                  <el-table-column label="版本号" prop="paths">
                    <template #default="scope">
                      <p v-for="item,index in scope.row.paths" :key="index"> {{ item.action }}-{{ item.filePath }} </p>
                    </template>
                  </el-table-column>
  
                </el-table> -->
              </template>
            </el-col>
          </el-row>
        </template>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">操作步骤</div>
          </div>
        </template>
        <template #default>
          <el-button
            v-if="updateInfo.step != 0"
            type="danger"
            size="large"
            :disabled="buttonDisabled"
            @click="execUpdateTask"
          >
            <template #default>
              当前步骤:{{ updateInfo.step }}. {{ updateInfo.stepName }}
            </template>
          </el-button>
        </template>
      </el-card>

      <!-- <el-card>
        <template #header>
          <div>
            <span>更新信息:</span>
          </div>
        </template>
        <template #default>
          
        </template>

      </el-card> -->
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import GameUpdateApi, { GameUpdateForm } from "@/api/job/game-update";
import GameTypeApi from "@/api/game/gameType";
import GameServerApi, { type GameServer } from "@/api/game/gameServer";

defineOptions({
  name: "GameUpdateInfo",
  inheritAttrs: false,
});
const router = useRouter();
const route = useRoute();
const infoId = route.params.id;
const buttonDisabled = ref(false);

const updateInfo = ref<GameUpdateForm>({
  name: "",
  updateType: 0,
});

const updateTypeOpteions = [
  {
    value: 0,
    label: "------",
  },
  {
    value: 1,
    label: "正常更新",
  },
  {
    value: 2,
    label: "热更服务端代码",
  },
  {
    value: 3,
    label: "热更配置文件",
  },
];

const serverTypeOptions = [
  {
    value: 0,
    label: "------",
  },
  {
    value: 1,
    label: "游戏服",
  },
  {
    value: 2,
    label: "游戏类型",
  },
];
const getUpdateInfo = async () => {
  await GameUpdateApi.getGameUpdateById(infoId).then((res: any) => {
    updateInfo.value = res.data;
  });
};

const hotUpdateObj = ref([]);

const hotUpdateObjInfo = computed(() => {
  if (!updateInfo.value.hotServerList) {
    return [];
  }
  const obj = JSON.parse(updateInfo.value.hotServerList);
  return hotUpdateObj.value.filter((item: any) => {
    return obj.includes(item.ID);
  });
});

const execUpdateTask = () => {
  buttonDisabled.value = true;
  GameUpdateApi.execUpdateGameTask({ id: updateInfo.value.ID }).then(
    (res: any) => {
      router.push({ name: "task", params: { jobId: res.data.jobId } });
    }
  );
};

const svnInfo = ref([]);

onMounted(async () => {
  // 获取更新任务信息
  await getUpdateInfo();
  // 热更是获取热更对象信息
  if (updateInfo.value.updateType === 2) {
    if (updateInfo.value.hotServerType === 1) {
      GameServerApi.getGameServerAll().then((res: any) => {
        hotUpdateObj.value = res.data;
      });
    } else if (updateInfo.value.hotServerType === 2) {
      GameTypeApi.getGameTypeAll().then((res: any) => {
        hotUpdateObj.value = res.data;
      });
    } else {
      ElMessage.error("热更类型错误");
    }
  } else if (updateInfo.value.updateType === 3) {
    GameUpdateApi.getGameSvnConfigInfo().then((res: any) => {
      svnInfo.value = res.data;
    });
  }
});
</script>

<style scoped lang="scss">
.card-center {
  display: flex;
  justify-content: center; // 水平居中
  // align-items: center; // 垂直居中
  // height: 100%; // 确保卡片有足够的高度以显示居中的按钮
  width: 100%;
}

.el-button {
  box-sizing: border-box; // 确保 padding 和 border 包含在宽度和高度内
  width: 100%; // 按钮宽度占满卡片
  height: 100%; // 按钮高度占满卡片
}

.el-card {
  margin-bottom: 20px;
}
</style>
