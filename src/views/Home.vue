<template>
    <div class="home">
        home
        <button @click="testTree">Tree ipc</button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {sendIpcLOG} from "@/scripts/Ipc";

export default defineComponent({
    name: 'Home',
    setup() {
        const testTree = () => {
            console.log(123)
            sendIpcLOG({
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
