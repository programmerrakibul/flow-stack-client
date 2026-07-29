import { uploadImage } from "@/lib/upload-image";
import { useState } from "react";

const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, setProgress);
      return url;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  return { upload, isUploading, progress };
};

export default useImageUpload;
