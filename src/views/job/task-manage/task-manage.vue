<template>
  <div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button icon="plus" type="primary" @click="addTask()">
          新增任务
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="ID"
      >
        <!-- <el-table-column align="left" type="selection" width="55" /> -->
        <el-table-column
          align="left"
          label="任务名称"
          min-width="120px"
          prop="name"
        />
        <el-table-column
          align="left"
          label="任务类型"
          min-width="120"
          prop="taskType"
        />
        <el-table-column align="left" label="创建时间" min-width="180px">
          <template #default="scope">
            {{ formatDate(scope.row.CreatedAt) }}
          </template>
        </el-table-column>

        <el-table-column align="left" label="操作">
          <template #default="scope">
            <el-button
              icon="edit"
              type="primary"
              link
              @click="editProject(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              icon="delete"
              type="primary"
              link
              @click="deleteTaskFunc(scope.row)"
            >
              删除
            </el-button>
            <el-button
              icon="rank"
              type="danger"
              link
              @click="execTaskFunc(scope.row)"
            >
              执行
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
          ref="taskForm"
          :model="form"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入任务名称"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="任务类型" prop="taskType">
            <el-input
              v-model.trim="form.taskType"
              placeholder="请跟后端task任务类型对应, 如:game:updateGameImage"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/format";
import TaskManageApi, { type TaskManage } from "@/api/job/task-manage";

defineOptions({
  name: "TaskManage",
});
const router = useRouter();
const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);

const rules = ref({
  name: [{ required: true, message: "请输入任务", trigger: "blur" }],
  taskType: [{ required: true, message: "请输入任务类型", trigger: "blur" }],
});

const getTableData = () => {
  TaskManageApi.getTaskList({
    page: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

getTableData();

const taskForm = ref();
const form = ref<TaskManage>({
  name: "",
  taskType: "",
});

const initForm = () => {
  if (taskForm.value) {
    taskForm.value.resetFields();
  }
  form.value = {
    name: "",
    taskType: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增任务";
      break;
    case "edit":
      dialogTitle.value = "编辑任务";
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

const addTask = () => {
  openDialog("add");
};

const editProject = (row: any) => {
  TaskManageApi.getTaskById(row.ID).then((res: any) => {
    form.value = res.data;
    openDialog("edit");
  });
};

const deleteTaskFunc = (row: TaskManage) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    TaskManageApi.deleteTask({
      id: row.ID,
    }).then((res) => {
      getTableData();
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    });
  });
};

const execTaskFunc = (row: TaskManage) => {
  ElMessageBox.confirm("确定要执行吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    TaskManageApi.execTask({ id: row.ID }).then((res: any) => {
      router.push({
        name: "task",
        params: {
          jobId: res.data.jobId,
        },
      });
      // console.log(res)
    });
  });
};

const enterDialog = () => {
  // 提交表单
  taskForm.value?.validate((valid: boolean) => {
    if (valid) {
      switch (type.value) {
        case "add": {
          TaskManageApi.createTask(form.value).then((res: any) => {
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
          TaskManageApi.updateTask(form.value).then((res: any) => {
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
const handleSizeChange = (val: any) => {
  pageSize.value = val;
  getTableData();
};

const handleCurrentChange = (val: any) => {
  page.value = val;
  getTableData();
};
</script>
