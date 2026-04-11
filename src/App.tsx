import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MembersPage from "@/pages/members/MembersPage";
import MemberProfilePage from "@/pages/members/MemberProfilePage";
import CollectionsPage from "@/pages/collections/CollectionsPage";
import ExpensesPage from "@/pages/expenses/ExpensesPage";
import LedgerPage from "@/pages/ledger/LedgerPage";
import BankAccountsPage from "@/pages/bank/BankAccountsPage";
import CashBookPage from "@/pages/cashbook/CashBookPage";
import PaymentsPage from "@/pages/payments/PaymentsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import IncomeExpenseReport from "@/pages/reports/IncomeExpenseReport";
import CashFlowReport from "@/pages/reports/CashFlowReport";
import MemberDueReport from "@/pages/reports/MemberDueReport";
import BankCashReport from "@/pages/reports/BankCashReport";
import SMSPage from "@/pages/sms/SMSPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import SomiteesPage from "@/pages/somitees/SomiteesPage";
import FAQPage from "@/pages/faq/FAQPage";
import ApiDocsPage from "@/pages/docs/ApiDocsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="somitees" element={<SomiteesPage />} />
            <Route path="subscriptions" element={<DashboardPage />} />
            <Route path="analytics" element={<DashboardPage />} />
            <Route path="global-settings" element={<SettingsPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="members/:id" element={<MemberProfilePage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="bank-accounts" element={<BankAccountsPage />} />
            <Route path="cashbook" element={<CashBookPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/income-expense" element={<IncomeExpenseReport />} />
            <Route path="reports/cash-flow" element={<CashFlowReport />} />
            <Route path="reports/member-due" element={<MemberDueReport />} />
            <Route path="reports/bank-cash" element={<BankCashReport />} />
            <Route path="sms" element={<SMSPage />} />
            <Route path="my-ledger" element={<LedgerPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="api-docs" element={<ApiDocsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
