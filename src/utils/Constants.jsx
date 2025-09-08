export const stateIniti = {
  DOB: "",
  Age: "",
  AgeYear: "",
  AgeDays: "",
  AgeMonth: "",
  RateID: 0,
  TotalAgeInDays: "",
  Title: "Mr.",
  FirstName: "",
  LastName: "",
  MiddleName: "",
  CentreID: "",
  Mobile: "",
  PinCode: "",
  State: "",
  Country: "1",
  Email: "",
  City: "",
  HouseNo: "",
  StreetName: "",
  Locality: "",
  Phone: "",
  Gender: "Male",
  isVIP: 0,
  IsMask: 0,
  PatientCode: "",
  PageName: "PatientRegistration",
  BarcodeNo: "",
  ProEmployee: "",
  OPDIPD: "",
  AutoEmail: 1,
  HMIS_PatCrNo: "",
  hmis_request_type: "",
  hmis_patCrNo: "",
  hmis_hospital_code: "",
  poct_facility_id: "",
  hmis_episode_code: "",
  hmis_episode_visitno: "",
  throughHmis: 0,
  PreBookingNo: "",
  throughHC: 0,
};
export const LTDataIniti = {
  TypeOfTnx: "OPD-LAB",
  NetAmount: "",
  GrossAmount: "",
  Date: "",
  IsCredit: 0,
  PName: "",
  Age: "",
  Gender: "",
  VIP: "0",
  LedgerTransactionIDHash: "",
  Remarks: "",
  Guid: "",
  ReferRate: "1",
  CentreName: "",
  DiscountType: 1,
  DoctorID: "1",
  DoctorName: "Self",
  SecondReferDoctor: "",
  DoctorMobile: "",
  DoctorEmail: "",
  ReferLabId: "",
  ReferLabName: "",
  ReferLab: 0,
  OtherReferLab: "",
  CardNo: "",
  CentreID: "",
  RateTypeId: "",
  Adjustment: "",
  AdjustmentDate: "",
  isDocumentUploaded: 0,
  PatientIDProof: "",
  PatientIDProofNo: "",
  PatientSource: "",
  PatientType: "",
  VisitType: 1,
  HLMPatientType: "OPD",
  HLMOPDIPDNo: "",
  reVisit: 0,
  Source: "",
  isAllowPrint: 0,
  CollectionBoyId: "",
  ReportDeliveryMethodId: "",
  ReportDeliveryMethodDetail: "",
  MedicalHistoryCount: 0,
  UploadDocumentCount: 0,
  IsMedicalHistory: "",
  IsDocumentUploaded: "",
  RegistrationDate: new Date(),
  SrfId: "",
  IcmrId: "",
  IsConcern: "",
  HideAmount: "",
  CashRendering: "",
  Return: "",
  Nationality: "",
  ID_Passport: "",
  HLMUHID: "",
  OPDIPD: "",
  DiscountApprovedBy: "",
  DiscountOnTotal: "",
  DiscountId: "",
  DiscountReason: "",
  Category: "",
  HisBillNo: "",
  BedNo: "",
};
export const DISCOUNT_TYPE = [
  { label: "EmployeeWise", value: 1 },
  { label: "Discount Type Wise", value: 2 },
];
export const SampleStatusSearch = [
  {
    label: "Sample Not Collected",
    value: 1,
    status: true,
  },
  {
    label: "Collected",
    value: 2,
    status: true,
  },
  {
    label: "Received",
    value: 3,
    status: true,
  },
  {
    label: "Rejected",
    value: 4,
    status: true,
  },
];
export const SearchBy = [
  { label: "Select", value: "" },
  { label: "BarcodeNo", value: "BarcodeNo" },
  { label: "Mobile", value: "Mobile" },
  { label: "UHID", value: "PatientCode" },
  { label: "PatientName", value: "PatientName" },
  { label: "VisitNo", value: "VisitNo" },
  { label: "PrebookingID", value: "PrebookingID" },
  // { label: "H/CY/GPNo", value: "H/CY/GPNo" },
];

export const LabelDetailOptions = [
  { label: "Below the Test", value: "B" },
  { label: "Right Side of the Test", value: "R" },
  { label: "Seperate Column", value: "S" },
];

export const TextAlignValue = [
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
  { label: "Center", value: "Center" },
];

export const NoOfPricks = [
  { label: "Select", value: "" },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];
export const SampleSource = [
  {
    label: "Left Arm",
    value: "Left Arm",
  },
  {
    label: "Right Arm",
    value: "Right Arm",
  },
];

export const DateTypeSearch = [
  { label: "Registration Date", value: "ivac.dtEntry" },
  { label: "Received Date", value: "ivac.ReceiveDate" },
];
export const DateTypeSearch2 = [
  { label: "Registration Date", value: "Date" },
  { label: "Received Date", value: "ReceiveDate" },
];
export const SampleStatus = [
  { label: "All", value: "", status: true },
  { label: "Not Collected", value: "1", status: true },
  { label: "Collected", value: "2", status: true },
  { label: "Receive", value: "3", status: true },

  { label: "Mac Data", value: "13", status: true },
  { label: "Rejected", value: "4", status: true },
  { label: "Result Done", value: "10", status: true },

  { label: "Dual Authentication", value: "20", status: true },
  { label: "Approved", value: "5", status: true },
  { label: "Hold", value: "11", status: true },
  { label: "Re-Run", value: "14", status: true },
  // { label: "Dispatched", value: "15", status: true },
  { label: "Printed", value: "6", status: true },
  { label: "OutSource", value: "18", status: true },
];
export const ActiveDoctor = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "In-Active",
    value: "0",
  },
];
export const Flag = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal", value: "Abnormal" },
];

export const Order = [
  { label: "DESC", value: "DESC" },
  { label: "ASC", value: "ASC" },
];

export const StatusCheck = {
  10: "Save",
  5: "Approve",
  11: "Hold",
  6: "Approve",
  20: "Dual Authenticated",
};

export const workSheetSampleStatus = [
  { label: "All", value: "", status: true },
  { label: "Not Collected", value: "1", status: true },
  { label: "Collected", value: "2", status: true },
  { label: "Receive", value: "3", status: true },

  { label: "Mac Data", value: "13", status: true },
  { label: "Rejected", value: "4", status: true },
  { label: "Result Done", value: "10", status: true },

  { label: "Dual Authentication", value: "20", status: true },
  { label: "Approved", value: "5", status: true },
  { label: "Hold", value: "11", status: true },
  { label: "Re-Run", value: "14", status: true },
  // { label: "Dispatched", value: "15", status: true },
  { label: "Printed", value: "6", status: true },
  { label: "OutSource", value: "18", status: true },
];
export const Status = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Approval",
    value: "1",
  },
];
export const SearchByCulture = [
  { label: "Select", value: "" },
  { label: "BarcodeNo", value: "pli.BarcodeNo" },
  { label: "Mobile", value: "pm.mobile" },
  { label: "PatientCode", value: "lt.PatientCode" },
  { label: "PatientName", value: "lt.PName" },
  { label: "VisitNo", value: "pli.LedgertransactionNo" },
];
export const ReportTypePreliminary = [
  { label: "Preliminary 1", value: "Preliminary 1" },
  { label: "Preliminary 2", value: "Preliminary 2" },
  { label: "Preliminary 3", value: "Preliminary 3" },
  { label: "Final Report", value: "Final Report" },
];
export const PayBy = [
  {
    label: "Patient",
    value: 0,
  },
  {
    label: "Corporate",
    value: 1,
  },
];
export const AgainstInvoice = [
  {
    label: "Select Invoice Type",
    value: "",
  },
  {
    label: "Against Invoice",
    value: 1,
  },
  {
    label: "Against/Rolling Advanced",
    value: 2,
  },
];

export const BillingCycle = [
  {
    label: "Weekly",
    value: "Weekly",
  },
  {
    label: "15 Days",
    value: "15 Days",
  },
  {
    label: "Monthly",
    value: "Monthly",
  },
];
export const CompanyBillingCycle = [
  {
    label: "Monthly",
    value: "1",
  },

  {
    label: "Quaterly",
    value: "3",
  },
  {
    label: "HalfYearly",
    value: "4",
  },
  {
    label: "Yearly",
    value: "5",
  },
];
export const GraceTime = [
  {
    label: "Select GraceTime in Days",
    value: "",
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
  {
    label: 5,
    value: 5,
  },
  {
    label: 6,
    value: 6,
  },
  {
    label: 7,
    value: 7,
  },
];
export const PaymentMode = [
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Credit",
    value: "Credit",
  },
];
export const DataType = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Package",
    value: "Package",
  },
  {
    label: "Profile",
    value: "Profile",
  },
  {
    label: "Test",
    value: "Test",
  },
];
export const ReportTypeNew = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Numeric",
    value: "1",
  },
  {
    label: "Memo",
    value: "2",
  },
  {
    label: "Ms-Word",
    value: "3",
  },
  // {
  //   label: "Histo-Type",
  //   value: "4",
  // },
];
export const SampleOption = [
  {
    label: "Sample Not Required",
    value: "Sample Not Required",
  },
  {
    label: "Sample Required",
    value: "Sample Required",
  },
];

export const InestigationRange = {
  InvestigationID: "",
  LabObservationID: "",
  Gender: "",
  FromAge: "",
  ToAge: "",
  MinReading: "",
  MaxReading: "",
  DisplayReading: "",
  DefaultReading: "",
  MinCritical: "",
  MaxCritical: "",
  ReadingFormat: "",
  Interpretation: "",
  MacID: "",
  MethodName: "",
  ShowMethod: "",
  CentreID: "",
  AbnormalValue: "",
  RangeType: "",
  AutoApprovedMin: "",
  AutoApprovedMax: "",
  AMRMin: "",
  AMRMax: "",
  ReflexMin: 0,
  ReflexMax: 0,
  RoundOff: 0,
  DlcCheck: "",
  isActive: 1,
};

export const RoundOff = [
  {
    label: -1,
    value: -1,
  },
  {
    label: 0,
    value: 0,
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
];
// export const Theme = [
//   {
//     label: "Default",
//     value: "",
//     color: "#326fd1",
//   },
//   {
//     label: "Grey",
//     value: "grey",
//     color: "#666866",
//   },
//   {
//     label: "Brown",
//     value: "brown",
//     color: "#8b2424",
//   },
//   {
//     label: "Blue",
//     value: "blue",
//     color: "#03a0e7",
//   },
//   {
//     label: "Pale Pink",
//     value: "palePink",
//     color: "#f78e8e",
//   },
//   {
//     label: "Peach",
//     value: "peach",
//     color: "#bc8f3c",
//   },
//   {
//     label: "Green",
//     value: "green",
//     color: "#22d8a9",
//   },
// ];
export const Theme = [
  {
    theme: "default_theme",
    icon: "default_icon",
    label: "Default",
    value: "default_theme",
  },
  {
    theme: "peach_theme",
    icon: "peach_icon",
    label: "Peach",
    value: "peach_theme",
  },
  {
    theme: "pale_pink_theme",
    icon: "pale_pink_icon",
    label: "Pale Pink",
    value: "pale_pink_theme",
  },
  {
    theme: "red_theme",
    icon: "red_icon",
    label: "Red",
    value: "red_theme",
  },
  {
    theme: "sky_blue_theme",
    icon: "sky_blue_icon",
    label: "Sky Blue",
    value: "sky_blue_theme",
  },
  {
    theme: "light_blue_theme",
    icon: "light_blue_icon",
    label: "Lite Blue",
    value: "light_blue_theme",
  },
  {
    theme: "pink_theme",
    icon: "pink_icon",
    label: "Pink",
    value: "pink_theme",
  },
  {
    theme: "purple_theme",
    icon: "purple_icon",
    label: "Purple",
    value: "purple_theme",
  },
  {
    theme: "gray_theme",
    icon: "gray_icon",
    label: "Gray",
    value: "gray_theme",
  },
  {
    theme: "pastel_pink_theme",
    icon: "pastel_pink_icon",
    label: "Pastel Pink",
    value: "pastel_pink_theme",
  },
  {
    theme: "light_peach_theme",
    icon: "light_peach_icon",
    label: "Lite Peach",
    value: "light_peach_theme",
  },
  {
    theme: "pale_peach_theme",
    icon: "pale_peach_icon",
    label: "Pale Peach",
    value: "pale_peach_theme",
  },
  {
    theme: "pale_yellow_theme",
    icon: "pale_yellow_icon",
    label: "Pale Yellow",
    value: "pale_yellow_theme",
  },
  {
    theme: "pale_green_theme",
    icon: "pale_green_icon",
    label: "Pale Green",
    value: "pale_green_theme",
  },
  {
    theme: "light_celadon_theme",
    icon: "light_celadon_icon",
    label: "Lite Celadon",
    value: "light_celadon_theme",
  },
  {
    theme: "pale_mint_theme",
    icon: "pale_mint_icon",
    label: "Pale Mint",
    value: "pale_mint_theme",
  },
  {
    theme: "pale_aqua_theme",
    icon: "pale_aqua_icon",
    label: "Pale Aqua",
    value: "pale_aqua_theme",
  },
  {
    theme: "pale_lavender_blue_theme",
    icon: "pale_lavender_blue_icon",
    label: "Pale Lavender Blue",
    value: "pale_lavender_blue_theme",
  },
  {
    theme: "pale_gray_theme",
    icon: "pale_gray_icon",
    label: "Pale Gray",
    value: "pale_gray_theme",
  },
  {
    theme: "pale_mauve_theme",
    icon: "pale_mauve_icon",
    label: "Pale Mauve",
    value: "pale_mauve_theme",
  },
  {
    theme: "lavender_blush_theme",
    icon: "lavender_blush_icon",
    label: "Lavender Blush",
    value: "lavender_blush_theme",
  },
  {
    theme: "pale_rose_theme",
    icon: "pale_rose_icon",
    label: "Pale Rose",
    value: "pale_rose_theme",
  },
  {
    theme: "lite_pale_theme",
    icon: "lite_pale_icon",
    label: "Lite Pale Pink",
    value: "lite_pale_theme",
  },
  {
    theme: "blush_pink_theme",
    icon: "blush_pink_Icon",
    label: "Blush Pink",
    value: "blush_pink_theme",
  },
  {
    theme: "light_pink_theme",
    icon: "light_pink_Icon",
    label: "Lite Pink",
    value: "light_pink_theme",
  },
];

export const TypeData = [
  {
    label: "As On Date",
    value: "1",
  },
  {
    label: "From Date To Date ",
    value: "2",
  },
  {
    label: "Date Wise Trend (Closing Balance)",
    value: "3",
  },
];

export const RADIOADVANCEINPUT = [
  {
    value: "1",
    label: "Deposit",
  },
  {
    value: "2",
    label: "Credit Note",
  },
  {
    value: "3",
    label: "Debit Note",
  },
];
export const MicroBioMaster = [
  { label: "Organism", value: "2" },
  { label: "Antibiotic", value: "4" },
];
export const SelectType = [
  // {
  //   label: "Select",
  //   value: "Select",
  // },
  {
    label: "PrePaid",
    value: "PrePaid",
  },
  {
    label: "PostPaid",
    value: "PostPaid",
  },
];

export const NoofRecord = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
  { label: "60", value: "60" },
  { label: "70", value: "70" },
  { label: "80", value: "80" },
  { label: "90", value: "90" },
  { label: "100", value: "100" },
];
export const Showonly = [
  {
    label: "Synced Data",
    value: "1",
  },
  {
    label: "Pending Data",
    value: "0",
  },
];

export const Active = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Deactive",
    value: "0",
  },
];
export const ActiveTemplateID = [{ label: "Active", value: "1" }];
export const DDLData = [
  {
    label: "",
    value: "",
  },

  {
    label: "PatientName",
    value: "PatientName",
  },
  {
    label: "Age",
    value: "Age",
  },
  {
    label: "Mobile",
    value: "Mobile",
  },
  {
    label: "Bill",
    value: "Bill",
  },
  {
    label: "Date",
    value: "Date",
  },
  {
    label: "Address",
    value: "Address",
  },
  {
    label: "Centre",
    value: "Centre",
  },
  {
    label: "PatientCode",
    value: "PatientCode",
  },
  {
    label: "ReferedBy",
    value: "ReferedBy",
  },
  {
    label: "VisitNo",
    value: "VisitNo",
  },
  {
    label: "CentreContactNo",
    value: "CentreContactNo",
  },
  {
    label: "CentreAddress",
    value: "CentreAddress",
  },
  {
    label: "CreatedBy",
    value: "CreatedBy",
  },
  {
    label: "Collector",
    value: "Collector",
  },
  {
    label: "Ph.",
    value: "Phone",
  },
  {
    label: "Mail",
    value: "Mail",
  },
  {
    label: "Web",
    value: "web",
  },
  {
    label: "company",
    value: "company",
  },
  {
    label: "Qrcode",
    value: "Qrcode",
  },
  {
    label: "Department Of",
    value: "Department Of",
  },
  {
    label: "PoweredBy",
    value: "PoweredBy",
  },
];
export const DDLDataDepartment = [
  {
    label: "",
    value: "",
  },

  {
    label: "Department Of",
    value: "Department Of",
  },
];
export const Dynamic = {
  Data: "",
  DynamicReportType: "Text",
  Height: "0",
  // ImageData: "",
  IsActive: "1",
  PositionLeft: "0",
  PositionTop: "0",
  Text: "",
  // fontSize: 10,
  TypePlaceHolder: "Header",
  Width: "0",
};
export const DynamicReportType = [
  {
    label: "Text",
    value: "Text",
  },
  {
    label: "Barcode",
    value: "Barcode",
  },

  {
    label: "HTML",
    value: "HTML",
  },

  {
    label: "PrintDateTime",
    value: "PrintDateTime",
  },
  {
    label: "NoOfPages",
    value: "NoOfPages",
  },
  {
    label: "Qrcode",
    value: "Qrcode",
  },
  {
    label: "Signature",
    value: "Signature",
  },
  {
    label: "Department",
    value: "Department",
  },
  {
    label: "PoweredBy",
    value: "PoweredBy",
  },
];

export const FontFamily = [
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman",
  },
  {
    label: "Calibri",
    value: "Calibri",
  },
  {
    label: "Verdana",
    value: "Verdana",
  },
];

export const LabelFontFamily = [
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman",
  },
  {
    label: "Calibri",
    value: "Calibri",
  },
  {
    label: "Verdana",
    value: "Verdana",
  },
];

export const NumericLabel = [
  {
    ID: 1,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Test Name ",
    LItalic: 1,
    LBold: 1,
    LUnderline: 0,
    LFontSize: "20",
    LFontFamily: "",
    LabelID: "TestName",
    Print: 0,
    Underline: 0,
  },
  {
    ID: 2,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Result Entry",
    LabelID: "ResultEntry",
    Print: 0,
    Underline: 0,
  },
  {
    ID: 3,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Flag",
    LabelID: "Flag",
    Print: 0,
    Underline: 0,
  },
  {
    ID: 4,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Ref. Range",
    LabelID: "Ref. Range",
    Print: 1,
    Underline: 0,
  },
  {
    ID: 5,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Unit",
    LabelID: "Unit",
    Print: 1,
    Underline: 0,
  },
  {
    ID: 6,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "SampleType",
    LabelID: "SampleType",
    Print: 1,
    Underline: 0,
    Position: "",
  },
  {
    ID: 7,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "MethodName",
    LabelID: "MethodName",
    Print: 1,
    Underline: 0,
    Position: "",
  },
  {
    ID: 8,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "",
    LabelID: "Test Heading",
    Print: "",
    Underline: 0,
  },
  {
    ID: 8,
    Bold: 1,
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "",
    LabelID: "Department",
    Print: "",
    Underline: 0,
  },
];

export const LableID = [
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Age/Gender",
    LabelID: "Age",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Mobile No.",
    LabelID: "Mobile",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "DeliveryMode",
    LabelID: "Bill",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Reg. Date",
    LabelID: "Date",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient Address.",
    LabelID: "Address",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Panel Name ",
    LabelID: "Centre",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "PatientCode",
    LabelID: "PatientCode",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Refered By ",
    LabelID: "ReferedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Lab No",
    LabelID: "VisitNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Centre Cont No",
    LabelID: "CentreContactNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "",
    LabelID: "CentreAddress",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "CreatedBy",
    LabelID: "CreatedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Collector",
    LabelID: "Collector",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "ICMRID",
    LabelID: "ICMRID",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "SRFID",
    LabelID: "SRFID",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
];
export const PageOrientation = [
  {
    label: "Portrait",
    value: "Portrait",
  },
  {
    label: "Landscape",
    value: "Landscape",
  },
];
export const PageSize = [
  {
    value: "A1",
    label: "A1",
  },

  {
    value: "A2",
    label: "A2",
  },

  {
    value: "A3",
    label: "A3",
  },

  {
    value: "A4",
    label: "A4",
  },

  {
    value: "A5",
    label: "A5",
  },

  {
    value: "A6",
    label: "A6",
  },
];
export const ReportType = [
  { label: "Lab Report", value: "Lab Report" },
  { label: "Bill", value: "Bill" },
  // { label: "TRF", value: "TRF" },
  // { label: "Department Slip", value: "Department Slip" },
];
export const TypePlaceHolder = [
  {
    label: "Header",
    value: "Header",
  },
  {
    label: "Page",
    value: "Page",
  },
  {
    label: "Footer",
    value: "Footer",
  },
];
export const MessageStatus = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Queued",
    value: "Queued",
  },
  {
    label: "Send",
    value: "Send",
  },
];
export const RoundUpTo = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

export const NoOfRecord = [
  {
    label: 5,
    value: Number(5),
  },
  {
    label: 10,
    value: Number(10),
  },
  {
    label: 20,
    value: Number(20),
  },
  {
    label: 50,
    value: Number(50),
  },
];

export const InvType = [
  {
    label: "Investigation",
    value: "Investigation",
  },
  {
    label: "InvestigationObservation",
    value: "InvestigationObservation",
  },

  {
    label: "InvestigationRange",
    value: "InvestigationRange",
  },
  {
    label: "InvestigationInterpretation",
    value: "InvestigationInterpretation",
  },
  {
    label: "InvestigationComment",
    value: "InvestigationComment",
  },
  {
    label: "InvestigationProfile",
    value: "InvestigationProfile",
  },
  {
    label: "InvestigationPackage",
    value: "InvestigationPackage",
  },
];

export const ManageDeliveryDaysType = [
  { label: "Investigation", value: 1 },
  { label: "Department", value: 2 },
  { label: "Urgent", value: 3 },
];

export const TimeSlots = [
  {
    label: "1-Slot",
    value: "1",
  },
  { label: "2-Slot", value: "2" },
  {
    label: "3-Slot",
    value: "3",
  },
  {
    label: "6-Slot",
    value: "6",
  },
];
export const AvgTimes = [
  { label: "15 min", value: "15" },
  {
    label: "30 min",
    value: "30",
  },
  { label: "60 min", value: "60" },
  {
    label: "120 min",
    value: "120",
  },
];
export const HCNewPatientForm = {
  Title: "Mr.",
  PName: "",
  HouseNo: "",
  StreetName: "",
  LocalityID: "",
  CityID: "",
  Pincode: "",
  StateID: "",
  MediaStreamAudioDestinationNode: "",
  CountryID: "",
  Phone: "",
  Mobile: "",
  Email: "",
  DOB: "",
  Age: "",
  AgeYear: "",
  AgeMonth: "",
  AgeDays: "",
  TotalAgeInDays: "",
  Gender: "Male",
  // CentreID: "1",
  IPAddress: "",
  PatientIDInterface: "",
  Patient_ID_create: "1",
  IsOnlineFilterData: "0",
  IsVIP: "0",
  IsMaskPatientGroupId: "0",
  IsMobileVerified: "0",
  IsEmailVerified: "0",
  isActive: "1",
  Landmark: "",
};

export const HCPaymentMode = [
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Credit Card",
    value: "Credit Card",
  },
  {
    label: "Debit Card",
    value: "Debit Card",
  },
  {
    label: "Online Payment",
    value: "Online Payment",
  },
  {
    label: "Mobile Wallet",
    value: "Mobile Wallet",
  },
  {
    label: "Credit",
    value: "Credit",
  },
];

export const Phelboweekoff = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuseday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];

export const PhelboSearchTypes = [
  {
    label: "Mobile",
    value: "Mobile",
  },
  { label: "Phelebo Code", value: "hpm.PhlebotomistID" },
  { label: "Name", value: "Name" },
  { label: "Email", value: "Email" },
  {
    label: "PanNo.",
    value: "PanNo.",
  },
];

export const Phelborecordoptions = [
  {
    label: 5,
    value: Number(5),
  },
  { label: 10, value: Number(10) },
  { label: 20, value: 20 },
  { label: 50, value: 50 },
  { label: 100, value: 100 },
];
export const Record = [
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 60, value: 60 },
  { label: 80, value: 80 },
  { label: 100, value: 100 },
  { label: 120, value: 120 },

  { label: 150, value: 150 },

  { label: 200, value: 200 },
];

export const PhelboSources = [
  {
    label: "Lab",
    value: "Lab",
  },
  { label: "Franchise", value: "Franchise" },
];

export const PhelbosearchDefault = {
  SearchType: "",
  SearchValue: "",
  NoOfRecord: 5,
  SearchGender: "",
  IsDeactivatePP: "1",
  SearchState: "",
  SearchCity: "",
  // employeeMaster:'',
};

export const SkipTimeType = [
  {
    label: "NA",
    value: "0",
  },
  { label: "Skip Hour", value: "1" },
  { label: "Skip Day", value: "2" },
  { label: "Skip Week", value: "3" },
  { label: "Skip Month", value: "4" },
  { label: "Real Time", value: "5" },
];

export const InputFields = [
  {
    label: "Input Type",
    value: "",
  },
  {
    label: "TextBox",
    value: "TextBox",
  },
  {
    label: "CheckBox",
    value: "CheckBox",
  },
  {
    label: "DropDown",
    value: "DropDown",
  },
];

export const Temptype = [
  {
    label: "MicroScopic",
    value: "MicroScopic",
  },
  {
    label: "Gross",
    value: "Gross",
  },
  {
    label: "Impression",
    value: "Impression",
  },
];
export const HistoSeries = [
  {
    label: "H-",
    value: "H",
  },
  {
    label: "CY-",
    value: "CY",
  },
  {
    label: "GP-",
    value: "GP",
  },
];
export const IsActive = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Active",
    value: 1,
  },
  {
    label: "InActive",
    value: 0,
  },
];
export const FilterPageType = [
  {
    label: "ResultEntry",
    value: "ResultEntry",
  },
  {
    label: "DispatchReport",
    value: "DispatchReport",
  },
  {
    label: "ReceiptReprint",
    value: "Reprint",
  },
  {
    label: "ResultEntryFilter",
    value: "ResultEntryFilter",
  },
];
export const SelectAccredition = [
  {
    value: "0",
    label: "--Select Accredition--",
  },
  {
    value: "3",
    label: "CAP",
  },
  {
    value: "1",
    label: "NA",
  },
  {
    value: "2",
    label: "NABL",
  },
  {
    value: "4",
    label: "NABL+CAP",
  },
  {
    value: "5",
    label: "Not in Scope",
  },
];

export const All_Zero = [
  {
    label: "All/Zero Rate",
    value: "1",
  },
  {
    label: "Zero Rate Only",
    value: "2",
  },
];

export const ChangeRateDDL = [
  // {
  //   label: "ChangeRateDDL",
  //   value: "0",
  // },
  {
    label: "-",
    value: "1",
  },
  {
    label: "+",
    value: "2",
  },
];

export const HeaderConfiguration = [
  {
    ID: 1,
    Name: "LabObservationName",
    Label: "Test Description",
    printOrder: 1,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 280,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 2,
    Name: "Value",
    Label: "Value(s)",
    printOrder: 2,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 130,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 3,
    Name: "DisplayReading",
    Label: "Reference Range",
    printOrder: 4,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 150,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 4,
    Name: "MethodName",
    Label: "Method",
    printOrder: 5,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 0,
    P_forecolor: "Black",
    Width: 140,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 5,
    Name: "InvName",
    Label: "Investigation Name",
    printOrder: 1,
    Fname: "Arial",
    Fsize: 14,
    Bold: "Y",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 0,
    P_forecolor: "Black",
    Width: 700,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 6,
    Name: "Department",
    Label: "Department",
    printOrder: 1,
    Fname: "Arial",
    Fsize: 14,
    Bold: "Y",
    Italic: "N",
    Under: "N",
    Alignment: "Centre",
    leftadd: 0,
    topadd: 0,
    Print: 0,
    P_forecolor: "Black",
    Width: 700,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 7,
    Name: "Organism",
    Label: "ANTIBIOGRAM",
    printOrder: 1,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 430,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 8,
    Name: "Mic",
    Label: "MIC",
    printOrder: 3,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 0,
    P_forecolor: "Black",
    Width: 125,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 9,
    Name: "Sensitivity",
    Label: "Sensitivity",
    printOrder: 2,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 150,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 10,
    Name: "flag",
    Label: "Status",
    printOrder: 3,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 100,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 11,
    Name: "Unit",
    Label: "Unit(s)",
    printOrder: 3,
    Fname: "Arial",
    Fsize: 14,
    Bold: "N",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 1,
    P_forecolor: "Black",
    Width: 100,
    Height: 20,
    Updatedate: "\\N",
  },
  {
    ID: 12,
    Name: "SubHeader",
    Label: "SubHeader",
    printOrder: 1,
    Fname: "Arial",
    Fsize: 14,
    Bold: "Y",
    Italic: "N",
    Under: "N",
    Alignment: "Left",
    leftadd: 0,
    topadd: 0,
    Print: 0,
    P_forecolor: "Black",
    Width: 700,
    Height: 20,
    Updatedate: "\\N",
  },
];

export const Position = [
  { label: "Left", value: "Left" },
  { label: "Right", value: "Right" },
  { label: "Top", value: "Top" },
  { label: "Bottom", value: "Bottom" },
  { label: "Centre", value: "Centre" },
];
export const Color = [
  { label: "Black", value: "Black" },
  { label: "Red", value: "Red" },
  { label: "Green", value: "Green" },
  { label: "Blue", value: "Blue" },
  { label: "Yellow", value: "Yellow" },
  { label: "Orange", value: "Orange" },
  { label: "Purple", value: "Purple" },
  { label: "Pink", value: "Pink" },
  { label: "Brown", value: "Brown" },
  { label: "White", value: "White" },
];

export const PatientType = [
  {
    label: "All",
    value: "0",
  },
  {
    label: "Urgent",
    value: "1",
  },
];

export const MailStatuses = [
  {
    label: "Approved",
    value: "2",
  },
  {
    label: "Request For Mail",
    value: "0",
  },
  {
    label: "Mail Sent",
    value: "1",
  },
  {
    label: "Sending Failed",
    value: "-1",
  },
];

export const EmailType = [
  {
    label: "Lab Report",
    value: "1",
  },
  {
    label: "Patient Receipt",
    value: "2",
  },
];

export const Roles = [
  {
    label: "Client",
    value: "1",
  },
  {
    label: "Doctor",
    value: "3",
  },
  {
    label: "Patient",
    value: "2",
  },
];

export const fontName = [
  {
    label: "Aharoni",
    value: "Aharoni",
  },
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Arial",
    value: "Arial",
  },
];

export const fontSize = [
  {
    label: "8",
    value: "8",
  },
  {
    label: "9",
    value: "9",
  },
  {
    label: "10",
    value: "10",
  },
  {
    label: "11",
    value: "11",
  },
  {
    label: "12",
    value: "12",
  },
  {
    label: "13",
    value: "13",
  },
  {
    label: "14",
    value: "14",
  },
];

export const WorkOrderID = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Work Order ID",
    value: "WorkOrderID",
  },
  {
    label: "UHID No",
    value: "PatientCode",
  },
  {
    label: "Patient Name",
    value: "PatientName",
  },
  {
    label: "Mobile",
    value: "Mobile",
  },
];

export const festivals = [
  // 2025 Holidays
  {
    date: "2025-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2025-10-02",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2025-10-20",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
  {
    date: "2025-01-01",
    name: "New Year's Day",
    description: "Celebration of the new year.",
  },
  {
    date: "2025-01-13",
    name: "Lohri",
    description: "Harvest festival of Punjab.",
  },
  {
    date: "2025-01-14",
    name: "Makar Sankranti",
    description: "Sun's transition to Capricorn.",
  },
  {
    date: "2025-01-26",
    name: "Republic Day",
    description: "Commemoration of India's Constitution.",
  },
  {
    date: "2025-03-31",
    name: "Ramzan Id/Eid-ul-Fitar",
    description: "End of Ramadan celebration.",
  },
  {
    date: "2025-04-18",
    name: "Good Friday",
    description: "Commemoration of Jesus' crucifixion.",
  },
  {
    date: "2025-08-15",
    name: "Independence Day",
    description: "India's independence from Britain.",
  },
  {
    date: "2025-08-15",
    name: "Janmashtami",
    description: "Celebrating Lord Krishna's birth.",
  },
  {
    date: "2025-08-27",
    name: "Ganesh Chaturthi",
    description: "Celebration of Lord Ganesha.",
  },

  // 2026 Holidays
  {
    date: "2026-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2026-10-22",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2026-11-08",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
  {
    date: "2026-01-01",
    name: "New Year's Day",
    description: "Celebration of the new year.",
  },
  {
    date: "2026-01-13",
    name: "Lohri",
    description: "Harvest festival of Punjab.",
  },
  {
    date: "2026-01-14",
    name: "Makar Sankranti",
    description: "Sun's transition to Capricorn.",
  },
  {
    date: "2026-01-26",
    name: "Republic Day",
    description: "Commemoration of India's Constitution.",
  },
  {
    date: "2026-03-20",
    name: "Ramzan Id/Eid-ul-Fitar",
    description: "End of Ramadan celebration.",
  },
  {
    date: "2026-04-03",
    name: "Good Friday",
    description: "Commemoration of Jesus' crucifixion.",
  },
  {
    date: "2026-08-15",
    name: "Independence Day",
    description: "India's independence from Britain.",
  },
  {
    date: "2026-09-04",
    name: "Janmashtami",
    description: "Celebrating Lord Krishna's birth.",
  },
  {
    date: "2026-09-17",
    name: "Ganesh Chaturthi",
    description: "Celebration of Lord Ganesha.",
  },

  // 2027 Holidays
  {
    date: "2027-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2027-10-12",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2027-10-29",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
  {
    date: "2027-01-01",
    name: "New Year's Day",
    description: "Celebration of the new year.",
  },
  {
    date: "2027-01-13",
    name: "Lohri",
    description: "Harvest festival of Punjab.",
  },
  {
    date: "2027-01-14",
    name: "Makar Sankranti",
    description: "Sun's transition to Capricorn.",
  },
  {
    date: "2027-01-26",
    name: "Republic Day",
    description: "Commemoration of India's Constitution.",
  },
  {
    date: "2027-03-10",
    name: "Ramzan Id/Eid-ul-Fitar",
    description: "End of Ramadan celebration.",
  },
  {
    date: "2027-03-26",
    name: "Good Friday",
    description: "Commemoration of Jesus' crucifixion.",
  },
  {
    date: "2027-08-15",
    name: "Independence Day",
    description: "India's independence from Britain.",
  },
  {
    date: "2027-08-24",
    name: "Janmashtami",
    description: "Celebrating Lord Krishna's birth.",
  },
  {
    date: "2027-09-06",
    name: "Ganesh Chaturthi",
    description: "Celebration of Lord Ganesha.",
  },

  // 2028 Holidays
  {
    date: "2028-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2028-09-30",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2028-10-17",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
  {
    date: "2028-01-01",
    name: "New Year's Day",
    description: "Celebration of the new year.",
  },
  {
    date: "2028-01-13",
    name: "Lohri",
    description: "Harvest festival of Punjab.",
  },
  {
    date: "2028-01-14",
    name: "Makar Sankranti",
    description: "Sun's transition to Capricorn.",
  },
  {
    date: "2028-01-26",
    name: "Republic Day",
    description: "Commemoration of India's Constitution.",
  },
  {
    date: "2028-02-28",
    name: "Ramzan Id/Eid-ul-Fitar",
    description: "End of Ramadan celebration.",
  },
  {
    date: "2028-04-14",
    name: "Good Friday",
    description: "Commemoration of Jesus' crucifixion.",
  },
  {
    date: "2028-08-15",
    name: "Independence Day",
    description: "India's independence from Britain.",
  },
  {
    date: "2028-09-12",
    name: "Janmashtami",
    description: "Celebrating Lord Krishna's birth.",
  },
  {
    date: "2028-09-24",
    name: "Ganesh Chaturthi",
    description: "Celebration of Lord Ganesha.",
  },

  // 2029 Holidays
  {
    date: "2029-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2029-10-19",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2029-11-05",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
  {
    date: "2029-01-01",
    name: "New Year's Day",
    description: "Celebration of the new year.",
  },
  {
    date: "2029-01-13",
    name: "Lohri",
    description: "Harvest festival of Punjab.",
  },
  {
    date: "2029-01-14",
    name: "Makar Sankranti",
    description: "Sun's transition to Capricorn.",
  },
  {
    date: "2029-01-26",
    name: "Republic Day",
    description: "Commemoration of India's Constitution.",
  },

  // 2030 Holidays
  {
    date: "2030-10-02",
    name: "Gandhi Jayanti",
    description: "Mahatma Gandhi's birthday celebration.",
  },
  {
    date: "2030-10-08",
    name: "Dussehra",
    description: "Victory of good over evil.",
  },
  {
    date: "2030-10-26",
    name: "Diwali/Deepavali",
    description: "Festival of lights and joy.",
  },
];

export const languages = [
  {
    value: "en",
    icon: "fi fi-us",
    label: "English",
  },
  {
    value: "hi",
    icon: "fi fi-in",
    label: "Hindi",
  },
  {
    value: "ta",
    icon: "fi fi-in", // India
    label: "Tamil",
  },
  {
    value: "te",
    icon: "fi fi-in", // India
    label: "Telugu",
  },
  {
    value: "pa",
    icon: "fi fi-in", // India
    label: "Punjabi",
  },
  {
    value: "bl",
    icon: "fi fi-in", // India
    label: "Bundeli",
  },
  {
    value: "ru",
    icon: "fi fi-ru", //Russia
    label: "Russian",
  },
  {
    value: "ar",
    icon: "fi fi-sa", // Saudi Arabia
    label: "Arabic",
  },
  {
    value: "fa",
    icon: "fi fi-ir", // Iran
    label: "Farsi",
  },

  {
    value: "sw",
    icon: "fi fi-ug", // Uganda
    label: "Swahili",
  },
  {
    value: "de",
    icon: "fi fi-de", // Germany
    label: "German",
  },
  {
    value: "es",
    icon: "fi fi-es", // Spain
    label: "Spanish",
  },
];
