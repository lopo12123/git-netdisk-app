/// background
namespace ErrorLog {
    const fs = require('fs');
    const EOL = require('os').EOL;

    /**
     * @description 输出日志
     */
    export const myLog = (type: 'INFO' | 'WARNING' | 'ERROR', e: string, path: string = './log.txt') => {
        fs.appendFile(path, `[${now()}] [${type}] ${e}${EOL}`, (err: Error) => {
            if(err) console.log(err)
        })
    }

    /**
     * @description 返回当前时间
     */
    const now = (): string => {
        return (new Date().toLocaleString('zh-tw', {hour12: false}))
    }
}

// const myLog = ErrorLog.myLog
module.exports = {
    myLog: ErrorLog.myLog
}