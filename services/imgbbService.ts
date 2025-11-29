import { IMGBB_API_KEY } from '../constants';

interface ImgBBResponse {
  data: {
    url: string;
  };
  success: boolean;
}

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data: ImgBBResponse = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('ImgBB returned unsuccessful response');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
