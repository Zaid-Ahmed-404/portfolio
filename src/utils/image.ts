/**
 * Get image path with basePath for production
 * In development, returns the path as-is. In production, adds the basePath prefix.
 */
export const getImgPath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  if (!basePath) {
    return path;
  }

  if (path.startsWith(basePath)) {
    return path;
  }

  return `${basePath}${path}`;
};
