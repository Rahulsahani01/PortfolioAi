"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';

export interface Site {
  id: string;
  slug: string;
  templateKey: string;
  siteDetailId?: string;
  status: 'DRAFT' | 'PUBLISHING' | 'LIVE';
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'REJECTED' | null;
  publishedUrl?: string;
  createdAt: string;
  // Note: the backend uses socialOffer, but frontend used offerStatus.
  // We can derive offerStatus from socialOffer if needed, or map it.
  socialOffer?: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  } | null;
  siteDetail?: {
    status: string;
    parsedData?: any;
  } | null;
}

interface SitesContextType {
  sites: Site[];
  activeSiteId: string | null;
  setActiveSiteId: (id: string | null) => void;
  activeSite: Site | undefined;
  isLoading: boolean;
  refreshSites: (siteId?: string) => Promise<void>;
}

const SitesContext = createContext<SitesContextType | undefined>(undefined);

export const SitesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSiteId, setActiveSiteIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeSiteId');
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const setActiveSiteId = (id: string | null) => {
    setActiveSiteIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('activeSiteId', id);
      } else {
        localStorage.removeItem('activeSiteId');
      }
    }
  };

  const fetchSites = async (siteId?: string) => {
    if (!isAuthenticated || !token) {
      setSites([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const endpoint = siteId ? `/sites?siteId=${siteId}` : '/sites';
      const data = await apiFetch(endpoint, { token });
      const sitesArray = data.sites || [];
      
      if (siteId) {
        if (sitesArray.length > 0) {
          setSites(prev => prev.map(s => s.id === siteId ? sitesArray[0] : s));
        }
      } else {
        setSites(sitesArray);
        
        let currentActive = activeSiteId;
        if (typeof window !== 'undefined' && !currentActive) {
          currentActive = localStorage.getItem('activeSiteId');
        }

        const isValid = sitesArray.some((s: Site) => s.id === currentActive);
        
        if (!isValid && sitesArray.length > 0) {
          setActiveSiteId(sitesArray[0].id);
        } else if (sitesArray.length === 0) {
          setActiveSiteId(null);
        } else if (currentActive && !activeSiteId) {
          setActiveSiteId(currentActive);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sites', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [isAuthenticated, token]);

  const activeSite = sites.find(s => s.id === activeSiteId);

  return (
    <SitesContext.Provider value={{ sites, activeSiteId, setActiveSiteId, activeSite, isLoading, refreshSites: fetchSites }}>
      {children}
    </SitesContext.Provider>
  );
};

export const useSites = () => {
  const context = useContext(SitesContext);
  if (context === undefined) {
    throw new Error('useSites must be used within a SitesProvider');
  }
  return context;
};
