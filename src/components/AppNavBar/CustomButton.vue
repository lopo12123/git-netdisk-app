<template>
    <div class="custom-button"  @click="$emit('btn-click', btnType)">
        <el-icon v-if="btnType==='MIN'" size="14">
            <bottom-left></bottom-left>
        </el-icon>

        <el-icon v-if="btnType==='MAX'" size="14">
            <full-screen></full-screen>
        </el-icon>

        <el-icon v-if="btnType==='REFRESH'" size="14">
            <refresh></refresh>
        </el-icon>

        <el-icon v-if="btnType==='CLOSE'" size="14">
            <close></close>
        </el-icon>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ElIcon} from "element-plus";
import {BottomLeft, FullScreen, Refresh, Close} from '@element-plus/icons'

export type BtnType = 'MIN' | 'MAX' | 'REFRESH' | 'CLOSE'

export default defineComponent({
    props: {
        btnType: String as PropType<BtnType>,
    },
    components: {
        ElIcon,
        BottomLeft, FullScreen, Refresh, Close
    },
})
</script>

<style lang="scss" scoped>
.custom-button {
    position: relative;
    width: 30px;
    height: 30px;
    border: solid 1px #dde4eb;
    border-radius: 5px;
    color: #9094a1;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;

    i {
        transition: transform 0.4s ease-in-out;
        -webkit-transition: -webkit-transform 0.4s ease-in-out;
    }
    &:hover {
        i {
            transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
        }
    }
}
</style>