import {createStore} from 'vuex'

export default createStore({
    modules: {
        // region [module:diskModule] 获取磁盘信息相关
        diskModule: {
            namespaced: true,
            state: {
                diskNameList: [] as string[]
            },
            mutations: {
                updateNameList(state: any, newList: string[]) {
                    state.diskNameList = newList
                }
            }
        }
        // endregion
    }
})
