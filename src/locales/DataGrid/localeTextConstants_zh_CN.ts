import { GridLocaleText } from "@mui/x-data-grid";

export const GRID_DEFAULT_LOCALE_TEXT_ZH_CN: GridLocaleText = {
  // Root
  noRowsLabel: "没有数据",
  noResultsOverlayLabel: "没有找到结果",

  // Density selector toolbar button text
  toolbarDensity: "密度",
  toolbarDensityLabel: "密度",
  toolbarDensityCompact: "紧凑",
  toolbarDensityStandard: "标准",
  toolbarDensityComfortable: "舒适",

  // Columns selector toolbar button text
  toolbarColumns: "列",
  toolbarColumnsLabel: "选择列",

  // Filters toolbar button text
  toolbarFilters: "过滤器",
  toolbarFiltersLabel: "显示过滤器",
  toolbarFiltersTooltipHide: "隐藏过滤器",
  toolbarFiltersTooltipShow: "显示过滤器",
  toolbarFiltersTooltipActive: (count) => `${count}个过滤器`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "搜索…",
  toolbarQuickFilterLabel: "搜索",
  toolbarQuickFilterDeleteIconLabel: "清理",

  // Export selector toolbar button text
  toolbarExport: "导出",
  toolbarExportLabel: "导出",
  toolbarExportCSV: "下载为CSV",
  toolbarExportPrint: "打印",
  toolbarExportExcel: "下载为Excel",

  // Columns panel text
  columnsPanelTextFieldLabel: "查找列",
  columnsPanelTextFieldPlaceholder: "列标题",
  columnsPanelDragIconLabel: "重新排序列",
  columnsPanelShowAllButton: "显示所有",
  columnsPanelHideAllButton: "隐藏所有",

  // Filter panel text
  filterPanelAddFilter: "添加过滤器",
  filterPanelDeleteIconLabel: "删除",
  // filterPanelLogicOperator: 'Logic operator',
  filterPanelOperators: "操作符",
  filterPanelOperatorAnd: "与",
  filterPanelOperatorOr: "或",
  filterPanelColumns: "列",
  filterPanelInputLabel: "值",
  filterPanelInputPlaceholder: "过滤值",

  // Filter operators text
  filterOperatorContains: "包含",
  filterOperatorEquals: "相等",
  filterOperatorStartsWith: "开始于",
  filterOperatorEndsWith: "结束于",
  filterOperatorIs: "是",
  filterOperatorNot: "不是",
  filterOperatorAfter: "在之后",
  filterOperatorOnOrAfter: "在之后(包含)",
  filterOperatorBefore: "在之前",
  filterOperatorOnOrBefore: "在之前(包含)",
  filterOperatorIsEmpty: "为空",
  filterOperatorIsNotEmpty: "不为空",
  filterOperatorIsAnyOf: "是任何的",

  // Filter values text
  filterValueAny: "全部",
  filterValueTrue: "真",
  filterValueFalse: "假",

  // Column menu text
  columnMenuLabel: "菜单",
  columnMenuShowColumns: "显示列",
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: "过滤",
  columnMenuHideColumn: "隐藏列",
  columnMenuUnsort: "取消排序",
  columnMenuSortAsc: "按升序排序(ASC)",
  columnMenuSortDesc: "按降序排序(DESC)",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count}个过滤器`,
  columnHeaderFiltersLabel: "显示过滤器",
  columnHeaderSortIconLabel: "排序",

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} 选择的行数`
      : `${count.toLocaleString()} 行被选中`,

  // Total row amount footer text
  footerTotalRows: "总行数:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `第${visibleCount.toLocaleString()}条数据, 总共${totalCount.toLocaleString()}数据`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "复选框选择",
  checkboxSelectionSelectAllRows: "全选",
  checkboxSelectionUnselectAllRows: "取消全选",
  checkboxSelectionSelectRow: "选择行",
  checkboxSelectionUnselectRow: "取消选择行",

  // Boolean cell text
  booleanCellTrueLabel: "是",
  booleanCellFalseLabel: "否",

  // Actions cell more text
  actionsCellMore: "更多",

  // Column pinning text
  pinToLeft: "固定在左边",
  pinToRight: "固定在右边",
  unpin: "取消固定",

  // Tree Data
  treeDataGroupingHeaderName: "组",
  treeDataExpand: "查看子节点",
  treeDataCollapse: "隐藏子节点",

  // Grouping columns
  groupingColumnHeaderName: "组",
  groupColumn: (name) => `按${name}分组`,
  unGroupColumn: (name) => `停止按${name}分组`,

  // Master/detail
  detailPanelToggle: "切换细节面板",
  expandDetailPanel: "展开",
  collapseDetailPanel: "折叠",

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: "重新排序行",

  // Aggregation
  aggregationMenuItemHeader: "聚合",
  aggregationFunctionLabelSum: "求和",
  aggregationFunctionLabelAvg: "平均",
  aggregationFunctionLabelMin: "最小",
  aggregationFunctionLabelMax: "最大",
  aggregationFunctionLabelSize: "大小",
  errorOverlayDefaultLabel: "",
  filterPanelLinkOperator: "",
};
