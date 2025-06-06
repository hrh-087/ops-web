<template>
  <div class="ops-table-box">
    <div class="ops-btn-list">
      <el-button type="primary" icon="plus" @click="addProject()">
        新增项目
      </el-button>
    </div>
    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column prop="ID" label="ID" min-width="100" />

      <el-table-column
        align="left"
        label="项目名称"
        min-width="120"
        prop="projectName"
      />
      <el-table-column align="left" label="项目状态" min-width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
            {{ projectStatus[scope.row.status] || "未知" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="left" label="项目角色" min-width="120">
        <template #default="scope">
          <el-cascader
            v-model="scope.row.authorityIds"
            :options="authOptions"
            :show-all-levels="false"
            collapse-tags
            :props="{
              multiple: true,
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :clearable="false"
            @visible-change="
              (flag) => {
                changeAuthority(scope.row, flag, 0);
              }
            "
            @remove-tag="
              (removeAuth) => {
                changeAuthority(scope.row, false, removeAuth);
              }
            "
          />
        </template>
      </el-table-column>

      <el-table-column align="left" label="是否为测试项目" min-width="120">
        <template #default="scope">
          <el-switch v-model="scope.row.isTest" disabled />
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            link
            icon="edit"
            @click="editProject(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            icon="delete"
            @click="deleteProject(scope.row)"
          >
            删除
          </el-button>
          <el-button
            v-if="scope.row.status != 1"
            type="warning"
            link
            icon="Loading"
            @click="initProject(scope.row)"
          >
            初始化
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="ops-pagination">
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
        ref="projectForm"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目代码" prop="projectCode">
          <el-input v-model="form.projectCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="json文件目录" prop="configDir">
          <el-input v-model.trim="form.configDir" autocomplete="off" />
        </el-form-item>
        <el-form-item label="json仓库路径" prop="svnUrl">
          <el-input v-model.trim="form.svnUrl" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="gm地址" prop="gmUrl">
          <el-input v-model.trim="form.gmUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网关地址" prop="gatewayUrl">
          <el-input v-model.trim="form.gatewayUrl" autocomplete="off" />
        </el-form-item> -->
        <!-- <el-form-item label="客户端json文件目录" prop="clientConfigDir">
          <el-input v-model.trim="form.clientConfigDir" autocomplete="off" />
        </el-form-item>
        <el-form-item label="客户端json仓库路径" prop="clientSvnUrl">
          <el-input v-model.trim="form.clientSvnUrl" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="是否为测试项目" prop="clientSvnUrl">
          <el-switch v-model="form.isTest" />
        </el-form-item>
        <template v-if="form.isTest">
          <el-form-item label="webHook地址" prop="webHook">
            <el-input v-model.trim="form.webHook" autocomplete="off" />
          </el-form-item>
        </template>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import ProjectApi from "@/api/system/project";
import AuthorityApi from "@/api/system/role";

defineOptions({ name: "Project" });

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});
const authOptions = ref([]);

const rules = ref({
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  configDir: [
    { required: true, message: "请输入json文件目录", trigger: "blur" },
  ],
  projectCode: [{ required: true, message: "请输入项目代码", trigger: "blur" }],
  svnUrl: [{ required: true, message: "请输入svn地址", trigger: "blur" }],
  // gmUrl: [{ required: true, message: "请输入gm地址", trigger: "blur" }],
  // gatewayUrl: [{ required: true, message: "请输入网关地址", trigger: "blur" }],
  // clientConfigDir: [
  //   { required: true, message: "请输入客户端json文件目录", trigger: "blur" },
  // ],
  // clientSvnUrl: [
  //   { required: true, message: "请输入客户端svn地址", trigger: "blur" },
  // ],
});

const projectStatus = ref<Record<number, string>>({
  0: "未上线",
  1: "已上线",
  2: "上线失败",
});

const getTableData = () => {
  ProjectApi.getProjectList({
    page: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

const initPage = () => {
  getTableData();
  AuthorityApi.getRoleList({ page: 1, pageSize: 999 }).then((res) => {
    setAuthorityOptions(res.data.rows, authOptions.value);
  });
};

initPage();

// 初始化相关
const setAuthorityOptions = (
  AuthorityData: never[],
  optionsData: Array<any>
) => {
  AuthorityData?.forEach((item: any) => {
    if (item.children && item.children.length) {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        children: [],
      };
      setAuthorityOptions(item.children, option.children);
      optionsData.push(option);
    } else {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
      };
      optionsData.push(option);
    }
  });
};

const projectForm = ref();
const form = ref({
  projectName: "",
  projectCode: "",
  configDir: "",
  svnUrl: "",
  gmUrl: "",
  gatewayUrl: "",
  clientConfigDir: "",
  clientSvnUrl: "",
  isTest: false,
  webHook: "",
});
const initForm = () => {
  if (projectForm.value) {
    projectForm.value.resetFields();
  }
  form.value = {
    projectName: "",
    projectCode: "",
    configDir: "",
    svnUrl: "",
    gmUrl: "",
    gatewayUrl: "",
    clientConfigDir: "",
    clientSvnUrl: "",
    isTest: false,
    webHook: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "addProject":
      dialogTitle.value = "新增项目";
      break;
    case "editProject":
      dialogTitle.value = "编辑项目";
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

const editProject = (row: any) => {
  ProjectApi.getProjectById({ id: row.ID }).then((res: any) => {
    form.value = res.data;
    openDialog("editProject");
  });
};

const deleteProject = (row: any) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    ProjectApi.deleteProject({ id: row.ID }).then((res: any) => {
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
      getTableData();
    });
  });
};

const initProject = (row: any) => {
  ElMessageBox.confirm(`确定要初始化${row.projectName}吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ProjectApi.initProject(row).then((res: any) => {
      ElMessage({
        type: "success",
        message: "开始初始化",
      });
    });
  });
};

const addProject = () => {
  openDialog("addProject");
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

const enterDialog = () => {
  // 提交表单
  projectForm.value?.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "addProject": {
          ProjectApi.createProject(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "添加成功!",
            });
            getTableData();
            closeDialog();
          });
          break;
        }
        case "editProject": {
          ProjectApi.updateProject(form.value).then((res: any) => {
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

const tempAuth: any = {};
// 修改角色
const changeAuthority = async (row: any, flag: boolean, removeAuth: any) => {
  if (!row.authorityIds) {
    row.authorities = [];
  }

  if (flag) {
    if (!removeAuth) {
      tempAuth[row.ID] = [...row.authorityIds];
    }
    return;
  }

  await nextTick();
  ProjectApi.setProjectAuthority({
    ID: row.ID,
    authorityIds: row.authorityIds,
  })
    .then(() => {
      ElMessage({ type: "success", message: "设置成功" });
    })
    .catch(() => {
      if (!removeAuth) {
        row.authorityIds = [...tempAuth[row.ID]];
        delete tempAuth[row.ID];
      } else {
        row.authorityIds = [removeAuth, ...row.authorityIds];
      }
    });
};

// 设置角色id组
const setAuthorityIds = () => {
  tableData.value &&
    tableData.value.forEach((user: any) => {
      user.authorityIds =
        user.authorities &&
        user.authorities.map((i: any) => {
          return i.authorityId;
        });
    });
};

watch(
  () => tableData.value,
  () => {
    setAuthorityIds();
  }
);
</script>
