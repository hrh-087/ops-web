<template>
  <div>
    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column prop="jobId" label="作业id" min-width="150" />

      <el-table-column
        align="left"
        label="作业名称"
        min-width="120"
        prop="name"
      />

      <el-table-column
        align="left"
        label="作业类型"
        min-width="120"
        prop="type"
      />

      <el-table-column
        align="left"
        label="作业状态"
        min-width="120"
        prop="status"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.status <= 3 ? 'success' : 'danger'"
            disable-transitions
          >
            {{
              jobStatusOptions.find(
                (item: any) => item.value === scope.row.status
              )?.label
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="创建人"
        min-width="120"
        prop="creator"
      />

      <el-table-column
        align="left"
        label="创建时间"
        min-width="120"
        prop="createAt"
      />

      <el-table-column align="left" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            type="primary"
            link
            icon="edit"
            @click="getJobById(scope.row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

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
</template>

<script setup lang="ts">
import JobApi from "@/api/job/job";

defineOptions({ name: "Job" });

const router = useRouter();

const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchInfo = ref({});

const jobStatusOptions = [
  { label: "未开始", value: 0 },
  { label: "运行中", value: 1 },
  { label: "已完成", value: 2 },
  { label: "运行失败", value: 3 },
];

const getTableData = () => {
  JobApi.getJobList({
    page: page.value,
    pageSize: pageSize.value,
    searchInfo: searchInfo.value,
  }).then((res) => {
    tableData.value = res.data.rows;
    total.value = res.data.total;
    page.value = res.data.page;
    pageSize.value = res.data.pageSize;
  });
};

getTableData();

const getJobById = (data: any) => {
  router.push({ name: "task", params: { jobId: data.jobId } });
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
