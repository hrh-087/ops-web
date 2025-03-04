<template>
  <div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <ExcelUploader
          @on-data-parsed="handleParsedData"
          @check-data-format="checkDataFormat"
          buttonName="批量导入"
        />
      </div>
      <el-table
        :data="tableData"
        row-key="id"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          align="left"
          label="榜单id"
          min-width="120"
          prop="id"
        />

        <el-table-column
          align="left"
          label="榜单名称"
          min-width="120"
          prop="name"
        />

        <el-table-column
          align="left"
          label="榜单描述"
          min-width="120"
          prop="desc"
        />

        <el-table-column align="left" label="状态" min-width="120" prop="type">
          <template #default="scope">
            <el-tag :type="scope.row.rankType == 1 ? 'primary' : 'warning'">
              {{ rankingListType[scope.row.rankType] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button type="primary" link @click="openDialog(scope.row)">
              配置
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-model="dialogTableVisible"
        :title="dialogTableTitle"
        width="1000px"
        center
        :before-close="closeTablelog"
      >
        <el-table :data="rankingData">
          <el-table-column property="id" label="榜单id" width="120" />
          <el-table-column property="startTime" label="开始时间" width="200" />
          <el-table-column property="endTime" label="结束时间" width="200" />
          <el-table-column property="awardList" label="榜单奖励">
            <template #default="scope">
              {{
                scope.row.awardList
                  .map((item: any) => `${item.id}_${item.name}*${item.num}`)
                  .join(",")
              }}
            </template>
          </el-table-column>
        </el-table>

        <template #footer>
          <el-button type="primary" @click="setRankingList(2)">确定</el-button>
          <el-button @click="closeTablelog()">取消</el-button>
        </template>
      </el-dialog>

      <el-drawer
        v-model="dialogFormVisible"
        size="50%"
        :before-close="closeDialog"
        :show-close="false"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg">{{ dialogFormTitle }}</span>
            <div>
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="setRankingList(1)">
                确 定
              </el-button>
            </div>
          </div>
        </template>

        <el-form
          :model="form"
          ref="rankingForm"
          :rules="rules"
          label-width="120px"
          label-position="top"
        >
          <el-form-item label="榜单id">
            <el-input v-model="form.id" autocomplete="off" disabled />
          </el-form-item>

          <el-form-item label="榜单名称">
            <el-input v-model="form.name" autocomplete="off" disabled />
          </el-form-item>

          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              format="YYYY/MM/DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>

          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              format="YYYY/MM/DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>

          <div>
            <div class="flex items-center gap-2">
              <el-button type="primary" icon="edit" @click="addaward()">
                新增奖励参数
              </el-button>
            </div>

            <el-table
              :data="form.awardList"
              style="width: 100%; margin-top: 12px"
            >
              <el-table-column align="left" prop="id" label="奖励id">
                <template #default="scope">
                  <el-input v-model="scope.row.id" />
                </template>
              </el-table-column>

              <el-table-column align="left" prop="num" label="奖励数量">
                <template #default="scope">
                  <div>
                    <el-input v-model.number="scope.row.num" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="left">
                <template #default="scope">
                  <div>
                    <el-button
                      type="danger"
                      icon="delete"
                      @click="deleteaward(form.awardList, scope.$index)"
                    >
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExcelUploader from "@/components/Excel/ExcelUploader.vue";
import GmRankingListApi, {
  type GmRankingList,
  RankingForm,
  RankingListAward,
} from "@/api/gm/ranking-list";
// import PlatformApi, { type Platform } from "@/api/game-config/platform";

defineOptions({ name: "RankingList" });

const rules = {};

const tableData = ref<GmRankingList[] | any>([
  {
    id: 1,
    name: "排行榜1",
    rankType: 2,
    desc: "排行榜描述",
    awardList: [{ id: 1, name: "奖励1", num: 1 }],
  },
]);

const rankingListType = ref<Record<number, string>>({
  1: "排行榜",
  2: "英雄榜",
});

// const serverId = ref<number>();
// const platformData = ref<Platform[] | any>([]);

const getTableData = () => {
  // PlatformApi.getPlatformAll().then((res: any) => {
  //   platformData.value = res.data;
  // });
};

getTableData();

// 添加奖励参数
const addaward = () => {
  if (!form.value.awardList) {
    form.value.awardList = [];
  }
  form.value.awardList.push({
    id: "",
    name: "",
    num: 0,
  });
};

// 删除奖励参数
const deleteaward = (awardList: any, index: number) => {
  awardList.splice(index, 1);
};

const dialogFormVisible = ref(false);
const dialogFormTitle = ref("配置");
const form = ref<RankingForm>({
  id: "",
  startTime: "",
  endTime: "",
  awardList: [],
});
const rankingForm = ref();

const initForm = () => {
  if (rankingForm.value) {
    rankingForm.value.resetFields();
  }
  form.value = {
    id: "",
    startTime: "",
    endTime: "",
    awardList: [],
  };
};

const openDialog = (row: any) => {
  form.value = row;
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  dialogFormVisible.value = false;
  initForm();
};

const dialogTableTitle = ref("导入结果");
const dialogTableVisible = ref(false);
const rankingData = ref<RankingForm[]>([]);

const closeTablelog = () => {
  dialogTableVisible.value = false;
  rankingData.value = [];
};
// 获取excel数据
const handleParsedData = (data: never[]) => {
  data.forEach((item: any) => {
    let award: RankingListAward[] = [];
    item.awardList?.forEach((item: any) => {
      let awardId = item.split("_")[0];
      let awardName = item.split("_")[1].split("*")[0];
      let awardNum = item.split("*")[1];
      award.push({
        id: awardId,
        name: awardName,
        num: awardNum,
      });
    });

    rankingData.value.push({
      id: item.id,
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
      awardList: award,
    });
  });
  // 校验通过则展示表格
  if (checkDataResult.value) {
    dialogTableVisible.value = true;
  } else {
    rankingData.value = [];
  }
};

const checkDataResult = ref(true);
// 检测excel格式
const checkDataFormat = (data: string[]) => {
  let arr = ["id", "startTime", "endTime", "awardList"];
  checkDataResult.value = true;
  for (const element of arr) {
    console.log(element, data);
    if (!data.includes(element)) {
      ElMessage({
        type: "error",
        message: "表格格式有误",
      });
      checkDataResult.value = false;
      return;
    }
  }
};

const setRankingList = (key: number) => {
  switch (key) {
    case 1:
      rankingData.value.push(form.value);
  }

  console.log(rankingData.value);

  // GmRankingListApi.setRankingList(rankingData.value).then((res:any) => {
  //   ElMessage({
  //     type: "success",
  //     message: "配置成功",
  //   });
  //   closeDialog();
  //   closeTablelog();
  // });
};

// const rankingForm = ref<GmRankingList[]>([])
</script>
