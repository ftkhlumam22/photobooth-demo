export const useDownload = () => {
  const downloadImage = (dataUrl: string, filename = 'photobooth-image.jpg') => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return { downloadImage };
};