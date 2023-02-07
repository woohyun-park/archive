import axios, { AxiosRequestConfig } from "axios";

export async function uploadImage(file: File[]) {
  const formData = new FormData();
  const config: AxiosRequestConfig<FormData> = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  formData.append("api_key", process.env.NEXT_PUBLIC_CD_API_KEY || "");
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CD_UPLOADE_PRESET || ""
  );
  formData.append(`file`, file[0]);

  return await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
    formData,
    config
  );
}
