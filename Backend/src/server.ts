import { configDotenv } from "dotenv";
configDotenv()
import app from "./app.js";
import { connectToDb } from "./config/db.js";

const port= Number(process.env.PORT) || 5000

await connectToDb();

app.listen(port, ()=> console.log(`app listening on port ${port}`) )
