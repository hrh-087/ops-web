<template>
  <el-row type="flex" justify="space-between" :gutter="10">
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">
              基础信息
            </div>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <p><strong>更新名称:</strong> {{ updateInfo.name }}</p>
            <p><strong>更新类型:</strong> {{ updateTypeOpteions.find(item => item.value === updateInfo.updateType)?.label }}</p>
          </el-col>
          <el-col :span="12">
            <p><strong>创建时间:</strong> {{ updateInfo.CreatedAt }}</p>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">
              更新信息
            </div>
          </div>
        </template>
        <template #default>
          <el-row>
            <el-col>
              <template v-if="updateInfo.updateType === 1">
                <p><strong>版号:</strong> {{ updateInfo.gameVersion }}</p>
              </template>
              <template v-else-if="updateInfo.updateType === 2">
                <p><strong>热更类型:</strong> {{ serverTypeOptions.find(item => item.value === updateInfo.hotServerType)?.label }}</p>
                <p><strong>热更文件:</strong> {{ updateInfo.sourceHotFile }}</p>
                <p><strong>热更服务:</strong></p>
                <p v-for="item in hotUpdateObjInfo" :key="item.ID" style="color: red;">
                  {{ updateInfo.hotServerType == 1 ? `${item.gameType.code}_${item.vmid}` : item.name }}
                </p>
              </template>
  
              <template v-else-if="updateInfo.updateType === 3">
                <p><strong>暂不支持热更配置文件</strong></p>
              </template>
            </el-col>
          </el-row>
         
        </template>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <div class="card-title">
              操作步骤
            </div>
          </div>
        </template>
        <template #default>
          <el-button v-if="updateInfo.step != 0" type="danger" size="large" :disabled="buttonDisabled" @click="execUpdateTask">
          <template #default>
            当前步骤:{{ updateInfo.step }}. {{ updateInfo.stepName }}
          </template>
        </el-button>
        </template>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import GameUpdateApi, {GameUpdateForm} from '@/api/job/game-update';
import GameTypeApi from '@/api/game/gameType';
import GameServerApi from '@/api/game/gameServer';

defineOptions({
  name: 'game-update-info',
  inheritAttrs: false
})
const router = useRouter()
const route = useRoute()
const infoId = route.params.id
const buttonDisabled = ref(false)

const updateInfo = ref<GameUpdateForm>({
  name: '',
  updateType: 0,
})

const updateTypeOpteions = [
  {
    value: 0,
    label: '------'
  },
  {
    value: 1,
    label: '正常更新'
  },
  {
    value: 2,
    label: '热更服务端代码'
  },
  {
    value: 3,
    label: '热更配置文件'
  }
]

const serverTypeOptions = [
  {
    value: 0,
    label: '------'
  },
  {
    value: 1,
    label: '游戏服'
  },
  {
    value: 2,
    label: '游戏类型'
  }
]
const getUpdateInfo = async () =>{
  await GameUpdateApi.getGameUpdateById(infoId).then((res:any) => {
    updateInfo.value = res.data
  })

 
}

const hotUpdateObj = ref([])

const hotUpdateObjInfo = computed(() => {
  if (!updateInfo.value.hotServerList){
    return []
  }
  const obj = JSON.parse(updateInfo.value.hotServerList)
  return hotUpdateObj.value.filter((item: any) => {
    return obj.includes(item.ID)
  })
})

const execUpdateTask = () =>{
  buttonDisabled.value = true
  GameUpdateApi.execUpdateGameTask({id:updateInfo.value.ID}).then((res:any) => {
    router.push({name: 'task', params: {jobId: res.data.jobId}})
  })
}

onMounted(async () => {
  // 获取更新任务信息
  await getUpdateInfo()
  // 热更是获取热更对象信息
  if (updateInfo.value.updateType === 2){
    if(updateInfo.value.hotServerType === 1){
      GameServerApi.getGameServerAll().then((res: any) => {
        hotUpdateObj.value = res.data
      })
    } else if (updateInfo.value.hotServerType === 2){
      GameTypeApi.getGameTypeAll().then((res: any) => {
        hotUpdateObj.value = res.data
      })
    } else {
      ElMessage.error('热更类型错误')
    }
  }
})

</script>

<style scoped lang="scss">
.card-center {
  display: flex;
  justify-content: center; // 水平居中
  // align-items: center; // 垂直居中
  // height: 100%; // 确保卡片有足够的高度以显示居中的按钮
  width: 100%;
}

.el-button {
  width: 100%; // 按钮宽度占满卡片
  height: 100%; // 按钮高度占满卡片
  box-sizing: border-box; // 确保 padding 和 border 包含在宽度和高度内
}
.el-card {
  margin-bottom: 20px;
}
</style>