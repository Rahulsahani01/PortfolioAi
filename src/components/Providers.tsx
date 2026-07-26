"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { SitesProvider } from '../context/SitesContext';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SitesProvider>
        {children}
      </SitesProvider>
    </AuthProvider>
  );
};
