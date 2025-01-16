<template>
  <div>
    <div class="grid grid-cols-12 w-full gap-2">
      <!-- <div class="col-span-3 h-full">
        <div class="w-full h-full bg-white dark:bg-slate-900 px-4 py-8 rounded-lg shadow-lg box-border">
          <div class="user-card px-6 text-center bg-white dark:bg-slate-900 shrink-0">
            <div class="flex justify-center">
              <SelectImage
                v-model="userStore.userInfo.headerImg"
                file-type="image"
              />
            </div>
            <div class="py-6 text-center">
              <p
                v-if="!editFlag"
                class="text-3xl flex justify-center items-center gap-4"
              >
                {{ userStore.userinfo?.nickname }}
                <el-icon
                  class="cursor-pointer text-sm"
                  color="#66b1ff"
                  @click="openEdit"
                >
                  <edit />
                </el-icon>
              </p>
              <p
                v-if="editFlag"
                class="flex justify-center items-center gap-4"
              >
                <el-input v-model="nickName" />
                <el-icon
                  class="cursor-pointer"
                  color="#67c23a"
                  @click="enterEdit"
                >
                  <check />
                </el-icon>
                <el-icon
                  class="cursor-pointer"
                  color="#f23c3c"
                  @click="closeEdit"
                >
                  <close />
                </el-icon>
              </p>
              <p class="text-gray-500 mt-2 text-md">这个家伙很懒，什么都没有留下</p>
            </div>
            <div class="w-full h-full text-left">
              <ul class="inline-block h-full w-full">
                <li class="info-list">
                  <el-icon>
                    <user />
                  </el-icon>
                  {{ userStore.userinfo?.nickname }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> -->
      <div class="col-span-24 ">
        <div class="bg-white dark:bg-slate-900 h-full px-4 py-8 rounded-lg shadow-lg box-border">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              label="账号绑定"
              name="second"
            >
              <ul>
                <li class="borderd">
                  <p class="pb-2.5 text-xl text-gray-600">手机</p>
                  <p class="pb-2.5 text-lg text-gray-400">
                    已绑定手机:{{ userStore.userinfo?.phone }}
                    <a
                      href="javascript:void(0)"
                      class="float-right text-blue-400"
                      @click="changePhoneFlag = true"
                    >立即修改</a>
                  </p>
                </li>
                <li class="borderd pt-2.5">
                  <p class="pb-2.5 text-xl text-gray-600">邮箱</p>
                  <p class="pb-2.5 text-lg text-gray-400">
                    已绑定邮箱：{{ userStore.userinfo?.email }}
                    <a
                      href="javascript:void(0)"
                      class="float-right text-blue-400"
                      @click="changeEmailFlag = true"
                    >立即修改</a>
                  </p>
                </li>
                <!-- <li class="borderd pt-2.5">  
                  <p class="pb-2.5 text-xl text-gray-600">密保问题</p>
                  <p class="pb-2.5 text-lg text-gray-400">
                    未设置密保问题
                    <a
                      href="javascript:void(0)"
                      class="float-right text-blue-400"
                    >去设置</a>
                  </p>
                </li> -->
                <li class="borderd pt-2.5">
                  <p class="pb-2.5 text-xl text-gray-600">修改密码</p>
                  <p class="pb-2.5 text-lg text-gray-400">
                    修改个人密码
                    <a
                      href="javascript:void(0)"
                      class="float-right text-blue-400"
                      @click="showPassword = true"
                    >修改密码</a>
                  </p>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showPassword"
      title="修改密码"
      width="360px"
      @close="clearPassword"
    >
      <el-form
        ref="modifyPwdForm"
        :model="pwdModify"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          :minlength="6"
          label="原密码"
          prop="password"
        >
          <el-input
            v-model="pwdModify.password"
            show-password
          />
        </el-form-item>
        <el-form-item
          :minlength="6"
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="pwdModify.newPassword"
            show-password
          />
        </el-form-item>
        <el-form-item
          :minlength="6"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="pwdModify.confirmPassword"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button

            @click="showPassword = false"
          >取 消</el-button>
          <el-button

            type="primary"
            @click="savePassword"
          >确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="changePhoneFlag"
      title="绑定手机"
      width="600px"
    >
      <el-form :model="phoneForm">
        <el-form-item
          label="手机号"
          label-width="120px"
        >
          <el-input
            v-model="phoneForm.phone"
            placeholder="请输入手机号"
            autocomplete="off"
          />
        </el-form-item>
        <!-- <el-form-item
          label="验证码"
          label-width="120px"
        >
          <div class="flex w-full gap-4">
            <el-input
              v-model="phoneForm.code"
              class="flex-1"
              autocomplete="off"
              placeholder="请自行设计短信服务，此处为模拟随便写"
              style="width:300px"
            />
            <el-button
              type="primary"
              :disabled="time>0"
              @click="getCode"
            >{{ time>0?`(${time}s)后重新获取`:'获取验证码' }}</el-button>
          </div>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button

            @click="closeChangePhone"
          >取消</el-button>
          <el-button
            type="primary"

            @click="changePhone"
          >更改</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="changeEmailFlag"
      title="绑定邮箱"
      width="600px"
    >
      <el-form :model="emailForm">
        <el-form-item
          label="邮箱"
          label-width="120px"
        >
          <el-input
            v-model="emailForm.email"
            placeholder="请输入邮箱"
            autocomplete="off"
          />
        </el-form-item>
        <!-- <el-form-item
          label="验证码"
          label-width="120px"
        >
          <div class="flex w-full gap-4">
            <el-input
              v-model="emailForm.code"
              class="flex-1"
              placeholder="请自行设计邮件服务，此处为模拟随便写"
              autocomplete="off"
              style="width:300px"
            />
            <el-button
              type="primary"
              :disabled="emailTime>0"
              @click="getEmailCode"
            >{{ emailTime>0?`(${emailTime}s)后重新获取`:'获取验证码' }}</el-button>
          </div>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button

            @click="closeChangeEmail"
          >取消</el-button>
          <el-button
            type="primary"

            @click="changeEmail"
          >更改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import { useUserStore } from '@/store';
import UserAPI from '@/api/system/user';
import { fa } from 'element-plus/es/locale';

defineOptions({
  name: 'Person',
})

const activeName = ref('second')
const rules = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
    {
      validator: (rule:any, value:any, callback:Function) => {
        if (value !== pwdModify.value.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})


const userStore = useUserStore()
const modifyPwdForm = ref()
const showPassword = ref(false)
const pwdModify = ref({
    password: '',
    newPassword: '',
    confirmPassword: '',
  })
// const nickName = ref('')
// const editFlag = ref(false)
const changePhoneFlag = ref(false)
const changeEmailFlag = ref(false)

const phoneForm = reactive({
  phone: '',
  code: ''
})

const emailForm = reactive({
  email: '',
  code: ''
})


const time = ref(0)

const openEdit = () => {
  // editFlag.value = true
}

const enterEdit = () => {
  // editFlag.value = false
}

const closeEdit = () => {
  // editFlag.value = false
}

const handleClick = (tab:any, event:any) => {
  console.log(tab, event)
}

const clearPassword = () => {

  pwdModify.value = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  }
  modifyPwdForm.value.clearValidate()
}

const savePassword = async() => {
  modifyPwdForm.value.validate((valid:boolean) => {
    if (valid) {
      UserAPI.changePassword({
        password: pwdModify.value.password,
        newPassword: pwdModify.value.newPassword,
      }).then((res:any) => {
        if (res.code === 0) {
          ElMessage.success('修改密码成功！')
        }
        showPassword.value = false
      })
    } else {
      return false
    }
  })
}

const closeChangePhone = () => {
  changePhoneFlag.value = false
  phoneForm.phone = ''
  phoneForm.code = ''
}

const changePhone = async() => {
  UserAPI.setSelfInfo({ phone: phoneForm.phone }).then((res:any) => {
    ElMessage.success('修改成功')
    userStore.ResetUserInfo({ phone: phoneForm.phone })
    closeChangePhone()
  })
}

const closeChangeEmail = () => {
  changeEmailFlag.value = false
  emailForm.email = ''
  emailForm.code = ''
}

const changeEmail = async() => {
  UserAPI.setSelfInfo({ email: emailForm.email }).then((res:any) => {
    ElMessage.success('修改成功')
    userStore.ResetUserInfo({ email: emailForm.email })
    closeChangeEmail()
  })
}



</script>