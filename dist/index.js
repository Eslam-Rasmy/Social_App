import "dotenv/config";
import express from "express";
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running");
});
//# sourceMappingURL=index.js.map