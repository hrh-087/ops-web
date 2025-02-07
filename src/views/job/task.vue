<template>
  <div class="task-page">
    <!-- 顶部任务信息 -->
    <el-card class="mb-3">
      <el-row :gutter="20">
        <el-col :span="8">
          <p>
            <strong>作业ID:</strong>
            {{ jobInfo.jobId }}
          </p>
          <p>
            <strong>创建人:</strong>
            {{ jobInfo.creator }}
          </p>
          <p>
            <strong>任务类型:</strong>
            {{ jobInfo.type }}
          </p>
          <p>
            <strong>任务状态:</strong>
            {{ status }}
          </p>
        </el-col>
        <el-col :span="8">
          <p>
            <strong>任务总数:</strong>
            {{ jobInfo.tasks.length }}
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
            <strong>总耗时:</strong>
            {{ jobInfo.execTime }}
          </p>
          <p>
            <strong>创建时间:</strong>
            {{ jobInfo.createAt }}
          </p>
        </el-col>
      </el-row>
      <p>
        <strong>任务进度:</strong>
        <el-progress
          :text-inside="true"
          :stroke-width="18"
          :percentage="((completed + faild) / jobInfo.tasks.length) * 100"
          class="mt-2"
          :status="
            completed + faild === jobInfo.tasks.length ? 'success' : 'active'
          "
        />
      </p>
    </el-card>

    <!-- 单个卡片展示任务进度表和任务输出 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 左侧：任务进度表 -->
        <el-col :span="12">
          <div class="header">任务列表:</div>
          <el-table
            :data="jobInfo.tasks"
            border
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
          </el-table>
        </el-col>

        <!-- 右侧：任务输出 -->
        <el-col :span="12">
          <div class="header">当前任务:</div>
          <p>{{ currentServer }}</p>
          <el-divider />
          <p class="header">控制台:</p>
          <pre class="output">{{ output }}</pre>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import JobApi from "@/api/job/job";
import TaskApi from "@/api/job/task";

defineOptions({ name: "Task" });

const route = useRoute();

const jobId = ref(route.params.jobId);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});
const jobInfo = ref({
  jobId: "",
  name: "",
  type: "",
  tasks: [],
  status: 0,
  creator: "",
  createAt: "",
  execTime: 0,
});
const jobStatus = ref<Record<number, string>>({
  0: "待执行",
  1: "执行中",
  2: "执行成功",
  3: "执行失败",
});

const getJobInfo = () => {
  JobApi.getJobById({
    jobId: jobId.value,
  }).then((res: any) => {
    jobInfo.value = res.data;

    // 检测任务状态为完成的时候清除定时器
    if (jobInfo.value.status === 2 || jobInfo.value.status === 3) {
      clearInterval(timer);
    }
  });
};

getJobInfo();

const currentServer = ref("");
const output = ref("");

const getTaskResult = (row: any) => {
  currentServer.value = row.taskId;
  TaskApi.getTaskResult({
    asynqId: row.asynqId,
  }).then((res: any) => {
    output.value = res.data.taskResult;
    console.log("output:", output.value);
  });
};
const getRowClass = ({ row }) => {
  return row.status === 2 ? "row-success" : "row-failure";
};

// 销毁组件的时候停止定时器
onBeforeUnmount(() => {
  clearInterval(timer);
});

// 定义一个定时器，当任务未完成时每3秒获取一次任务信息
const timer = setInterval(() => {
  getJobInfo();
}, 3000);

// 定义计算属性
const completed = computed(() => {
  return jobInfo.value.tasks.filter((item: any) => {
    if (item.status === "completed") {
      return true;
    }
  }).length;
});

const pending = computed(() => {
  return jobInfo.value.tasks.filter((item: any) => {
    if (item.status === "pending") {
      return true;
    }
  }).length;
});

const faild = computed(() => {
  return jobInfo.value.tasks.filter((item: any) => {
    if (item.status === "archived") {
      return true;
    }
  }).length;
});

const status = computed(() => {
  const statusNum = jobInfo.value?.status;
  return typeof statusNum === "number" ? jobStatus.value[statusNum] : "";
});
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
    height: 300px; /* 限定高度 */
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
