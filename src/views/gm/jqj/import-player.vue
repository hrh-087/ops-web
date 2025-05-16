<template>
  <el-card>
    <div class="card-content">
      <h1>玩家导号</h1>
      <el-form
        ref="importPlayerForm"
        :rules="rules"
        :model="form"
        label-width="auto"
        style="max-width: 100%; margin-top: 15px"
      >
        <el-form-item
          label="渠道列表"
          prop="platformCode"
          style="width: 100%"
          required
        >
          <el-select
            v-model="form.platformCode"
            placeholder="请选择渠道"
            size="large"
            style="width: 600px"
          >
            <el-option
              v-for="item in platformCodeList"
              :key="item.ID"
              :label="item.platformName"
              :value="item.platformCode"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="account"
          prop="account"
          style="width: 100%"
          required
        >
          <el-input
            v-model.trim="form.account"
            size="large"
            placeholder="请输入导入玩家account"
            @change="onChange"
          />
        </el-form-item>

        <el-form-item
          label="目标玩家id"
          prop="outputPlayerId"
          style="width: 100%"
          required
        >
          <el-input
            v-model="form.outputPlayerId"
            size="large"
            placeholder="请输入导出玩家Uid"
          />
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="DialogVisible = true">导入</el-button>

      <el-dialog v-model="DialogVisible" title="玩家导号" width="500">
        <template #default>
          <p>
            导入玩家账号Id:
            <el-tag>{{ form.account }}</el-tag>
          </p>
          <p>
            导入玩家UId:
            <el-tag>{{ form.importId }}</el-tag>
          </p>
          <p>
            导出玩家UId:
            <el-tag>{{ form.outputPlayerId }}</el-tag>
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
import GmImportPlayerApi from "@/api/gm/import-player";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

defineOptions({
  name: "ImportPlayer",
});

const rules = ref({
  account: [
    { required: true, message: "请输入导入玩家account", trigger: "blur" },
  ],
  importId: [{ required: true, message: "请选择导入玩家Uid", trigger: "blur" }],
  outputPlayerId: [
    { required: true, message: "请输入导出玩家Uid", trigger: "blur" },
  ],
  platformCode: [{ required: true, message: "请选择渠道", trigger: "blur" }],
});

const form = ref({
  account: "",
  importId: "",
  outputPlayerId: "",
  platformCode: "",
});

const platformCodeList = ref<Platform[]>();
const DialogVisible = ref(false);
const importPlayerForm = ref();

const init = () => {
  PlatformApi.getPlatformAll()
    .then((res: any) => {
      platformCodeList.value = res.data;
    })
    .catch(() => {
      ElMessage.error("获取渠道失败");
    });
};

init();

const onSubmit = () => {
  importPlayerForm.value.validate((valid: boolean) => {
    if (valid) {
      DialogVisible.value = false;
      GmImportPlayerApi.importPlayerData(form.value)
        .then((res) => {
          ElMessage.success("导入成功");
        })
        .catch(() => {
          ElMessage.error("导入失败");
        });
    } else {
      ElMessage.error("参数值不对");
      return false;
    }
  });
};

const onChange = () => {
  if (form.value.account.trim() == "" || form.value.platformCode == "") {
    ElMessage.error("请输入账号和渠道");
    return;
  }
  GmImportPlayerApi.getAccountInfo({
    account: form.value.account,
    platformCode: form.value.platformCode,
  })
    .then((res: any) => {
      form.value.importId = res.data.toString();
    })
    .catch(() => {
      ElMessage.error("获取失败");
    });
};
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
