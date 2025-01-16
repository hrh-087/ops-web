<template>
  <div>
    <div>
      <el-button
        type="primary"
        icon="plus"
        @click="addGameType()"
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
          label="名称"
          min-width="120"
          prop="name"
        />
      
        <el-table-column
          align="left"
          label="代号"
          min-width="120"
          prop="code"
        />

        <el-table-column
          align="left"
          label="tcp端口规则"
          min-width="120"
          prop="tcpPort"
        />

        <el-table-column
          align="left"
          label="http端口规则"
          min-width="120"
          prop="httpPort"
        />

        <el-table-column
          align="left"
          label="grpc端口规则"
          min-width="120"
          prop="grpcPort"
        />

        <el-table-column
          align="left"
          label="vmid规则"
          min-width="120"
          prop="vmidRule"
        />

        <el-table-column
          align="left"
          label="是否为战斗服类型"
          min-width="120"
          prop="isFight"
        >
          <template v-slot="scope">
            <el-switch v-model="scope.row.isFight" disabled />
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
              @click="editGameType(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteGameType(scope.row)"
            >删除</el-button>
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
        ref="gameTypeForm"
        :model="form"
        :rules="rules"
        :inline="true"
        label-position="top"
        label-width="120px"
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
            placeholder="限时跨服"
          />
        </el-form-item>

        <el-form-item
          label="代号"
          prop="code"
          style="width: 30%;"
          required
        >
          <el-input
            v-model="form.code"
            autocomplete="off"
            placeholder="instance"
          />
        </el-form-item>

        <el-form-item
          label="vmid规则"
          prop="vmidRule"
          style="width: 30%;"
          required
        >
          <el-input
            v-model.number="form.vmidRule"
            autocomplete="off"
            placeholder="1"
          />
        </el-form-item>

        <el-form-item
          label="tcp端口规则"
          prop="tcpPort"
          style="width: 30%;"
        >
          <el-input
            v-model="form.tcpPort"
            autocomplete="off"
            placeholder="10600, 10699"
          />
        </el-form-item>

        <el-form-item
          label="http端口规则"
          prop="httpPort"
          style="width: 30%;"
        >
          <el-input
            v-model="form.httpPort"
            autocomplete="off"
            placeholder="20600, 20699"
          />
        </el-form-item>

        <el-form-item
          label="grpc端口规则"
          prop="grpcPort"
          style="width: 30%;"
        >
          <el-input
            v-model="form.grpcPort"
            autocomplete="off"
            placeholder="30600, 30699"
          />
        </el-form-item>
        <el-form-item
          label="是否为战斗服"
          prop="isFight"
          style="width: 30%;"
        >
          <el-switch v-model="form.isFight" />
        </el-form-item>

        <el-form-item
          label="类型配置模板"
          prop="configTemplate"
          style="width: 70%;"
          
        >
          <el-input
            v-model="form.configTemplate"
            autocomplete="off"
            type="textarea"
            :rows="10"
          />
        </el-form-item>

        <el-form-item
          label="docker-compose配置模板"
          prop="composeTemplate"
          style="width: 70%;"
          
        >
          <el-input
            v-model="form.composeTemplate"
            autocomplete="off"
            type="textarea"
            :rows="5"
          />
        </el-form-item>



      </el-form>
    </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">

import GameTypeApi from '@/api/game/gameType';

defineOptions({ name: "gameType" })
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchInfo = ref({
  name: ''
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
  code: [{ required: true, message: '请输入类型代码', trigger: 'blur' },],
  vmidRule: [{ required: true, message: '请输入Vmid规则', trigger: 'blur' },],
}

const getTableData = () => {
  GameTypeApi.getGameTypeList({page: page.value, pageSize:pageSize.value, ...searchInfo.value}).then(res => {
    tableData.value = res.data.rows
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  })
}

getTableData()

const gameTypeForm = ref()
const form = ref({
  name: "",
  code: "",
  tcpPort: "",
  httpPort: "",
  grpcPort: "",
  vmidRule: 0,
  configTemplate: "",
  composeTemplate: "",
  isFight: false
})

const initForm = () => {
  if (gameTypeForm.value){
    gameTypeForm.value.resetFields()
  }
  form.value = {
    name: "",
    code: "",
    tcpPort: "",
    httpPort: "",
    grpcPort: "",
    vmidRule: 0,
    configTemplate: "",
    composeTemplate: "",
    isFight: false
  }
}

const dialogTitle = ref('')
const type = ref('')
const dialogFormVisible = ref(false)

const openDialog = (key: string) => {
  switch (key) {
    case 'add':
      dialogTitle.value = "新增"
      break
    case 'edit':
       dialogTitle.value = "编辑"
      break
    default:
      break
  }

  type.value = key
  dialogFormVisible.value = true
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
  gameTypeForm.value.validate((valid: boolean) => {
    if (valid){
      switch(type.value){
        case 'add':
          {
            GameTypeApi.createGameType(form.value).then(
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
            GameTypeApi.updateGameType(form.value).then(
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


const addGameType = () => {
  openDialog('add')
}

const editGameType = (row: any) => {
  GameTypeApi.getGameTypeById(row.ID).then((res: any) => {
    form.value = res.data
    openDialog('edit')
  })
}

const deleteGameType = (row: any) => {
  ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    GameTypeApi.deleteGameType({ID: row.ID}).then(() => {
      ElMessage({
       type: 'success',
       message: '删除成功'
      })
      getTableData()
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