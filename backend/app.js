const express = require("express");
const cors = require("cors");

const tripsRoutes = require("./routes/trips.routes");
const app = express();

app.use(cors());
app.use(express.json());
const PORT = 3000;
app.get("/",(req, res)=>{
    res.json({
        message: "Carnet de Route API is running",
    });
});
app.listen(PORT, () =>{
console.log(`Server running on http://localhost:${PORT}`);

});