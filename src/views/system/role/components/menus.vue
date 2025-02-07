<template>
  <div>
    <div class="sticky top-0.5 z-10">
      <el-input v-model="filterText" class="w-3/5" placeholder="筛选" />
      <el-button class="float-right" type="primary" @click="relation">
        确 定
      </el-button>
    </div>
    <div class="tree-content">
      <el-scrollbar>
        <el-tree
          ref="menuTree"
          :data="menuTreeData"
          :default-checked-keys="menuTreeIds"
          :props="menuDefaultProps"
          highlight-current
          node-key="ID"
          show-checkbox
          :filter-node-method="filterNode"
          @check="nodeChange"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <!-- <span>
                <el-button
                  type="primary"
                  link
                  :style="{color:row.defaultRouter === data.name?'#E6A23C':'#85ce61'}"
                  :disabled="!node.checked"
                  @click="() => setDefault(data)"
                >
                  {{ row.defaultRouter === data.name?"首页":"设为首页" }}
                </el-button>
              </span> -->
              <!-- <span v-if="data.menuBtn.length">
                <el-button
                  type="primary"
                  link

                  @click="() => OpenBtn(data)"
                >
                  分配按钮
                </el-button>
              </span> -->
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <!-- <el-dialog
      v-model="btnVisible"
      title="分配按钮"
      destroy-on-close
    >
      <el-table
        ref="btnTableRef"
        :data="btnData"
        row-key="ID"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="按钮名称"
          prop="name"
        />
        <el-table-column
          label="按钮备注"
          prop="desc"
        />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="enterDialog"
          >确 定</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import MenuAPI from "@/api/system/menu";

defineOptions({
  name: "Menus",
});

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
const menuTreeData = ref();
const menuTreeIds = ref([]);
const needConfirm = ref(false);
const menuDefaultProps = ref({
  children: "children",
  label: function (data: any) {
    return data.meta.title;
  },
});

const init = async () => {
  // 获取所有菜单树
  await MenuAPI.getBaseMenuTree()
    .then((res) => {
      menuTreeData.value = res.data;
    })
    .catch(() => {
      ElMessage({
        type: "error",
        message: "基础菜单加载失败",
      });
    });

  await MenuAPI.getMenuAuthority({ authorityId: props.row.authorityId })
    .then((res) => {
      const menus = res.data.menus;
      const arr: never[] = [];
      if (menus) {
        menus.forEach((item: any) => {
          // 防止直接选中父级造成全选
          if (!menus.some((same: any) => same.parentId === item.menuId)) {
            arr.push(Number(item.menuId) as never);
          }
        });
      }

      menuTreeIds.value = arr;
    })
    .catch((err) => {
      console.log(err);
      ElMessage({
        type: "error",
        message: "角色菜单加载失败",
      });
      emit("closeDrawer");
    });
};

init();

// const setDefault = async(data) => {
//   const res = await updateAuthority({ authorityId: props.row.authorityId, AuthorityName: props.row.authorityName, parentId: props.row.parentId, defaultRouter: data.name })
//   if (res) {
//     ElMessage({ type: 'success', message: '设置成功' })
//     emit('changeRow', 'defaultRouter', res.data.authority.defaultRouter)
//   }
// }
const nodeChange = () => {
  needConfirm.value = true;
};
// 暴露给外层使用的切换拦截统一方法
const enterAndNext = () => {
  relation();
};
defineExpose({ enterAndNext, needConfirm });
// 关联树 确认方法
const menuTree = ref();
const relation = async () => {
  const checkArr = menuTree.value.getCheckedNodes(false, true);
  const res = await MenuAPI.addMenuAuthority({
    menus: checkArr,
    authorityId: props.row.authorityId,
  });
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: "菜单设置成功!",
    });
  }
};

const filterNode = (value: any, data: any) => {
  if (!value) return true;
  // console.log(data.mate.title)
  return data.meta.title.indexOf(value) !== -1;
};

watch(filterText, (val) => {
  menuTree.value.filter(val);
});
</script>

<style lang="scss" scoped>
.custom-tree-node {
  span + span {
    margin-left: 0.75rem;
  }
}
</style>
