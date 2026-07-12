export function resolveProductImage(image) {
  if (!image || typeof image !== 'string') return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
    return trimmed;
  }

  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  return `/images/${trimmed}`;
}
