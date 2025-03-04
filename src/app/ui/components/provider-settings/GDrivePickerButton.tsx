'use client';

import { useState, useEffect } from 'react';

export interface GDrivePickerButtonProps {
  className?: string;
  autoOpen?: boolean;
  triggerOpen?: boolean;
}

declare global {
  interface Window {
    gapi: any;    // eslint-disable-line @typescript-eslint/no-explicit-any
    google: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export default function GDrivePickerButton({ 
  className, 
  autoOpen = false,
  triggerOpen = false
}: GDrivePickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pickerReady, setPickerReady] = useState(false);
  const [justConnected, setJustConnected] = useState(false);

  // Check if we just connected and should auto-open
  useEffect(() => {
    if (typeof window !== 'undefined' && autoOpen) {
      const urlParams = new URLSearchParams(window.location.search);
      const connected = urlParams.get('justConnected') === 'true';
      
      if (connected) {
        // Remove the query parameter without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setJustConnected(true);
      }
    }
  }, [autoOpen]);

  // Load Google Picker API when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.gapi) {
      loadGooglePickerAPI();
    } else if (window.gapi) {
      setPickerReady(true);
    }
  }, []);
  
  // Auto-open picker when we've just connected and picker is ready
  useEffect(() => {
    if ((justConnected || triggerOpen) && pickerReady) {
      // Open picker after a small delay to ensure scripts are fully loaded
      const timer = setTimeout(() => {
        openGooglePicker();
        setJustConnected(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [justConnected, pickerReady, triggerOpen]);

  // Load Google Picker API
  const loadGooglePickerAPI = async () => {
    try {
      // Load the Google API client
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('picker', () => resolve());
        };
        document.body.appendChild(script);
      });

      // Load Google Identity Services
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

      setPickerReady(true);
    } catch (error) {
      console.error('Failed to load Google Picker API:', error);
    }
  };

  // Open Google Picker
  const openGooglePicker = async () => {
    setIsLoading(true);
        
    try {
      // Get credentials from the server
      const credentialsResponse = await fetch('/api/auth/gdrive/credentials');
      if (!credentialsResponse.ok) {
        throw new Error('Failed to get credentials');
      }
      
      const { accessToken, apiKey } = await credentialsResponse.json();
      
      // Create and display the picker
      const googleViewId = window.google.picker.ViewId.DOCS;
      
      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setTitle('Select Google Drive files to use with WayStation')
        .setAppId(77803289750)
        .setDeveloperKey(apiKey)
        .setOAuthToken(accessToken)
        .addView(googleViewId)
        .setCallback((data: any) => pickerCallback(data)) // eslint-disable-line @typescript-eslint/no-explicit-any
        .build();
      
      picker.setVisible(true);
    } catch (error) {
      console.error('Error opening Google Picker:', error);
      setIsLoading(false);
    }
  };

  // Handle picker selection
  const pickerCallback = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setIsLoading(false);
    
    // If picker was closed or cancelled
    if (data.action !== window.google.picker.Action.PICKED) {
      return;
    }
        
  };

  // Handle button click
  const handleClick = () => {
    if (!pickerReady) {
      loadGooglePickerAPI().then(() => {
        openGooglePicker();
      });
    } else {
      openGooglePicker();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className || "px-2 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"}
      title="Select Google Drive files"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
}