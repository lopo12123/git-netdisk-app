<template>
    <div id="home">
        <div class="info-box">Select A Folder To Get Start</div>
        <div class="file-box">
            <file-selector
                v-loading="ifLoading"
                @box-event="boxEvent"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ElMessage} from "element-plus";
import {v4 as uuid} from "uuid";
import FileSelector from "@/components/Home/FileSelector.vue";
import {sendIpcHome} from "@/scripts/Ipc";

export default defineComponent({
    name: 'Home',
    components: {
        FileSelector
    },
    setup() {
        const ifLoading = ref(false)
        const boxEvent = (args: {type: 'click', path: null} | {type: 'drop', path: string}) => {
            // 点击 - 后台调用资源管理器打开选择路径(不限时)
            // 拖拽 - 传送路径到后台并解析文件树(设置超时时间)
            sendIpcHome({uuid: uuid(), path: args.path})
                .then(({tree}) => {  // 后台解析树后返回
                    if(tree === null) {
                        ElMessage({
                            type: 'warning',
                            message: 'some problem occurred when parsing file tree'
                        })
                    }
                    else {
                        console.log('成功解析文件树: ', tree)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    ElMessage({
                        type: 'warning',
                        message: '111'
                    })
                })
        }

        return {
            ifLoading,
            boxEvent
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

    .info-box {
        position: relative;
        width: calc(100% - 60px);
        height: 40px;
        margin: 10px 30px;
        color: #cccccc;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        user-select: none;
    }

    .file-box {
        width: calc(100% - 60px);
        height: calc(100% - 80px);
        margin: 0 30px 20px;
    }
}
</style>
