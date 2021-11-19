// 引入spark-md5
self.importScripts('spark-md5.min.js')

self.onmessage = e=>{
    // 接受主线程传递的数据
    let {chunks} = e.data
    const spark = new self.SparkMD5.ArrayBuffer()
    let progress = 0
    let count = 0
    const loadNext = index=>{
        let reader = new FileReader()
        reader.readAsArrayBuffer(chunks[index].file)
        reader.onload=e=>{
            count++
            spark.append(e.target.result)
            if(count==chunks.length){
                self.postMessage({
                    progress:100,
                    hash:spark.end()
                })
            }else{
                progress+=100/chunks.length
                self.postMessage({
                    progress:progress,
                    hash:""
                })
                loadNext(index+1)
            }
        }
    }
    loadNext(0)
}