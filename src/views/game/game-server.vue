<template>
  <div>
    <div>
      <el-button
        type="primary"
        icon="plus"
        @click="addGameServer()"
      >新增</el-button>
    </div>

    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%;margin-top:15px;"
    >
      <el-table-column 
          prop="ID" 
          label="ID" 
          min-width="100" />

        <el-table-column
          align="left"
          label="渠道"
          min-width="120"
          prop="platform.platformName"
        />

        <el-table-column
          align="left"
          label="游戏服名称"
          min-width="120"
          prop="name"
        />
      
        <el-table-column
          align="left"
          label="类型"
          min-width="120"
          prop="gameType.name"
        />

        <el-table-column
          align="left"
          label="主机"
          min-width="300"  
        >
          <template #default="scope">
            {{ scope.row.host.serverName }}-{{ scope.row.host.pubIp }}
          </template>
        </el-table-column>
        
        
        <el-table-column
          align="left"
          label="vmid"
          min-width="120"
          prop="vmid"
        />

        <el-table-column
          align="left"
          label="tcp端口"
          min-width="120"
          prop="tcpPort"
        />

        <el-table-column
          align="left"
          label="http端口"
          min-width="120"
          prop="httpPort"
        />

        <el-table-column
          align="left"
          label="grpc端口"
          min-width="120"
          prop="grpcPort"
        />

        <el-table-column
          align="left"
          label="状态"
          min-width="120"
        >
          <template #default="scope">
            {{ gameStaus[scope.row.status] }}
          </template>
        </el-table-column>

    

        <el-table-column
          align="left"
          fixed="right"
          label="操作"
          width="300"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editGameServer(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteGameServer(scope.row)"
            >删除</el-button>
            <el-button
              v-if="scope.row.status == 0"
              type="danger"
              link
              icon="download"
              @click="installGameServer(scope.row)"
            >安装</el-button>
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
              <el-button @click="closeDialog">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="enterDialog"
              >
                确 定
              </el-button>
            </div>
          </div>
        </template>
        <el-form
          ref="gameServerForm"
          :model="form"
          :rules="rules"
          :inline="true"
          label-width="120px"
          label-position="top"
        >
          <el-form-item
            
            label="名称"
            prop="name"
            style="width: 30%;"
            required
          >
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="正式服"
              size="large"
            />
          </el-form-item>

          <el-form-item
            label="渠道"
            prop="platformId"
            style="width: 30%;"
            required
          >
            <el-select
              v-model.number="form.platformId"
              placeholder="请选择渠道"
              size="large"
              @change="changePlatform"
              :disabled="isEdit"
            >
              <el-option
                v-for="item in platformData"
                :key="item.ID"
                :label="item.platformName"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>
          

          <el-form-item
            label="类型"
            prop="gameTypeId"
            style="width: 30%;"
            required
          >
            <el-select
              v-model.number="form.gameTypeId"
              placeholder="请选择类型"
              size="large"
              :disabled="isEdit"
            >
              <el-option
                v-for="item in gameTypeData"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>

          
          <el-form-item
            label="服务器"
            prop="hostId"
            style="width: 40%;"
            required
          >
            <el-select
              v-model.number="form.hostId"
              placeholder="请选择服务器"
              size="large"
            >
              <el-option
                v-for="item in serverData"
                :key="item.ID"
                :label="item.serverName"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="redis"
            prop="redisId"
            style="width: 40%;"
            required
          >
            <el-select
              v-model.number="form.redisId"
              placeholder="请选择redis"
              size="large"
            >
              <el-option
                v-for="item in redisData"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="mongo"
            prop="mongoId"
            style="width: 40%;"
            required
          >
            <el-select
              v-model.number="form.mongoId"
              placeholder="请选择mongo"
              size="large"
            >
              <el-option
                v-for="item in mongoData"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="kafka"
            style="width: 40%;"
            required
          >
            <el-select
              v-model.number="form.kafkaId"
              placeholder="请选择kafka"
              size="large"
            >
              <el-option
                v-for="item in kafkaData"
                :key="item.ID"
                :label="item.name"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="vmid" style="width: 20%;">
            <el-input v-model=form.vmid readonly></el-input>
          </el-form-item>
          <el-form-item label="tcp端口" style="width: 20%;">
            <el-input v-model=form.tcpPort readonly></el-input>
          </el-form-item>
          <el-form-item label="grpc端口" style="width: 20%;">
            <el-input v-model=form.grpcPort readonly></el-input>
          </el-form-item>
          <el-form-item label="http端口" style="width: 20%;">
            <el-input v-model=form.httpPort readonly></el-input>
          </el-form-item>
          <el-form-item label="docker-compose.yml" style="width: 100%;">
            <el-input v-model=form.composeFile readonly type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="application.yml" style="width: 100%;">
            <el-input v-model=form.configFile readonly type="textarea" rows="10"></el-input>
          </el-form-item>
          
        </el-form>

      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlatformApi from '@/api/game-config/platform';
import AssetsServerApi from '@/api/assets/server';
import AssetsKafkaApi from '@/api/assets/kafka';
import AssetsMongoApi from '@/api/assets/mongo';
import AssetsRedisApi from '@/api/assets/redis';
import GameTypeApi from '@/api/game/gameType';
import GameServerApi from '@/api/game/gameServer';

defineOptions({
  name: 'gameServer'
})

const router = useRouter()

const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchInfo = ref({
  name: ''
})

const platformData = ref([])
const gameTypeData = ref([])
const serverData = ref([])
const kafkaData = ref([])
const mongoData = ref([])
const redisData = ref([])

const gameStaus = ref({
  0: '待安装',
  1: '安装中',
  2: '已安装',
  3: '已删除'
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
  gameTypeId: [{ required: true, message: '请选择游戏类型', trigger: 'blur' },],
  redisId: [{ required: true, message: '请选择游戏redis', trigger: 'blur' },],
  mongoId: [{ required: true, message: '请选择游戏mongo', trigger: 'blur' },],
  kafkaId: [{ required: true, message: '请选择游戏kafka', trigger: 'blur' },],
  hostId: [{ required: true, message: '请选择游戏服务器', trigger: 'blur' },],
  platformId: [{ required: true, message: '请选择游戏渠道', trigger: 'blur' },],
}

const getTableData = () => {
  GameServerApi.getGameServerList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value
  }).then(res => {
    tableData.value = res.data.rows
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  })
}

getTableData()

const gameServerForm = ref()
const form = ref({
  name: '',
  gameTypeId: '',
  redisId: '',
  mongoId: '',
  kafkaId: '',
  hostId: '',
  platformId: '',
  vmid: 0,
  grpcPort: 0,
  httpPort: 0,
  tcpPort: 0,
  composeFile: '',
  configFile: ''
})

const initForm = () => {
  if (gameServerForm.value){
    gameServerForm.value.resetFields()
  }
  form.value = {
    name: '',
    gameTypeId: '',
    redisId: '',
    mongoId: '',
    kafkaId: '',
    hostId: '',
    platformId: '',
    vmid: 0,
    grpcPort: 0,
    httpPort: 0,
    tcpPort: 0,
    composeFile: '',
    configFile: ''
  }
  platformData.value = []
  gameTypeData.value = []
  serverData.value = []
  kafkaData.value = []
  mongoData.value = []
  redisData.value = []
}

const dialogTitle = ref('')
const type = ref('')
const dialogFormVisible = ref(false)
const isEdit = ref(false)

const openDialog = (key: string) => {
  switch (key) {
    case 'add':
      dialogTitle.value = "新增"
      isEdit.value = false
      break
    case 'edit':
       dialogTitle.value = "编辑"
       isEdit.value = true
      break
    default:
      break
  }
  getSelectData()
  type.value = key
  dialogFormVisible.value = true
}

const getSelectData = () => {
  // 获取渠道信息
  PlatformApi.getPlatformAll().then((res: any) => {
    platformData.value = res.data
  })

  GameTypeApi.getGameTypeAll().then((res: any) => {
    gameTypeData.value = res.data
  })

}

const changePlatform = (val: any) => {
  AssetsRedisApi.getAssetsRedisall({platformId: val}).then((res: any) => {
    redisData.value = res.data
  })
  AssetsMongoApi.getAssetsMongoall({platformId: val}).then((res: any) => {
    mongoData.value = res.data
  })
  AssetsKafkaApi.getAssetsKafkaall({platformId: val}).then((res: any) => {
    kafkaData.value = res.data
  })
  AssetsServerApi.getAssetsServerall({platformId: val}).then((res: any) => {
    serverData.value = res.data
  })
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const onReset = () => {
  searchInfo.value = {
    name: ''
  }
}

const onSubmit = () => {
  getTableData()
}

const enterDialog = () => {
  gameServerForm.value.validate((valid: boolean) => {
    if (valid){
      switch(type.value){
        case 'add':
          {
            GameServerApi.createGameServer(form.value).then(
              () => {
                ElMessage({
                  type: 'success',
                  message: '添加成功!'
                })
                getTableData()
                closeDialog()
              }
            )
            return
          }
          
        case 'edit':
          {
            GameServerApi.updateGameServer(form.value).then(
              () => {
                ElMessage({
                  type: 'success',
                  message: '修改成功!'
                })
                getTableData()
                closeDialog()
                return
              }
            )
          }
      }
    }
  })
}


const addGameServer = () => {
  openDialog('add')
}

const editGameServer = (row: any) => {
  changePlatform(row.platformId)
  GameServerApi.getGameServerById(row.ID).then((res: any) => {
    form.value = row
    
    openDialog('edit')
  })
}

const deleteGameServer = (row: any) => {
  ElMessageBox.confirm('确定删除该记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    GameServerApi.deleteGameServer({id: row.ID}).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getTableData()
   })
  })
}

const installGameServer = (row: any) => {
  // GameServerApi.installGameServer({id: row.ID}).then((res) => {
  //   console.log(res)
  // })
  ElMessageBox.confirm('确定安装该游戏吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    GameServerApi.installGameServer({ids: [row.ID]}).then((res:any) => {
      router.push({"name": 'task', params: {jobId: res.data.jobId}})
   })
  })
}

// 分页
const handleSizeChange = (val:number) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val:number) => {
  page.value = val
  getTableData()
}


</script>