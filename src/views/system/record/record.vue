<template>
  <div>
    <div class="ops-search-box">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="请求方法">
          <el-input v-model="searchInfo.method" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="请求路径">
          <el-input v-model="searchInfo.path" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="结果状态码">
          <el-input v-model="searchInfo.status" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">
            查询
          </el-button>
          <el-button icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <el-button
          icon="delete"
          :disabled="!multipleSelection.length"
          @click="onDelete"
        >
          删除
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="ID"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="left" type="selection" width="55" />
        <el-table-column align="left" label="操作人" width="140">
          <template #default="scope">
            <div>
              {{ scope.row.user.userName }}({{ scope.row.user.nickName }})
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="日期" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态码" prop="status" width="120">
          <template #default="scope">
            <div>
              <el-tag type="success">{{ scope.row.status }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="请求IP" prop="ip" width="120" />
        <el-table-column
          align="left"
          label="请求方法"
          prop="method"
          width="120"
        />
        <el-table-column
          align="left"
          label="请求路径"
          prop="path"
          width="240"
        />
        <el-table-column align="left" label="请求" prop="path" width="80">
          <template #default="scope">
            <div>
              <el-popover
                v-if="scope.row.body"
                placement="left-start"
                :width="444"
              >
                <div class="popover-box">
                  <pre>{{ fmtBody(scope.row.body) }}</pre>
                </div>
                <template #reference>
                  <el-icon style="cursor: pointer"><warning /></el-icon>
                </template>
              </el-popover>

              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="响应" prop="path" width="80">
          <template #default="scope">
            <div>
              <el-popover
                v-if="scope.row.resp"
                placement="left-start"
                :width="444"
              >
                <div class="popover-box">
                  <pre>{{ fmtBody(scope.row.resp) }}</pre>
                </div>
                <template #reference>
                  <el-icon style="cursor: pointer"><warning /></el-icon>
                </template>
              </el-popover>
              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作">
          <template #default="scope">
            <el-button
              icon="delete"
              type="primary"
              link
              @click="deleteRecordFunc(scope.row)"
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
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/format";
import RecordAPI from "@/api/system/record";

defineOptions({ name: "Record" });

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);
const searchInfo = ref({
  method: "",
  path: "",
  status: "",
});
const onReset = () => {
  searchInfo.value = {
    method: "",
    path: "",
    status: "",
  };
};

// 条件搜索前端看此方法
const onSubmit = () => {
  page.value = 1;
  pageSize.value = 10;
  if (searchInfo.value.status === "") {
    searchInfo.value.status = "";
  }
  getTableData();
};

// 查询
const getTableData = () => {
  RecordAPI.getRecordList({
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

const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

const onDelete = () => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const ids: number[] = multipleSelection.value.map((item: any) => item.ID);
    RecordAPI.deleteRecordBatch({ ids: ids }).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      if (tableData.value.length === ids.length && page.value > 1) {
        page.value--;
      }
      getTableData();
    });
  });
};

const deleteRecordFunc = (row: any) => {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    RecordAPI.deleteRecordById({ ID: row.ID }).then((res: any) => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getTableData();
    });
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

const fmtBody = (value: any) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};
</script>
