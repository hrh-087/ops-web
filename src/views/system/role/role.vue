<template>
      <warning-bar title="注：右上角头像下拉可切换角色" />
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button
          type="primary"
          icon="plus"
          @click="addAuthority(0)"
        >新增根角色</el-button>
      </div>
      <el-table
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="authorityId"
        style="width: 100%;margin-top:15px;"
      >
        <el-table-column
          label="角色ID"
          min-width="180"
          prop="authorityId"
        />
        <el-table-column
          align="left"
          label="角色名称"
          min-width="180"
          prop="authorityName"
        />
        <el-table-column
          align="left"
          label="操作"
          width="460"
        >
          <template #default="scope">
            <el-button
              icon="setting"

              type="primary"
              link
              @click="openDrawer(scope.row)"
            >设置权限</el-button>
            <el-button
              icon="plus"

              type="primary"
              link
              @click="addAuthority(scope.row.authorityId)"
            >新增子角色</el-button>
            <el-button
              icon="copy-document"

              type="primary"
              link
              @click="copyAuthorityFunc(scope.row)"
            >拷贝</el-button>
            <el-button
              icon="edit"
              type="primary"
              link
              @click="editAuthority(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"

              type="primary"
              link
              @click="deleteAuth(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增角色弹窗 -->
    <el-drawer
      v-model="authorityFormVisible"
      :show-close="false"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ authorityTitleForm }}</span>
          <div>
            <el-button @click="closeAuthorityForm">取 消</el-button>
            <el-button
              type="primary"
              @click="submitAuthorityForm"
            >确 定</el-button>
          </div>
        </div>
      </template>
      <el-form
        ref="authorityForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="父级角色"
          prop="parentId"
        >
          <el-cascader
            v-model="form.parentId"
            style="width:100%"
            :disabled="dialogType==='add'"
            :options="AuthorityOption"
            :props="{ checkStrictly: true,label:'authorityName',value:'authorityId',disabled:'disabled',emitPath:false}"
            :show-all-levels="false"
            filterable
          />
        </el-form-item>
        <el-form-item
          label="角色ID"
          prop="authorityId"
        >
          <el-input
            v-model="form.authorityId"
            :disabled="dialogType==='edit'"
            autocomplete="off"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item
          label="角色姓名"
          prop="authorityName"
        >
          <el-input
            v-model="form.authorityName"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer
      v-if="drawer"
      v-model="drawer"
      :with-header="false"
      size="40%"
      title="角色配置"
    >
      <el-tabs
        :before-leave="autoEnter"
        type="border-card"
      >
        <el-tab-pane label="角色菜单">
          <Menus
            ref="menus"
            :row="activeRow"
            @changeRow="changeRow"
            @closeDrawer="()=>drawer=false"
          />
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <Apis
            ref="apis"
            :row="activeRow"
            @changeRow="changeRow"
            @closeDrawer="()=>drawer=false"
          />
        </el-tab-pane>

        <el-tab-pane label="角色项目">
          <Projects
            ref="projects"
            :row="activeRow"
            @changeRow="changeRow"
            @closeDrawer="()=>drawer=false"
          />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

</template>

<script setup lang="ts">

import AuthorityApi from '@/api/system/role';
import Menus from './components/menus.vue';
import Apis from './components/apis.vue';
import Projects from './components/projects.vue';

import {type TabPaneName} from 'element-plus'


defineOptions({
  name: 'Authority'
})


const drawer = ref(false)
const activeRow = ref({})

const AuthorityOption = ref([
  {
    authorityId: 0,
    authorityName: '根角色'
  }
])

const form = ref({
  authorityId: 0,
  authorityName: '',
  parentId: 0
})

// 自定义认证方式
const mustUint = (rule:any, value:any, callback:Function) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入正整数'))
  }
  return callback()
}

const rules = ref({
  authorityId: [
    { required: true, message: '请输入角色ID', trigger: 'blur' },
    { validator: mustUint, trigger: 'blur', message: '必须为正整数' }
  ],
  authorityName: [
    { required: true, message: '请输入角色名', trigger: 'blur' }
  ],
  parentId: [
    { required: true, message: '请选择父角色', trigger: 'blur' },
  ]
})

const copyForm = ref({
  dataAuthorityId : [],
  authorityId: 0
})

// 请求类型
const dialogType = ref('')
const authorityTitleForm = ref('新增角色') // 表单title
const authorityFormVisible = ref(false)// 控制抽屉显示
const apiDialogFlag = ref(false)

// 初始化表单
const authorityForm = ref()

const initForm = () => {
  if (authorityForm.value) {
    authorityForm.value.resetFields()
  }
  form.value = {
    authorityId: 0,
    authorityName: '',
    parentId: 0
  }
}

// 关闭窗口
const closeAuthorityForm = () => {
  initForm()
  authorityFormVisible.value = false
  apiDialogFlag.value = false
}

const setOptions = ()=> {
  AuthorityOption.value = [
    {
      authorityId: 0,
      authorityName: '根角色'
    }
  ]
  setAuthorityOptions(tableData.value, AuthorityOption.value, false)
}

// 设置角色参数
const setAuthorityOptions = (AuthorityData:Array<any>, optionsData:Array<any>, disabled:boolean) => {
  AuthorityData?.forEach(item => {
    if (item.children && item.children.length) {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        disabled: disabled || item.authorityId === form.value.authorityId,
        children: []
      }
      setAuthorityOptions(
        item.children,
        option.children,
        disabled || item.authorityId === form.value.authorityId
      )
      optionsData.push(option)
    } else {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        disabled: disabled || item.authorityId === form.value.authorityId
      }
      optionsData.push(option)
    }
  })
}

// 确定弹窗

const submitAuthorityForm = () => {
  authorityForm.value.validate(async (valid:Boolean) => {
    if (valid) {
      form.value.authorityId = Number(form.value.authorityId)
      switch (dialogType.value) {
        case 'add':
          {
            const res = await AuthorityApi.createAuthority(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!'
              })
              getAuthorityList()
              closeAuthorityForm()
            }
          }
          break
        case 'edit':
          {
            const res = await AuthorityApi.updateAuthority(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '编辑成功!'
              })
              getAuthorityList()
              closeAuthorityForm()
            }
          }
          break
        case 'copy': {
          const data = {
            authority: {
              authorityId: 0,
              authorityName: '',
              datauthorityId: [],
              parentId: 0
            },
            oldAuthorityId: 0
          }
          data.authority.authorityId = form.value.authorityId
          data.authority.authorityName = form.value.authorityName
          data.authority.parentId = form.value.parentId
          data.authority.datauthorityId = copyForm.value.dataAuthorityId
          data.oldAuthorityId = copyForm.value.authorityId
          const res = await AuthorityApi.copyAuthority(data)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '复制成功！'
            })
            getAuthorityList()
          }
        }
      }

      initForm()
      authorityFormVisible.value = false
    }
  })
}

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchInfo = ref({})
const tableData = ref([])


// 打开抽屉
const openDrawer = (row:any) => {
  drawer.value = true
  activeRow.value = row
}

// 获取角色列表
const getAuthorityList = async () => {
  const table = await AuthorityApi.getRoleList({page: page.value, pageSize: pageSize.value, ...searchInfo.value})
  if (table.code !== 0 ){
    tableData.value = []
    total.value = 0
  } else {
    tableData.value = table.data.rows
    total.value = table.data.total
  }
  
}

getAuthorityList()

// 新增角色
const addAuthority = async (parentId:number) => {
  initForm()
  authorityTitleForm.value = '新增角色'
  dialogType.value = 'add'
  form.value.parentId = parentId
  setOptions()
  authorityFormVisible.value = true
    
}

// 编辑角色
const editAuthority = (row:any) => {
  initForm()
  authorityTitleForm.value = '编辑角色'
  dialogType.value = 'edit'
  form.value = row
  setOptions()
  authorityFormVisible.value = true
}

// 删除角色
const deleteAuth = (row:any) => {
  ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async ()=>{
    const res = await AuthorityApi.deleteAuthority({ authorityId: row.authorityId })
      if (res) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getAuthorityList()
      }
  }).catch(()=>{
    ElMessage({
        type: 'info',
        message: '已取消删除'
      })
  })
}

const copyAuthorityFunc = (row:any) => {
  setOptions()
  authorityTitleForm.value = '拷贝角色'
  dialogType.value = 'copy'
  form.value = {...row}
  copyForm.value = {...row}
  authorityFormVisible.value = true
}

const menus = ref()
const apis = ref()
const projects = ref()
const autoEnter = (activeName:TabPaneName, oldActiveName:TabPaneName) => {
  const paneArr = [menus, apis, projects]
  if (oldActiveName) {
    const enterFunc = paneArr[Number(oldActiveName)].value
    if (enterFunc.needConfirm) {
      enterFunc.enterAndNext()
      enterFunc.needConfirm = false
    }
  }
}

const changeRow = (key:string, value:any) => {
  activeRow.value = {...activeRow.value,...{key:value}}
}


</script>