import { Router, Request } from "express";
import * as cloudinary from "cloudinary";
import { resolve } from "path";
import { deleteFile } from "../../../modules/fileUtils";
cloudinary.config({
  cloud_name: "heiyukidev",
  api_key: process.env.cloudinaryAPIKey,
  api_secret: process.env.cloudinaryAPISecret
});
const router = Router();
interface IFileRequest extends Request {
  files: {
    file: any;
  };
}
// just Placeholder cause we'll always need this
// router.post("/", (req: IFileRequest, res) => {
//   if (!req.files) res.status(400).send({});

//   const file = req.files.file;
//   const path = "/upload/" + file.name;

//   file.mv("." + path, err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }
//     cloudinary.v2.uploader.upload(
//       __dirname + "/../../../.." + path,
//       {
//         resource_type: "raw"
//       },
//       (error, result) => {
//         if (error) {
//           console.error(error);
//           res.status(500).send(error);
//         }
//         deleteFile(resolve(path));
//         return res.send({
//           url: result.url,
//           originalFileName: result.original_filename
//         });
//       }
//     );
//   });
// });

export default router;
