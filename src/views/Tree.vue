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
            height="100%" stripe>

            <el-table-column label="类型" prop="type"/>

            <el-table-column label="全名" prop="base"/>

            <el-table-column label="文件名" prop="name"/>

            <el-table-column label="扩展名" prop="ext"/>

            <el-table-column label="路径" prop="dir"/>

        </el-table>
    </div>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";
import {FileTreeNode} from "@/scripts/interface";
import {ElMessage, ElTable, ElTableColumn} from "element-plus";
import router from "@/router";

export default defineComponent({
    name: "Tree",
    components: {
        ElTable, ElTableColumn
    },
    setup() {
        const ifTree = ref(false)
        const treeData: Ref<FileTreeNode[]> = ref([{}])
        const treeJsonStr = sessionStorage.getItem('tree')
        try {
            if(treeJsonStr === null) throw new Error('NULL')
            treeData.value = [JSON.parse(treeJsonStr)]
            ifTree.value = true
            ElMessage({
                type: 'success',
                message: 'parse file tree successfully'
            })
        } catch (e) {
            ifTree.value = false
            ElMessage({
                type: 'warning',
                message: 'some problem occurred when parsing file tree'
            })
        }
        const backToHome = () => {
            router.push({name: 'Home'})
        }

        return {
            ifTree, treeData, backToHome
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
