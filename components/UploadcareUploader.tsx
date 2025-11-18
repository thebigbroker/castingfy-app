"use client";

import { useEffect, useRef } from "react";
import { UPLOADCARE_PUBLIC_KEY } from "@/lib/constants";

interface UploadcareUploaderProps {
  onFileUpload: (cdnUrl: string) => void;
  accept?: string;
  imgOnly?: boolean;
  multiple?: boolean;
  value?: string;
}

// Uploadcare types
interface UploadcareFileInfo {
  cdnUrl: string;
  uuid: string;
  name: string;
  size: number;
  isImage: boolean;
  originalImageInfo?: {
    width: number;
    height: number;
  };
}

interface UploadcareWidget {
  onUploadComplete: (callback: (info: UploadcareFileInfo) => void) => void;
}

interface WindowWithUploadcare extends Window {
  uploadcare?: {
    Widget: (input: HTMLInputElement | null) => UploadcareWidget;
  };
}

// Global flag to track if script is loaded
let uploadcareScriptLoaded = false;
let uploadcareScriptLoading = false;

export default function UploadcareUploader({
  onFileUpload,
  accept,
  imgOnly = false,
  multiple = false,
  value,
}: UploadcareUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetInstanceRef = useRef<UploadcareWidget | null>(null);

  useEffect(() => {
    const initializeWidget = () => {
      const windowWithUploadcare = window as WindowWithUploadcare;
      if (inputRef.current && windowWithUploadcare.uploadcare && !widgetInstanceRef.current) {
        const widget = windowWithUploadcare.uploadcare.Widget(inputRef.current);

        widget.onUploadComplete((info: UploadcareFileInfo) => {
          onFileUpload(info.cdnUrl);
        });

        widgetInstanceRef.current = widget;
      }
    };

    // If script is already loaded, initialize immediately
    if (uploadcareScriptLoaded) {
      initializeWidget();
      return;
    }

    // If script is currently loading, wait for it
    if (uploadcareScriptLoading) {
      const checkInterval = setInterval(() => {
        if (uploadcareScriptLoaded) {
          clearInterval(checkInterval);
          initializeWidget();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load script for the first time
    uploadcareScriptLoading = true;
    const existingScript = document.querySelector('script[src*="uploadcare"]');

    if (existingScript) {
      uploadcareScriptLoaded = true;
      uploadcareScriptLoading = false;
      initializeWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
    script.async = true;

    script.onload = () => {
      uploadcareScriptLoaded = true;
      uploadcareScriptLoading = false;
      initializeWidget();
    };

    script.onerror = () => {
      uploadcareScriptLoading = false;
      console.error("Failed to load Uploadcare script");
    };

    document.body.appendChild(script);

    // Don't remove the script on cleanup - it should persist
    return () => {
      // Widget cleanup would go here if needed
    };
  }, [onFileUpload]);

  return (
    <input
      ref={inputRef}
      type="hidden"
      role="uploadcare-uploader"
      data-public-key={UPLOADCARE_PUBLIC_KEY}
      data-tabs="file url"
      data-images-only={imgOnly}
      data-multiple={multiple}
      data-crop={imgOnly ? "free" : undefined}
      data-input-accept-types={accept}
      defaultValue={value || ""}
    />
  );
}
