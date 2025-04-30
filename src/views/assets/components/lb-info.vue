<template>
  <div>
    <el-card class="mb-3" v-if="lbInfo">
      <template #header>
        <div class="clearfix">
          <span>负载均衡信息</span>
        </div>
      </template>
      <template #default>
        <el-row :gutter="20">
          <el-col>
            <p>
              <strong>实例名称:</strong>
              {{ lbInfo.name }}
            </p>
            <p>
              <strong>实例id:</strong>
              {{ lbInfo.instanceId }}
            </p>
            <p>
              <strong>外网ip:</strong>
              {{ lbInfo.pubIp }}
            </p>
            <p>
              <strong>内网ip:</strong>
              {{ lbInfo.privateIp }}
            </p>
            <p>
              <strong>子网id:</strong>
              {{ lbInfo.subnetCidrId }}
            </p>
            <p>
              <strong>渠道名称:</strong>
              {{ lbInfo.platform.platformName }}
            </p>
            <p>
              <strong>云商名称:</strong>
              {{ lbInfo.cloudProduce.regionName }}
            </p>
          </el-col>
        </el-row>
      </template>
    </el-card>

    <el-card class="mb-3" v-if="lbInfo && lbInfo.listener">
      <template #header>
        <div class="clearfix">
          <span style="padding: 10px">监听器信息</span>
          <el-button type="danger" @click="clearLbListener">
            清除监听器
          </el-button>
        </div>
      </template>
      <template #default>
        <el-table
          :data="lbInfo.listener"
          row-key="ID"
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column
            align="left"
            prop="name"
            label="监听器名称"
            min-width="120"
          />
          <el-table-column
            align="left"
            prop="protocol"
            label="协议"
            min-width="120"
          />
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import LbApi from "@/api/assets/lb";
import { type Lb } from "@/api/assets/lb";

defineOptions({ name: "LoadbalanceInfo" });

const route = useRoute();
const lbId = ref(route.params.id as string);

const lbInfo = ref<Lb | null>(null);

const getLbInfo = async () => {
  try {
    const res = await LbApi.getAssetsLbById(lbId.value);
    lbInfo.value = res.data;
  } catch (error) {
    console.error("Failed to fetch load balancer info:", error);
  }
};

const clearLbListener = () => {
  ElMessageBox.confirm("此操作将清除该实例下所有监听器, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  }).then(() => {
    LbApi.clearLbListener(lbInfo.value).then(() => {
      ElMessage({
        type: "success",
        message: "清除成功",
      });
      getLbInfo();
    });
  });
};

onBeforeMount(() => {
  getLbInfo();
});
</script>
