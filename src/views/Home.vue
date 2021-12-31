<template>
    <div id="home" v-loading="ifLoading" element-loading-text="scanning disk names">
        <div class="info-box">
            <span v-if="ifSuccess">Select A Folder To Get Start</span>
        </div>
        <div class="disk-box">
            <el-card v-if="ifSuccess" class="disk-item" shadow="hover"
                     v-for="(item, index) in diskNameList" :key="index">
                <div class="caption">
                    <span class="key">DISK NAME</span>
                    <span class="value">{{ item.caption }}</span>
                </div>
                <div class="number">
                    <span class="key">USED/TOTAL</span>
                    <span class="value">
                        {{ getPercentage(item.freeSize, item.totalSize, 'text') }}
                    </span>
                </div>
                <div class="bar">
                    <el-progress
                        :text-inside="true"
                        :stroke-width="18"
                        :status="getPercentageType(item.freeSize, item.totalSize)"
                        :percentage="getPercentage(item.freeSize, item.totalSize, 'number')"/>
                </div>
            </el-card>
            <div v-if="!ifSuccess" class="failed">
                <img src="../assets/broken.png" alt @click="tryGetDiskNameList" draggable="false">
                <div class="fail-info">
                    Some problems occurred while scanning the hard drive. <br>
                    Click on the face above to try again.
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {useStore} from "vuex";
import {ElMessage, ElCard, ElProgress} from "element-plus";
import {v4 as uuid} from "uuid";
import {sendIpcDisk} from "@/scripts/Ipc";

export default defineComponent({
    name: 'Home',
    components: {
        ElCard, ElProgress
    },
    setup() {
        const store = useStore();
        const ifLoading = ref(true)
        const ifSuccess = ref(false)

        // region 获取磁盘盘符列表(进入后自动执行一次, 若失败可再次手动调用)
        const tryGetDiskNameList = () => {
            sendIpcDisk(uuid())
                .then((diskArr) => {
                    ifLoading.value = false
                    ifSuccess.value = true
                    if(diskArr !== null) {  // 获取到了盘符
                        store.commit('diskModule/updateNameList', diskArr)
                        ElMessage({
                            type: 'success',
                            message: 'finish scanning disks on this computer'
                        })
                    }
                    else {  // 未获取到盘符
                        ElMessage({
                            type: 'warning',
                            message: 'can`t get disk name list on this computer'
                        })
                    }
                })
                .catch((err) => {
                    ifLoading.value = false
                    ifSuccess.value = false
                    ElMessage({
                        type: 'error',
                        message: err === 'TIMEOUT'
                            ? 'timeout in scanning disks on this computer'
                            : 'some problem occurs when getting disk list on this machine'
                    })
                })
        }
        tryGetDiskNameList()
        // endregion

        // region 处理展示卡片数据相关的函数
        const getPercentage = (freeBit: number, totalBit: number, type: 'number' | 'text') => {
            if(type === 'number') {
                return parseFloat(((totalBit - freeBit) / totalBit * 100).toFixed(2))
            }
            else {
                return (`
                    ${((totalBit-freeBit)/1024/1024/1024).toFixed(2)}GB
                    / ${(totalBit/1024/1024/1024).toFixed(2)}GB
                `)
            }
        }
        const getPercentageType = (freeBit: number, totalBit: number) => {
            const p = getPercentage(freeBit, totalBit, 'number') as number
            if(p <= 50) return 'success'
            else if(p <= 80) return 'warning'
            else return 'exception'
        }
        // endregion

        return {
            tryGetDiskNameList,
            ifLoading, ifSuccess,
            diskNameList: computed(() => store.state.diskModule.diskNameList),
            getPercentage, getPercentageType
        }
    }
})
</script>

<style lang="scss" scoped>
@import "../styles/index";

#home {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .info-box {
        position: relative;
        width: calc(100% - 60px);
        height: 40px;
        margin: 20px 30px 0;
        color: #cccccc;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        user-select: none;
    }

    .disk-box {
        @include scrollBarStyle();
        width: calc(100% - 60px);
        height: calc(100% - 100px);
        margin: 0 30px 40px;
        overflow-y: auto;

        .disk-item {
            position: relative;
            margin: 10px 0;
            cursor: pointer;
            user-select: none;

            .caption {
                position: relative;
                width: 20%;
                display: inline-block;
            }
            .number {
                position: relative;
                width: 40%;
                display: inline-block;
            }
            .bar {
                position: relative;
                width: 40%;
                display: inline-block;
            }
            .key {
                margin-right: 10px;
                color: #cccccc;
            }
            .value {
                color: #787878;
                font-weight: bold;
            }
        }

        .failed {
            position: relative;
            width: calc(100% - 60px);
            height: calc(100% - 100px);
            margin: 0 30px 40px;
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
    }
}
</style>
