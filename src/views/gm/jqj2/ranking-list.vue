<template>
  <div>
    <div class="ops-search-box">
      <span>渠道:</span>
      <el-select
        v-model="serverId"
        placeholder="请选择渠道"
        style="width: 180px"
        @change="getRankList"
      >
        <el-option
          v-for="item in platformData"
          :key="item.platformCode"
          :label="item.platformName"
          :value="Number(item.platformCode)"
        />
      </el-select>
    </div>
    <div class="ops-table-box">
      <div class="ops-btn-list">
        <ExcelUploader
          @on-data-parsed="handleParsedData"
          :sheetNames="sheetNames"
          buttonName="批量导入"
          excelName="rankTemplate.xlsx"
        />
      </div>
      <el-table
        :data="tableData"
        row-key="id"
        :default-sort="{ prop: 'id', order: 'descending' }"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          align="left"
          label="id"
          min-width="120"
          prop="id"
          sortable
        />
        <el-table-column
          align="left"
          label="榜单id"
          min-width="120"
          prop="rankId"
          sortable
        />

        <el-table-column
          align="left"
          label="榜单名称"
          min-width="120"
          prop="name"
        />

        <el-table-column
          align="left"
          label="展示数量"
          min-width="120"
          prop="showCount"
        />

        <el-table-column
          align="left"
          label="开始时间"
          min-width="120"
          prop="startTime"
        />

        <el-table-column
          align="left"
          label="结束时间"
          min-width="120"
          prop="endTime"
        />

        <el-table-column
          align="left"
          label="榜单关闭时间"
          min-width="120"
          prop="closeTime"
        />

        <!-- <el-table-column align="left" label="状态" min-width="120" prop="type">
          <template #default="scope">
            <el-tag :type="scope.row.rankType == 1 ? 'primary' : 'warning'">
              {{ rankingListType[scope.row.rankType] }}
            </el-tag>
          </template>
        </el-table-column> -->

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
        width="1500px"
        center
        :before-close="closeTablelog"
      >
        <el-table :data="rankingData">
          <el-table-column property="id" label="id" width="80" sortable />
          <el-table-column
            property="rankId"
            label="榜单id"
            width="120"
            sortable
          />
          <el-table-column property="rankName" label="榜单名称" width="200" />
          <el-table-column property="showCount" label="展示数量" width="200" />
          <el-table-column property="startTime" label="开始时间" width="200" />
          <el-table-column property="endTime" label="结束时间" width="200" />
          <el-table-column property="closeTime" label="结束时间" width="200" />
          <el-table-column property="rewardList" label="榜单奖励">
            <template #default="scope">
              <el-tooltip placement="bottom" effect="light">
                <template #content>
                  <div>
                    <el-table
                      :data="scope.row.rewardList"
                      border
                      height="300"
                      width="300"
                    >
                      <el-table-column property="id" label="ID" width="120" />
                      <el-table-column
                        property="openId"
                        label="榜单配置唯一id"
                        width="120"
                      />
                      <el-table-column
                        property="rank"
                        label="排名"
                        width="120"
                      />
                      <el-table-column label="奖励" width="120">
                        <template #default="rewardScope">
                          <el-tag
                            v-for="(reward, index) in rewardScope.row.rewards"
                            :key="index"
                          >
                            {{ reward.rewardId }}_{{ reward.rewardName }}*{{
                              reward.rewardNum
                            }}
                          </el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
                <el-tag>查看奖励</el-tag>
              </el-tooltip>
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
          <el-form-item label="榜单唯一id">
            <el-input v-model="form.id" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="榜单id">
            <el-input v-model="form.rankId" autocomplete="off" disabled />
          </el-form-item>

          <el-form-item label="榜单名称">
            <el-input v-model="form.rankName" autocomplete="off" disabled />
          </el-form-item>

          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>

          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              date-format="MMM DD, YYYY"
              time-format="HH:mm"
            />
          </el-form-item>

          <div>
            <div class="flex items-center gap-2">
              <el-button
                type="primary"
                icon="edit"
                @click="addaward(form.rewardList.length + 1, form.rankId)"
              >
                新增奖励参数
              </el-button>
            </div>

            <el-table
              :data="form.rewardList"
              :default-sort="{ prop: 'id', order: 'ascending' }"
              style="width: 100%; margin-top: 12px"
              row-key="id"
            >
              <el-table-column align="left" prop="id" label="id" sortable>
                <template #default="scope">
                  <el-input v-model="scope.row.id" disabled />
                </template>
              </el-table-column>

              <el-table-column align="left" prop="openId" label="榜单唯一id">
                <template #default="scope">
                  <el-input v-model="scope.row.openId" disabled />
                </template>
              </el-table-column>

              <el-table-column align="left" prop="openId" label="榜单id">
                <template #default>
                  <el-input v-model="form.rankId" disabled />
                </template>
              </el-table-column>

              <el-table-column align="left" prop="rank" label="排名">
                <template #default="scope">
                  <el-input v-model="scope.row.rank" />
                </template>
              </el-table-column>

              <!-- <el-table-column align="left" prop="num" label="奖励数量">
                <template #default="scope">
                  <div>
                    <el-input v-model.number="scope.row.num" />
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column align="left">
                <template #default="scope">
                  <div>
                    <el-button
                      type="danger"
                      icon="delete"
                      link
                      @click="deleteaward(form.rewardList, scope.$index)"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="warning"
                      icon="edit"
                      link
                      @click="editward(form.rewardList, scope.$index)"
                    >
                      修改奖励
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-drawer>

      <el-dialog
        v-model="dialogRewardFormVisible"
        :title="dialogRewardFormTitle"
        width="600px"
        center
        :before-close="closeRewardlog"
      >
        <div>
          <el-button icon="plus" link @click="addReward()">添加</el-button>
        </div>
        <el-table
          :data="rewardForm"
          :default-sort="{ prop: 'id', order: 'ascending' }"
          style="width: 100%; margin-top: 12px"
          key="id"
        >
          <!-- <el-table-column align="left" prop="id" label="id">
            <template #default="scope">
              <el-input v-model="scope.row.id" disabled/>
            </template>
          </el-table-column> -->

          <el-table-column align="left" prop="rewardId" label="奖励id">
            <template #default="scope">
              <el-input v-model="scope.row.rewardId" />
            </template>
          </el-table-column>

          <el-table-column align="left" prop="rewardNum" label="奖励数量">
            <template #default="scope">
              <el-input v-model.number="scope.row.rewardNum" />
            </template>
          </el-table-column>

          <el-table-column align="left" prop="rewardNum" label="操作">
            <template #default="scope">
              <el-button type="danger" @click="deleteReward(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <template #footer>
          <el-button type="primary" @click="setReward()">确定</el-button>
          <el-button @click="closeRewardlog()">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExcelUploader from "@/components/Excel/ExcelUploader.vue";
import GmRankApi, {
  type GmRankList,
  RankOpenForm,
  RankRewardForm,
  RankReward,
} from "@/api/gm/ranking-list";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

defineOptions({ name: "RankingList" });

const rules = {};
const sheetNames = ["open", "reward"];

const tableData = ref<GmRankList[] | any>([]);

const rankingListType = ref<Record<number, string>>({
  1: "排行榜",
  2: "英雄榜",
});

const platformData = ref<Platform[] | any>([]);
const serverId = ref<number>();
const getTableData = () => {
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });
};

getTableData();

const getRankList = () => {
  GmRankApi.getRankList({
    serverId: serverId.value,
  }).then((res: any) => {
    tableData.value = res.data;
  });
};

// 添加奖励参数
const addaward = (id: number, rankId: number) => {
  if (!form.value.rewardList) {
    form.value.rewardList = [];
  }
  form.value.rewardList.push({
    id: id,
    openId: rankId,
    rank: "",
    rewards: [],
  });
};

// 删除奖励参数
const deleteaward = (rewardList: any, index: number) => {
  rewardList.splice(index, 1);
};

const currentIndex = ref(0);
// 编辑奖励参数
const editward = (rewardList: any, index: number) => {
  const rewards = rewardList[index].rewards;
  // 打开弹窗
  currentIndex.value = index;
  if (!rewards) {
    rewardForm.value = [];
  } else {
    rewardForm.value = [...rewards];
  }

  openRewardDialog();
};

const openRewardDialog = () => {
  dialogRewardFormVisible.value = true;
};

const dialogRewardFormVisible = ref(false);
const dialogRewardFormTitle = ref("编辑奖励");
const rewardForm = ref<RankReward[]>([]);

const closeRewardlog = () => {
  dialogRewardFormVisible.value = false;
  rewardForm.value = [];
  currentIndex.value = 0;
};

const setReward = () => {
  // 确保 rewards 是一个数组
  if (!form.value.rewardList[currentIndex.value].rewards) {
    form.value.rewardList[currentIndex.value].rewards = [];
  }
  // 将 rewardForm.value 赋值给 rewards
  form.value.rewardList[currentIndex.value].rewards = rewardForm.value;

  rewardForm.value = [];
  currentIndex.value = 0;

  closeRewardlog();
};

const addReward = () => {
  if (!rewardForm.value) {
    rewardForm.value = [];
  }
  rewardForm.value.push({
    rewardId: "",
    rewardName: "",
    rewardNum: 0,
  });
};

const deleteReward = (index: number) => {
  rewardForm.value.splice(index, 1);
};

const dialogFormVisible = ref(false);
const dialogFormTitle = ref("配置");
const form = ref<RankOpenForm>({
  id: 0,
  rankId: 0,
  showCount: 0,
  startTime: "",
  endTime: "",
  closeTime: "",
  rewardList: [],
});
const rankingForm = ref();

const initForm = () => {
  if (rankingForm.value) {
    rankingForm.value.resetFields();
  }
  form.value = {
    id: 0,
    rankId: 0,
    showCount: 0,
    startTime: "",
    endTime: "",
    closeTime: "",
    rewardList: [],
  };
};

const openDialog = (row: any) => {
  form.value = row;
  GmRankApi.getRankRewardList({
    serverId: serverId.value,
    id: row.id,
  }).then((res: any) => {
    form.value = row;
    form.value.rewardList = res.data;
    dialogFormVisible.value = true;
  });
};

const closeDialog = () => {
  dialogFormVisible.value = false;
  initForm();
};

const dialogTableTitle = ref("导入结果");
const dialogTableVisible = ref(false);
const rankingData = ref<RankOpenForm[]>([]);

const closeTablelog = () => {
  dialogTableVisible.value = false;
  rankingData.value = [];
};
// 获取excel数据
const handleParsedData = (data: Record<string, []>) => {
  console.log("data", data);

  // 获取榜单配置参数
  rankingData.value = (data["open"] as RankOpenForm[]).map(
    (item: RankOpenForm) => ({
      id: item.id,
      rankId: item.rankId,
      showCount: item.showCount,
      rankName: item.rankName,
      startTime: item.startTime,
      endTime: item.endTime,
      closeTime: item.closeTime,
      rewardList: [],
    })
  );

  for (const item of data["reward"] as RankRewardForm[]) {
    for (const item2 of rankingData.value) {
      try {
        if (item.openId === item2.id) {
          let rankReward: RankReward[] = [];

          // 如果奖励为空，则忽略
          if (item.rewards === undefined) {
            rankReward = [];
          } else {
            let reward = JSON.parse(item.rewards.toString());
            for (const key in reward) {
              rankReward.push({
                // id: item.id,
                rewardId: key,
                rewardName: "",
                rewardNum: reward[key],
              });
            }
          }
          // 追加奖励参数
          item2.rewardList.push({
            id: item.id,
            openId: item.openId,
            rank: item.rank.toString(),
            rewards: rankReward,
          });
        }
      } catch (error) {
        console.log("rewards", item.rewards);
        console.log(error);
        ElMessage.error({
          message: "奖励配置无法解析",
        });
        return;
      }
    }
  }
  dialogTableVisible.value = true;
  console.log("rankingData", rankingData.value);
};

// const checkDataResult = ref(true);
// 检测excel格式
// const checkDataFormat = (data: string[]) => {
//   let arr = ["id", "startTime", "endTime", "rewardList"];
//   checkDataResult.value = true;
//   for (const element of arr) {
//     console.log(element, data);
//     if (!data.includes(element)) {
//       ElMessage({
//         type: "error",
//         message: "表格格式有误",
//       });
//       checkDataResult.value = false;
//       return;
//     }
//   }
// };

const setRankingList = (key: number) => {
  switch (key) {
    case 1:
      rankingData.value.push(form.value);
  }

  console.log(rankingData.value);

  GmRankApi.setRankReward({
    serverId: serverId.value,
    rankConfig: rankingData.value,
  }).then((res: any) => {
    ElMessage({
      type: "success",
      message: "配置成功",
    });
    closeDialog();
    closeTablelog();
  });
};

// const rankingForm = ref<GmRankingList[]>([])
</script>
