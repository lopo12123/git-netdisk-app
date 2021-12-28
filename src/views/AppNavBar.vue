<template>
    <div class="app-nav-bar">
        <custom-button btn-type="MIN" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="MAX" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="REFRESH" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="CLOSE" @btn-click="navBarBtn"></custom-button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CustomButton, { BtnType } from "@/components/AppNavBar/CustomButton.vue";
import {sendIpc} from '@/components/AppNavBar/ipc'

export default defineComponent({
    name: 'AppNavBar',
    components: {
        CustomButton: CustomButton
    },
    setup() {
        const navBarBtn = (type: BtnType) => {
            if(type === 'REFRESH') window.location.reload()
            else {
                sendIpc(type)
            }
        }

        return {
            navBarBtn
        }
    }
})
</script>

<style lang="scss" scoped>
.app-nav-bar {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .custom-button {
        margin-right: 10px;
    }
}
</style>