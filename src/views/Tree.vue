<template>
    <div id="tree">
        <div v-if="!ifTree" class="no-tree">
            <img src="../assets/broken.png" alt @click="backToHome" draggable="false">
            <div class="fail-info">
                Some problems occurred while parsing the file tree. <br>
                Click on the face above to back and try again.
            </div>
        </div>
        <el-table
            v-if="ifTree" class="tree-table"
            :data="treeData" row-key="uuid"
            @row-contextmenu="contextMenu"
            height="100%" stripe>

            <el-table-column label="类型">
                <template #default="scope">
                    <folder-open-outlined v-if="scope.row.type === 'DIR'"/>
                    <file-text-outlined v-if="scope.row.type === 'FILE'"/>
                </template>
            </el-table-column>

            <el-table-column label="全名" prop="base"/>

            <el-table-column label="文件名" prop="name"/>

            <el-table-column label="扩展名" prop="ext"/>

            <el-table-column label="路径" prop="dir"/>

        </el-table>
        <context-menu :style="`left: ${left}px; top: ${top}px`"
                      @item-click="itemClick"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, Ref, ref} from "vue";
import {useRouter} from "vue-router";
import {v4 as uuid} from "uuid";
import {FileTreeNode} from "@/scripts/interface";
import {ElMessage, ElTable, ElTableColumn} from "element-plus";
import {FolderOpenOutlined, FileTextOutlined} from "@ant-design/icons-vue";
import ContextMenu from "@/components/Tree/ContextMenu.vue"
import {sendIpcExplorer} from "@/scripts/Ipc";

export default defineComponent({
    name: "Tree",
    components: {
        ElTable, ElTableColumn,
        FolderOpenOutlined, FileTextOutlined,
        ContextMenu
    },
    setup() {
        const router = useRouter()
        const ifTree = ref(false)
        const treeData: Ref<FileTreeNode[]> = ref([])
        const treeJsonStr = sessionStorage.getItem('tree')
        try {
            if(treeJsonStr === null) throw new Error('NULL')
            treeData.value = [JSON.parse(treeJsonStr)]
            ifTree.value = true
            // ElMessage({
            //     type: 'success',
            //     message: 'parse file tree successfully'
            // })
        }
        catch (e) {
            ifTree.value = false
            ElMessage({
                type: 'warning',
                message: 'some problem occurred when parsing file tree'
            })
        }
        const backToHome = () => {
            router.push({name: 'Home'})
        }

        let rowClicked: FileTreeNode | null = null  // 存储当前row用于展开
        const [left, top] = [ref(-500), ref(-500)]  // 右键菜单的位置
        const contextMenu = (row: any, column: any, e: PointerEvent) => {
            const { clientWidth, clientHeight } = document.body
            const { clientX, clientY } = e
            left.value = clientX < (clientWidth - 130) ? (clientX + 5) : (clientX - 130)
            top.value = clientY < (clientHeight - 80) ? (clientY - 50) : (clientY - 130)
            rowClicked = row
        }
        const hideContextMenu = () => {
            left.value = -500
            top.value = -500
        }
        const itemClick = (type: 'Expansion' | 'Explorer') => {
            if(type === 'Expansion') {
                // ipc expand
            }
            else if(type === 'Explorer') {
                if(rowClicked === null) return
                else if(rowClicked.type === 'DIR') {
                    sendIpcExplorer({uuid: uuid(), dir: rowClicked.dir+rowClicked.base})
                }
                else {
                    sendIpcExplorer({uuid: uuid(), dir: rowClicked.dir})
                }
            }
            console.log(type, '了')
        }


        document.addEventListener('click', hideContextMenu)
        onBeforeUnmount(() => {
            document.removeEventListener('click', hideContextMenu)
        })

        return {
            ifTree, treeData, backToHome,
            left, top, contextMenu, itemClick,
        }
    }
})
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";

#tree {
    position: relative;
    width: 100%;
    height: 100%;

    .no-tree {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > img {
            position: relative;
            width: 128px;
            height: 128px;
            border-radius: 64px;
            cursor: pointer;
            user-select: none;
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
            &:active {
                opacity: 0.8;
            }
        }
        .fail-info {
            margin-top: 20px;
            color: #cccccc;
            font-size: 16px;
            line-height: 40px;
            text-align: center;
            user-select: none;
        }
    }

    .tree-table {
        position: relative;
        width: 100%;
        height: 100%;
    }

    ::v-deep {
        .el-table__body-wrapper {
            @include scrollBarStyle();
        }
    }
}
</style>
