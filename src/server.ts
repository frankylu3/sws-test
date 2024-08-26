import express from "express";
import router from "./routes";

const app = express();
app.use(express.json());
app.use("/company", router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
