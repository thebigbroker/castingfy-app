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
      if (widgetRef.current && (window as any).uploadcare) {
        const widget = (window as any).uploadcare.Widget(widgetRef.current.querySelector("input"));

        widget.onUploadComplete((info: any) => {
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
