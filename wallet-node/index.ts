import "dotenv/config";
import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.get("/", (req, res) => {
  return res.send("wallet api");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
