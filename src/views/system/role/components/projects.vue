<template>
  <div>
    <div class="sticky top-0.5 z-10 flex space-x-2">
      <el-input v-model="filterText" class="w-3/5" placeholder="筛选" />
      <el-button class="float-right" type="primary" @click="relation">
        确 定
      </el-button>
    </div>
    <div class="tree-content clear-both">
      <el-scrollbar>
        <el-tree
          ref="projectTree"
          :data="projectTreeData"
          :default-checked-keys="projectTreeIds"
          :props="projectDefaultProps"
          default-expand-all
          highlight-current
          node-key="ID"
          show-checkbox
          :filter-node-method="filterNode"
          @check="nodeChange"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectApi from "@/api/system/project";

defineOptions({ name: "Projects" });

const props = defineProps({
  row: {
    default: function () {
      return {};
    },
    type: Object,
  },
});

const emit = defineEmits(["changeRow", "closeDrawer"]);

const filterText = ref("");
const projectTreeData = ref();
const projectTreeIds = ref([]);
const needConfirm = ref(false);
const projectDefaultProps = ref({
  children: "children",
  label: function (data: any) {
    return data.projectName;
  },
});

const init = () => {
  ProjectApi.getBaseProjectTree().then((res) => {
    projectTreeData.value = res.data;
  });

  ProjectApi.getAntuorityProject({ authorityId: props.row.authorityId }).then(
    (res) => {
      const projectIds = [];
      if (res.data && res.data.length > 0) {
        const projectIds = res.data.map((item: any) => item.ID);
        projectTreeIds.value = projectIds as never[];
      }
    }
  );
};

init();

const enterAndNext = () => {
  relation();
};

defineExpose({ enterAndNext, needConfirm });
// 关联树 确认方法
const projectTree = ref();
const relation = async () => {
  const checkArr = projectTree.value.getCheckedNodes(false, true);
  ProjectApi.addProjectAuthority({
    projectIds: checkArr,
    authorityId: props.row.authorityId,
  }).then(() => {
    ElMessage({
      type: "success",
      message: "项目设置成功!",
    });
  });
};

const filterNode = (value: any, data: any) => {
  if (!value) return true;
  // console.log(data.mate.title)
  return data.meta.title.indexOf(value) !== -1;
};

// 监听筛选框
watch(filterText, (val) => {
  projectTree.value.filter(val);
});

const nodeChange = () => {
  needConfirm.value = true;
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  span + span {
    @apply ml-3;
  }
}
</style>
