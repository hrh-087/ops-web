<template>
  <div>
    <div class="ops-search-box">
      <span>渠道:</span>
      <el-select
        v-model="serverId"
        placeholder="请选择渠道"
        style="width: 180px"
        @change="getliveServerList"
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
        <el-button icon="plus" @click="addGameLive">新增房间</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="typeKey"
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          align="left"
          label="渠道名称"
          min-width="120"
          prop="platform.platformName"
        >
          <template>
            {{
              platformData.find(
                (item: Platform) => item.platformCode == String(serverId)
              )?.platformName
            }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="房间名称"
          min-width="120"
          prop="nameForTQT"
        />
        <el-table-column
          align="left"
          label="容纳人数"
          min-width="120"
          prop="number"
        />

        <el-table-column
          align="left"
          label="开始时间"
          min-width="120"
          prop="startTime"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.startTime || "无" }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="结束时间"
          min-width="120"
          prop="endTime"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.endTime || "无" }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              type="primary"
              icon="edit"
              link
              @click="editGameLive(scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        ref="gameLiveForm"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <template v-if="type == 'edit'">
          <el-form-item label="房间id" prop="id" style="width: 70%">
            <el-input v-model.trim="form.id" disabled />
          </el-form-item>
        </template>

        <el-form-item label="渠道" prop="serverId" style="width: 70%" required>
          <el-select
            v-model="form.serverId"
            placeholder="请选择"
            style="width: 100%"
            :disabled="type == 'edit'"
          >
            <el-option
              v-for="item in platformData"
              :key="item.platformCode"
              :label="item.platformName"
              :value="Number(item.platformCode)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="房间名称" prop="nameForTQT" style="width: 70%">
          <el-input
            v-model.trim="form.nameForTQT"
            placeholder="请输入房间名称"
          />
        </el-form-item>
        <el-form-item label="房间人数" prop="number" style="width: 70%">
          <el-input v-model.number="form.number" placeholder="请输入房间人数" />
        </el-form-item>

        <el-form-item
          label="开始时间"
          prop="startTime"
          style="width: 70%"
          required
        >
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="endTime"
          style="width: 70%"
          required
        >
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <div>
        <div class="flex items-center gap-2">
          <el-button type="primary" icon="edit" @click="addHomeOwner()">
            新增房主
          </el-button>
        </div>
        <el-table
          :data="homeownerList"
          style="width: 100%; padding-bottom: 12px; margin-top: 12px"
        >
          <el-table-column align="left" prop="id" label="房主id">
            <template #default="scope">
              <el-input v-model.number="scope.row.id" />
            </template>
          </el-table-column>
          <el-table-column align="left" prop="id" label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                icon="delete"
                link
                @click="kickLivePlayer(scope.row, 1)"
                v-if="scope.row.id != 0"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex items-center gap-2">
          <el-button type="primary" icon="edit" @click="addmember()">
            新增成员
          </el-button>
        </div>
        <el-table :data="memberList" style="width: 100%; margin-top: 12px">
          <el-table-column align="left" prop="id" label="成员id">
            <template #default="scope">
              <el-input v-model.number="scope.row.id" />
            </template>
          </el-table-column>
          <el-table-column align="left" prop="id" label="操作">
            <template #default="scope">
              <el-button
                type="danger"
                icon="delete"
                link
                @click="kickLivePlayer(scope.row, 2)"
                v-if="scope.row.id != 0"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import GmLiveApi, { type GameLive } from "@/api/gm/live";
import PlatformApi, { type Platform } from "@/api/game-config/platform";

const tableData = ref<GameLive[] | any>([]);
const serverId = ref<number>();
const platformData = ref<Platform[] | any>([]);

const rules = {
  serverId: [{ required: true, message: "请选择渠道", trigger: "blur" }],
  typeKey: [{ required: true, message: "请输入类型key", trigger: "blur" }],
};

const getTableData = () => {
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data;
  });
};

getTableData();

const homeownerList = ref([]);
const memberList = ref([]);
const getliveServerList = () => {
  GmLiveApi.getLiveServerList({
    serverId: Number(serverId.value),
  }).then((res: any) => {
    tableData.value = res.data;
  });
};

const form = ref<GameLive | any>({
  id: 0,
  serverId: "",
  startTime: "",
  endTime: "",
  homeowner: [],
  member: [],
  number: 50,
  nameForTQT: "",
});
const gameLiveForm = ref();

const initForm = () => {
  if (gameLiveForm.value) {
    gameLiveForm.value.resetFields();
  }
  form.value = {
    id: 0,
    serverId: "",
    startTime: "",
    endtime: "",
    homeowner: [],
    member: [],
    number: 50,
    nameForTQT: "",
  };
};

const dialogTitle = ref("");
const type = ref("");
const dialogFormVisible = ref(false);

const openDialog = (key: string) => {
  switch (key) {
    case "add":
      dialogTitle.value = "新增直播服房间";
      break;
    case "edit":
      dialogTitle.value = "编辑直播服房间";
      break;
    default:
      break;
  }
  type.value = key;
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  initForm();
  homeownerList.value = [];
  memberList.value = [];
  dialogFormVisible.value = false;
};

const addGameLive = () => {
  openDialog("add");
};

const editGameLive = (row: any) => {
  form.value = row;
  homeownerList.value = row.homeowner.map((item: any) => {
    return {
      id: item,
    };
  });
  memberList.value = row.member.map((item: any) => {
    return {
      id: item,
    };
  });
  openDialog("edit");
};

const addHomeOwner = () => {
  homeownerList.value.push({
    id: "",
  } as never);
};

const addmember = () => {
  memberList.value.push({
    id: "",
  } as never);
};

const kickLivePlayer = (row: any, type: number) => {
  GmLiveApi.kickLivePlayer({
    serverId: form.value.serverId,
    // groupId: form.value.groupId,
    playerId: row.id,
  }).then((res: any) => {
    ElMessage({
      type: "success",
      message: "踢人成功!",
    });

    // 踢人成功后删除相应的id

    switch (type) {
      case 1: {
        homeownerList.value = homeownerList.value.filter((item: any) => {
          return item.id !== row.id;
        });
        break;
      }
      case 2: {
        memberList.value = memberList.value.filter((item: any) => {
          return item.id !== row.id;
        });
        break;
      }
    }
  });
};

const enterDialog = () => {
  // 提交表单
  gameLiveForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      // 转换为数组
      form.value.homeowner = homeownerList.value.map((item: any) => {
        return item.id;
      });
      form.value.member = memberList.value.map((item: any) => {
        return item.id;
      });

      switch (type.value) {
        case "add": {
          GmLiveApi.setLiveServer(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "添加成功!",
            });
          });
        }
        case "edit": {
          GmLiveApi.setLiveServer(form.value).then((res: any) => {
            ElMessage({
              type: "success",
              message: "修改成功!",
            });
          });
        }
      }
      setTimeout(() => {
        getliveServerList();
      }, 1000);
      closeDialog();
    }
  });
};
</script>
