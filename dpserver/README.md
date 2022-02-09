# server
npm install --registry=https://registry.npm.taobao.org
由于个人使用3.2的 mongodb，因此nodejs的mongo插件版本为老版本。
把inkbox编译出来的 ink/ include/ bin/ 文件夹放进来作为 depends库和启动器
server 是主要业务逻辑层 使用者维护
test 文件夹中有一个测试用例 账号登录 如果没有角色就创建一个角色