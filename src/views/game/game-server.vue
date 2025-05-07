<template>
  <div>
    <div class="ops-search-box">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="渠道">
          <el-select
            v-model="searchInfo.platformId"
            placeholder="请选择渠道"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in platformData"
              :key="item.ID"
              :label="item.platformName"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏服类型">
          <el-select
            v-model="searchInfo.gameTypeId"
            placeholder="请选择类型"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in gameTypeData"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchInfo.status"
            placeholder="请选择状态"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in gameStaus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
        <el-button type="primary" icon="plus" @click="addGameServer()">
          新增
        </el-button>
        <el-button type="warning" @click="updateGameConfig()">
          更新配置文件
        </el-button>
        <el-button type="warning" @click="generateMonitorFile()">
          生成监控文件
        </el-button>
        <el-button type="danger" @click="rsyncGameConfig()">
          同步配置文件
        </el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
        style="width: 100%; margin-top: 15px"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="ID" label="ID" min-width="100" /> -->
        <el-table-column type="selection" width="55" />

        <el-table-column
          align="left"
          label="渠道"
          min-width="120"
          prop="platform.platformName"
        />

        <el-table-column
          align="left"
          label="游戏服名称"
          min-width="120"
          prop="name"
        />

        <el-table-column
          align="left"
          label="类型"
          min-width="120"
          prop="gameType.name"
        />

        <el-table-column align="left" label="主机" min-width="300">
          <template #default="scope">
            {{ scope.row.host.serverName }}-{{ scope.row.host.pubIp }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="vmid"
          min-width="120"
          prop="vmid"
        />

        <el-table-column
          align="left"
          label="tcp端口"
          min-width="120"
          prop="tcpPort"
        />

        <el-table-column
          align="left"
          label="http端口"
          min-width="120"
          prop="httpPort"
        />

        <el-table-column
          align="left"
          label="grpc端口"
          min-width="120"
          prop="grpcPort"
        />

        <el-table-column align="left" label="状态" min-width="120">
          <template #default="scope">
            {{
              gameStaus.find((item) => item.value == scope.row.status)?.label
            }}
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editGameServer(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteGameServer(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.status >= 4"
              type="danger"
              link
              icon="download"
              @click="installGameServer(scope.row)"
            >
              安装
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="ops-pagination">
        <div>
          <el-select
            v-model="taskNum"
            style="width: 249px; padding-right: 20px"
          >
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="danger" @click="execTaskDialogVisible = true">
            执行
          </el-button>
        </div>

        <div>
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
      </div>
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
        ref="gameServerForm"
        :model="form"
        :rules="rules"
        :inline="true"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="名称" prop="name" style="width: 30%" required>
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="正式服"
            size="large"
          />
        </el-form-item>

        <el-form-item
          label="渠道"
          prop="platformId"
          style="width: 30%"
          required
        >
          <el-select
            v-model.number="form.platformId"
            placeholder="请选择渠道"
            size="large"
            @change="changePlatform"
            :disabled="isEdit"
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
          label="类型"
          prop="gameTypeId"
          style="width: 30%"
          required
        >
          <el-select
            v-model.number="form.gameTypeId"
            placeholder="请选择类型"
            size="large"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in gameTypeData"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="服务器" prop="hostId" style="width: 40%" required>
          <el-select
            v-model.number="form.hostId"
            placeholder="请选择服务器"
            size="large"
          >
            <el-option
              v-for="item in serverData"
              :key="item.ID"
              :label="item.serverName"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="redis" prop="redisId" style="width: 40%" required>
          <el-select
            v-model.number="form.redisId"
            placeholder="请选择redis"
            size="large"
          >
            <el-option
              v-for="item in redisData"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="mongo" prop="mongoId" style="width: 40%" required>
          <el-select
            v-model.number="form.mongoId"
            placeholder="请选择mongo"
            size="large"
          >
            <el-option
              v-for="item in mongoData"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="kafka" style="width: 40%" required>
          <el-select
            v-model.number="form.kafkaId"
            placeholder="请选择kafka"
            size="large"
          >
            <el-option
              v-for="item in kafkaData"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="vmid" style="width: 20%">
          <el-input v-model="form.vmid" readonly />
        </el-form-item>
        <el-form-item label="tcp端口" style="width: 20%">
          <el-input v-model="form.tcpPort" readonly />
        </el-form-item>
        <el-form-item label="grpc端口" style="width: 20%">
          <el-input v-model="form.grpcPort" readonly />
        </el-form-item>
        <el-form-item label="http端口" style="width: 20%">
          <el-input v-model="form.httpPort" readonly />
        </el-form-item>
        <el-form-item label="docker-compose.yml" style="width: 100%">
          <el-input
            v-model="form.composeFile"
            readonly
            type="textarea"
            rows="5"
          />
        </el-form-item>
        <el-form-item label="application.yml" style="width: 100%">
          <el-input
            v-model="form.configFile"
            readonly
            type="textarea"
            rows="10"
          />
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog
      v-model="execTaskDialogVisible"
      title="Warning"
      width="800"
      align-center
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ execName }}</span>
        </div>
      </template>

      <template #default>
        <el-table :data="multipleSelection" style="width: 100%">
          <el-table-column label="渠道">
            <template #default="scope">
              {{ scope.row.platform.platformName }}
            </template>
          </el-table-column>
          <el-table-column label="游戏服">
            <template #default="scope">
              {{ scope.row.gameType.code }}_{{ scope.row.vmid }}
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="execTaskDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="execTask">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import PlatformApi, { type Platform } from "@/api/game-config/platform";
import AssetsServerApi, { type AssetsServer } from "@/api/assets/server";
import AssetsKafkaApi, { type AssetsKafka } from "@/api/assets/kafka";
import AssetsMongoApi, { type AssetsMongo } from "@/api/assets/mongo";
import AssetsRedisApi, { type AssetsRedis } from "@/api/assets/redis";
import GameTypeApi, { type GameType } from "@/api/game/gameType";
import GameServerApi, { type GameServer } from "@/api/game/gameServer";
import { it } from "node:test";

defineOptions({
  name: "GameServer",
});

const router = useRouter();

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({
  platformId: "",
  gameTypeId: "",
  status: "",
});

const platformData = ref<Platform[] | any>();
const gameTypeData = ref<GameType[] | any>();
const serverData = ref<AssetsServer[] | any>();
const kafkaData = ref<AssetsKafka[] | any>();
const mongoData = ref<AssetsMongo[] | any>();
const redisData = ref<AssetsRedis[] | any>();

const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  gameTypeId: [{ required: true, message: "请选择游戏类型", trigger: "blur" }],
  redisId: [{ required: true, message: "请选择游戏redis", trigger: "blur" }],
  mongoId: [{ required: true, message: "请选择游戏mongo", trigger: "blur" }],
  kafkaId: [{ required: true, message: "请选择游戏kafka", trigger: "blur" }],
  hostId: [{ required: true, message: "请选择游戏服务器", trigger: "blur" }],
  platformId: [{ required: true, message: "请选择游戏渠道", trigger: "blur" }],
};

const gameStaus = ref([
  { label: "待安装", value: 5 },
  { label: "安装中", value: 1 },
  { label: "已安装", value: 2 },
  { label: "已删除", value: 3 },
  { label: "安装失败", value: 4 },
]);

const getTableData = () => {
  GameServerApi.getGameServerList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
    getSelectData();
  });
};

getTableData();

const multipleSelection = ref<GameServer[]>([]);
const handleSelectionChange = (val: GameServer[]) => {
  multipleSelection.value = val;
};

const taskNum = ref(0);
const taskTypeOptions = ref([
  { label: "-------", value: 0 },
  { label: "开启游戏服", value: 1 },
  { label: "关闭游戏服", value: 2 },
]);

const execTaskDialogVisible = ref(false);

const execTask = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要操作的项");
    return;
  }

  if (taskNum.value === 0) {
    ElMessage.warning("请选择要操作的任务类型");
    return;
  }

  let ids: Number[] = multipleSelection.value.map((item) => item.ID);

  GameServerApi.execGameTask({
    taskType: taskNum.value,
    gameServerIds: ids,
  }).then((res: any) => {
    execTaskDialogVisible.value = false;
    router.push({ name: "task", params: { jobId: res.data.jobId } });
    // console.log(res)
  });
};

const gameServerForm = ref();
const form = ref({
  name: "",
  gameTypeId: "",
  redisId: "",
  mongoId: "",
  kafkaId: "",
  hostId: "",
  platformId: "",
  vmid: 0,
  grpcPort: 0,
  httpPort: 0,
  tcpPort: 0,
  composeFile: "",
  configFile: "",
});

const initForm = () => {
  if (gameServerForm.value) {
    gameServerForm.value.resetFields();
  }
  form.value = {
    name: "",
    gameTypeId: "",
    redisId: "",
    mongoId: "",
    kafkaId: "",
    hostId: "",
    platformId: "",
    vmid: 0,
    grpcPort: 0,
    httpPort: 0,
    tcpPort: 0,
    composeFile: "",
    configFile: "",
  };
  gameTypeData.value = [];
  serverData.value = [];
  kafkaData.value = [];
  mongoData.value = [];
  redisData.value = [];
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);
const isEdit = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增";
      isEdit.value = false;
      break;
    case "edit":
      dialogTitle.value = "编辑";
      isEdit.value = true;
      break;
    default:
      break;
  }
  getSelectData();
  type.value = key;
  dialogFormVisible.value = true;
};

const getSelectData = () => {
  // 获取渠道信息
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });

  GameTypeApi.getGameTypeAll().then((res: any) => {
    gameTypeData.value = res.data;
  });
};

const changePlatform = (val: any) => {
  AssetsRedisApi.getAssetsRedisall({ platformId: val }).then((res: any) => {
    redisData.value = res.data;
  });
  AssetsMongoApi.getAssetsMongoall({ platformId: val }).then((res: any) => {
    mongoData.value = res.data;
  });
  AssetsKafkaApi.getAssetsKafkaall({ platformId: val }).then((res: any) => {
    kafkaData.value = res.data;
  });
  AssetsServerApi.getAssetsServerall({ platformId: val }).then((res: any) => {
    serverData.value = res.data;
  });
};

const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};

const onReset = () => {
  searchInfo.value = {
    platformId: "",
    gameTypeId: "",
    status: "",
  };
};

const onSubmit = () => {
  getTableData();
};

const enterDialog = () => {
  gameServerForm.value.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          GameServerApi.createGameServer(form.value).then(() => {
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
          GameServerApi.updateGameServer(form.value).then(() => {
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

const addGameServer = () => {
  openDialog("add");
};

const editGameServer = (row: any) => {
  changePlatform(row.platformId);
  GameServerApi.getGameServerById(row.ID).then((res: any) => {
    form.value = row;

    openDialog("edit");
  });
};

const deleteGameServer = (row: any) => {
  ElMessageBox.confirm("确定删除该记录吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    GameServerApi.deleteGameServer({ id: row.ID }).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getTableData();
    });
  });
};

const installGameServer = (row: any) => {
  // GameServerApi.installGameServer({id: row.ID}).then((res) => {
  //   console.log(res)
  // })
  ElMessageBox.confirm("确定安装该游戏吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    GameServerApi.installGameServer({ ids: [row.ID] }).then((res: any) => {
      router.push({ name: "task", params: { jobId: res.data.jobId } });
    });
  });
};

const updateGameConfig = () => {
  ElMessageBox.confirm("确定更新配置文件吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    GameServerApi.updateGameConfig({ updateType: 1, ids: [] }).then(() => {
      getTableData();
      ElMessage({
        type: "success",
        message: "更新成功",
      });
    });
  });
};

const rsyncGameConfig = () => {
  ElMessageBox.confirm("确定同步配置文件吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    GameServerApi.RsyncGameConfig({ updateType: 1, ids: [] }).then(
      (res: any) => {
        router.push({ name: "task", params: { jobId: res.data.jobId } });
      }
    );
  });
};

const generateMonitorFile = () => {
  ElMessageBox.confirm("确定生成监控配置文件吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    GameServerApi.generateMonitorFile().then((res: any) => {
      ElMessage({
        type: "success",
        message: "生成成功",
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

// 计算属性
const execName = computed(() => {
  return taskTypeOptions.value.find((item: any) => {
    return item.value === taskNum.value;
  })?.label;
});
</script>

<style lang="scss" scoped>
.ops-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 将子元素分布到两端 */

  .el-pagination__editor {
    .el-input__inner {
      height: 2rem; // 使用标准单位
    }
  }

  .is-active {
    color: #fff !important;
    background-color: var(--el-color-primary);
    border-radius: 0.25rem;
  }
}
</style>
