<template>
  <el-card>
    <div class="card-content">
      <h1>维度推送</h1>
      <el-form
        :model="form"
        label-width="auto"
        style="max-width: 100%; margin-top: 15px"
      >
        <el-form-item
          label="维度列表"
          prop="platformList"
          style="width: 100%"
          required
        >
          <el-select
            v-model="form.platformList"
            placeholder="请选择维度对象"
            size="large"
            style="width: 600px"
            clearable
            multiple
          >
            <el-option
              v-for="item in platformOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="danger" @click="DialogVisible = true">推送</el-button>

      <el-dialog v-model="DialogVisible" title="维度推送" width="500">
        <template #default>
          <el-tag v-for="i in form.platformList" :key="i">
            {{ i }}
          </el-tag>
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
import GmDimensionPushApi from "@/api/gm/dimension-push";

defineOptions({
  name: "DimensionPush",
});

const platformOption = [
  {
    label: "887706-stable",
    value: "887706",
  },
  {
    label: "887711-简体",
    value: "887711",
  },
  {
    label: "887712-繁体",
    value: "887712",
  },
  {
    label: "887705-pt",
    value: "887705",
  },
];

const form = ref({
  platformList: [],
});

const DialogVisible = ref(false);

const onSubmit = () => {
  DialogVisible.value = false;
  GmDimensionPushApi.dimensionPush(form.value)
    .then((res) => {
      ElMessage.success("推送成功");
    })
    .catch(() => {
      ElMessage.error("推送失败");
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
