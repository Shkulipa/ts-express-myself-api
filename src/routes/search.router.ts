import { Router } from "express";
import searchController from "../controllers/search.controller";
import validation from "../middlewares/validation.middleware";
import search from "../schemas/search.schema";

const searchRouter = Router();

searchRouter.get("/", validation(search), searchController.searchAll);
searchRouter.get("/post", validation(search), searchController.searchPost);
searchRouter.get("/user", validation(search), searchController.searchUser);
searchRouter.get("/tags", validation(search), searchController.searchTags);

export default searchRouter;
