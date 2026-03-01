# Harmony TCM Wellness - Component System

## 项目结构

```
chinese/
├── index.html                          # 主页面
├── README.md                           # 项目文档
├── css/                               # 样式目录
│   └── styles.css                     # 主样式文件
├── js/                                # 脚本目录
│   ├── script.js                      # 主交互脚本
│   └── component-loader.js            # 组件加载器
└── components/                        # 组件目录
    ├── navbar.html                     # 导航栏组件
    └── footer.html                     # 页脚组件
```

## 组件系统说明

### 可复用组件

#### 1. 导航栏组件 (`components/navbar.html`)
- 包含网站logo和导航链接
- 响应式设计，支持移动端菜单
- 自动高亮当前页面

#### 2. 页脚组件 (`components/footer.html`)
- 包含品牌信息、社交媒体链接
- 产品和服务链接
- 联系信息和版权声明

### 如何使用组件

#### 在HTML中使用组件

只需在需要的位置添加 `data-component` 属性：

```html
<!-- 导航栏 -->
<div data-component="navbar"></div>

<!-- 页脚 -->
<div data-component="footer"></div>
```

#### 添加新组件

1. 在 `components/` 目录下创建新的HTML文件
2. 在 `component-loader.js` 中注册组件：

```javascript
this.components = {
    'navbar': 'components/navbar.html',
    'footer': 'components/footer.html',
    'your-component': 'components/your-component.html'  // 添加新组件
};
```

3. 在HTML中使用：

```html
<div data-component="your-component"></div>
```

### 组件加载器特性

- **异步加载**：使用Fetch API异步加载组件
- **自动初始化**：组件加载完成后自动触发 `componentsLoaded` 事件
- **错误处理**：加载失败时会在控制台输出错误信息
- **性能优化**：并行加载所有组件

### 注意事项

1. **需要HTTP服务器**：由于使用了Fetch API，必须通过HTTP服务器访问（不能直接打开HTML文件）
2. **组件加载时机**：主脚本在 `componentsLoaded` 事件触发后才初始化，确保DOM元素已存在
3. **样式隔离**：组件共享全局样式文件 `styles.css`

### 本地开发

使用Python启动本地服务器：

```bash
python -m http.server 8080
```

或使用Node.js：

```bash
npx serve
```

然后在浏览器中访问：`http://localhost:8080`

### 浏览器兼容性

- 现代浏览器（支持Fetch API和ES6）
- IE11及以下不支持

## 主要产品

1. **Herbal Milk Tea (中药奶茶)** - 中药奶茶
2. **Medicinal Cuisine (药膳养生)** - 药膳养生
3. **TCM Therapy (中医调理)** - 中医调理

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- 组件化架构

## 设计风格

- 炫酷与典雅相结合
- 深色主题配金色点缀
- 流畅的动画效果
- 响应式设计
