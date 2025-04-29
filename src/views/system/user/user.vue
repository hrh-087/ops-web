<template>
  <div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button type="primary" icon="plus" @click="addUser">
          新增用户
        </el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
        style="width: 100%; margin-top: 15px"
      >
        <!-- <el-table-column
          align="left"
          label="头像"
          min-width="75"
        >
          <template #default="scope">
            <CustomPic
              style="margin-top:8px"
              :pic-src="scope.row.headerImg"
            />
          </template>
        </el-table-column> -->
        <el-table-column align="left" label="ID" min-width="50" prop="ID" />
        <el-table-column
          align="left"
          label="用户名"
          min-width="150"
          prop="userName"
        />
        <el-table-column
          align="left"
          label="昵称"
          min-width="150"
          prop="nickName"
        />
        <el-table-column
          align="left"
          label="手机号"
          min-width="180"
          prop="phone"
        />
        <el-table-column
          align="left"
          label="邮箱"
          min-width="180"
          prop="email"
        />
        <el-table-column align="left" label="用户角色" min-width="200">
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
        <el-table-column align="left" label="启用" min-width="150">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enable"
              inline-prompt
              :active-value="true"
              :inactive-value="false"
              @change="
                () => {
                  switchEnable(scope.row);
                }
              "
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="openEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              icon="magic-stick"
              @click="resetPasswordFunc(scope.row)"
            >
              重置密码
            </el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteUserFunc(scope.row)"
            >
              删除
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
    </div>
    <el-drawer
      v-model="addUserDialog"
      size="60%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">用户</span>
          <div>
            <el-button @click="closeAddUserDialog">取 消</el-button>
            <el-button type="primary" @click="enterAddUserDialog">
              确 定
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="userForm"
        :rules="rules"
        :model="userInfo"
        label-width="80px"
      >
        <el-form-item
          v-if="dialogFlag === 'add'"
          label="用户名"
          prop="userName"
        >
          <el-input v-model="userInfo.userName" />
        </el-form-item>
        <el-form-item v-if="dialogFlag === 'add'" label="密码" prop="password">
          <el-input v-model="userInfo.password" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="userInfo.nickName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfo.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email" />
        </el-form-item>
        <el-form-item label="用户角色" prop="authorityId">
          <el-cascader
            v-model="userInfo.authorityIds"
            style="width: 100%"
            :options="authOptions"
            :show-all-levels="false"
            :props="{
              multiple: true,
              checkStrictly: true,
              label: 'authorityName',
              value: 'authorityId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="启用" prop="disabled">
          <el-switch
            v-model="userInfo.enable"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <!-- <el-form-item
          label="头像"
          label-width="80px"
        >
          <SelectImage
            v-model="userInfo.headerImg"
          />
        </el-form-item> -->
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import UserAPI from "@/api/system/user";
import AuthorityApi from "@/api/system/role";
// import { User } from '@element-plus/icons-vue/dist/types';

defineOptions({
  name: "User",
});

// 弹窗相关
const userInfo = ref({
  userName: "",
  password: "",
  nickName: "",
  // headerImg: '',
  phone: "",
  email: "",
  authorityId: "",
  authorityIds: [],
  enable: false,
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);

const authOptions = ref([]);

const rules = ref({
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, message: "最低5位字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入用户密码", trigger: "blur" },
    { min: 6, message: "最低6位字符", trigger: "blur" },
  ],
  nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  phone: [
    {
      pattern: /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/,
      message: "请输入合法手机号",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  authorityId: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
});

// 获取用户信息
const getTableData = () => {
  UserAPI.getUserList({ page: page.value, pageSize: pageSize.value }).then(
    (res) => {
      if (res.code === 0) {
        console.log("res:", res.data);
        tableData.value = res.data.rows;
        total.value = res.data.total;
        page.value = res.data.page;
        pageSize.value = res.data.pageSize;
      }
    }
  );
};

const initPage = async () => {
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

const userForm = ref();
const dialogFlag = ref("");
const addUserDialog = ref(false);

const enterAddUserDialog = async () => {
  userInfo.value.authorityId = userInfo.value.authorityIds[0];
  userForm.value.validate(async (valid: boolean) => {
    if (valid) {
      const req = {
        ...userInfo.value,
      };
      if (dialogFlag.value === "add") {
        console.log("req", req);
        UserAPI.register(req).then(async (res: any) => {
          if (res.code === 0) {
            ElMessage({ type: "success", message: "创建成功" });
            await getTableData();
            closeAddUserDialog();
          }
        });
      }

      if (dialogFlag.value === "edit") {
        UserAPI.setUserInfo(req).then(async (res: any) => {
          if (res.code === 0) {
            ElMessage({ type: "success", message: "编辑成功" });
            await getTableData();
            closeAddUserDialog();
          }
        });
      }
    }
  });
};

const closeAddUserDialog = () => {
  userForm.value.resetFields();
  // userInfo.value.headerImg = ''
  userInfo.value.authorityIds = [];
  addUserDialog.value = false;
};

// 添加用户
const addUser = () => {
  dialogFlag.value = "add";
  addUserDialog.value = true;
};

// 编辑用户
const openEdit = (row: any) => {
  dialogFlag.value = "edit";
  userInfo.value = JSON.parse(JSON.stringify(row));
  addUserDialog.value = true;
};

// 删除用户
const deleteUserFunc = (row: any) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    UserAPI.deleteUser({ id: row.ID }).then((res: any) => {
      if (res.code === 0) {
        ElMessage.success("删除成功");
        getTableData();
      }
    });
  });
};

const tempAuth: any = {};
// 修改角色
const changeAuthority = async (row: any, flag: boolean, removeAuth: any) => {
  // if (!row.authorityIds) {
  //   row.authorityIds = []
  // }

  if (flag) {
    if (!removeAuth) {
      tempAuth[row.ID] = [...row.authorityIds];
    }
    return;
  }

  await nextTick();
  UserAPI.setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds,
  })
    .then(() => {
      ElMessage({ type: "success", message: "角色设置成功" });
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

// 启用禁用
const switchEnable = async (row: any) => {
  userInfo.value = JSON.parse(JSON.stringify(row));
  await nextTick();
  const req = {
    ...userInfo.value,
  };
  const res = await UserAPI.setUserInfo(req);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${!req.enable ? "禁用" : "启用"}成功`,
    });
    await getTableData();
    // userInfo.value.headerImg = ''
    userInfo.value.authorityIds = [];
  }
};

// 重置密码
const resetPasswordFunc = (row: any) => {
  ElMessageBox.confirm("是否将此用户密码重置为123456?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    UserAPI.resetPassword({ ID: row.ID })
      .then((res: any) => {
        ElMessage({
          type: "success",
          message: res.msg,
        });
      })
      .catch((err: any) => {
        ElMessage({
          type: "error",
          message: "重置密码失败!",
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

// 设置角色id组
const setAuthorityIds = () => {
  tableData.value &&
    tableData.value.forEach((project: any) => {
      project.authorityIds =
        project.authorities &&
        project.authorities.map((i: any) => {
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
