const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //Folder where the images uploaded images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Generating a unique file name
    }
});
const upload = multer({ storage: storage });



// function to add a product to a particular resturant or firm
const addProduct = async (req,res)=>{
    try {
        const{productName,price,category,bestSeller,description} = req.body;
        const image = req.file?req.file.filename:undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(401).json({error:"No Firm Found"});
        }
        const product = new Product({
            productName,price,category,bestSeller,description,image,firm:firm._id
        })
        const savedProduct = await product.save();
        firm.product.push(savedProduct);
        await firm.save(); 
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

// function to get products of a firm
const getProductByFirm = async (req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"Firm Not Found"});
        }
        const resturantName = firm.firmName;
        const products = await Product.find({firm:firmId});
        res.status(200).json({resturantName,products});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"})
    }
}

// method to delete products
const deleteProductById = async(req,res) =>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            res.status(404).json({error:"Product Not Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}




module.exports = {addProduct: [upload.single('image'),addProduct] , getProductByFirm, deleteProductById};


