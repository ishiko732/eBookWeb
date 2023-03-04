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
    opt_success: "操作成功",
    opt_error: "操作失败:{{data}}",
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
    media: {
      title: "媒体文件管理",
      number: "该用户资源数目",
      search: "查询",
      username: "用户名",
      helperTextUsername: "请输入用户名",
      fileId: "文件ID",
      fileName: "文件名",
      fsId: "资源ID",
      fid: "文件夹ID",
      upload: "添加文件到用户的缓冲目录",
      error_upload: "您还没进行查询用户呢~",
      links: {
        file: "文件信息",
        download: "下载",
        delete: "删除",
        update: "重命名",
      },
    },
    book: {
      title: "电子书管理",
      number: "当前已登记的电子书数目",
      restart: "刷新",
      notSelect: "还未选中图书!",
      bookField: {
        id: "图书ID",
        mid: "资源ID",
        author: "作者",
        title: "标题",
        subject: "概要",
        types: "图书类型",
        keywords: "图书关键词",
        creator: "来源程序",
        creationDate: "创建时间",
      },
      user_name: "持有者",
      user_number: "持有者人数",
      edit_text: "请输入并按下回车键",
      edit_repeat: "输入的信息已存在",
      op: {
        view: "浏览文件",
        file: "查看持有者",
        comment: "查看评论",
        book: "浏览信息",
        share: "查看共享",
        edit_type: "编辑类型",
        edit_keyword: "编辑关键词",
      },
    },
    review: {
      title: "电子书共享&审核",
      status: {
        WAIT: "待审核",
        AGREE: "已通过",
        REVOKE: "驳回",
        NOT: "暂无",
      },
      color: {
        WAIT: "info",
        AGREE: "success",
        REVOKE: "error",
      },
      view: "查看{{field}}",
      op: "操作",
      sharebookField: {
        id: "共享ID",
        check: "审核",
        file: "文件",
        book: "电子书",
        browse: "浏览量",
        love: "点赞数",
        status: "审核状态",
        createdAt: "申请时间",
        updateAt: "变更时间",
      },
      viewReview: {
        create: "提交申请",
        review: "检查处理",
        message: "请仔细检查用户提交的信息",
        finish: "审核决定",
        completed: "已经完成审核,可进行",
        Continue: "继续",
        Finish: "完成",
        BACK: "上一步",
        LastStep: "最后一步!",
        RESET: "重置",
        review_message: "审核信息",
      },
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
    Share: "共享{{type}}",
    Open: "打开{{type}}",
    Input: "请输入{{type}}名称",
    Tip: "请谨慎操作,一旦{{type}}就无法恢复!",
    YES: "确定{{opt}}",
    NO: "取消",
    opt: {
      Add: "创建",
      Delete: "删除",
      Move: "移动",
      Rename: "重命名",
      Upload: "上传",
      Update: "更新",
      Share: "共享",
      Open: "打开",
    },
  },
  comment: {
    comment: "评论",
    notComment: "暂无评论",
    notComment_msg: "立即发表自己的评论",
    newCommnet: "发表评论",
    addComment: "添加评论",
    deleteComment: "删除评论",
    myself: "本人",
  },
  read: {
    read: "阅读",
    addBook: "添加到书库",
    downloadBook: "下载图书",
  },
  topic: {
    default: "默认主题",
  },
  note: {
    title: "笔记",
    question: "问题",
    answer: "答案",
    label: "标签",
    cancel: "取消",
    save: "保存",
  },
  fsrs: {
    config: "FSRS 调度配置",
    request_retention: "记忆概率",
    request_retention_full:
      "代表你想要的目标记忆的概率。注意，在较高的保留率和较高的重复次数之间有一个权衡。建议你把这个值设置在0.8和0.9之间。",
    enable_fuzz: "启用抖动",
    enable_fuzz_full:
      "当启用时，这将为新的间隔时间增加一个小的随机延迟，以防止卡片粘在一起，总是在同一天被审查。",
    on: "开启",
    off: "关闭",
    maximum_interval: "最大间隔天数",
    maximum_interval_full:
      "复习卡片间隔的最大天数。 当复习卡片的间隔达到此天数时， 「困难」、「良好」和「简单」的间隔将会一致。 此间隔越短，工作量越多。",
    easy_bonus: "简单系数",
    easy_bonus_full: `当复习卡被回答为 "容易"时，会有一个额外的乘数应用于间隔时间。`,
    hard_factor: "困难系数",
    hard_factor_full: `当复习卡被回答为 "困难"时，会有一个额外的乘数应用于间隔时间。`,
    w: "FSRS优化器权重",
    w_full:
      "通过运行FSRS优化器创建的权重。默认情况下，这些是由样本数据集计算出来的权重。",
  },
  card: {
    title: "FSRS间隔重复记忆系统",
    new: "未学习",
    learing: "学习中",
    relearing: "重新学习",
    review: "待复习",
    again: "重新学习",
    hard: "困难",
    good: "良好",
    easy: "简单",
    start: "开始学习",
    answer_is_empty: "你想要什么时候再看到该卡片?",
    show: "显示答案",
    day: "天",
    min: "分钟",
    done: "你已经完成了今日的计划!",
    Rating: {
      Again: "重来",
      Hard: "困难",
      Good: "良好",
      Easy: "简单",
    },
    Rating_color: {
      Again: "error",
      Hard: "warning",
      Good: "success",
      Easy: "info",
    },
  },
};

export default customChineseMessages;
