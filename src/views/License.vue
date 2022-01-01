<template>
    <div id="license">
        <a-dropdown :trigger="['contextmenu']">
            <div class="background-cover">
                <div class="title">
                    {{ title }} <br> <br>
                </div>
                <div class="copyright">
                    {{ copyright }} <br> <br>
                </div>
                <div class="context">
                    {{ context_p1 }} <br> <br>
                    {{ context_p2 }} <br> <br>
                    {{ context_p3 }} <br> <br>
                </div>
                <input id="toCopy" ref="toCopy" type="text" :value="title+copyright+context_p1+context_p2+context_p3">
            </div>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="copy">Copy The License</a-menu-item>
                    <a-menu-item @click="mit">More About <i>MIT</i></a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";
import {ElMessage} from "element-plus";
import {Dropdown, Menu, MenuItem} from 'ant-design-vue';
import {sendIpcUrl} from "@/scripts/Ipc";

export default defineComponent({
    name: "License",
    components: {
        ADropdown: Dropdown,
        AMenu: Menu,
        AMenuItem: MenuItem
    },
    setup() {
        const toCopy: Ref<HTMLInputElement|null> = ref(null)
        const title = "MIT License"
        const copyright = "Copyright (c) <2022> <Chen MH>"
        const context_p1 = "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:"
        const context_p2 = "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software."
        const context_p3 = "The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software."

        const copy = () => {
            if(toCopy.value === null) {
                ElMessage({
                    type: 'info',
                    message: 'can`t copy it now, try it later or manually'
                })
            }
            else {
                toCopy.value?.select()
                const result = document.execCommand('copy')
                ElMessage({
                    type: result ? 'success' : 'warning',
                    message: result ? 'copy to clipboard successfully' : 'copy to clipboard failed'
                })
            }
        }
        const mit = () => {
            sendIpcUrl('https://spdx.org/licenses/MIT')
        }

        return {
            title, copyright, context_p1, context_p2, context_p3,
            toCopy, copy, mit
        }
    }
})
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";

#license {
    position: relative;
    width: 100%;
    height: 100%;
    .background-cover {
        @include scrollBarStyle(#cccccc);
        position: relative;
        width: calc(100% - 400px);
        height: calc(100% - 60px);
        margin: 20px 200px 20px;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #eeeeee;
        color: #646464;
        font-style: italic;
        word-break: break-all;
        overflow-y: auto;

        #toCopy {
            position: absolute;
            width: 1px;
            height: 1px;
            top: -100px;
            left: -100px;
            border: none;
            outline: none;
        }
    }
}
</style>
