<template>
  <div class="ops-table-box">
    <div class="ops-btn-list">
      <el-button type="primary" icon="plus" @click="addCronTask()">
        新增定时任务
      </el-button>
    </div>

    <el-table
      :data="tableData"
      row-key="cronTaskId"
      style="width: 100%; margin-top: 15px"
    >
      <!-- <el-table-column prop="cronTaskId" label="id" min-width="300" /> -->

      <el-table-column
        align="left"
        label="任务名称"
        min-width="200"
        prop="name"
      >
        <template #default="scope">
          <el-button link @click="getCronTaskInfo(scope.row)">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="任务标识"
        min-width="200"
        prop="taskTypeName"
      />

      <el-table-column
        align="left"
        label="任务类型"
        min-width="120"
        prop="type"
      >
        <template #default="scope">
          <el-tag :type="scope.row.type === 1 ? 'info' : 'warning'">
            {{ cronTaskType[scope.row.type] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="任务状态"
        min-width="120"
        prop="status"
      >
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ cronTaskStatus[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="创建人"
        min-width="120"
        prop="creator"
      />

      <el-table-column align="left" label="执行规则" min-width="200">
        <template #default="scope">
          <el-tag>
            {{
              scope.row.type === 1
                ? formatDate(scope.row.execTime)
                : scope.row.cronRule
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="创建时间"
        min-width="150"
        prop="createdAt"
      >
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            link
            icon="edit"
            @click="updateCronTask(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            icon="delete"
            @click="deleteCronTask(scope.row)"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            link
            icon="rank"
            @click="openExecDialog(scope.row)"
          >
            {{ scope.row.status === 1 ? "关闭" : "开启" }}
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
    <el-form ref="cronTaskForm" :model="form" :rules="rules" label-width="10%">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型名称" prop="taskTypeName">
        <el-input
          v-model.trim="form.taskTypeName"
          autocomplete="off"
          placeholder="cron:closeMatchBlock"
          :disabled="type == 'edit'"
        />
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select
          v-model="form.type"
          style="width: 200px"
          :disabled="type == 'edit'"
        >
          <el-option
            v-for="(value, key) in cronTaskType"
            :key="key"
            :label="value"
            :value="Number(key)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="describe">
        <el-input
          v-model="form.describe"
          type="textarea"
          rows="4"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
  </el-drawer>

  <el-dialog
    v-model="dialogExecFormVisible"
    :before-close="closeExecDialog"
    :show-close="false"
    width="500"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg">{{ dialogExecFormTitle }}</span>
      </div>
    </template>

    <el-form ref="" :model="form" :rules="rules" label-width="15%">
      <el-form-item label="名称">
        <el-input v-model="form.name" autocomplete="off" disabled />
      </el-form-item>

      <el-form-item label="执行规则" v-if="form.type == 2 && form.status == 2">
        <el-input v-model="form.cronRule" autocomplete="off" />
        <pre class="cron-help">
*   *   *   *   * 
│  │  │  │  │
│  │  │  │  └─── 星期几 (0 - 6, 星期天 = 0)
│  │  │  └───── 月份 (1 - 12)
│  │  └─────── 天数 (1 - 31)
│  └───────── 小时 (0 - 23)
└─────────── 分钟 (0 - 59)
        </pre>
      </el-form-item>

      <el-form-item label="执行时间" v-if="form.type == 1 && form.status == 2">
        <el-date-picker
          v-model="form.execTime"
          type="datetime"
          placeholder="请选择时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeExecDialog">取消</el-button>
        <el-button type="primary" @click="execCronTask">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/format";
import CronTaskApi, { type CronTask, CronTaskForm } from "@/api/job/cron";
import { get } from "http";

const router = useRouter();

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});

const rules = ref({
  name: [{ required: true, message: "请输入定时任务名称", trigger: "blur" }],
  // type 必填 范围在1-2
  type: [{ required: true, message: "请选择定时任务类型", trigger: "blur" }],
  taskTypeName: [
    { required: true, message: "请输入任务类型名称", trigger: "blur" },
  ],
});

const cronTaskType = ref<Record<number, string>>({
  1: "一次性任务",
  2: "周期性任务",
});

const cronTaskStatus = ref<Record<number, string>>({
  1: "已开启",
  2: "已关闭",
});
4;
const getTableData = () => {
  CronTaskApi.getCronTaskList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  }).then((res: any) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};
getTableData();

const cronTaskForm = ref();
const form = ref<CronTaskForm>({
  name: "",
  cronRule: "",
  type: 1,
  execTime: new Date(),
  describe: "",
  taskTypeName: "",
});

const initForm = () => {
  if (cronTaskForm.value) {
    cronTaskForm.value.resetFields();
  }

  form.value = {
    name: "",
    cronRule: "",
    type: 1,
    execTime: new Date(),
    describe: "",
    taskTypeName: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增定时任务";
      break;
    case "edit":
      dialogTitle.value = "编辑定时任务";
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

const dialogExecFormVisible = ref(false);
const dialogExecFormTitle = ref("");

const openExecDialog = (row: any) => {
  form.value = row;

  console.log("form.value", form.value);

  if (form.value.type == 1) {
    dialogExecFormTitle.value = "一次性任务";
  } else if (form.value.type == 2) {
    dialogExecFormTitle.value = "周期性任务";
  } else {
    return;
  }

  dialogExecFormVisible.value = true;
};

const closeExecDialog = () => {
  initForm();
  dialogExecFormVisible.value = false;
};

const addCronTask = () => {
  openDialog("add");
};

const updateCronTask = (row: any) => {
  form.value = { ...row };
  openDialog("edit");
};

const deleteCronTask = (row: any) => {
  ElMessageBox.confirm(`确定要删除${row.name}吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    CronTaskApi.deleteCronTask({ cronTaskId: row.cronTaskId }).then(
      (res: any) => {
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        getTableData();
      }
    );
  });
};

const execCronTask = () => {
  const statusText = form.value.status === 1 ? "关闭" : "开启";
  ElMessageBox.confirm(
    `确定要${statusText} (${form.value.name}) 任务吗?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    CronTaskApi.execCronTask(form.value).then((res: any) => {
      ElMessage({
        type: "success",
        message: "执行成功!",
      });
      getTableData();
      closeExecDialog();
    });
  });
};

const getCronTaskInfo = (row: any) => {
  router.push({
    name: "cron-task-info",
    params: {
      cronTaskId: row.cronTaskId,
    },
  });
};

const enterDialog = () => {
  // 提交表单
  cronTaskForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          CronTaskApi.createCronTask(form.value).then((res: any) => {
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
          CronTaskApi.updateCronTask(form.value).then((res: any) => {
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

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableData();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  getTableData();
};
</script>

<style lang="scss" scoped>
.cron-help {
  padding: 8px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #faf5f5;
  white-space: pre;
  background: black;
  border-radius: 5px;
}
</style>
