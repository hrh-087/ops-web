<template>
  <div>
    <div class="sticky top-0.5 z-10 flex space-x-2">
      <el-input
        v-model="filterTextName"
        class="flex-1"
        placeholder="筛选名字"
      />
      <el-input
        v-model="filterTextPath"
        class="flex-1"
        placeholder="筛选路径"
      />
      <el-button class="float-right" type="primary" @click="authApiEnter">
        确 定
      </el-button>
    </div>
    <div class="tree-content">
      <el-scrollbar>
        <el-tree
          ref="apiTree"
          :data="apiTreeData"
          :default-checked-keys="apiTreeIds"
          :props="apiDefaultProps"
          highlight-current
          node-key="onlyId"
          show-checkbox
          :filter-node-method="filterNode"
          @check="nodeChange"
        >
          <template #default="{ data }">
            <div class="flex items-center justify-between w-full pr-1">
              <span>{{ data.description }}</span>
              <el-tooltip :content="data.path">
                <span
                  class="max-w-[240px] break-all overflow-ellipsis overflow-hidden"
                >
                  {{ data.path }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import ApiAPI from "@/api/system/api";
import CasbinAPI from "@/api/system/casbin";
// import { el } from 'element-plus/es/locale';
// import Api from '../../api/api.vue';

defineOptions({ name: "Apis" });

const props = defineProps({
  row: {
    default: function () {
      return {};
    },
    type: Object,
  },
});

const apiDefaultProps = ref({
  children: "children",
  label: "description",
});
const filterTextName = ref("");
const filterTextPath = ref("");
const apiTreeData = ref();
const apiTreeIds = ref();
const activeUserId = ref("");

const init = async () => {
  await ApiAPI.getAllApis().then((res) => {
    apiTreeData.value = buildApiTree(res.data);
  });

  activeUserId.value = props.row.authorityId;
  apiTreeIds.value = [];

  // console.log("activeUserId:", activeUserId.value)
  await CasbinAPI.getPolicyPathByAuthorityId({
    authorityId: activeUserId.value,
  }).then((res) => {
    const arr: never[] = [];
    res.data?.forEach((item: any) => {
      arr.push(("p:" + item.path + "m:" + item.method) as never);
    });

    apiTreeIds.value = arr;
  });
};

init();

// 创建api树方法
const buildApiTree = (apis: any[]) => {
  const apiObj: Record<string, any[]> = {};

  apis.forEach((item) => {
    item.onlyId = "p:" + item.path + "m:" + item.method;
    if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
      apiObj[item.apiGroup].push(item);
    } else {
      Object.assign(apiObj, { [item.apiGroup]: [item] });
    }
  });

  const apiTree = [];
  for (const key in apiObj) {
    const treeNode = {
      ID: key,
      description: key + "组",
      children: apiObj[key],
    };
    apiTree.push(treeNode);
  }
  return apiTree;
};

const emit = defineEmits(["changeRow", "closeDrawer"]);

// 关联关系确定
const apiTree = ref();
const authApiEnter = () => {
  const checkArr = apiTree.value.getCheckedNodes(true);
  var casbinInfos: Array<{ path: string; method: string }> = [];
  checkArr?.forEach((item: any) => {
    var casbinInfo = {
      path: item.path,
      method: item.method,
    };
    casbinInfos.push(casbinInfo);
  });

  CasbinAPI.updateCasbin({ authorityId: activeUserId.value, casbinInfos })
    .then((res) => {
      if (res.code === 0) {
        ApiAPI.freshApi().then((res) => {
          if (res.code !== 0) {
            ElMessage({
              type: "success",
              message: "刷新权限失败, 请手动刷新",
            });
          }
        });
        ElMessage({
          type: "success",
          message: "api设置成功",
        });
      }
    })
    .finally(() => {
      emit("closeDrawer");
    });
};

const nodeChange = () => {
  needConfirm.value = true;
};

// 暴露给外层使用的切换拦截统一方法
const needConfirm = ref(false);
const enterAndNext = () => {
  authApiEnter();
};

defineExpose({
  needConfirm,
  enterAndNext,
});

const filterNode = (value: any, data: any) => {
  if (!filterTextName.value && !filterTextPath.value) return true;
  let matchesName, matchesPath;
  if (!filterTextName.value) {
    matchesName = true;
  } else {
    matchesName =
      data.description && data.description.includes(filterTextName.value);
  }
  if (!filterTextPath.value) {
    matchesPath = true;
  } else {
    matchesPath = data.path && data.path.includes(filterTextPath.value);
  }
  return matchesName && matchesPath;
};

watch([filterTextName, filterTextPath], () => {
  apiTree.value.filter("");
});
</script>
