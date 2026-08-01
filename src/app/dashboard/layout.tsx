import React from 'react';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WhatsAppButton />
    </>
  );
}
