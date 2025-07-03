export async function downloadImageAsBase64(url: string, filename: string) {
  const response = await fetch(url);
  const blob = await response.blob();

  const reader = new FileReader();

  reader.onloadend = function () {
    const base64data = reader.result as string;

    const link = document.createElement('a');
    link.href = base64data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  reader.readAsDataURL(blob);
}
