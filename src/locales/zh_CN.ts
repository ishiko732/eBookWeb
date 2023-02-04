const customChineseMessages = {
  webTitle: "电子书管理系统",
  hello: "您好",
  transfer: {
    language: "语言",
    change: "切换{{language}}",
    zh_CN: "中文",
    en_US: "English",
    ja_JP: "日本语",
  },
  auth: {
    login: {
      login: "登录",
      name: "用户名",
      password: "密码",
      remember: "记住我",
      forgot: "忘记密码",
      signup: "还没有账号?立即注册",
      loadingIndicator: "登录中",
    },
    register: {
      register: "注册",
      name: "用户名",
      password: "密码",
      phone: "手机号码",
      login: "已有账号?立即登录",
      readed: "我已阅读网站相关规定",
      loadingIndicator: "注册中",
      zh_CN: "+86",
      en_US: "+1",
      ja_JP: "+81",
    },
    valid: {
      username: "请输入用户名",
      username_minlength: "用户名至少为5位",
      username_maxlength: "用户名最多为10位",
      password: "请输入密码",
      password_minlength: "密码至少为4位",
      phone: "请输入正确的手机号",
      zh_CN: "CN",
      en_US: "US",
      ja_JP: "JP",
    },
  },
  error: {
    "404": {
      "Not Found": "你要访问的页面不存在。",
      "Back Page": "返回上页",
    },
    "403": {
      forbidden: "您没有权限访问该网页",
      "Back Page": "返回上页",
    },
  },
  config: {
    logout: {
      logout: "注销",
      title: "确定要退出吗?",
      text: "退出可能会导致你现在的一些信息丢失!",
      disagree: "我再想想",
      agree: "确定",
    },
    config: {
      config: "配置",
      message: "用户信息",
      user: "用户名:{{name}}(UID:{{uid}})",
      role: "角色:{{role}}",
      phone: "手机号码:{{phone}}",
      status: "用户状态:",
    },
  },
  menu: {
    System: "系统管理",
    "System-systemConfig": "系统配置",
    "System-onlineConfig": "在线管理",
    Admin: "应用管理",
    "Admin-userConfig": "用户权限管理",
    "Admin-mediaConfig": "媒体文件管理",
    "Admin-bookConfig": "电子书 管理",
    "Admin-shareConfig": "图书共享管理",
    Browse: "浏览图书",
    "Browse-public": "获取图书",
    "Browse-Read": "阅读图书",
    "Browse-Notes": "笔记复习",
  },
  role: {
    SUPERADMIN: "超级管理员",
    ADMIN: "管理员",
    USER: "用户",
    TEMP: "临时用户",
  },
  userStatus: {
    EXPIRED: "失效",
    ENABLED: "启用",
    LOCKED: "锁定",
  },
  system: {
    message: "系统信息",
    CPU: "CPU",
    OS: "操作系统",
    version: "版本",
    status: "{{name}}状态 ",
    UP: "正常运行",
    DOWN: "服务停止",
    details: {
      version: "版本",
    },
    mongo: {
      maxWireVersion: "连接限制",
    },
    diskSpace: {
      run: "运行状态",
      path: "运行路径",
      threshold: "警告阈值",
      free: "剩余空间",
      use: "已用空间",
    },
    online: {
      online: "在线管理",
      number: "当前在线人数",
      restart: "刷新",
      op: "操作",
      links: {
        underline: "下线处理",
      },
    },
  },
  api: {
    success: "读取成功",
    error: "读取失败",
  },
  management: {
    user: {
      title: "用户权限管理",
      number: "当前已注册人数",
      createDate: "创建时间",
      updateDate: "更新时间",
      protected: "保护中",
      updatePassword: "修改密码",
      rawPassword: "原密码",
      newPassword: "新密码",
      repeatPassword: "再次输入密码",
      updatePassword_Tip: "原密码将保持跟新密码一致",
      update_ok: "确定修改",
      update_no: "取消修改",
      password_check: "新密码与再次输入密码不一致",
    },
  },
  TreeView: {
    Folder: "文件夹",
    File: "文件",
    PDF: "电子书",
    Topic: "主题",
    Note: "笔记",
    Copy: "复制名称:{{name}}",
    Add: "创建{{type}}",
    Delete: "删除{{type}}",
    Move: "移动{{type}}",
    Rename: "命名{{type}}",
    Upload: "上传{{type}}",
    Input: "请输入{{type}}名称",
    YES: "确定{{opt}}",
    NO: "取消",
    opt: {
      Add: "创建",
      Delete: "删除",
      Move: "移动",
      Rename: "重命名",
      Upload: "上传",
    },
  },
};

export default customChineseMessages;
