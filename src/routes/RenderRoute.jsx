import React, { Fragment, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "@app/components/loader/Loading";
import ErrorBoundary from "../layouts/error-Boundary";
import Layout from "@app/layouts";
import Authenticated from "@app/Guard/Authenticated.jsx";
import Guest from "@app/Guard/Guest.jsx";
import { ToastContainer } from "react-toastify";
import AnimatedPage from "./AnimatedPage .jsx";

function RenderRoute() {
  return (
    <>
      <ToastContainer
        autoClose={1000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {[...allRoutes["commonRoutes"], ...allRoutes["roleRoutes"]]?.map(
              (route, index) => {
                const Component = route?.component;
                const Layout = route?.layout || Fragment;
                const Guard = route?.Guard || Fragment;

                return (
                  <Route
                    path={route?.path}
                    exact={route?.exact}
                    key={index}
                    element={
                      <Guard>
                        <Layout>
                          <AnimatedPage>
                            <Component />
                          </AnimatedPage>
                        </Layout>
                      </Guard>
                    }
                  />
                );
              }
            )}
            <Route path="*" element={<Navigate to="/BlankPage" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default RenderRoute;

const allRoutes = {
  commonRoutes: [
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/dashboard",
      component: lazy(() => import("@app/pages/Dashboard.jsx")),
      exact: true,
    },
    {
      path: "/login",
      component: lazy(() => import("../modules/login/Login")),
      exact: true,
    },
    {
      path: "/CaptchaComponent",
      component: lazy(() => import("../modules/login/CaptchaComponent")),
      exact: true,
    },
    {
      path: "/PatientPortalLogin",
      component: lazy(() => import("../modules/login/PatientPortalLogin.jsx")),
      exact: true,
    },
    {
      path: "/LabReport",
      component: lazy(() => import("../Frontend/Laboratory/LabReport.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Welcome",
      component: lazy(() => import("../modules/login/Welcome")),
      exact: true,
    },
    {
      path: "/PrivacyPolicy",
      component: lazy(() => import("../modules/login/PrivacyPolicy")),
      exact: true,
    },
    {
      path: "/RefundPolicy",
      component: lazy(() => import("../modules/login/RefundPolicy")),
      exact: true,
    },
    {
      path: "/TermsAndCondition",
      component: lazy(() => import("../modules/login/TermsAndCondition")),
      exact: true,
    },

    {
      Guard: Guest,
      path: "/LabReport/GetLabReportFromQr/:id",
      component: lazy(() => import("../Frontend/Laboratory/LabReport.jsx")),
      exact: true,
    },
    {
      path: "/QRController/GetLabReportFromQr/:id",
      component: lazy(() => import("../Frontend/Laboratory/QRCodeReport.jsx")),
      exact: true,
    },
    {
      path: "/ForgetPassword",
      component: lazy(() => import("@app/modules/login/ForgetPassword.jsx")),
      exact: true,
    },
    {
      layout: Layout,
      path: "/BlankPage",
      component: lazy(() => import("../Frontend/BlankPage/BlankPage.jsx")),
      exact: true,
    },
  ],
  roleRoutes: [
    {
      Guard: Authenticated,
      layout: Layout,
      path: "*",
      component: lazy(() => import("../Frontend/BlankPage/BlankPage.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/patientregister",
      component: lazy(
        () => import("../Frontend/Laboratory/PatientRegistration.jsx")
      ),
      exact: true,
    }, {
      Guard: Authenticated,
      layout: Layout,
      path: "/TestWiseRecordUpdate",
      component: lazy(
        () => import("../Frontend/Laboratory/TestWiseRecordUpdate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HistoCytoResultEntry",
      component: lazy(
        () => import("../Frontend/Laboratory/HistoCytoResultEntry.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SampleCollection",
      component: lazy(
        () => import("../Frontend/Laboratory/SampleCollection.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DepartmentReceive",
      component: lazy(
        () => import("../Frontend/Laboratory/DepartmentReceive.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SMSData",
      component: lazy(() => import("../Frontend/Laboratory/SMSData.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ResultEntry",
      component: lazy(() => import("../Frontend/Laboratory/ResultEntry.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ResultEntry/:id",
      component: lazy(() => import("../Frontend/Laboratory/ResultEntry.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DispatchReport",
      component: lazy(
        () => import("../Frontend/Laboratory/DispatchReport.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ReceiptReprint",
      component: lazy(
        () => import("../Frontend/Laboratory/ReceiptReprint.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EditPatientInfo",
      component: lazy(
        () => import("../Frontend/Laboratory/EditPatientInfo.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EditPatientDetails",
      component: lazy(
        () => import("../Frontend/Laboratory/EditPatientDetails.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SendSampleToLab",
      component: lazy(
        () => import("../Frontend/Laboratory/SendSampleToLab.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DynamicLabSearch",
      component: lazy(
        () => import("../Frontend/Laboratory/DynamicLabSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DynamicReportSearch",
      component: lazy(
        () => import("../Frontend/Laboratory/DynamicReportSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BulkActivity",
      component: lazy(() => import("../Frontend/Laboratory/BulkActivity.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CriticalCalloutRecord",
      component: lazy(
        () => import("../Frontend/Laboratory/CriticalCalloutRecord.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentrePanel",
      component: lazy(() => import("../Frontend/Master/CentrePanel.jsx")),
      exact: true,
    },
    {
          Guard: Authenticated,
          layout: Layout,
          path: "/DepartmentMasterUpdate",
          component: lazy(() => import("../Frontend/Master/DepartmentMasterUpdate.jsx")),
          exact: true,
        },
        {
          Guard: Authenticated,
          layout: Layout,
          path: "/InvestigationMasterUpdate",
          component: lazy(() => import("../Frontend/Master/InvestigationMasterUpdate.jsx")),
          exact: true,
        },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HistoTemplate",
      component: lazy(() => import("../Frontend/Master/HistoTemplate.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HistoTemplateList",
      component: lazy(() => import("../Frontend/Master/HistoTemplateList.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DepartmentMasterInterface",
      component: lazy(() => import("../Frontend/Master/DepartmentMasterInterface.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SampleTypeMasterInterface",
      component: lazy(() => import("../Frontend/Master/SampleTypeMasterInterface.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Departments",
      component: lazy(() => import("../Frontend/Master/Departments.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LiveImageEditor",
      component: lazy(() => import("../Frontend/Master/LiveImageEditor.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangePassword",
      component: lazy(() => import("../Frontend/Master/ChangePassword.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FieldBoyMaster",
      component: lazy(() => import("../Frontend/Master/FieldBoyMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FilterTableMaster",
      component: lazy(() => import("../Frontend/Master/FilterTableMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ResendSMS",
      component: lazy(() => import("../Frontend/Master/ResendSMS.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreateFieldBoyMaster",
      component: lazy(
        () => import("../Frontend/Master/CreateFieldBoyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Designations",
      component: lazy(() => import("../Frontend/Master/Designations.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DesignationsCreate",
      component: lazy(
        () => import("../Frontend/Master/DesignationsCreate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentreMaster/:name",
      component: lazy(() => import("../Frontend/Master/CentreMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Settlement",
      component: lazy(() => import("../Frontend/Laboratory/Settlement.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SingleBulkPanelChange",
      component: lazy(
        () => import("../Frontend/Laboratory/SingleBulkPanelChange.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BulkRegistration",
      component: lazy(
        () => import("../Frontend/Laboratory/BulkRegistration.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/GlobalTypeMaster",
      component: lazy(
        () => import("../Frontend/Laboratory/GlobalTypeMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewGlobalMaster",
      component: lazy(
        () => import("../Frontend/Laboratory/ViewGlobalMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/getReport/:id",
      component: lazy(() => import("../Frontend/Reports/Report.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentreMasterList/:name",
      component: lazy(() => import("../Frontend/Master/CentreMasterList.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmployeeMaster",
      component: lazy(() => import("../Frontend/Master/EmployeeMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreateEmployeeMaster",
      component: lazy(
        () => import("../Frontend/Master/CreateEmployeeMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Investigations",
      component: lazy(() => import("../Frontend/Master/Investigations.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationsList",
      component: lazy(
        () => import("../Frontend/Master/InvestigationsList.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationRange",
      component: lazy(
        () => import("../Frontend/Master/InvestigationRange.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationsInterpretion",
      component: lazy(
        () => import("../Frontend/Master/InvestigationsInterpretion.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RequiredFields",
      component: lazy(
        () => import("../Frontend/Master/InvestigationsRequiredField.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HelpMenu",
      component: lazy(
        () => import("../Frontend/Master/InvestigationsHelpMenu.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OutSourceLabMaster",
      component: lazy(
        () => import("../Frontend/Master/OutSourceLabMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OutSourceTestMaster",
      component: lazy(
        () => import("../Frontend/Master/OutSourceTestMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OutSourceTestToOtherLab",
      component: lazy(
        () => import("../Frontend/Master/OutSourceTestToOtherLab.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OutSourceTagging",
      component: lazy(() => import("../Frontend/Master/OutSourceTagging.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MenuMaster",
      component: lazy(() => import("../Frontend/Master/MenuMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ImportExportInvestigations",
      component: lazy(
        () => import("../Frontend/Master/ImportExportInvestigations.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PageMaster",
      component: lazy(() => import("../Frontend/Master/PageMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SubPageMaster",
      component: lazy(() => import("../Frontend/Master/SubPageMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PrintBarCode",
      component: lazy(() => import("../Frontend/Laboratory/PrintBarCode.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/IDMaster",
      component: lazy(() => import("../Frontend/Master/IDMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InterfaceBookingData",
      component: lazy(
        () => import("../Frontend/Master/InterfaceBookingData.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BulkSettlement",
      component: lazy(
        () => import("../Frontend/Laboratory/BulkSettlement.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EmailTemplate",
      component: lazy(() => import("../Frontend/Laboratory/EmailTemplate.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DownTimeMaster",
      component: lazy(() => import("../Frontend/Laboratory/DownTimeMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ResultCulture",
      component: lazy(() => import("../Frontend/Laboratory/ResultCulture.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangeDeliveryStatus",
      component: lazy(
        () => import("../Frontend/Laboratory/ChangeDeliveryStatus.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MicroLabEntry",
      component: lazy(() => import("../Frontend/Laboratory/MicroLabEntry.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerStatus",
      component: lazy(() => import("../Frontend/Invoicing/LedgerStatus.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerStatusAsOnDate",
      component: lazy(
        () => import("../Frontend/Invoicing/LedgerStatusAsOnDate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerTransaction",
      component: lazy(
        () => import("../Frontend/Invoicing/LedgerTransaction.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerStatement",
      component: lazy(
        () => import("../Frontend/Invoicing/LedgerStatement.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AdvancePayment",
      component: lazy(() => import("../Frontend/Invoicing/AdvancePayment.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LedgerReport",
      component: lazy(() => import("../Frontend/Invoicing/LedgerReport.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceCreation",
      component: lazy(
        () => import("../Frontend/Invoicing/InvoiceCreation.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceCancel",
      component: lazy(() => import("../Frontend/Invoicing/InvoiceCancel.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvoiceReprint",
      component: lazy(() => import("../Frontend/Invoicing/InvoiceReprint.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ValidatePayment",
      component: lazy(
        () => import("../Frontend/Invoicing/ValidatePayment.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/OnlinePaymentPage",
      component: lazy(
        () => import("../Frontend/CompanyMaster/OnlinePaymentPage.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyKey",
      component: lazy(() => import("../Frontend/CompanyMaster/CompanyKey.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyPaymentDetail",
      component: lazy(
        () => import("../Frontend/CompanyMaster/CompanyPaymentDetail.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyWiseUpdate",
      component: lazy(
        () => import("../Frontend/CompanyMaster/CompanyWiseUpdate.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyMaster",
      component: lazy(
        () => import("../Frontend/CompanyMaster/CompanyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyMasterList",
      component: lazy(
        () => import("../Frontend/CompanyMaster/CompanyMasterList.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DiscountAfterBill",
      component: lazy(
        () => import("../Frontend/Administrator/DiscountAfterBill.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TermsAndConditions",
      component: lazy(
        () => import("../Frontend/Laboratory/TermsAndConditions.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RefundAfterBill",
      component: lazy(
        () => import("../Frontend/Administrator/RefundAfterBill.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SettlementPatient",
      component: lazy(
        () => import("../Frontend/Administrator/SettlementPatient.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DiscountMasterEmployeeWise",
      component: lazy(
        () => import("../Frontend/Administrator/DiscountMasterEmployeeWise.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangePaymentMode",
      component: lazy(
        () => import("../Frontend/Administrator/ChangePaymentMode.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangeSampleStatus",
      component: lazy(
        () => import("../Frontend/Administrator/ChangeSampleStatus.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ChangeBarCode",
      component: lazy(
        () => import("../Frontend/Administrator/ChangeBarCode.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DiscountApproval",
      component: lazy(
        () => import("../Frontend/Administrator/DiscountApproval.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RevertDiscountApprovalStatus",
      component: lazy(
        () =>
          import("../Frontend/Administrator/RevertDiscountApprovalStatus.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ModalityMaster",
      component: lazy(() => import("../Frontend/Radiology/ModalityMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TokenGenerationMaster",
      component: lazy(
        () => import("../Frontend/Radiology/TokenGenerationMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ScRoomMaster",
      component: lazy(() => import("../Frontend/Radiology/ScRoomMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationTimeSlotMaster",
      component: lazy(
        () => import("../Frontend/Radiology/InvestigationTimeSlotMaster.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AgeWiseDiscount",
      component: lazy(() => import("../Frontend/Master/AgeWiseDiscount.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/AgeWiseDiscountList",
      component: lazy(
        () => import("../Frontend/Master/AgeWiseDiscountList.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/BreakpointPage",
      component: lazy(() => import("../Frontend/Master/BreakpointPage.jsx")),
      exact: true,
    },{
      Guard: Authenticated,
      layout: Layout,
      path: "/ResultEntryDynamicValue",
      component: lazy(() => import("../Frontend/Master/ResultEntryMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CancelReceipt",
      component: lazy(() => import("../Frontend/Master/CancelReceipt.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CenterAccess",
      component: lazy(() => import("../Frontend/Master/CenterAccess.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentreTypeMaster",
      component: lazy(() => import("../Frontend/Master/CentreTypeMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CreateDoctorReferal",
      component: lazy(
        () => import("../Frontend/Master/CreateDoctorMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DoctorReferal",
      component: lazy(() => import("../Frontend/Master/DoctorMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DoctorMisReportPage",
      component: lazy(
        () => import("../Frontend/Master/DoctorMisReportPage.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DoctorShareMaster",
      component: lazy(() => import("../Frontend/Master/DoctorShareMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DoctorTypeCopyShare",
      component: lazy(
        () => import("../Frontend/Master/DoctorTypeCopyShare.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/FormulaMaster",
      component: lazy(() => import("../Frontend/Master/FormulaMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ImportExportExcel",
      component: lazy(() => import("../Frontend/Master/ImportExportExcel.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvalidContactNumber",
      component: lazy(
        () => import("../Frontend/Master/InvalidContactNumber.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationCommentMaster",
      component: lazy(
        () => import("../Frontend/Master/InvestigationCommentMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationCommentMasterList",
      component: lazy(
        () => import("../Frontend/Master/InvestigationCommentMasterList.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LoadData",
      component: lazy(() => import("../Frontend/Master/LoadData.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MacData",
      component: lazy(() => import("../Frontend/Master/MacData.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MachineReferenceRangeMaster",
      component: lazy(
        () => import("../Frontend/Master/MachineReferenceRangeMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MacObservation",
      component: lazy(() => import("../Frontend/Master/MacObservation.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageDeliveryDays",
      component: lazy(
        () => import("../Frontend/Master/ManageDeliveryDays.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageFieldMaster",
      component: lazy(() => import("../Frontend/Master/ManageFieldMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/VisitTypeCategory",
      component: lazy(() => import("../Frontend/Master/VisitTypeCategory.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageHoliday",
      component: lazy(() => import("../Frontend/Master/ManageHoliday.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageOrdering",
      component: lazy(() => import("../Frontend/Master/ManageOrdering.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MergeDoctor",
      component: lazy(() => import("../Frontend/Master/MergeDoctor.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MicroBiologyMaster",
      component: lazy(
        () => import("../Frontend/Master/MicroBiologyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MicroBiologyMasterMapping",
      component: lazy(
        () => import("../Frontend/Master/MicroBiologyMasterMapping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RateList",
      component: lazy(() => import("../Frontend/Master/RateList.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RateTypeShareMaster",
      component: lazy(
        () => import("../Frontend/Master/RateTypeShareMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/Rate/:id",
      component: lazy(() => import("../Frontend/Master/RateTypeCopyShare.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/SampleType",
      component: lazy(() => import("../Frontend/Master/SampleTypeCreate.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/setDoctor",
      component: lazy(() => import("../Frontend/Master/SetDoctorShare.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TestMappingCenter",
      component: lazy(() => import("../Frontend/Master/TestCentreMapping.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampApprovalRightMaster",
      component: lazy(
        () => import("../Frontend/Camp/CampApprovalRightMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampConfigurationMaster",
      component: lazy(
        () => import("../Frontend/Camp/CampConfigurationMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampConfigurationApproval",
      component: lazy(
        () => import("../Frontend/Camp/CampConfigurationApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampCreationSearch",
      component: lazy(() => import("../Frontend/Camp/CampCreationSearch.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampRequestApproval",
      component: lazy(() => import("../Frontend/Camp/CampRequestApproval.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampCreationMaster",
      component: lazy(() => import("../Frontend/Camp/CampCreationMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampReject",
      component: lazy(() => import("../Frontend/Camp/CampReject.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RouteMaster",
      component: lazy(
        () => import("../Frontend/HomeCollection/RouteMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HomeCollectionLocationMaster",
      component: lazy(
        () =>
          import("../Frontend/HomeCollection/HomeCollectionLocationMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HomeCollectionRoutes",
      component: lazy(
        () => import("../Frontend/HomeCollection/HomeCollectionRoutes.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PhelebotomistMapping",
      component: lazy(
        () => import("../Frontend/HomeCollection/PhelebotomistMapping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CallCentre",
      component: lazy(
        () => import("../Frontend/HomeCollection/CallCentre.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HCPhlebotomistHoliday",
      component: lazy(
        () => import("../Frontend/HomeCollection/PhlebotomistHoliday.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HCPatientEdit",
      component: lazy(
        () => import("../Frontend/HomeCollection/HCPatientEdit.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HCChangePhlebotomist",
      component: lazy(
        () => import("../Frontend/HomeCollection/HCChangePhlebotomist.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HCChangeDropLocation",
      component: lazy(
        () => import("../Frontend/HomeCollection/HCChangeDropLocation.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PhelebotomistRegisteration",
      component: lazy(
        () =>
          import("../Frontend/HomeCollection/PhelebotomistRegisteration.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/PhelbomistCallTransfer",
      component: lazy(
        () => import("../Frontend/HomeCollection/PhelbomistCallTransfer.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CampRequest",
      component: lazy(() => import("../Frontend/Camp/CampRequest.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MembershipCardMaster",
      component: lazy(
        () => import("../Frontend/MembershipCard/MembershipCardMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MembershipCardSearch",
      component: lazy(
        () => import("../Frontend/MembershipCard/MembershipCardSearch.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MemberShipCardEdit",
      component: lazy(
        () => import("../Frontend/MembershipCard/MemberShipCardEdit.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MembershipCardItemMapping",
      component: lazy(
        () => import("../Frontend/MembershipCard/MembershipCardItemMapping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MembershipCardIssue",
      component: lazy(
        () => import("../Frontend/MembershipCard/MembershipCardIssue.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HomeCollectionSearch",
      component: lazy(
        () => import("../Frontend/HomeCollection/HomeCollectionSearch.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/LocationMaster",
      component: lazy(
        () => import("../Frontend/HomeCollection/LocationMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RoleMaster",
      component: lazy(() => import("../Frontend/Master/RoleMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/RoleMaster",
      component: lazy(() => import("../Frontend/Master/RoleMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ItemMasterInterface",
      component: lazy(
        () => import("../Frontend/Master/ItemMasterInterface.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HimsToLims",
      component: lazy(() => import("../Frontend/Master/HimsToLims.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CentreMasterInterface",
      component: lazy(
        () => import("../Frontend/Master/CentreMasterInterface.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InterfaceCompanyMaster",
      component: lazy(
        () => import("../Frontend/Master/InterfaceCompanyMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ManageNabl",
      component: lazy(() => import("../Frontend/Master/ManageNabl.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/InvestigationRequiredMaster",
      component: lazy(
        () => import("../Frontend/Master/InvestigationRequiredMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MachineGroup",
      component: lazy(() => import("../Frontend/Machine/MachineGroup.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MachineMaster",
      component: lazy(() => import("../Frontend/Machine/MachineMaster.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MachineParams",
      component: lazy(() => import("../Frontend/Machine/MachineParams.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/TransferMachineRanges",
      component: lazy(
        () => import("../Frontend/Machine/TransferMachineRanges.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MachineReading",
      component: lazy(() => import("../Frontend/Machine/MachineReading.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/DaySpecialTest",
      component: lazy(() => import("../Frontend/Extra/DaySpecialTest.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CouponMaster",
      component: lazy(
        () => import("../Frontend/CouponMaster/CouponMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CouponMasterApproval",
      component: lazy(
        () => import("../Frontend/CouponMaster/CouponMasterApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CouponManageApproval",
      component: lazy(
        () => import("../Frontend/CouponMaster/CouponManageApproval.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ExportInvInterpretation",
      component: lazy(
        () => import("../Frontend/Master/ExportInvInterpretation.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ReportHeaderSetupMaster",
      component: lazy(
        () => import("../Frontend/Master/ReportHeaderSetupMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyWiseTemplateMapping",
      component: lazy(
        () => import("../Frontend/Master/CompanyWiseTemplateMapping.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ReportBill",
      component: lazy(() => import("../Frontend/Master/ReportBill.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HistoCytoGrossingAndSliding",
      component: lazy(
        () => import("../Frontend/Laboratory/HistoCytoGrossingAndSliding.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/HistoCytoResultEntrySecondPage",
      component: lazy(
        () =>
          import("../Frontend/Laboratory/HistoCytoResultEntrySecondPage.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/MailStatus",
      component: lazy(() => import("../Frontend/Laboratory/MailStatus.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EstimateRatenew",
      component: lazy(() => import("../Frontend/Master/EstimateRatenew.jsx")),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConcentFormMaster",
      component: lazy(
        () => import("../Frontend/Laboratory/ConcentFormMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ConcentFormList",
      component: lazy(
        () => import("../Frontend/Laboratory/ConcentFormList.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/CompanyWiseSmsCountAndWhatsAppCount",
      component: lazy(
        () =>
          import("../Frontend/Master/CompanyWiseSmsWPCount.jsx")
      ),
      exact: true,
    },
    // Emergency module End
  ],
};
