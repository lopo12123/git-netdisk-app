import {createStore} from 'vuex'
import {DiskInfo} from "@/scripts/interface";

export default createStore({
    modules: {
        // region [module:diskModule] 获取磁盘信息相关
        diskModule: {
            namespaced: true,
            state: {
                diskNameList: [] as DiskInfo[]
            },
            mutations: {
                updateNameList(state: any, newList: DiskInfo[]) {
                    state.diskNameList = newList
                }
            }
        }
        // endregion
    }
})
