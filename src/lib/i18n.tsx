import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    dashboard: "Dashboard",
    employees: "Employee Management",
    attendance: "Attendance",
    production: "Production Management",
    inventory: "Inventory Management",
    sales: "Sales & Dispatch",
    login: "Login",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    logout: "Logout",
    language: "Language",
    adminDashboard: "Admin Dashboard",
    managerDashboard: "Manager Dashboard",
    addEmployee: "Add Employee",
    name: "Name",
    position: "Position",
    status: "Status",
    department: "Department",
    currentlyDoing: "Currently Doing",
    supervisor: "Supervisor",
    actions: "Actions",
    save: "Save",
    cancel: "Cancel",
    present: "Present",
    absent: "Absent",
    leave: "Leave",
    markAttendance: "Mark Attendance",
    date: "Date",
    totalProduced: "Total Produced",
    notes: "Notes",
    addReport: "Add Report",
    itemName: "Item Name",
    sku: "SKU",
    quantity: "Quantity",
    unit: "Unit",
    threshold: "Threshold",
    addItem: "Add Item",
    orderId: "Order ID",
    dispatchDate: "Dispatch Date",
    pending: "Pending",
    dispatched: "Dispatched",
    addOrder: "Add Order",
    accessDenied: "Access Denied",
    unauthorizedMessage: "You do not have permission to view this page.",
    welcome: "Welcome",
    systemUsers: "System Users",
    addUser: "Add User",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    employees: "कर्मचारी प्रबंधन",
    attendance: "उपस्थिति",
    production: "उत्पादन प्रबंधन",
    inventory: "इन्वेंटरी प्रबंधन",
    sales: "बिक्री और प्रेषण",
    login: "लॉग इन",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन करें",
    logout: "लॉग आउट",
    language: "भाषा",
    adminDashboard: "व्यवस्थापक डैशबोर्ड",
    managerDashboard: "प्रबंधक डैशबोर्ड",
    addEmployee: "कर्मचारी जोड़ें",
    name: "नाम",
    position: "पद",
    status: "स्थिति",
    department: "विभाग",
    currentlyDoing: "वर्तमान कार्य",
    supervisor: "पर्यवेक्षक",
    actions: "कार्रवाइयां",
    save: "सहेजें",
    cancel: "रद्द करें",
    present: "उपस्थित",
    absent: "अनुपस्थित",
    leave: "छुट्टी",
    markAttendance: "उपस्थिति दर्ज करें",
    date: "तारीख",
    totalProduced: "कुल उत्पादन",
    notes: "नोट्स",
    addReport: "रिपोर्ट जोड़ें",
    itemName: "वस्तु का नाम",
    sku: "एसकेयू",
    quantity: "मात्रा",
    unit: "इकाई",
    threshold: "सीमा",
    addItem: "वस्तु जोड़ें",
    orderId: "ऑर्डर आईडी",
    dispatchDate: "प्रेषण तिथि",
    pending: "लंबित",
    dispatched: "प्रेषित",
    addOrder: "ऑर्डर जोड़ें",
    accessDenied: "पहुंच अस्वीकृत",
    unauthorizedMessage: "आपके पास इस पृष्ठ को देखने की अनुमति नहीं है।",
    welcome: "स्वागत है",
    systemUsers: "सिस्टम उपयोगकर्ता",
    addUser: "उपयोगकर्ता जोड़ें",
  }
};

type Translations = typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
