<template>
  <el-card>
    <div class="card-content">
      <h1>批量命令</h1>
      <el-form
        :model="form"
        label-width="auto"
        style="max-width: 100%; margin-top: 15px"
      >
        <el-form-item
          label="执行类型"
          prop="batchType"
          style="width: 100%"
          required
        >
          <el-select
            v-model.number="form.batchType"
            placeholder="请选择类型"
            size="large"
            style="width: 600px"
            @change="getObjList"
          >
            <el-option
              v-for="item in batchTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="执行对象"
          prop="serverList"
          style="width: 100%"
          required
        >
          <el-select
            v-model="form.serverList"
            placeholder="请选择对象"
            size="large"
            style="width: 600px"
            clearable
            multiple
          >
            <el-option
              v-for="item in batchObjOption"
              :key="item.ID"
              :label="item.serverName ? item.serverName : item.platformName"
              :value="Number(item.ID)"
            />
            <el-option
              v-if="!batchObjOption.length"
              :value="-1"
              disabled
              label="加载中..."
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="命令"
          prop="commandId"
          style="width: 100%"
          required
        >
          <el-select
            v-model.number="form.commandId"
            placeholder="请选择命令"
            size="large"
            style="width: 600px"
          >
            <el-option
              v-for="item in commandList"
              :key="item.ID"
              :label="item.name"
              :value="item.ID"
            />
            <el-option
              v-if="!commandList.length"
              :value="-1"
              disabled
              label="加载中..."
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="DialogVisible = true">执行</el-button>

      <el-dialog v-model="DialogVisible" title="批量命令" width="500">
        <template #default>
          <p>
            执行类型:
            <strong>{{ getBatchTypeLabel }}</strong>
          </p>
          <p>
            执行对象:
            <strong>{{ batchObjName }}</strong>
          </p>
          <p>
            执行命令:
            <strong>{{ commandInfo }}</strong>
          </p>
        </template>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="DialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import CommandApi, { Command } from "@/api/job/command";
import AssetsServerApi, { type AssetsServer } from "@/api/assets/server";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

defineOptions({
  name: "BatchCommand",
});

const router = useRouter();
const DialogVisible = ref(false);

const batchTypeOption = [
  {
    value: 0,
    label: "----",
  },
  {
    value: 1,
    label: "服务器",
  },
  {
    value: 2,
    label: "渠道",
  },
];
const batchObjOption = ref<AssetsServer[] | Platform[]>([]);
const commandList = ref<Command[]>([]);

const form = ref({
  batchType: "",
  commandId: "",
  serverList: [],
});

const onSubmit = () => {
  CommandApi.execBatchCommand(form.value).then((res: any) => {
    DialogVisible.value = false;
    router.push({
      name: "task",
      params: {
        jobId: res.data.jobId,
      },
    });
  });
};

const getObjList = () => {
  form.value.serverList = [];
  switch (form.value.batchType.toString()) {
    case "1":
      AssetsServerApi.getAssetsServerall({}).then((res: any) => {
        batchObjOption.value = res.data;
      });
      break;
    case "2":
      PlatformApi.getPlatformAll().then((res: any) => {
        batchObjOption.value = res.data;
      });
      break;
    default:
      break;
  }
};

const getCommandList = () => {
  CommandApi.getCommandBatchAll().then((res: any) => {
    commandList.value = res.data;
  });
};
getCommandList();

const commandInfo = computed(() => {
  return (
    commandList.value.find((item) => item.ID === form.value.commandId)
      ?.command || ""
  );
});

const batchObjName = computed(() => {
  let objList = batchObjOption.value.filter((item: any) =>
    form.value.serverList.includes(item.ID as never)
  );

  switch (form.value.batchType.toString()) {
    case "1":
      return objList.map((item: any) => item.serverName).join(",");
    case "2":
      return objList.map((item: any) => item.platformName).join(",");
    default:
      return "1111";
  }
});

const getBatchTypeLabel = computed(() => {
  const batchTypeNumber = parseInt(form.value.batchType);
  const option = batchTypeOption.find(
    (option) => option.value === batchTypeNumber
  );
  return option ? option.label : "";
});
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: column; /* 使子元素垂直排列 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  min-height: 100%; /* 使容器至少和父元素一样高 */
  // padding: 20px; /* 根据需要添加内边距 */
}

.el-form-item {
  text-align: center;
}
</style>
