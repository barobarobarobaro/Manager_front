"use client";

import { AlertProvider, AlertBridge } from '@/libs/AlertManager';

export default function ClientAlertProvider({ children }) {
  return (
    <AlertProvider>
      <AlertBridge />
      {children}
    </AlertProvider>
  );
}