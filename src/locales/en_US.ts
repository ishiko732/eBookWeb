const customEnglishMessages = {
  hello: "hello",
  transfer: {
    language: "lanuage",
    change: "change {{language}}",
    zh_CN: "中文",
    en_US: "English",
    ja_JP: "日本语",
  },
  auth: {
    login: {
      login: "Sign in",
      name: "name",
      password: "password",
      remember: "remember me",
      forgot: "Forgot password?",
      signup: "Don't have an account? Sign Up",
      loadingIndicator: "loading",
    },
    register: {
      register: "Sign up",
      name: "name",
      password: "password",
      phone: "phone",
      login: "Already have an account? Sign in",
      readed:
        "I want to receive inspiration, marketing promotions and updates via email.",
      loadingIndicator: "registering",
      zh_CN: "+86",
      en_US: "+1",
      ja_JP: "+81",
    },
    valid: {
      username: "please input username",
      username_minlength: "用户名至少为5位",
      username_maxlength: "用户名最多为10位",
      password: "please input password",
      password_minlength: "密码至少为4位",
      phone: "please input phone",
      zh_CN: "CN",
      en_US: "US",
      ja_JP: "JP",
    },
  },
  error: {
    "404": {
      "Not Found": "The page you’re looking for doesn’t exist.",
      "Back Page": "Back Page",
    },
    "403": {
      forbidden: "You do not have permission to access this page",
      "Back Page": "Back Page",
    },
  },
  config: {
    logout: {
      logout: "Log out",
      title: "Are you sure you want to log out?",
      text: "Signing out may cause some of your current information to be lost!",
      disagree: "let me think again",
      agree: "Sure",
    },
    config: {
      config: "configuration",
      message: "user information",
      user: "user:{{name}}(UID:{{uid}})",
      role: "role:{{role}}",
      phone: "phone:{{phone}}",
      status: "user status:",
    },
  },
  menu: {
    System: "System Management",
    "System-systemConfig": "System Configuration",
    "System-onlineConfig": "Online Management",
    Admin: "Application Management",
    "Admin-userConfig": "User Permission Management",
    "Admin-mediaConfig": "Media File Management",
    "Admin-bookConfig": "e-Book Management",
    "Admin-shareConfig": "Book Sharing Management",
    Browse: "Browse Books",
    "Browse-public": "Get Public Books",
    "Browse-Read": "Read",
    "Browse-Notes": "Notes&Review",
  },
  role: {
    SUPERADMIN: "SuperAdmin",
    ADMIN: "Admin",
    USER: "User",
    TEMP: "Temp User",
  },
  userStatus: {
    EXPIRED: "Expired",
    ENABLED: "Enabled",
    LOCKED: "Locked",
  },
};

export default customEnglishMessages;
