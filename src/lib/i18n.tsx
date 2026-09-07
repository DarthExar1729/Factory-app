import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

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
  },
  es: {
    dashboard: "Panel Principal",
    employees: "Gestión de Empleados",
    attendance: "Asistencia",
    production: "Gestión de Producción",
    inventory: "Gestión de Inventario",
    sales: "Ventas y Despacho",
    login: "Iniciar Sesión",
    email: "Correo Electrónico",
    password: "Contraseña",
    signIn: "Entrar",
    logout: "Cerrar Sesión",
    language: "Idioma",
    adminDashboard: "Panel de Administrador",
    managerDashboard: "Panel de Gerente",
    addEmployee: "Agregar Empleado",
    name: "Nombre",
    position: "Puesto",
    status: "Estado",
    department: "Departamento",
    currentlyDoing: "Actividad Actual",
    supervisor: "Supervisor",
    actions: "Acciones",
    save: "Guardar",
    cancel: "Cancelar",
    present: "Presente",
    absent: "Ausente",
    leave: "Permiso",
    markAttendance: "Marcar Asistencia",
    date: "Fecha",
    totalProduced: "Total Producido",
    notes: "Notas",
    addReport: "Agregar Reporte",
    itemName: "Nombre del Artículo",
    sku: "SKU",
    quantity: "Cantidad",
    unit: "Unidad",
    threshold: "Umbral",
    addItem: "Agregar Artículo",
    orderId: "ID del Pedido",
    dispatchDate: "Fecha de Despacho",
    pending: "Pendiente",
    dispatched: "Despachado",
    addOrder: "Agregar Pedido",
    accessDenied: "Acceso Denegado",
    unauthorizedMessage: "No tienes permiso para ver esta página.",
    welcome: "Bienvenido",
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
