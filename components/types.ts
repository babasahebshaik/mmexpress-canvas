export interface Reflect {
  signkey: number;
  refldate: number;
  refltfore: number;
  refltback: number;
  updated_signkey: number;
  updated_refldate: number;

  updated_refltfore: number;
  updated_refltback: number;
  record_inserted: number;
  record_updated: number;
}

export enum ReportType {
  NO_PASSING_ROUTE_REPORT = "NO_PASSING_ROUTE_REPORT",
  NO_PASSING_ROUTE_REPORT_IFRAME = "NO_PASSING_ROUTE_REPORT_IFRAME",
  NO_PASSING_ROUTE_GRAPHICAL_ZONES_REPORT = "NO_PASSING_ROUTE_GRAPHICAL_ZONES_REPORT",
  NO_PASSING_ROUTE_GRAPHICAL_REPORT_IFRAME = "NO_PASSING_ROUTE_GRAPHICAL_REPORT_IFRAME",
  NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_CURRENT_BASE_REPORT = "NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_CURRENT_BASE_REPORT",
  NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_RECOMMENDED_BASE_REPORT = "NO_PASSING_ROUTE_GRAPHICAL_ZONES_COMPARISON_RECOMMENDED_BASE_REPORT",
  POPULATE_PASSZONE = "POPULATE_PASSZONE",
  SIGN_CONTROL_EXPRESS_PORTRAIT = "SIGN_CONTROL_EXPRESS_PORTRAIT",
  SIGN_CONTROL_EXPRESS_LANDSCAPE = "SIGN_CONTROL_EXPRESS_LANDSCAPE",
  PROJECT_ROUTE_REPORT = "PROJECT_ROUTE_REPORT",
  PROJECT_NO_PASSING_GRAPHICAL_ZONES_REPORT = "PROJECT_NO_PASSING_ZONE_REPORT",
  REPORT_PROJECT_ROUTE_REPORT = "REPORT_PROJECT_ROUTE_REPORT",
  REPORT_PROJECT_NO_PASSING_GRAPHICAL_ZONES_REPORT = "REPORT_PROJECT_NO_PASSING_ZONE_REPORT",
}

export interface ReportGenerationRequest {
  reportType: ReportType;
  data: unknown;
}
export interface BaseReportDataRequest {
  dbFile: string;
  reportType: ReportType;
}
export interface ReportDataRequest extends BaseReportDataRequest {
  sqlStatement: string;
  orderedBy: string;
}

export interface SignReportDataRequest extends BaseReportDataRequest {
  sqlStatement: string;
  orderedBy: string;
}

export interface GraphicalReportDataRequest extends BaseReportDataRequest {
  npZones: string;
  controls: string;
  routesArray: string;
  orderedBy: string;
  controlPoints: string;
}

export interface GraphicalReportDataRequestNew extends BaseReportDataRequest {
  npZones: string;
  controls: string;
  routesArray: string;
  orderedBy: string;
  controlPoints: string;
  sortOrder: string;
  routeFilter: string;
  pendingWhereQuery: string;
  controlFilter: string;
  noPassFilter: string;
  ctrlPtBegin: number;
  ctrlPtEnd: number;
  scaleSize: number;
  studyType: string;
}

export interface NoPassingReportData {
  reportType: string;
  agency: Agency;
  orderBy: OrderBy;
  sortOrder: string;
  routeFilter: string;
  pendingWhereQuery: string;
  controlFilter: string;
  noPassFilter: string;
  ctrlPtBegin: string;
  ctrlPtEnd: string;
  scaleSize: number | ScaleSizeM;
  controlsArr: ControlsArrEntity[];
  npZonesArr: NpZonesArrEntity[];
  noPassTypes: NoPassTypesEntity[];
  routesArr: RoutesArrEntity[];
  routesNumArr: RoutesNumArrEntity[];
  studyType: string;
  stripeGapRatio: {
    stripeLen: number;
    gapLen: number;
  };
}
export interface Agency {
  agencyName: string;
}

export interface ScaleSizeM {
  scaleSize: number;
}
export interface OrderBy {
  orderedBy: string;
}
export interface ControlsArrEntity {
  GroupLabel: string;
  children?: ChildrenEntity[] | null;
}
export interface ChildrenEntity {
  name: string;
  route: string;
  min_log_point?: null;
  max_log_point?: null;
  npProjectTitle?: null;
  dir_route: number;
  ctrl_id: number;
  rtecode: string;
  log_point: number;
  descript: string;
  survey_dte?: number | null;
  memcontrol: string;
  side: string;
  dict_type: number;
  gps_lat: string;
  gps_lon: string;
  gps_alt: string;
  effdate?: number | null;
  endeffdate?: null;
  upduser?: string | null;
  record_inserted: number;
  record_updated: number;
  Type: string;
}
export interface NpZonesArrEntity {
  GroupLabel: string;
  children?: ChildrenEntity1[] | null;
}
export interface NpZonesDiffArrEntity {
  GroupLabel: string;
  currentChildren: ChildrenEntity1[] | undefined;
  recommendedChildren: ChildrenEntity1[] | undefined;
}
export interface ChildrenEntity1Compare extends ChildrenEntity1 {
  type: string;
  print_beg: boolean;
  print_end: boolean;
  zonelength: boolean;
}
export interface ChildrenEntity1 {
  name: string;
  route: string;
  dir_route: number;
  min_log_point?: null;
  max_log_point?: null;
  npProjectTitle?: null;
  rtecode: string;
  NPZoneKey: number;
  b_trulog: number;
  e_trulog: number;
  zone_code: string;
  s_date: number;
  study_type: string;
  zone_orig?: string | null;
  effdate: number;
  endeffdate?: null;
  upduser?: string | null;
  beg_lat: number;
  beg_lon: number;
  beg_alt: number;
  end_lat: number;
  end_lon: number;
  end_alt: number;
  record_inserted: number;
  record_updated: number;
  type?: string | null;
  print_beg?: boolean;
  print_end?: boolean;
  zonelength?: boolean;
  inExcluded?: boolean;
}
export interface NoPassTypesEntity {
  descript: string;
}
export interface RoutesArrEntity {
  RouteCode: string;
  Route: string;
  Name: string;
  DirectionIndex: number;
  Direction: string;
  RouteType?: string | null;
  Primary1: string;
  Secondary: string;
  Tertiary: string;
  Comments: string;
}
export interface RoutesNumArrEntity {
  Route: string;
}
