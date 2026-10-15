export async function prepareImage(file, kind = 'cover') {
  if (!file.type.startsWith('image/')) throw new Error('Выберите файл изображения.');
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('Не удалось прочитать изображение. Попробуйте JPG или PNG.'));
      image.src = source;
    });
    const maxEdge = kind === 'cover' ? 900 : 1800;
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Браузер не смог обработать изображение.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', kind === 'cover' ? .82 : .9);
  } finally {
    URL.revokeObjectURL(source);
  }
}
