
export const fileToBase64 = (file: File): Promise<{data: string, mimeType: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:image/jpeg;base64,LzlqLzRBQ...""
      // we need to remove the prefix
      const base64Data = result.split(',')[1];
      const mimeType = result.split(';')[0].split(':')[1];
      resolve({data: base64Data, mimeType});
    };
    reader.onerror = (error) => reject(error);
  });
};
