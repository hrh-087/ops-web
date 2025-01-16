<template>
  <div>
    <el-form
        ref="searchForm"
        :inline="true"
        :model="searchInfo"
      >
        <el-form-item label="路径">
          <el-input
            v-model="searchInfo.path"
            placeholder="路径"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="searchInfo.description"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="API组">
          <el-input
            v-model="searchInfo.apiGroup"
            placeholder="api组"
          />
        </el-form-item>
        <el-form-item label="请求">
          <el-select
            v-model="searchInfo.method"
            clearable
            placeholder="请选择"
            style="width:200px"
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="search"
            @click="onSubmit"
          >
            查询
          </el-button>
          <el-button
            icon="refresh"
            @click="onReset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
  </div>
  <div>
    <el-button
          type="primary"
          icon="plus"
          @click="openDialog('addApi')"
        >
          新增
    </el-button>
    <el-button
      icon="delete"
      :disabled="!apis?.length"
      @click="onDelete"
    >
      删除
    </el-button>
    <el-button
      icon="Refresh"
      @click="onFresh"
    >
      刷新缓存
    </el-button>
    <!-- <el-button
      icon="Compass"
      @click="onSync"
    >
      同步API
    </el-button> -->
  </div>

  <el-table
    :data="tableData"
    @sort-change="sortChange"
    @selection-change="handleSelectionChange"
    style="width: 100%;margin-top:15px;"
  >
    <el-table-column
      type="selection"
      width="55"
    />
    <el-table-column
      align="left"
      label="id"
      min-width="60"
      prop="ID"
      sortable="custom"
    />
    <el-table-column
      align="left"
      label="API路径"
      min-width="150"
      prop="path"
      sortable="custom"
    />
    <el-table-column
      align="left"
      label="API分组"
      min-width="150"
      prop="apiGroup"
      sortable="custom"
    />
    <el-table-column
      align="left"
      label="API简介"
      min-width="150"
      prop="description"
      sortable="custom"
    />
    <el-table-column
      align="left"
      label="请求"
      min-width="150"
      prop="method"
      sortable="custom"
    >
      <template #default="scope">
        <div>
          {{ scope.row.method }} / {{ methodFilter(scope.row.method) }}
        </div>
      </template>
    </el-table-column>

    <el-table-column
      align="left"
      fixed="right"
      label="操作"
      width="200"
    >
      <template #default="scope">
        <el-button
          icon="edit"

          type="primary"
          link
          @click="editApiFunc(scope.row)"
        >
          编辑
        </el-button>
        <el-button
          icon="delete"

          type="primary"
          link
          @click="deleteApiFunc(scope.row)"
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

    <el-drawer
      v-model="dialogFormVisible"
      size="60%"
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

      <warning-bar title="新增API，需要在角色管理内配置权限才可使用" />
      <el-form
        ref="apiForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="路径"
          prop="path"
        >
          <el-input
            v-model="form.path"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="请求"
          prop="method"
        >
          <el-select
            v-model="form.method"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="`${item.label}(${item.value})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="api分组"
          prop="apiGroup"
        >
          <el-select
            v-model="form.apiGroup"
            placeholder="请选择或新增" allow-create filterable default-first-option
          >
            <el-option
              v-for="item in apiGroupOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="api简介"
          prop="description"
        >
          <el-input
            v-model="form.description"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import ApiAPI from '@/api/system/api';
import { id } from 'element-plus/es/locale';

defineOptions({name: 'Api'})

const apis = ref()

const form = ref({
  path: '',
  apiGroup: '',
  method: '',
  description: ''
})
const methodOptions = ref([
  {
    value: 'POST',
    label: '创建',
    type: 'success'
  },
  {
    value: 'GET',
    label: '查看',
    type: ''
  },
  {
    value: 'PUT',
    label: '更新',
    type: 'warning'
  },
  {
    value: 'DELETE',
    label: '删除',
    type: 'danger'
  }
])

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({
  path: '',
  apiGroup: '',
  method: '',
  description: '',
  orderKey: 'id',
  desc: true
})

const type = ref('')
const rules = ref({
  path: [{ required: true, message: '请输入api路径', trigger: 'blur' }],
  apiGroup: [
    { required: true, message: '请输入组名称', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择请求方式', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入api介绍', trigger: 'blur' }
  ]
})

const apiForm = ref()
const initForm = () => {
  // console.log("apiForm:", apiForm)
  if (apiForm.value) {
    apiForm.value.resetFields()
  }
  form.value = {
    path: '',
    apiGroup: '',
    method: '',
    description: ''
  }
}

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

const onReset = () => {
  searchInfo.value = {
    path: '',
    apiGroup: '',
    method: '',
    description: '',
    orderKey: 'id',
    desc: true
  }
}

const dialogTitle = ref()
const dialogFormVisible = ref(false)
const openDialog = (key: string) => {
  switch (key) {
    case 'addApi':
      dialogTitle.value = "新增Api"
      break
    case 'editApi':
       dialogTitle.value = "编辑Api"
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}

const enterDialog = async() => {
  apiForm.value.validate(async(valid:boolean) => {
    if (valid){
      switch(type.value){
        case 'addApi':
          {
            ApiAPI.createApi(form.value).then(
              (res:any) => {
                if (res.code === 0) {
                  ElMessage({
                    type: 'success',
                    message: '添加成功!'
                  })
                  getTableData()
                  getGroup()
                  closeDialog()
                }
              }
            ).catch(
              (err:any) => {
                console.log(err)
              }
            )
            break
          }
        case 'editApi':
          {
            ApiAPI.editApi(form.value).then(
              (res:any) => {
                if (res.code === 0) {
                  ElMessage({
                    type: 'success',
                    message: '编辑成功!'
                  })
                  getTableData()
                  closeDialog()
                }
              }).catch((err) => { console.log(err)})
          }
      }
    }
  })
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const onDelete = (data:object) => {
  ElMessageBox.confirm('确定删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
      const ids = apis.value.map((item:any) => item.ID)
      ApiAPI.deleteApisByIds({ids}).then((res:any) => {
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
      if (tableData.value.length === ids.length && page.value > 1) {
        page.value--
      }
      getTableData()
      getGroup()
      }

    })
  })
}

const onFresh = () => {
 ElMessageBox.confirm('确定刷新缓存吗?', '提示', {
   confirmButtonText: '确定',
   cancelButtonText: '取消',
   type: 'warning'
 }).then(() => {
    ApiAPI.freshApi().then((res:any) => {
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '刷新成功!'
        })
      }
  })
 })
}

// const onSync = () => {

// }

const editApiFunc = (row:any) => {
  // console.log("row:", row)
  // ApiAPI.getApiById({id:row.ID}).then((res) => {
  //   if (res.code === 0) {
  //     form.value = res.data
  //     openDialog('editApi')
  //   }
  // })
  form.value = row
  openDialog('editApi')
}

const deleteApiFunc = (row:any) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ApiAPI.deleteApi({id:row.ID}).then((res) => {
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        getTableData()
        getGroup()
      }
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}



// 排序
const sortChange = ({ prop, order }:{prop:string, order:any}) => {
  if (prop !== '') {
    if (prop === 'ID') {
      prop = 'id'
    }
    searchInfo.value.orderKey = toSQLLine(prop)
    searchInfo.value.desc = order === 'descending'
  }
  getTableData()
}

// 批量操作
const handleSelectionChange = (val:never[]) => {
  apis.value = val
}

const getTableData = async() => {
  ApiAPI.getApiList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value
  }).then((res)=> {
      if (res.code === 0) {
      tableData.value = res.data.rows
      total.value = res.data.total
    }
  }).catch(
    (err)=>{
      console.log('err:', err)
    }
  )
}

const apiGroupOptions = ref<{ label: string, value: string }[]>()
const getGroup = () => {
  ApiAPI.getApiGroups().then((res)=> {
    if (res.code === 0) {
      apiGroupOptions.value = res.data.map(item => ({ label: item, value: item }))
    }
  })
}

getTableData()
getGroup()

// 驼峰转换下划线
const toSQLLine = (str:string) => {
    if (str === 'ID') return 'ID'
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
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

const methodFilter = (value:string) => {
  const target = methodOptions.value.filter(item => item.value === value)[0]
  return target && `${target.label}`
}


</script>

<style lang="scss" scoped>
// el-select {
//   width: 200px;
// }
</style>