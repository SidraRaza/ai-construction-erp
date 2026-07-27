export type Language = "en" | "ur";

export const translations = {
  en: {
    appName: "AI Construction ERP",
    dashboard: "Dashboard",
    projects: "Projects",
    attendance: "Attendance",
    materials: "Materials",
    invoices: "Quotations & Invoices",
    expenses: "Expenses",
    aiAssistant: "AI Assistant",
    recentActivity: "Recent Activity Log",
    totalRevenue: "Total Revenue",
    activeProjects: "Active Projects",
    labourPresent: "Labour Present",
    pendingInvoices: "Pending Invoices",
    dailyReport: "Daily Progress Report",
    searchPlaceholder: "Global search projects, invoices, site logs...",
  },
  ur: {
    appName: "اے آئی تعمیراتی ای آر پی",
    dashboard: "ڈیش بورڈ",
    projects: "منصوبے",
    attendance: "حاضری",
    materials: "تعمیراتی سامان",
    invoices: "انوائسز اور کوٹیشنز",
    expenses: "اخراجات",
    aiAssistant: "اے آئی معاون",
    recentActivity: "حالیہ سرگرمی لاگ",
    totalRevenue: "کل آمدنی",
    activeProjects: "زیرِ کار منصوبے",
    labourPresent: "حاضر مزدور",
    pendingInvoices: "زیرِ التواء انوائسز",
    dailyReport: "روزانہ پیشرفت رپورٹ",
    searchPlaceholder: "منصوبے، انوائسز، سائٹس تلاش کریں...",
  },
} as const;

export function t(key: keyof typeof translations.en, lang: Language = "en"): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
