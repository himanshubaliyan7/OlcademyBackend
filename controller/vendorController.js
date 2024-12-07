const Vendor = require('../models/vendors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();
const secretKey = process.env.WhatIsYourName;



// Vendor Registeration Olcademy
const vendorRegister = async (req,res)=>{
    const {username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail==true){
            return res.status(400).json("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newVendor = new Vendor({
            username,
            email,
            password : hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message:"Vendor REgistered Successfully"})
        console.log("Registered Successfully")
    }catch(error){
        res.status(500).json({error:"Internal server Error"})
    }
}


// Vendor Login Olcademy
const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"});
        }
        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"});
        const vendorId = vendor._id;
        res.status(200).json({success:"Login success",token,vendorId});
        console.log(email,"this is the token",token);
    }catch(error){
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors});
    }catch (error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}


// get vendor by its ID
const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor Not Found"});
        }
        const vendorFirmId = vendor.firm[0]._id;
        res.status(200).json({vendorId,vendorFirmId});
        console.log(vendorFirmId);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById};
