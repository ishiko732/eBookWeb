const customEnglishMessages = {
  webTitle: "EBook Management System",
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
      username: "Please enter a username",
      username_minlength: "Username should be at least 5 characters long",
      username_maxlength: "Username should be no more than 10 characters long",
      password: "Please enter a password",
      password_minlength: "Password should be at least 4 characters long",
      phone: "Please enter a valid phone number",
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
    System: "System Mgmt",
    "System-systemConfig": "System Config",
    "System-onlineConfig": "Online Mgmt",
    Admin: "Application Mgmt",
    "Admin-userConfig": "User Permission Mgmt",
    "Admin-mediaConfig": "Media File Mgmt",
    "Admin-bookConfig": "E-book Mgmt",
    "Admin-shareConfig": "Book Sharing Mgmt",
    Browse: "Browse Books",
    "Browse-public": "Get Public Books",
    "Browse-Read": "Read Books",
    "Browse-Notes": "Notes Review",
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
  system: {
    message: "System Info",
    CPU: "CPU",
    OS: "OS",
    version: "Version",
    status: "{{name}} Status",
    UP: "Running",
    DOWN: "Stopped",
    details: {
      version: "Version",
    },
    mongo: {
      maxWireVersion: "Connection Limit",
    },
    diskSpace: {
      run: "Run Status",
      path: "Run Path",
      threshold: "Warning Threshold",
      free: "Free Space",
      use: "Used Space",
    },
    online: {
      online: "Online Management",
      number: "Current Online Users",
      restart: "Refresh",
      op: "Operation",
      links: {
        underline: "Offline Processing",
      },
    },
  },
  api: {
    success: "Success",
    error: "Error",
    opt_success: "Operation Successful",
    opt_error: "Operation Failed: {{data}}",
  },
  management: {
    user: {
      title: "User Permissions Management",
      number: "Number of Registered Users",
      createDate: "Creation Time",
      updateDate: "Update Time",
      protected: "Protected",
      updatePassword: "Change Password",
      rawPassword: "Original Password",
      newPassword: "New Password",
      repeatPassword: "Repeat Password",
      updatePassword_Tip:
        "The original password will remain the same as the new password",
      update_ok: "Confirm Change",
      update_no: "Cancel Change",
      password_check: "The new password and the repeated password do not match",
    },
    media: {
      title: "Media File Management",
      number: "Number of Resources Owned by the User",
      search: "Search",
      username: "Username",
      helperTextUsername: "Please Enter Username",
      fileId: "File ID",
      fileName: "File Name",
      fsId: "Resource ID",
      fid: "Folder ID",
      upload: "Add File to User's Buffer Directory",
      error_upload: "You have not searched for a user yet~",
      links: {
        file: "File Information",
        download: "Download",
        delete: "Delete",
        update: "Rename",
      },
    },
    book: {
      title: "E-Book Management",
      number: "Number of Registered E-Books",
      restart: "Refresh",
      notSelect: "No Book Selected Yet!",
      bookField: {
        id: "Book ID",
        mid: "Resource ID",
        author: "Author",
        title: "Title",
        subject: "Summary",
        types: "Book Types",
        keywords: "Book Keywords",
        creator: "Source Program",
        creationDate: "Creation Time",
      },
      user_name: "Holder",
      user_number: "Number of Holders",
      edit_text: "Please Enter and Press Enter Key",
      edit_repeat: "The Entered Information Already Exists",
      op: {
        view: "Browse File",
        file: "View Holder",
        comment: "View Comment",
        book: "Browse Information",
        share: "View Shared",
        edit_type: "Edit Type",
        edit_keyword: "Edit Keyword",
      },
    },
    review: {
      title: "E-Book Sharing & Review",
      status: {
        WAIT: "Pending Review",
        AGREE: "Approved",
        REVOKE: "Rejected",
        NOT: "No Data Yet",
      },
      color: {
        WAIT: "info",
        AGREE: "success",
        REVOKE: "error",
      },
      view: "View {{field}}",
      op: "Operation",
      sharebookField: {
        id: "Share ID",
        check: "Check",
        file: "File",
        book: "E-book",
        browse: "Views",
        love: "Likes",
        status: "Audit Status",
        createdAt: "Created At",
        updateAt: "Updated At",
      },
      viewReview: {
        create: "Submit Application",
        review: "Check and Handle",
        message: "Please carefully check the information submitted by the user",
        finish: "Audit Decision",
        completed: "Audit completed and can be continued",
        Continue: "Continue",
        Finish: "Finish",
        BACK: "Previous",
        LastStep: "Last Step!",
        RESET: "Reset",
        review_message: "Audit Information",
      },
    },
  },

  TreeView: {
    Folder: "Folder",
    File: "File",
    PDF: "PDF",
    Topic: "Topic",
    Note: "Note",
    Copy: "Copy name: {{name}}",
    Add: "Create {{type}}",
    Delete: "Delete {{type}}",
    Move: "Move {{type}}",
    Rename: "Rename {{type}}",
    Upload: "Upload {{type}}",
    Share: "Share {{type}}",
    Open: "Open {{type}}",
    Input: "Please enter {{type}} name",
    Tip: "Please be careful, {{type}} cannot be recovered once deleted!",
    YES: "Yes, {{opt}}",
    NO: "No",
    search: "Search...",
    opt: {
      Add: "Create",
      Delete: "Delete",
      Move: "Move",
      Rename: "Rename",
      Upload: "Upload",
      Update: "Update",
      Share: "Share",
      Open: "Open",
    },
  },
  comment: {
    comment: "Comments",
    notComment: "No comments yet",
    notComment_msg: "Be the first to comment",
    newCommnet: "Add a comment",
    addComment: "Add a comment",
    deleteComment: "Delete comment",
    myself: "Myself",
  },
  read: {
    read: "Read",
    addBook: "Add to library",
    downloadBook: "Download book",
    selectTexts: "Select text",
    files: "Files",
    outline: "Outline",
    notes: "Notes",
    topic: "Topic",
  },
  topic: {
    default: "Default topic",
  },
  note: {
    title: "Note",
    question: "Question",
    answer: "Answer",
    label: "Label",
    cancel: "Cancel",
    save: "Save",
  },
  fsrs: {
    config: "FSRS Scheduling Configuration",
    request_retention: "Memory Probability",
    request_retention_full:
      "Represents the probability of the target memory you want. Note that there is a trade-off between higher retention rates and higher repetition rates. It is recommended that you set this value between 0.8 and 0.9.",
    enable_fuzz: "Enable Fuzz",
    enable_fuzz_full:
      "When enabled, this adds a small random delay to the new interval time to prevent cards from sticking together and always being reviewed on the same day.",
    on: "On",
    off: "Off",
    maximum_interval: "Maximum Interval Days",
    maximum_interval_full:
      "The maximum number of days between reviews of a card. When the review interval of a card reaches this number of days, the 'hard', 'good', and 'easy' intervals will be consistent. The shorter the interval, the more workload.",
    easy_bonus: "Easy Factor",
    easy_bonus_full:
      "When a review card is answered 'easy', an additional multiplier is applied to the interval time.",
    hard_factor: "Hard Factor",
    hard_factor_full: `When a review card is answered 'hard', an additional multiplier is applied to the interval time.`,
    w: "FSRS Optimizer Weights",
    w_full:
      "Weights created by running the FSRS optimizer. By default, these are calculated from a sample dataset.",
  },
  card: {
    title: "FSRS Spaced Repetition System",
    new: "New",
    learning: "Learning",
    relearning: "Relearning",
    review: "Review",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    start: "Start Learning",
    answer_is_empty: "When do you want to see this card again?",
    show: "Show Answer",
    day: "day",
    min: "min",
    done: "You have completed today's plan!",
    Rating: {
      Again: "Again",
      Hard: "Hard",
      Good: "Good",
      Easy: "Easy",
    },
    Rating_color: {
      Again: "error",
      Hard: "warning",
      Good: "success",
      Easy: "info",
    },
    State_color: {
      New: "inherit",
      Learning: "info",
      Relearning: "error",
      Review: "success",
    },
    log: {
      review_day: "Review Day",
      state: "State",
      rating: "Rating",
      scheduled_day: "Scheduled Day",
    },
  },
};

export default customEnglishMessages;
