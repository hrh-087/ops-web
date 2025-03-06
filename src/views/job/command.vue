<template>
  <div class="ops-table-box">
    <div class="ops-btn-list">
      <el-button type="primary" icon="plus" @click="addCommand()">
        新增命令
      </el-button>
    </div>
    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column
        align="left"
        label="命令名称"
        min-width="120"
        prop="name"
      />

      <el-table-column align="left" label="命令类型" min-width="120">
        <template #default="scope">
          {{ getCommandType(scope.row.commandType) }}
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="命令"
        min-width="120"
        prop="command"
        show-overflow-tooltip
      />

      <el-table-column
        align="left"
        label="描述"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row.description || "-" }}
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="是否允许批量执行"
        min-width="120"
        prop="useBatch"
      >
        <template #default="scope">
          <el-switch v-model="scope.row.useBatch" disabled />
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            link
            icon="edit"
            @click="editCommand(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            link
            icon="delete"
            @click="deleteCommand(scope.row)"
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
          ref="commandForm"
          :model="form"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="命令名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>

          <el-form-item label="命令类型" prop="commandType">
            <el-select
              v-model="form.commandType"
              clearable
              placeholder="请选择类型"
              style="width: 240px"
            >
              <el-option
                v-for="item in commandTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="命令" prop="command">
            <el-input
              v-model="form.command"
              type="textarea"
              :rows="5"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="10"
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item label="允许批量执行" prop="useBatch">
            <el-switch v-model="form.useBatch" />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommandApi, { Command } from "@/api/job/command";

defineOptions({
  name: "Command",
});

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});

const rules = ref({
  name: [{ required: true, message: "请输入命令名称", trigger: "blur" }],
  command: [{ required: true, message: "请输入命令", trigger: "blur" }],
});

const commandTypeOptions = [
  {
    value: 1,
    label: "shell",
  },
];

const commandType: Record<number, string> = {
  1: "shell",
};

const getTableData = () => {
  CommandApi.getCommandList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

getTableData();

const commandForm = ref();
const form = ref<Command>({
  name: "",
  command: "",
});

const initForm = () => {
  if (commandForm.value) {
    commandForm.value.resetFields();
  }
  form.value = {
    name: "",
    command: "",
    description: "",
    commandType: 0,
    useBatch: false,
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增命令";
      break;
    case "edit":
      dialogTitle.value = "编辑命令";
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
const addCommand = () => {
  openDialog("add");
};

const editCommand = (row: Command) => {
  form.value = { ...row };
  openDialog("edit");
};

const deleteCommand = (row: any) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    CommandApi.deleteCommand({
      id: row.ID,
    }).then((res: any) => {
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
      getTableData();
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

const enterDialog = () => {
  // 提交表单
  commandForm.value?.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          CommandApi.createCommand(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "添加成功!",
            });
            getTableData();
            closeDialog();
          });
          break;
        }
        case "edit": {
          CommandApi.updateCommand(form.value).then((res: any) => {
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

const getCommandType = (type: number) => {
  return commandType[type];
};
</script>
