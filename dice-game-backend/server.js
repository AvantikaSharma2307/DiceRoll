import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());



app.post("/roll-dice", (req, res) => {
    const roll = Math.floor(Math.random() * 6) + 1; 
    res.json({ roll });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
