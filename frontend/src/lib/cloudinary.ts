export function toThumbnailUrl(url: string) {
  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", "/upload/f_auto,q_auto,w_640,c_fill/");
}
