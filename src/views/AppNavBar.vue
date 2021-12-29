<template>
    <div class="app-nav-bar">
        <el-dropdown size="small" @command="handleCommand">
            <custom-button btn-type="MORE" @btn-click="navBarBtn" style="margin-left: 10px"></custom-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="HOME">
                        <el-icon size="14"><house/></el-icon>
                        <span class="txt">Home</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="SETTING">
                        <el-icon size="14"><setting/></el-icon>
                        <span class="txt">Setting</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="GITHUB">
                        <el-icon size="14"><Link/></el-icon>
                        <span class="txt">GitHub</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <div class="placeholder"></div>

        <custom-button btn-type="MIN" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="MAX" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="REFRESH" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="CLOSE" @btn-click="navBarBtn" style="margin-right: 10px"></custom-button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon} from "element-plus";
import {Setting, House, Link} from '@element-plus/icons'
import CustomButton, { BtnType } from "@/components/AppNavBar/CustomButton.vue";
import {sendIpcNav} from "@/scripts/Ipc";
import {useRouter} from "vue-router";

type CmdType = 'HOME' | 'SETTING' | 'GITHUB'

export default defineComponent({
    name: 'AppNavBar',
    components: {
        ElDropdown, ElDropdownMenu, ElDropdownItem,
        CustomButton,
        ElIcon, Setting, House, Link
    },
    setup() {
        const router = useRouter()

        // 导航栏按钮
        const navBarBtn = (type: BtnType) => {
            if(type === 'MIN' || type === 'MAX' || type === 'CLOSE') {
                sendIpcNav(type)
            }
            else if(type === 'REFRESH') window.location.reload()
            else if(type === 'MORE') {
                router.push({name: 'Setting'})
            }
        }

        // 下拉菜单按钮
        const handleCommand = (type: CmdType) => {
            switch(type) {
                case "HOME":
                    router.push({name: 'Home'})
                    break
                case "SETTING":
                    router.push({name: 'Setting'})
                    break
                case "GITHUB":
                    sendIpcNav('GITHUB')
                    break
            }
        }

        return {
            navBarBtn,
            handleCommand
        }
    }
})
</script>

<style lang="scss" scoped>
$btn-number: 5;

.app-nav-bar {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .placeholder {
        width: calc(100% - #{$btn-number} * 30px - #{$btn-number} * 10px - 20px);
        height: 30px;
    }
}
</style>