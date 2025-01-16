import ProjectApi from "@/api/system/project";
import { useUserStore } from "./user";
import {type ProjectInfo} from "@/api/system/project";
import { store } from "@/store";


export const useProjectStore = defineStore('project', ()=>{
  const projectinfo = ref<ProjectInfo[]>()

  const projectId = ref<number>()

  const userStore = useUserStore()

  /**
   * 获取角色项目信息
   */

  function getProject(){
    return new Promise<void>((resolve, reject) => {
      ProjectApi.getAntuorityProject({authorityId:userStore.userinfo?.authority.authorityId}).then(
        res => {
          if (res.data.length === 0){
            reject("请先配置项目权限")
          }
          setProjecinfo(res.data);
          resolve();
        }
      ).catch(error => {
        reject(error)
      })
    })
  }

  const setProjecinfo = (data:any) => {
    projectinfo.value = data
  }

  return {
    projectinfo,
    getProject
  }

});

export function useProjectStoreHook() {
  return useProjectStore(store);
}