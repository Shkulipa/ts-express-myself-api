import { Response, Request, NextFunction } from "express";
import FileService from "../services/file.service";
import { IUserRequest } from "../types/user.type";
import { errorHandler } from "../handlers/error.handler";
import logger from "../utils/logger";

const checkFiles =
	(limitFiles: number, types: string[], avaibleSize: number) =>
	(req: Request, res: Response, next: NextFunction) => {
		req as IUserRequest;
		const handling = limitFiles > 1 ? "The File" : "Files";
		try {
			if (req.files && req.files.images) {
				const filesArr = FileService.parseUploadFile(req.files.images);

				/**
				 * Check limit files
				 */
				if (filesArr.length > limitFiles)
					return res
						.status(400)
						.send(
							errorHandler(
								`You can upload up to ${limitFiles} ${handling} inclusive`
							)
						);

				/**
				 * Check type(s) of Upload file(s)
				 */
				const isValidTypes = FileService.isValidType(filesArr, types);

				if (!isValidTypes) {
					const typesToString = FileService.typesToString(types);
					return res
						.status(400)
						.send(
							errorHandler(`${handling} type must be one of: ${typesToString}`)
						);
				}

				/**
				 * Check size value of Upload file(s)
				 * * sizeInBytes convets into Mb(need * 1e6)
				 */
				const sizeInBytes = avaibleSize * 1e6;
				const isValidSize = FileService.isValidSize(filesArr, sizeInBytes);

				if (!isValidSize)
					return res
						.status(400)
						.send(
							errorHandler(
								`${handling} must not be larger than ${avaibleSize} megabytes`
							)
						);
			} // end if

			next();
		} catch (err) {
			logger.error(err);
			return res
				.status(500)
				.send(
					errorHandler(`Sorry, something went wrong while check ${handling}`)
				);
		}
	};

export default checkFiles;
