/**
 * 获取Cookie值
 * @param name 需要获取的key
 * @returns value
 */
export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts: string[] = value.split(`; ${name}=`);
  if (Array.isArray(parts) && parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};
