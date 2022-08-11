import router from "./routes";
import { verify } from "jsonwebtoken";
import { signinUser, signupUser, checkUser } from "../controllers/controller";

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/check", checkUser);
