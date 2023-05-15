import paymentEntry from "../views/paymentEntry";
import payment from "../views/payment";
import successView from "../views/successView";
import FailedView from "../views/FailedView";
import processing from "../views/processing";
import AddPayment from "../views/AddPayment";
import AddCard from "../views/AddCard";
import AddMpesa from "../views/AddMpesa";
import STKComponent from "../views/STKComponent";
import MpesaC2B from "../views/MpesaC2B";
import NoPaymentOption from "../views/NoPaymentOption";
import PaymentOptionsPage from "../views/PaymentOptionsPage";
import CardDetailsPage from "../views/CardDetailsPage";
import MpesaDetail from "../views/MpesaDetail";
import PaymentOptionDetail from "../views/PaymentOptionDetail"
import choosePayment from "../views/ChoosePayment";
import ChoosePaymentCheckout from "../views/ChoosePayment/ChoosePaymentCheckout";
import ResolvePayment from "../views/ResolvePayment";
import HowitWorks from "../views/PayBybank/howitworks";
import TermsOfService from "../views/PayBybank/TermsOfService";
import AccountReadyView from "../views/PayBybank/AccountReadyView";
import FailedAccountSetup from "../views/PayBybank/FailedAccountSetup";
import PayByBank from "../views/PayBybank";
import AddWithdrawal from "../views/ManageWithdrawalOptions/AddWithdrawal";
import BankWithdrawal from "../views/ManageWithdrawalOptions/BankWIthdrawal";
import ConfirmOtp from "../views/ManageWithdrawalOptions/ConfirmOtp";
import MobileWithdrawal from "../views/ManageWithdrawalOptions/MobileWithdrawal";
import ManageWithdrawalOptions from "../views/ManageWithdrawalOptions";
import OtpFail from "../views/ManageWithdrawalOptions/OtpFail";
import WithdrawalCheckout from "../views/WithdrawalCheckout";
import WithdrawalSuccess from "../views/WithdrawalCheckout/WithdrawalSuccess";
import WithdrawalFailed from "../views/WithdrawalCheckout/WithdrawalFailed";
import DuplicateAccount from "../views/ManageWithdrawalOptions/DuplicateAccount";
import WithdrawalApproval from "../views/WithdrawalCheckout/WithdrawalApproval";

const routes = [
  {
    path: "/paymentlib",
    component: paymentEntry,
    children: [
      {
        path: "/",
        name: "Entry",
        component: payment,
      },
      {
        path: "/success-view/:reciept?:duration?/:transferredAmount?/:title?",
        name: "SuccessView",
        component: successView,
      },
      {
        path: "/failed-view/:mpesa?",
        name: "FailedView",
        component: FailedView,
      },
      {
        path: "/resolve-payment/",
        name: "ResolvePayment",
        component: ResolvePayment,
      },
      {
        path: "/retry-view",
        name: "RetryView",
        component: FailedView,
      },
      {
        path: "/processing",
        name: "Processing",
        component: processing,
      },
      {
        path: "/choose-payment/:entry?",
        name: "ChoosePayment",
        component: choosePayment,
      },
      {
        path: "/choose-payment-checkout",
        name: "ChoosePaymentCheckout",
        component: ChoosePaymentCheckout,
      },
      {
        path: "/add-payment/:entry?",
        name: "AddPayment",
        component: AddPayment,
      },
      {
        path: "/add-card",
        name: "AddCard",
        component: AddCard,
      },
      {
        path: "/add-mpesa",
        name: "AddMpesa",
        component: AddMpesa,
      },
      {
        path: "/mpesa-stk",
        name: "STKComponent",
        component: STKComponent,
      },
      {
        path: "/mpesa-c2b",
        name: "MpesaC2B",
        component: MpesaC2B,
      },
      {
        path: "/no-payment-option",
        name: "NoPaymentOption",
        component: NoPaymentOption,
      },
      {
        path: "/payment-option-page",
        name: "PaymentOptionsPage",
        component: PaymentOptionsPage,
      },
      {
        path: "/card-details/:cardno/:cardTitle?",
        name: "CardDetails",
        component: CardDetailsPage,
      },
      {
        path: "/mobile-details/:id/:title?/:icon?/:paymentOption?",
        name: "MpesaDetails",
        component: MpesaDetail,
      },
      {
        path: "/payment-details",
        name: "PaymentOptionDetail",
        component: PaymentOptionDetail,
      },
      {
        path: "/bank/how-it-works",
        name: "HowitWorks",
        component: HowitWorks,
      },
      {
        path: "/bank/terms-of-service",
        name: "TermsOfService",
        component: TermsOfService,
      },
      {
        path: "/bank/account-ready",
        name: "AccountReadyView",
        component: AccountReadyView,
      },
      {
        path: "/bank/failed-setup",
        name: "FailedAccountSetup",
        component: FailedAccountSetup,
      },
      {
        path: "/bank/pay",
        name: "PayByBank",
        component: PayByBank,
      },
      {
        path: "/add-withdrawal",
        name: "AddWithdrawal",
        component: AddWithdrawal,
      },
      {
        path: "/bank-withdrawal",
        name: "BankWithdrawal",
        component: BankWithdrawal,
      },
      {
        path: "/bank-withdrawal/:edit?",
        name: "BankWithdrawal",
        component: BankWithdrawal,
      },
      {
        path: "/confirm-otp/:delete?",
        name: "ConfirmOtp",
        component: ConfirmOtp,
      },
      {
        path: "/otp-fail",
        name: "OtpFail",
        component: OtpFail,
      },
      {
        path: "/mobile-withdrawal/:edit?",
        name: "MobileWithdrawal",
        component: MobileWithdrawal,
      },
      {
        path: "/manage-withrawal",
        name: "ManageWithdrawal",
        component: ManageWithdrawalOptions,
      },
      {
        path: "/duplicate",
        name: "DuplicateAccount",
        component: DuplicateAccount,
      },
      {
        path: "/withdraw-cash",
        name: "WithdrawalCheckout",
        component: WithdrawalCheckout,
      },
      {
        path: "/withdraw-cash-failed",
        name: "WithdrawalFailed",
        component: WithdrawalFailed,
      },
      {
        path: "/withdraw-cash-success/:reciept?",
        name: "WithdrawalSuccess",
        component: WithdrawalSuccess,
      },
      {
        path: "/withdrawal-approval",
        name: "WithdrawalApproval",
        component: WithdrawalApproval,
      }


    ],
  },
];

export default routes;
