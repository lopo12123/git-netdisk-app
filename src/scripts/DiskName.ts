namespace DiskName {
    const {execSync} = require("child_process");
    const myLog = require("./Logger").myLog;

    /**
     * @description 获取系统的盘符(出错则返回null => 手动选择)
     */
    export const getDiskName = (): string[] | null => {
        try {
            return (execSync('wmic logicaldisk get caption', {encoding: 'utf-8'}) as string)
                .replace(/[\r]/g, '')
                .split('\n')
                .map((item) => {
                    return item.trim()
                })
                .filter((item) => {
                    return item !== ''
                })
                .splice(1)
        }
        catch (e) {
            myLog('ERROR', e.toString())
            return null
        }
    }
}

module.exports = {
    getDiskName: DiskName.getDiskName
}