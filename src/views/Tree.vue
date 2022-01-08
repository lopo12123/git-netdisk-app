<template>
    <div id="tree">
        <div v-if="!ifTree" class="no-tree">
            <img src="../assets/broken.png" alt @click="backToHome" draggable="false">
            <div class="fail-info">
                Some problems occurred while parsing the file tree. <br>
                Click on the face above to back and try again.
            </div>
        </div>

        <el-table v-if="ifTree"
            class="tree-table" ref="treeTable"
            :data="treeData" row-key="uuid"
            @row-contextmenu="contextMenu"
            @row-dblclick="doExpand"
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

            <el-table-column label="路径" width="70px">
                <template #default="scope">
                    <copy-outlined class="copy-dir" @click="copyDir(scope)"/>
                </template>
            </el-table-column>
        </el-table>

        <input class="iptForCopy" ref="toCopy" type="text">

        <context-menu :style="`left: ${left}px; top: ${top}px`" @item-click="itemClick"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, Ref, ref} from "vue";
import {useRouter} from "vue-router";
import {v4 as uuid} from "uuid";
import {FileTreeNode} from "@/scripts/interface";
import {ElMessage, ElTable, ElTableColumn} from "element-plus";
import {FolderOpenOutlined, FileTextOutlined, CopyOutlined} from "@ant-design/icons-vue";
import ContextMenu from "@/components/Tree/ContextMenu.vue"
import {sendIpcExplorer, sendIpcTree} from "@/scripts/Ipc";

export default defineComponent({
    name: "Tree",
    components: {
        ElTable, ElTableColumn,
        FolderOpenOutlined, FileTextOutlined, CopyOutlined,
        ContextMenu
    },
    setup() {
        const router = useRouter()
        const ifTree = ref(false)
        const treeTable: Ref<(typeof ElTable) | null> = ref(null)
        const treeData: Ref<FileTreeNode[]> = ref([])
        const treeJsonStr = sessionStorage.getItem('tree')
        try {
            if(treeJsonStr === null) throw new Error('NULL')
            treeData.value = [JSON.parse(treeJsonStr)]
            ifTree.value = true
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
            e.preventDefault()
            e.stopPropagation()
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
        const doExpand = (row: any, column: any, e: PointerEvent) => {
            e.preventDefault()
            e.stopPropagation()
            rowClicked = row
            itemClick('Expansion')
        }
        const itemClick = (type: 'Expansion' | 'Explorer') => {
            if(type === 'Expansion') {
                if(rowClicked === null) return;
                else if(rowClicked.type === 'FILE') {
                    ElMessage({
                        type: 'info',
                        message: 'this is not a directory'
                    })
                }
                else if(rowClicked.children && rowClicked.children.length > 0) {
                    treeTable.value!.toggleRowExpansion(rowClicked)
                }
                else {
                    sendIpcTree('EXPAND', uuid(), rowClicked.uuid)
                        .then((args) => {
                            treeData.value = [args.tree]
                            sessionStorage.setItem('tree', JSON.stringify(args.tree))
                            ElMessage({
                                type: args.result ? 'success' : 'warning',
                                message: args.reason
                            })
                            setTimeout(() => {
                                treeTable.value!.toggleRowExpansion(rowClicked)
                            }, 0)
                        })
                }
            }
            else if(type === 'Explorer') {
                if(rowClicked === null) return;
                else if(rowClicked.type === 'DIR') {
                    sendIpcExplorer({uuid: uuid(), dir: rowClicked.dir+rowClicked.base})
                }
                else {
                    sendIpcExplorer({uuid: uuid(), dir: rowClicked.dir})
                }
            }
        }

        const toCopy: Ref<HTMLInputElement|null> = ref(null)
        const copyDir = (scope: any) => {
            if(toCopy.value === null) {
                ElMessage({
                    type: 'info',
                    message: 'can`t copy it now, try it later'
                })
            }
            else {
                toCopy.value!.value = scope.row.dir + scope.row.base
                toCopy.value?.select()
                const result = document.execCommand('copy')
                ElMessage({
                    type: result ? 'success' : 'warning',
                    message: result ? 'copy to clipboard successfully' : 'copy to clipboard failed'
                })
            }
        }

        document.addEventListener('click', hideContextMenu)
        onBeforeUnmount(() => {
            document.removeEventListener('click', hideContextMenu)
        })

        return {
            ifTree, treeTable, treeData, backToHome,
            left, top, contextMenu, doExpand, itemClick,
            toCopy, copyDir,
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

        .copy-dir {
            cursor: pointer;
            &:hover:not(:active) {
                color: #40cead;
            }
        }
    }

    ::v-deep {
        .el-table__body-wrapper {
            @include scrollBarStyle();
        }
    }
}
</style>
