<template>
  <div>
    <div>
      <el-button
        type="primary"
        icon="plus"
        @click="addSshKey()"
      >新增秘钥</el-button>
    </div>
    <el-table
      :data="tableData"
      row-key="ID"
      style="width: 100%;margin-top:15px;"
    >
        <el-table-column
          align="left"
          label="登录用户"
          min-width="120"
          prop="user"
        />
        <el-table-column
          align="left"
          label="是否使用密码登录"
          min-width="120"
          prop="usePass"
        >
          <template #default="scope">
            <el-switch v-model="scope.row.usePass" disabled />
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
          fixed="right"
          label="操作"
          width="300"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editSshKey(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteSshKey(scope.row)"
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
        ref="sshKeyForm"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item
          label="登录用户"
          prop="user"
        >
          <el-input
            v-model="form.user"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="登录密码"
          prop="password"
        >
          <el-input
            v-model="form.password"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="公钥"
          prop="publicKey"
        >
          <el-input
            v-model="form.publicKey"
            type="textarea"
            :rows=5
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="私钥"
          prop="privateKey"
        >
          <el-input
            v-model="form.privateKey"
            type="textarea"
            :rows=10
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="私钥密码"
          prop="privateKeyPassphrase"
        >
          <el-input
            v-model="form.privateKeyPassphrase"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="是否使用密码登录"
          prop="usePass"
        >
          <el-switch v-model="form.usePass" />
        </el-form-item>
      </el-form>
    </el-drawer>

    </div>
  </div>
</template>

<script setup lang="ts">

import SshKeyApi from '@/api/system/sshkey';
import { fa } from 'element-plus/es/locale';

defineOptions({
  name: 'ssh-key'
})

const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchInfo = ref({})

const rules = ref({
  user: [{ required: true, message: '请输入登录用户名', trigger: 'blur' }]
})

const getTableData = () =>{
  SshKeyApi.getSshKeyList({
    page: page.value,
    pageSize: pageSize.value,
    searchInfo: searchInfo.value
  }).then((res:any) => {
    tableData.value = res.data.rows
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  })
}

getTableData()

const sshKeyForm = ref()
const form = ref({
  user: "",
  password: "",
  publicKey: "",
  privateKey: "",
  privateKeyPassphrase: "",
  usePass: false
})
const initForm = () => {
  if (sshKeyForm.value){
    sshKeyForm.value.resetFields()
  }
  form.value = {
    user: "",
    password: "",
    publicKey: "",
    privateKey: "",
    privateKeyPassphrase: "",
    usePass:false
  }
}

const dialogTitle = ref('')
const type = ref('')
const dialogFormVisible = ref(false)

const openDialog = (key: string) => {
  switch (key) {
    case 'add':
      dialogTitle.value = "新增秘钥"
      break
    case 'edit':
       dialogTitle.value = "编辑秘钥"
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

const addSshKey = () => {
  openDialog('add')
}

const editSshKey = (row: any) => {
  SshKeyApi.getSshKeyById(row.ID).then((res:any) => {
    form.value = res.data
    openDialog('edit')
  })
}

const deleteSshKey = (row: any) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    SshKeyApi.deleteSshKey({
      id: row.ID
    }).then((res:any) => {
      ElMessage({
        type: 'success',
        message: "删除成功!",
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

const enterDialog = () => {
  // 提交表单
  sshKeyForm.value?.validate((valid: boolean) => {
    if (valid){
      switch(type.value){
        case 'add':
          {
            SshKeyApi.createSshKey(form.value).then(
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
            SshKeyApi.updateSshKey(form.value).then(
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

</script>