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

export default function UploadcareUploader({
  onFileUpload,
  accept,
  imgOnly = false,
  multiple = false,
  value,
}: UploadcareUploaderProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import Uploadcare widget script
    const script = document.createElement("script");
    script.src = "https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const windowWithUploadcare = window as WindowWithUploadcare;
      if (widgetRef.current && windowWithUploadcare.uploadcare) {
        const inputElement = widgetRef.current.querySelector("input") as HTMLInputElement | null;
        const widget = windowWithUploadcare.uploadcare.Widget(inputElement);

        widget.onUploadComplete((info: UploadcareFileInfo) => {
          const cdnUrl = info.cdnUrl;
          onFileUpload(cdnUrl);
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onFileUpload]);

  return (
    <div ref={widgetRef}>
      <input
        type="hidden"
        role="uploadcare-uploader"
        data-public-key={UPLOADCARE_PUBLIC_KEY}
        data-tabs="file url"
        data-images-only={imgOnly}
        data-multiple={multiple}
        data-crop={imgOnly ? "free" : undefined}
        data-input-accept-types={accept}
        value={value}
      />
    </div>
  );
}
