<p align="center">
  <a href="https://github.com/asahiqin/physium-aiot">
    <img src="src/common/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Physium</h3>
  <p align="center">
    一个适用于Vela的化学与物理小工具	
    <br />
    <a href="https://github.com/asahiqin/physium-aiot/releases/tag/v0.2.0-alpha"><strong>下载测试版（v0.2.0-alpha）</strong></a>
    <br />
    <br />
  </p>

</p>

## 简介
 此quickapp受Casio计算器的Physium应用（即「理化」应用）启发，期望在小米手环上实现相关功能，方便查看物理常数、化学元素周期表等数据

## 功能与待办
- [x] 基本元素周期表查看
- [x] 基本元素信息查看
- [x] 化学分子式计算
- [x] 物理常数表
- [ ] 化学元素周期表显示金属等分类
- [ ] 化学元素检索
- [ ] 物理常数简介

其他希望开发的功能也欢迎提出喵！


## 贡献
你可以发现，本项目有一个requirements.txt文件，同时在src/physics文件下有一个generate_data.py文件，这是用来生成物理常数LaTeX公式与相关描述的工具
如果你想要为此项目增加新的物理常数，请安装依赖并在终端运行该python文件

接下来应该会要求你输入几项内容，具体描述如下：
1. symbol: 物理量符号，可以是LaTeX公式
2. calc：该物理量是怎么计算出来的，例如Vm就是RT/p，支持LaTeX，可以留空
3. describe：对物理量的描述，不支持LaTeX
4. value：物理量的值，不支持LaTeX
5. unit：物理量单位，可以留空，支持LaTeX

默认的json会在采用值中出现
## 预览图

![IMG_20250804_003715](https://github.com/user-attachments/assets/b30ea615-1981-4942-8f51-c92dee0db1aa)
![IMG_20250804_003650](https://github.com/user-attachments/assets/5e5454d4-0641-4657-9fc8-b855f2db7a6c)
![IMG_20250804_003628](https://github.com/user-attachments/assets/3781fc98-e9d8-4e05-849c-43826903011f)
![IMG_20250804_003601](https://github.com/user-attachments/assets/81350bbe-26f7-4912-868c-2f777d03ba29)
![IMG_20250805_111518](https://github.com/user-attachments/assets/94297462-4603-42bc-8342-bb4bd9deb0c0)
![IMG_20250805_111506](https://github.com/user-attachments/assets/1ae688be-d944-4e40-b623-139a202f6456)
![IMG_20250805_111455](https://github.com/user-attachments/assets/c9ddb98f-ea78-43ff-89f1-5b105eb8bd6c)


## 调试该项目
### 1. 开发

```
npm install
npm run start
```

#### 2. 构建

```
npm run build
npm run release
```

### 3. 调试

```
npm run watch
```
