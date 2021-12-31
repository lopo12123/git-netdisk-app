<template>
    <div id="app-main-window">
        <div id="app-main-window-nav-bar">
            <app-nav-bar></app-nav-bar>
        </div>
        <div id="app-main-window-view-port">
            <router-view v-loading="ifLoading" element-loading-text="scanning disk names"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, ref} from "vue";
import AppNavBar from "@/views/AppNavBar.vue";
import {v4 as uuid} from "uuid";
import {sendIpcDisk, sendIpcF12} from "@/scripts/Ipc";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'App',
    components: {
        AppNavBar
    },
    setup() {
        // region 注册F12快捷键监听及其注销(唤起控制台)
        const f12 = (e: KeyboardEvent) => {
            if(e.key === 'F12') sendIpcF12()
        }
        window.addEventListener('keyup', f12)
        onBeforeUnmount(() => {
            window.removeEventListener('keyup', f12)
        })
        // endregion

        // region 获取盘符
        const ifLoading = ref(false)
        ifLoading.value = true
        sendIpcDisk(uuid())
            .then((diskArr) => {
                ifLoading.value = false
                if(diskArr !== null) {
                    ElMessage({
                        type: 'info',
                        message: `disks on this computer: ["${diskArr.join('", "')}"]`
                    })
                }
                else {
                    // 未获取到盘符
                    ElMessage({
                        type: 'warning',
                        message: 'can`t get disk list on this computer'
                    })
                }
            })
            .catch((err) => {
                ifLoading.value = false
                ElMessage({
                    type: 'error',
                    message: err === 'TIMEOUT'
                        ? 'timeout parsing file tree'
                        : 'some problem occurs when getting disk list on this machine'
                })
            })
        // endregion

        return {
            ifLoading
        }
    }
})
</script>

<style lang="scss" scoped>
#app-main-window {
    position: relative;
    width: 100%;
    height: 100%;

    #app-main-window-nav-bar {
        position: relative;
        width: 100%;
        height: 59px;
        border-bottom: solid 1px #dde4eb;
        -webkit-app-region: drag;
    }

    #app-main-window-view-port {
        position: relative;
        width: 100%;
        height: calc(100% - 60px);
        -webkit-app-region: no-drag;
    }
}
</style>
