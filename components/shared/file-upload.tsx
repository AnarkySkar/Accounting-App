"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File[]; // Cambiato per supportare più file
  onChange?: (files?: File[]) => void; // Cambiato per supportare più file
  className?: string;
}

export function FileUpload({ value, onChange, className }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value || []); // Gestisce un array di file

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = [...files, ...acceptedFiles]; // Aggiungi i nuovi file all'array esistente
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10, // Impostato per caricare fino a 10 file, puoi modificarlo
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  const removeFile = useCallback(
    (fileToRemove: File) => {
      const updatedFiles = files.filter((file) => file !== fileToRemove);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, onChange]
  );

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition cursor-pointer",
          isDragActive && "border-primary",
          "dark:border-gray-800 dark:hover:border-gray-700"
        )}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                  className="ml-auto hover:opacity-75 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <Cloud className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop files here or click to select
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
