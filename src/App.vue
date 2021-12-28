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
import {defineComponent} from "vue";
import AppNavBar from "@/views/AppNavBar.vue";

export default defineComponent({
    name: 'App',
    components: {
        AppNavBar
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
