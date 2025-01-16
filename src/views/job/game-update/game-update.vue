<template>
  <div>
    <el-button
      type="primary"
      icon="plus"
      @click="addupdate()"
    >新增更新任务</el-button>
  </div>
  <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%;margin-top:15px;"
    >
      
        <el-table-column
          align="left"
          label="名称"
          min-width="120"
          prop="name"
        />
        <el-table-column
          align="left"
          label="类型"
          min-width="120"
          prop="updateType"
        >
          <template #default="scope">
            {{ updateTypeOpteions.find(item => item.value === scope.row.updateType)?.label }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="创建时间"
          min-width="120"
          prop="CreatedAt"
        />
        <el-table-column
          align="left"
          label="更新时间"
          min-width="120"
          prop="UpdatedAt"
        />

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
              icon="view"
              @click="checkupdate(scope.row)"
            >查看</el-button>
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editupdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteupdate(scope.row)"
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
        ref="updateForm"
        :model="form"
        :rules="rules"
        label-width="10%"
      >
        <el-form-item
          label="任务名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="更新类型"
          prop="updateType"
        >
          <el-select
            v-model="form.updateType"
            clearable
            placeholder="请选择类型"
            style="width: 240px"
          >
            <el-option
              v-for="item in updateTypeOpteions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <template v-if ="form.updateType === 1">
            <el-form-item
              label="游戏版本号:"
              prop="gameVersion"
            >
              <el-input
                v-model="form.gameVersion"
                autocomplete="off"
              />
            </el-form-item>
        </template>
        <template v-else-if="form.updateType === 2">
          <el-form-item
            label="热更类型"
            prop="serverType"
          >
            <el-select
              v-model="form.serverType"
              clearable
              placeholder="请选择热更类型"
              @change="changeServerType"
              style="width: 240px"
            >
              <el-option
                v-for="item in serverTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="热更对象"
            prop="serverList"
          >
            <el-select
              v-model="form.serverList"
              placeholder="请选择对象"
              size="large"
              style="width: 600px;"
              clearable
              multiple
            >
              <el-option
                v-for="item in hotUpdateObjList"
                :key="item.ID"
                :label="form.serverType == 1 ? `${item.gameType.code}_${item.vmid}` : item.name"
                :value="item.ID"
              />
              <el-option v-if="!hotUpdateObjList.length" :value="-1" disabled label="加载中..."></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="热更文件"
            prop="hotFile"
          >
          <el-upload
            ref="uploadfileRef"
            class="upload-wrapper"
            :limit="1"
            :auto-upload="false"
            action="#"
            :on-change="handleFileChange"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              <em>上传热更文件</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                zip files with a size less than 5M
              </div>
            </template>
          </el-upload>
          </el-form-item>
        </template>

      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import GameUpdateApi, {GameUpdateForm} from '@/api/job/game-update';
import GameServerApi from '@/api/game/gameServer';
import GameTypeApi from '@/api/game/gameType';
import UploadFileApi from '@/api/base';

import { UploadFile } from 'element-plus';
import { json } from 'stream/consumers';
import { pa } from 'element-plus/es/locale';

defineOptions({name: 'game-update'})

const router = useRouter()

const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchInfo = ref({})

const rules = ref({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  updateType: [
    { required: true, message: '请选择更新类型', trigger: 'blur' },
    {
      validator(rule: any, value: any, callback: any) {
        if (value === 0) {
          return callback(new Error('请选择更新类型'));
        }
        callback();
      }
    }
  ],
  hotFile: [
    { required: false, message: '请选择热更文件', trigger: 'blur' },
    {
      validator(rule: any, value: any, callback: any) {
        console.log(formData)
        if (!formData.has("file")) {
          return callback(new Error('请选择热更文件'));
        }
        callback();
      }
    }
  ],
  serverList:[{ required: true, message: '请选择热更对象', trigger: 'blur' }],
  serverType: [{ required: true, message: '请选择热更类型', trigger: 'blur' }]
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

const hotUpdateObjList = ref([])

const changeServerType = () => {
  form.value.serverList = []
  if (form.value.serverType === 1){
    GameServerApi.getGameServerAll().then((res: any) => {
      hotUpdateObjList.value = res.data
    })
  }else if (form.value.serverType === 2){
    GameTypeApi.getGameTypeAll().then((res: any) => {
      hotUpdateObjList.value = res.data
    })
  }
}

const getTableData = () => {
  GameUpdateApi.getGameUpdateList({page: page.value, pageSize:pageSize.value, ...searchInfo.value}).then(res => {
    tableData.value = res.data.rows
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  })
}

getTableData()

const updateForm = ref()
const form = ref<GameUpdateForm>({
  name : '',
  updateType : 0,
})

const initForm = () => {
  if (updateForm.value){
    updateForm.value.resetFields()
  }
  if (uploadfileRef.value){
    uploadfileRef.value.clearFiles()
  }
  form.value = {
    name : '',
    updateType : 0,
  }
  hotUpdateObjList.value = []
  formData = new FormData()
}

const dialogTitle = ref('')
const type = ref('')
const dialogFormVisible = ref(false)

const openDialog = (key: string) => {
  switch (key) {
    case 'add':
      dialogTitle.value = "新增更新任务"
      break
    case 'edit':
       dialogTitle.value = "编辑更新任务"
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

// 分页
const handleSizeChange = (val:number) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val:number) => {
  page.value = val
  getTableData()
}

const checkupdate = (row:any)=>{
  router.push({name:'game-update-info', params:{id:row.ID}})
}
const addupdate = () => {
  openDialog('add')
}

const editupdate = (row: any) => {
  GameUpdateApi.getGameUpdateById(row.ID).then((res:any)=>{
    form.value = res.data
    openDialog('edit')
  })
}
const deleteupdate = (row: any) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    GameUpdateApi.deleteGameUpdate({id:row.ID}).then((res:any)=>{
      ElMessage({
        type: 'success',
        message: "删除成功!",
      })
      getTableData()
    })
  })
}

const enterDialog = () => {
  // 提交表单
  updateForm.value?.validate(async (valid: boolean) => {
    if (valid){
      switch(type.value){
        case 'add':
          {
            if (form.value.updateType === 2){
              let isUploadFile = await postUploadFile()
              if (!isUploadFile){
                return
              }
            }
            GameUpdateApi.createGameUpdate(form.value).then(
              (res:any) => {
                ElMessage({
                  type: 'success',
                  message: '添加成功!'
                })
                getTableData()
                closeDialog()
              }
            )
            break
          }
        case 'edit':
          {
            if (form.value.updateType === 2){
              let isUploadFile = await postUploadFile()
              if (!isUploadFile){
                return
              }
            }
            GameUpdateApi.updateGameUpdate(form.value).then(
              (res:any) => {
                ElMessage({
                  type: 'success',
                  message: '修改成功!'
                })
                getTableData()
                closeDialog()
              }
            )
            break
          }
      }
    }
  })
}

/** 
const fileList = ref<UploadFile[]>()

const beforeUpload = (file: File) => {
  console.log("测试一下")
  const isZip = file.name.endsWith('.zip')
  const isLt5M = file.size / 1024 / 1024 <= 5

  if (!isZip) {
    ElMessage.error('只能上传 .zip 格式的文件');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 10MB');
    return false;
  }
  return true
}
*/
const uploadfileRef = ref();
let formData = new FormData();
// 监听文件变化
const handleFileChange = (file: UploadFile, fileListChanged: UploadFile[]) => {
  if (!file.name.endsWith('.zip')){
    ElMessage.error('只能上传 .zip 格式的文件');
    uploadfileRef.value.clearFiles()
    return false;
  }
  if (file?.size == undefined || file?.size > 1024 * 1024 * 5){
    ElMessage.error('文件大小不能超过 5MB');
    uploadfileRef.value.clearFiles()
    return false;
  }
  formData.append('file', file.raw as Blob);
};

const postUploadFile = async() => {
  if (formData === null || formData === undefined){
    ElMessage.error('请选择热更文件');
    return false;
  }
  let isSucesse = false
  await UploadFileApi.uploadFile(formData).then((res:any) => {
    form.value.hotFile = res.data.filePath
    form.value.sourceHotFile = res.data.sourceFileName
    isSucesse = true
  })
  return isSucesse
};


</script>

<style lang="scss" scoped>
.upload-wrapper {
  width: 100%;
}
.upload-wrapper .el-upload {
  width: 100%; /* 上传框宽度100% */
  border: 1px dashed #d9d9d9; /* 边框样式 */
  text-align: center; /* 文本居中 */
  padding: 20px; /* 内边距 */
  background-color: #fafafa; /* 背景色 */
}
</style>