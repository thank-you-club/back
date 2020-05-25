import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { getDownloadPath } from "./pathUtils";

export async function downloadFile(filename: string, url: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(
      path.resolve(getDownloadPath(), filename)
    );
    const request = http.get(url, response => {
      response.pipe(file);
    });
    request.on("close", () => resolve());
    request.on("error", err => reject(err));
  });
}

export async function deleteFile(filepath: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
