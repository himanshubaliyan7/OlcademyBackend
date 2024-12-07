const express = require('express')
const app = express();
const dotEnv = require('dotenv');
const mongoose = require('mongoose'); 
const vendorRoutes = require('./routes/vendorRoutes')
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productsRoutes');
const path = require('path');
const cors = require('cors');


const PORT = 4040;


dotEnv.config();

mongoose.connect("mongodb+srv://vivekrkhpt:V22173127v@cluster0.srb9d.mongodb.net/Olcad?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Connected Successfully");
}).catch((error)=>{
    console.log(error);
})
app.use(cors());
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/products',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT , ()=>{
    console.log(`The server is running on port ${PORT}`)
})
app.use("/",(req,res)=>{
    res.send("<h1>This is Olcademy project</h1>")
})



