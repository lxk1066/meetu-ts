/**
 * 长按图片弹出action框，点击保存图片保存到本地
 */

export default async function downloadImg(url: string): Promise<void> {
  await request(url, (blob: Blob, type: string) => {
    downloadBlob(blob, `Meetu_post_${Date.now()}.${type}`);
  });
}

// 将图片转为blob
async function request(url: string, callback?: Function) {
  const DownUrl = url;
  return await fetch(DownUrl)
    .then((response) => response.blob())
    .then((res) => {
      //获取文件格式
      const index = DownUrl.lastIndexOf(".");
      //获取文件后缀判断文件格式
      const fileType = DownUrl.substr(index + 1);
      const blob = new Blob([res]);
      callback && callback(blob, fileType);
    });
}

function downloadBlob(blob: Blob, fileName: string): void {
  try {
    const href = window.URL.createObjectURL(blob); //创建下载的链接
    // 谷歌浏览器 创建a标签 添加download属性下载
    const downloadElement = document.createElement("a");
    downloadElement.href = href;
    downloadElement.target = "_blank";
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob url
  } catch (e) {
    console.log("图片保存失败");
  }
}
