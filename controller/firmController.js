const Firm = require('../models/Firm');
const Vendor = require('../models/vendors');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //Folder where the images uploaded images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Generating a unique file name
    }
});
const upload = multer({ storage: storage });


const addFirm = async (req, res) => {
    //Just adding the required thinngs in the process , other data linke location , video can be stored later
    try {
        const { firmName, area, category, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({ message: "Vendor Not Found" });
        }
        if(vendor.firm.length > 0){
            res.status(400).json({message:"One Vendor Can Have Only One Firm"})
        }
        const firm = new Firm({
            firmName, area, category, offer, image, vendor: vendor._id
        })
        const savedFirm = await firm.save();
        const firmId = savedFirm._id;
        vendor.firm.push(savedFirm);
        await vendor.save();
        return res.status(200).json({ message: "Firm Added Successfully" ,firmId});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            return res.status(404).json({error:"Firm Not Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
    }

}




module.exports = { addFirm: [upload.single('image'), addFirm] ,deleteFirmById};


