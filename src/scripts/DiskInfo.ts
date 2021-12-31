namespace DiskInfo {
    const {execSync} = require("child_process");
    const myLog = require("./Logger").myLog;

    // region 接口
    // @ts-ignore TODO
    import {DiskInfo} from "@/scripts/interface";
    // endregion

    // region 方法
    /**
     * @description 获取系统的磁盘信息(出错则返回null => 手动选择)
     */
    export const getDiskInfo = (): DiskInfo[] | null => {
        try {
            const keyValueArr = execSync('wmic logicaldisk get caption,freespace,size /format:list')
                .toString()
                .replace(/[\r]/g, '')
                .split('\n')
                .filter((item: string) => { return item.trim() !== '' })

            if(keyValueArr.length % 3 !== 0) {
                myLog('ERROR', 'Wrong Result In WMIC')
                return null
            }
            else {
                const diskInfoList: {
                    caption: string  // 盘符
                    freeSize: number  // 剩余空间 bit
                    totalSize: number  // 总空间 bit
                }[] = []

                for(let i = 0; i < keyValueArr.length / 3; i++) {
                    diskInfoList.push({
                        caption: keyValueArr[3*i].split('=')[1],
                        freeSize: parseInt(keyValueArr[3*i+1].split('=')[1]),
                        totalSize: parseInt(keyValueArr[3*i+2].split('=')[1])
                    })
                }
                return diskInfoList
            }
        } catch (e) {
            myLog('ERROR', e.toString())
            return null
        }
    }
    // endregion
}

module.exports = {
    getDiskInfo: DiskInfo.getDiskInfo
}
