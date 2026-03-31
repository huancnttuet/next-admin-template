export interface CloudinaryUploadResult {
  secure_url: string;
}

function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const uploadFolder = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER;

  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  if (!uploadPreset) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }

  return { cloudName, uploadPreset, uploadFolder };
}

export async function uploadFileToCloudinary(file: File): Promise<string> {
  const { cloudName, uploadPreset, uploadFolder } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (uploadFolder) {
    formData.append('folder', uploadFolder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = (await response.json()) as Partial<CloudinaryUploadResult> & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message || 'Failed to upload file to Cloudinary',
    );
  }

  if (!data.secure_url) {
    throw new Error('Cloudinary did not return a file URL');
  }

  return data.secure_url;
}

export async function uploadFilesToCloudinary(
  files: File[],
): Promise<string[]> {
  const uploaded = await Promise.all(
    files.map((file) => uploadFileToCloudinary(file)),
  );
  return uploaded.filter(Boolean);
}
