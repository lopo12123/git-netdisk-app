<template>
    <div class="file-selector">
        <div class="fake-box"
             ref="dragBox"
             @click="fileBoxOpen">
            <span class="text-big">Drag File Here</span>
            <span class="text-small">or</span>
            <span class="text-big">Click To Select</span>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, Ref, ref} from "vue";
import {ElMessage} from "element-plus";
import {sendIpcLog} from "@/scripts/Ipc";

export default defineComponent({
    name: 'FileSelector',
    setup(props, ctx) {
        const dragBox: Ref<HTMLDivElement|null> = ref(null)

        // region 拖拽选择文件夹
        const dropCB = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()

            const droppedFile = e.dataTransfer?.files[0]
            if(!droppedFile) {
                ElMessage({
                    type: 'warning',
                    message: 'neither folder nor file!'
                })
            }
            else {
                _judgeDirOrFile(droppedFile)
                    .then((type) => {
                        if(type === 'file') {
                            ElMessage({
                                type: 'warning',
                                message: 'folder(s) only!'
                            })
                        }
                        else {
                            if(!droppedFile.path) {
                                ElMessage({
                                    type: 'warning',
                                    message: 'some problem occurred when solving path of directory'
                                })
                            }
                            else {
                                ctx.emit('box-event', {type: 'drop', path: droppedFile.path})
                            }
                        }
                    })
                    .catch((e) => {
                        ElMessage({
                            type: 'error',
                            message: '出错了, 请重试'
                        })
                        sendIpcLog({type: 'ERROR', e: e.toString()})
                    })
            }

        }
        const dragoverCB = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }
        onMounted(() => {
            if(dragBox.value !== null) {
                dragBox.value?.addEventListener('drop', dropCB)
                dragBox.value?.addEventListener('dragover', dragoverCB)
            }
        })
        onBeforeUnmount(() => {
            if(dragBox.value !== null) {
                dragBox.value?.removeEventListener('drop', dropCB)
                dragBox.value?.removeEventListener('dragover', dragoverCB)
            }
        })
        // endregion

        // region 点击选择文件夹
        const fileBoxOpen = () => {
            ctx.emit('box-event', {type: 'click', path: null})
        }
        // endregion

        /**
         * @description 通过尝试用FileReader进行读取: [成功 - 文件; 失败 - 文件夹]
         */
        const _judgeDirOrFile = (file: File):Promise<'file'|'dir'> => {
            const _reader = new FileReader()
            return new Promise((resolve) => {
                _reader.onload = () => {
                    resolve('file')
                }
                _reader.onerror = (e) => {
                    e.preventDefault()
                    resolve('dir')
                }
                _reader.readAsText(file)
            })
        }

        return {
            dragBox,
            fileBoxOpen
        }
    }
})
</script>

<style lang="scss" scoped>
.file-selector {
    position: relative;
    width: 100%;
    height: 100%;
    color: #d5dce3;

    .fake-box {
        position: relative;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        border: dashed 1px #afb4b9;
        border-radius: 10px;
        user-select: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:hover {
            border-color: #0000ee;
        }

        .text-big {
            font-size: 16px;
            line-height: 24px;
            margin: 5px 0;
        }
        .text-small {
            font-size: 12px;
            line-height: 18px;
            margin: 5px 0;
        }
    }

    #fileBox {
        width: 0;
        height: 0;
        opacity: 0;
        display: none;
    }
}
</style>