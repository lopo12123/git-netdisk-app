<template>
    <div id="app-main-window">
        <div id="app-main-window-nav-bar">
            <app-nav-bar></app-nav-bar>
        </div>
        <div id="app-main-window-view-port">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount} from "vue";
import AppNavBar from "@/views/AppNavBar.vue";
import {sendIpcF12} from "@/scripts/Ipc";

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
