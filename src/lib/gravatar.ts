import md5 from "md5";

export function getGravatarUrl(email: string, size = 80): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=${size}`;
}
