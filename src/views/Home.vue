<template>
    <div id="home">
        Select A Folder To Get Start
<!--        <button @click="testTree">Tree ipc</button>-->
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {sendIpcLog} from "@/scripts/Ipc";

export default defineComponent({
    name: 'Home',
    setup() {
        const testTree = () => {
            console.log(123)
            sendIpcLog({
                type: 'WARNING',
                e: '123123123'
            })
        }

        return {
            testTree
        }
    }
})
</script>

<style lang="scss" scoped>
#home {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
