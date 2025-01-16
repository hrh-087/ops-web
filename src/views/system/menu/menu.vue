<template>
  <div>

    <el-button
        type="primary"
        icon="plus"
        @click="addMenu(0)"
      >新增根菜单</el-button>
 
    <div>
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
          label="展示名称"
          min-width="120"
          prop="authorityName"
        >
          <template #default="scope">
            <span>{{ scope.row.meta.title }}</span>
          </template>
      </el-table-column>

      <el-table-column
          align="left"
          label="路由Name"
          show-overflow-tooltip
          min-width="160"
          prop="name"
        />

      <el-table-column
        align="left"
        label="路由Path"
        show-overflow-tooltip
        min-width="160"
        prop="path"
      />

      <el-table-column
        align="left"
        label="是否隐藏"
        min-width="100"
        prop="hidden"
      >
        <template #default="scope">
          <span>{{ scope.row.hidden ? "隐藏" : "显示" }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="left"
          label="父节点"
          min-width="90"
          prop="parentId"
        />

      <el-table-column
        align="left"
        label="排序"
        min-width="70"
        prop="sort"
      />

      <!-- <el-table-column
        align="left"
        label="文件路径"
        min-width="360"
        prop="component"
      /> -->

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
              icon="plus"
              @click="addMenu(scope.row.ID)"
            >添加子菜单</el-button>
            <el-button
              type="primary"
              link
              icon="edit"
              @click="editMenu(scope.row.ID)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteMenu(scope.row.ID)"
            >删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </div>
    <el-drawer 
      v-model="dialogFormVisible"
      :before-close="handleClose"
      size="60%"
      :show-close="false"
    >
    <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ dialogTitle }}</span>
          <div>
            <el-button @click="closeDialog">取 消</el-button>
            <el-button
              type="primary"
              @click="enterDialog"
            >确 定</el-button>
          </div>
      </div>
    </template>

    <warning-bar title="新增菜单，需要在角色管理内配置权限才可使用" />
    <el-form
      v-if="dialogFormVisible"
      ref="menuForm"
      :inline="true"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="85px"
    >
    <el-form-item
          label="路由Name"
          prop="path"
          style="width: 30%"
        >
      <el-input
        v-model="form.name"
        autocomplete="off"
        placeholder="唯一英文字符串"
        @change="changeName"
      />
    </el-form-item>

    <el-form-item
      prop="path"
      style="width: 30%"
    >
      <template #label>
        <span style="display: inline-flex; align-items: center">
          <span>路由Path</span>
          <el-checkbox
            v-model="checkFlag"
            style="margin-left: 12px; height: auto"
          >添加参数</el-checkbox>
        </span>
      </template>

      <el-input
        v-model="form.path"
        :disabled="!checkFlag"
        autocomplete="off"
        placeholder="建议只在后方拼接参数"
      />
    </el-form-item>

    <el-form-item
          label="是否隐藏"
          style="width: 30%"
    >
      <el-select
        v-model="form.hidden"
        placeholder="是否在列表隐藏"
      >
        <el-option
          :value="false"
          label="否"
        />
        <el-option
          :value="true"
          label="是"
        />
      </el-select>
    </el-form-item>

    <el-form-item
          label="父节点ID"
          style="width: 30%"
    >
      <el-cascader
        v-model="form.parentId"
        style="width: 100%"
        :disabled="!isEdit"
        :options="menuOption"
        :props="{
          checkStrictly: true,
          label: 'title',
          value: 'ID',
          disabled: 'disabled',
          emitPath: false,
        }"
        :show-all-levels="false"
        filterable
      />
    </el-form-item>
    
    <el-form-item
      label="文件路径"
      prop="component"
      style="width: 60%"
    >
      <el-input
        v-model="form.component"
        autocomplete="off"
        placeholder="文件所在路径"
        
      />
      <!-- <span style="font-size: 12px; margin-right: 12px">如果菜单包含子菜单，请创建router-view二级路由页面或者</span><el-button
        style="margin-top: 4px"
        @click="form.component = 'view/routerHolder.vue'"
      >点我设置</el-button> -->
    </el-form-item>

    <el-form-item
      label="展示名称"
      prop="meta.title"
      style="width: 30%"
    >
      <el-input
        v-model="form.meta.title"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      label="图标"
      prop="meta.icon"
      style="width: 30%"
    >
      <el-input
        v-model="form.meta.icon"
        placeholder="请输入图标名称"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      label="排序标记"
      prop="sort"
      style="width: 30%"
    >
      <el-input
        v-model.number="form.sort"
        placeholder="请输入排序标记, 如1,2,3"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      prop="meta.activeName"
      style="width: 30%"
    >
      <template #label>
        <div>
          <span> 高亮菜单 </span>
          <el-tooltip
            content="注：当到达此路由时候，指定左侧菜单指定name会处于活跃状态（亮起），可为空，为空则为本路由Name。"
            placement="top"
            effect="light"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-input
        v-model="form.meta.activeName"
        :placeholder="form.name"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item
      label="KeepAlive"
      prop="meta.keepAlive"
      style="width: 30%"
    >
      <el-select
        v-model="form.meta.keepAlive"
        style="width: 100%"
        placeholder="是否keepAlive缓存页面"
      >
        <el-option
          :value="false"
          label="否"
        />
        <el-option
          :value="true"
          label="是"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="CloseTab"
      prop="meta.closeTab"
      style="width: 30%"
    >
      <el-select
        v-model="form.meta.closeTab"
        style="width: 100%"
        placeholder="是否自动关闭tab"
      >
        <el-option
          :value="false"
          label="否"
        />
        <el-option
          :value="true"
          label="是"
        />
      </el-select>
    </el-form-item>

    <el-form-item style="width: 30%">
      <template #label>
        <div>
          <span> 是否为基础页面 </span>
          <el-tooltip
            content="此项选择为是，则不会展示左侧菜单以及顶部信息。"
            placement="top"
            effect="light"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-select
        v-model="form.meta.defaultMenu"
        style="width: 100%"
        placeholder="是否为基础页面"
      >
        <el-option
          :value="false"
          label="否"
        />
        <el-option
          :value="true"
          label="是"
        />
      </el-select>
    </el-form-item>
    </el-form>
    <div>
        <div class="flex items-center gap-2">
          <el-button
            type="primary"
            icon="edit"
            @click="addParameter()"
          >新增菜单参数</el-button>
        </div>
        <el-table
          :data="form.parameters"
          style="width: 100%; margin-top: 12px"
        >
          <el-table-column
            align="left"
            prop="type"
            label="参数类型"
            width="180"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.type"
                placeholder="请选择"
              >
                <el-option
                  key="query"
                  value="query"
                  label="query"
                />
                <el-option
                  key="params"
                  value="params"
                  label="params"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="key"
            label="参数key"
            width="180"
          >
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.key" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="value"
            label="参数值"
          >
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.value" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #default="scope">
              <div>
                <el-button
                  type="danger"
                  icon="delete"
                  @click="deleteParameter(form.parameters, scope.$index)"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex items-center gap-2 mt-3">
          <el-button
            type="primary"
            icon="edit"
            @click="addBtn()"
          >新增可控按钮
          </el-button>
        </div>

        <el-table
          :data="form.menuBtn"
          style="width: 100%; margin-top: 12px"
        >
          <el-table-column
            align="left"
            prop="name"
            label="按钮名称"
            width="180"
          >
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.name" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="name"
            label="备注"
            width="180"
          >
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.desc" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left">
            <template #default="scope">
              <el-button
                  type="danger"
                  icon="delete"
                  @click="deleteBtn(form.menuBtn, scope.$index)"
                >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


  </el-drawer>

  </div>
</template>

<script setup lang="ts">
import MenuAPI from "@/api/system/menu";
// import { RequestList, ResponseList } from "@/api/types/common";
// import { MenuFrom } from "@/api/types/menu";

defineOptions({
  name: 'Menus',
})

const rules = reactive({
  path: [{ required: true, message: '请输入菜单name', trigger: 'blur' }],
  component: [{ required: true, message: '请输入文件路径', trigger: 'blur' }],
  'meta.title': [
    { required: true, message: '请输入菜单展示名称', trigger: 'blur' },
  ]
})

const page = ref(1)
const pageSize = ref(10)

const total = ref(0)
const tableData = ref<Array<any>>()
const searchInfo = ref("")

const dialogFormVisible = ref(false)

const form = ref<any>({
  ID: 0,
  path: '',
  name: '',
  hidden: false,
  parentId: 0,
  component: '',
  sort: 0,
  meta: {
    activeName: '',
    title: '',
    icon: '',
    defaultMenu: false,
    closeTab: false,
    keepAlive: false,
  },
  parameters: [],
  menuBtn: [],
})

const menuOption = ref([
  {
    ID: 0,
    title: '根菜单',
  },
])

const setOptions = () => {
  menuOption.value = [
    {
      ID: 0,
      title: '根目录',
    },
  ]
  setMenuOptions(tableData.value, menuOption.value, false)
}

const setMenuOptions = (menuData:any, optionsData:Array<any>, disabled: boolean) => {
  menuData &&
    menuData.forEach((item:any) => {
      if (item.children && item.children.length) {
        const option = {
          title: item.meta.title,
          ID: item.ID,
          disabled: disabled || item.ID === form.value.ID,
          children: [],
        }
        setMenuOptions(
          item.children,
          option.children,
          disabled || item.ID === form.value.ID
        )
        optionsData.push(option)
      } else {
        const option = {
          title: item.meta.title,
          ID: item.ID,
          disabled: disabled || item.ID === form.value.ID,
        }
        optionsData.push(option)
      }
    })
}

const handleClose = (done:any) => {
  initForm()
  done()
}

// 初始化弹窗内表格方法
const menuForm = ref()
const checkFlag = ref(false)
const initForm = () => {
  checkFlag.value = false
  menuForm.value.resetFields()

}

const changeName = () => {
  form.value.path = form.value.name
}

const fmtComponent = () =>{

}

// 关闭弹窗
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

// 添加menu
const enterDialog = async() => {
  menuForm.value.validate(async(valid:boolean) => {
    if (valid) {
      let res
      if (isEdit.value) {
        res = await MenuAPI.updateBaseMenu(form.value)
      } else {
        res = await MenuAPI.addBaseMenu(form.value)
      }

      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: isEdit.value ? '编辑成功' : '添加成功!',
        })
        getTableData()
      }
      initForm()
      dialogFormVisible.value = false
    }
  })
}

const getTableData = async () => {
  MenuAPI.getMenuList({
    page: page.value,
    pageSize: pageSize.value
  }).then(res => {
    tableData.value = res.data.rows
    total.value = res.data.total
  }).catch(err => {
    console.log("err:", err)
  })
}

// 添加菜单方法，id为 0则为添加根菜单
const isEdit = ref(false)
const dialogTitle = ref('新增菜单')
const addMenu = (id: number) => {
  dialogFormVisible.value = true
  dialogTitle.value = '新增菜单'
  isEdit.value = false
  form.value.parentId = id
  setOptions()
}

const editMenu = async (id: number) => {
  dialogFormVisible.value = true
  const res = await MenuAPI.getBaseMenuById({ id })
  dialogTitle.value = '编辑菜单'
  isEdit.value = true
  form.value = res.data
  setOptions()
}

const deleteMenu = (id: number) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该菜单, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async ()=>{
    const res = await MenuAPI.deleteBaseMenu({ id })
    if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        if (tableData.value?.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
  })
}

getTableData()

// 添加路由参数
const addParameter = () => {
  if (!form.value.parameters) {
    form.value.parameters = []
  }
  form.value.parameters.push({
    type: 'query',
    key: '',
    value: '',
  })
}

const deleteParameter = (parameters:Array<any>, index:number) => {
  parameters.splice(index, 1)
}


// 添加按钮
const addBtn = () => {
  if (!form.value.menu) {
    form.value.menuBtn = []
  }
  form.value.menuBtn.push({
    type: 'query',
    key: '',
    value: '',
  })
}

// 删除按钮
const deleteBtn = (btns: Array<any>, index:number) => {
  btns.splice(index, 1)
}

</script>