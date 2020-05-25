export function getDownloadPath() {
  return process.env.NODE_ENV === "production" ? "../tmp" : "files";
}
export function getProcessedPath() {
  return process.env.NODE_ENV === "production" ? "../tmp" : "processed";
}
export function getUploadPath() {
  return process.env.NODE_ENV === "production" ? "../tmp" : "upload";
}
