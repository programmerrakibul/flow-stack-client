import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

export const uploadImage = async (
  file: File,
  setProgress?: Dispatch<SetStateAction<number | null>>,
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress?.(percent);
        }
      },
    },
  );

  return data.data.url;
};
