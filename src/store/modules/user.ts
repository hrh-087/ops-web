// import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo, LoginData } from "@/api/system/user";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const userinfo = ref<UserInfo>();

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      UserAPI.login(loginData)
        .then((data) => {
          const { token, user } = data.data;
          // localStorage.setItem(TOKEN_KEY, tokenType + " " + accessToken); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          // 设置token跟用户信息
          settoken(token as string);
          // userinfo.value = user as UserInfo;
          setUserinfo(user as UserInfo)
          
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  const ResetUserInfo = (value:object) => {
    if (userinfo.value) {
      Object.assign(userinfo.value, value);
    } else {
      userinfo.value = { ...value } as UserInfo;
    }
  }
  const setUserinfo = (data: UserInfo) => {
    userinfo.value = data;
  };

  const settoken = (data: string) => {
    localStorage.setItem(TOKEN_KEY, data);
  };

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((res) => {
          // console.log("data:",res)
          if (res.code !== 0) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!res.data.authority || res.data.authorities.length < 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          setUserinfo(res.data);
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      UserAPI.logout()
        .then(() => {
          localStorage.setItem(TOKEN_KEY, "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, "");
      resetRouter();
      resolve();
    });
  }

  return {
    userinfo,
    login,
    getUserInfo,
    logout,
    resetToken,
    ResetUserInfo,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
