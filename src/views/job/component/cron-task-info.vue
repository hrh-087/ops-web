<template>
  <div class="task-page">
    <!-- 顶部任务信息 -->
    <el-card class="mb-3">
      <el-row :gutter="20">
        <el-col :span="8">
          <p>
            <strong>任务ID:</strong>
            {{ cronTaskInfo.cronTaskId }}
          </p>
          <p>
            <strong>创建人:</strong>
            {{ cronTaskInfo.creator }}
          </p>
          <p>
            <strong>任务类型:</strong>
            <el-tag>{{ cronTaskType[cronTaskInfo.type] }}</el-tag>
          </p>
          <p>
            <strong>任务状态:</strong>
            <el-tag :type="cronTaskInfo.status == 1 ? 'success' : 'info'">
              {{ cronTaskStatus[cronTaskInfo.status] }}
            </el-tag>
          </p>
        </el-col>
        <el-col :span="8">
          <p>
            <strong>任务总数:</strong>
            {{ cronTaskInfo.tasks.length }}
          </p>
          <p>
            <strong>完成的任务数:</strong>
            {{ completed }}
          </p>
          <p>
            <strong>等待的任务数:</strong>
            {{ pending }}
          </p>
          <p>
            <strong>失败的任务数:</strong>
            {{ faild }}
          </p>
        </el-col>
        <el-col :span="8">
          <p>
            <strong>创建时间:</strong>
            {{ formatDate(cronTaskInfo.createdAt) }}
          </p>
          <p>
            <strong>最后更新时间:</strong>
            {{ formatDate(cronTaskInfo.updatedAt) }}
          </p>
          <p>
            <strong>执行规则:</strong>
            <el-tag>
              {{
                cronTaskInfo.type == 2
                  ? cronTaskInfo.cronRule
                  : formatDate(cronTaskInfo.execTime)
              }}
            </el-tag>
          </p>
        </el-col>
      </el-row>
    </el-card>

    <!-- 单个卡片展示任务进度表和任务输出 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 左侧：任务进度表 -->
        <el-col :span="12">
          <div class="header">任务列表:</div>
          <el-table
            :data="jobTaskList"
            border
            height="400px"
            style="width: 100%"
            :row-class-name="getRowClass"
            @row-click="getTaskResult"
          >
            <el-table-column prop="taskId" label="任务ID" width="300" />
            <el-table-column prop="hostName" label="主机名" width="150" />
            <el-table-column prop="hostIp" label="管理地址" width="150" />
            <el-table-column prop="status" label="状态" width="150">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.status === 'completed' ? 'success' : 'danger'
                  "
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="execTime" label="耗时(s)" width="120" />
            <el-table-column prop="createAt" label="创建时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.createAt) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- <el-pagination
              :current-page="page"
              :page-size="pageSize"
              :total="total"
              background
              layout="prev, pager, next"
              @current-change="getCronTaskInfo"
            /> -->

          <el-pagination
            class="ops-pagination"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </el-col>

        <!-- 右侧：任务输出 -->
        <el-col :span="12">
          <div class="header">
            当前任务:
            <el-tag>{{ currentServer }}</el-tag>
          </div>
          <el-divider />
          <p class="header">控制台:</p>
          <pre class="output">{{ output }}</pre>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import CronTaskApi, { type CronTask } from "@/api/job/cron";
import TaskApi from "@/api/job/task";
import { formatDate } from "@/utils/format";

defineOptions({
  name: "CronTaskInfo",
});

const route = useRoute();

const cronTaskId = ref(route.params.cronTaskId);

const page = ref(1);
const pageSize = ref(5);
const total = ref(0);
const searchInfo = ref({});

const cronTaskInfo = ref<CronTask>({
  createdAt: "",
  creator: "",
  cronRule: "",
  cronTaskId: "",
  describe: "",
  execTime: "",
  name: "",
  projectId: 0,
  status: 0,
  taskId: "",
  tasks: [],
  taskTypeName: "",
  type: 0,
  updatedAt: "",
});

const jobTaskList = ref([]);

const cronTaskStatus = ref<Record<number, string>>({
  1: "已开启",
  2: "已关闭",
});

const cronTaskType = ref<Record<number, string>>({
  2: "周期性任务",
  1: "一次性任务",
});

const getCronTaskInfo = () => {
  CronTaskApi.getCronTaskById(cronTaskId.value).then((res: any) => {
    TaskApi.getTaskList({
      page: page.value,
      pageSize: pageSize.value,
      jobId: cronTaskId.value,
    }).then((res) => {
      jobTaskList.value = res.data.rows;
      total.value = res.data.total;
      page.value = res.data.page;
      pageSize.value = res.data.pageSize;
    });

    cronTaskInfo.value = res.data;
  });
};

getCronTaskInfo();

const currentServer = ref("");
const output = ref("");

// 定义计算属性
const completed = computed(() => {
  return cronTaskInfo.value.tasks.filter((item: any) => {
    if (item.status === "completed") {
      return true;
    }
  }).length;
});

const pending = computed(() => {
  return cronTaskInfo.value.tasks.filter((item: any) => {
    if (item.status === "pending") {
      return true;
    }
  }).length;
});

const faild = computed(() => {
  return cronTaskInfo.value.tasks.filter((item: any) => {
    if (item.status === "archived") {
      return true;
    }
  }).length;
});

const getTaskResult = (row: any) => {
  currentServer.value = row.taskId;
  TaskApi.getTaskResult({
    ...row,
  }).then((res: any) => {
    output.value = res.data.taskResult;
    // console.log("output:", output.value);
  });
};

const getRowClass = (row: any) => {
  return row.status === 2 ? "row-success" : "row-failure";
};

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getCronTaskInfo();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  getCronTaskInfo();
};
</script>

<style scoped lang="scss">
.task-page {
  padding: 20px;

  .mb-3 {
    margin-bottom: 20px;
  }

  .mt-2 {
    margin-top: 10px;
  }

  .header {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .output {
    height: 320px; /* 限定高度 */
    padding: 10px;
    overflow-y: auto; /* 滚动条 */
    font-size: 14px;
    color: #fff; /* 白色字体 */
    background-color: #000; /* 黑色背景 */
    border-radius: 5px;
  }

  .row-success {
    background-color: #e8f5e9; /* 成功绿色背景 */
  }

  .row-failure {
    background-color: #ffebee; /* 失败红色背景 */
  }
}
</style>
