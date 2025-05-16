<template>
  <div class="flex">
    <div class="nav-project-item" style="">
      <span>当前项目：</span>
      <el-select
        v-model="projectValue"
        filterable
        placeholder="请选择项目"
        style="width: 160px"
      >
        <el-option
          v-for="item in project.projectinfo"
          :key="item.ID"
          :label="item.projectName"
          :value="item.ID"
        />
      </el-select>
    </div>

    <template v-if="!isMobile">
      <!--全屏 -->
      <div class="nav-action-item" @click="toggle">
        <svg-icon
          :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
        />
      </div>

      <!-- 布局大小 -->
      <!-- <el-tooltip
        :content="$t('sizeSelect.tooltip')"
        effect="dark"
        placement="bottom"
      >
        <size-select class="nav-action-item" />
      </el-tooltip> -->

      <!-- 语言选择 -->
      <!-- <lang-select class="nav-action-item" /> -->

      <!-- 消息通知 -->
      <!-- <el-dropdown class="message nav-action-item" trigger="click">
        <el-badge is-dot>
          <div class="flex-center h100% p10px">
            <i-ep-bell />
          </div>
        </el-badge>
        <template #dropdown>
          <div class="px-5 py-2">
            <el-tabs v-model="activeTab">
              <el-tab-pane
                v-for="(label, key) in MessageTypeLabels"
                :label="label"
                :name="key"
                :key="key"
              >
                <div
                  class="w-[380px] py-2"
                  v-for="message in getFilteredMessages(key)"
                  :key="message.id"
                >
                  <el-link type="primary">
                    <el-text class="w-350px" size="default" truncated>
                      {{ message.title }}
                    </el-text>
                  </el-link>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-divider />
            <div class="flex-x-between">
              <el-link type="primary" :underline="false">
                <span class="text-xs">查看更多</span>
                <el-icon class="text-xs"><ArrowRight /></el-icon>
              </el-link>
              <el-link type="primary" :underline="false">
                <span class="text-xs">全部已读</span>
              </el-link>
            </div>
          </div>
        </template>
      </el-dropdown> -->
    </template>

    <!-- 用户头像 -->
    <el-dropdown class="nav-action-item" trigger="click">
      <div class="flex-center h100% p10px">
        <img
          src="@/assets/images/123.gif"
          class="rounded-full mr-10px w24px h24px"
        />
        <span>{{ userStore.userinfo?.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-item>
          <span>
            当前角色：{{ userStore.userinfo?.authority.authorityName }}
          </span>
        </el-dropdown-item>
        <template v-if="userStore.userinfo?.authorities">
          <el-dropdown-item
            v-for="item in userStore.userinfo.authorities.filter(
              (i) => i.authorityId !== userStore.userinfo?.authority.authorityId
            )"
            :key="item.authorityId"
            @click="changeUserAuth(item.authorityId)"
          >
            <span>切换为：{{ item.authorityName }}</span>
          </el-dropdown-item>
        </template>
        <el-dropdown-menu>
          <el-dropdown-item icon="avatar" @click="toPerson">
            {{ $t("navbar.userInfo") }}
          </el-dropdown-item>
          <el-dropdown-item divided icon="reading-lamp" @click="logout">
            {{ $t("navbar.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="nav-action-item" @click="settingStore.settingsVisible = true">
        <svg-icon icon-class="setting" />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  useAppStore,
  useTagsViewStore,
  useUserStore,
  useSettingsStore,
  useProjectStore,
} from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import UserAPI from "@/api/system/user";
import { on } from "events";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingStore = useSettingsStore();

const route = useRoute();
const router = useRouter();
const project = useProjectStore();

const projectValue = ref();

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);

const { isFullscreen, toggle } = useFullscreen();

// const activeTab = ref(MessageTypeEnum.MESSAGE);

/* 切换角色 */
const changeUserAuth = (id: any) => {
  UserAPI.setUserAuthority({ authorityId: id }).then(() => {
    // window.sessionStorage.setItem("needCloseAll", "true");
    // window.sessionStorage.setItem("needToHome", "true");
    window.location.reload();
  });
};

/* 个人中心 */
const toPerson = () => {
  router.push({ name: "person" });
};

/* 注销 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}

const setProject = () => {
  if (project.projectinfo && project.projectinfo.length > 0) {
    if (userStore.userinfo?.projectId === 0) {
      UserAPI.setUserProject({ projectId: project.projectinfo[0].ID }).then(
        () => {
          window.location.reload();
        }
      );
      // projectValue.value = project.projectinfo[0].ID
    } else {
      projectValue.value = userStore.userinfo?.projectId;
    }
  } else {
    ElMessage.warning("请联系管理员添加项目权限");
  }
};
setProject();

// 监听项目id, 切换的时候设置对应用户的项目id
watch(projectValue, (newValue, oldValue) => {
  UserAPI.setUserProject({ projectId: newValue })
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, "提示", {
        confirmButtonText: "确定",
        type: "warning",
        lockScroll: false,
      }).then(() => {
        window.location.reload();
      });
    });
});
</script>
<style lang="scss" scoped>
.nav-action-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.nav-project-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  // &:hover {
  //   background: rgb(0 0 0 / 10%);
  // }
}

:deep(.message .el-badge__content.is-fixed.is-dot) {
  top: 5px;
  right: 10px;
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

.dark .nav-action-item:hover {
  background: rgb(255 255 255 / 20%);
}

.layout-top .nav-action-item,
.layout-mix .nav-action-item {
  color: #fff;
}
</style>
