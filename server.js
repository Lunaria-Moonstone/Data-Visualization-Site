const http = require('http');
const fs = require('fs');

// 创建服务器
const server = http.createServer((req, res) => {
  // 获取请求的路径
  const path = req.url;

  // 处理根路径 '/'
  if (path === '/') {
    // 发送默认的 HTML 页面
    fs.readFile('index.html', (error, data) => {
      if (error) {
        // 处理读取文件错误
        console.error('Error reading file:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        // 设置响应的 Content-Type 为 'text/html'
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else {
    // 处理其他路径
    // 去除路由尾部?后的参数
    const repath = path.replace(/\?.*$/, '');
    const file = `.${repath}`;
    fs.readFile(file, (error, data) => {
      if (error) {
        // 处理文件读取错误
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File Not Found');
        } else {
          console.error('Error reading file:', error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      } else {
        // 设置响应的 Content-Type 根据文件扩展名
        const mimeType = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'text/javascript',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
        }[path.substr(path.lastIndexOf('.') + 1)];

        if (mimeType) {
          res.setHeader('Content-Type', mimeType);
        }

        res.end(data);
      }
    });
  }
});

// 监听指定端口
server.listen(8000, () => {
  console.log('Server is running on port 8000.');
});