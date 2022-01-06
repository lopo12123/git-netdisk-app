<template>
    <div id="app-nav-bar">
        <a-dropdown>
            <custom-button btn-type="MORE" @btn-click="navBarBtn" style="margin-left: 10px"></custom-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="handleCommand('HOME')">
                        <home-outlined/>
                        <span class="txt">Back To Home</span>
                    </a-menu-item>
                    <a-menu-item @click="handleCommand('SETTING')">
                        <setting-outlined/>
                        <span class="txt">Setting</span>
                    </a-menu-item>
                    <a-sub-menu title="View More">
                        <template #icon>
                            <link-outlined/>
                        </template>
                        <a-menu-item  @click="handleCommand('AUTHOR')">
                            <github-outlined/>
                            <span class="txt">Author</span>
                        </a-menu-item>
                        <a-menu-item  @click="handleCommand('PROJECT')">
                            <folder-open-outlined/>
                            <span class="txt">Project</span>
                        </a-menu-item>
                        <a-menu-item  @click="handleCommand('LICENSE')">
                            <file-outlined/>
                            <span class="txt">License</span>
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </template>
        </a-dropdown>

        <div class="placeholder"></div>

        <custom-button btn-type="MIN" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="MAX" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="REFRESH" @btn-click="navBarBtn"></custom-button>
        <custom-button btn-type="CLOSE" @btn-click="navBarBtn" style="margin-right: 10px"></custom-button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ElDropdown, ElDropdownMenu, ElDropdownItem} from "element-plus";
import {Dropdown, Menu, SubMenu, MenuItem} from 'ant-design-vue';
import {
    HomeOutlined,
    SettingOutlined,
    LinkOutlined,
    GithubOutlined,
    FolderOpenOutlined,
    FileOutlined
} from "@ant-design/icons-vue";
import CustomButton, { BtnType } from "@/components/AppNavBar/CustomButton.vue";
import {sendIpcNav, sendIpcUrl} from "@/scripts/Ipc";
import {useRouter} from "vue-router";

type CmdType = 'AUTHOR' | 'HOME' | 'LICENSE' | 'PROJECT' | 'SETTING'

export default defineComponent({
    name: 'AppNavBar',
    components: {
        ElDropdown, ElDropdownMenu, ElDropdownItem,
        ADropdown: Dropdown, AMenu: Menu, ASubMenu: SubMenu, AMenuItem: MenuItem,
        CustomButton,
        HomeOutlined, SettingOutlined, LinkOutlined, GithubOutlined, FolderOpenOutlined, FileOutlined
    },
    setup() {
        const router = useRouter()

        // 导航栏按钮
        const navBarBtn = (type: BtnType) => {
            if(type === 'MIN' || type === 'MAX' || type === 'CLOSE') {
                sendIpcNav(type)
            }
            else if(type === 'REFRESH') window.location.reload()
            else if(type === 'MORE') { /** do nothing */ }
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
                case "PROJECT":
                    sendIpcUrl('https://github.com/lopo12123/git-netdisk-app')
                    break
                case "LICENSE":
                    router.push({name: 'License'})
                    break
                case "AUTHOR":
                    sendIpcUrl('https://github.com/lopo12123')
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

#app-nav-bar {
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
