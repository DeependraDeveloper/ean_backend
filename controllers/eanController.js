const { isValid } = require('../utils/extenstions');
const EanMaster = require('../models/EanMaster');

const AWS = require("aws-sdk");

AWS.config.update({
    maxRetries: 5,
    httpOptions: { timeout: 50000, connectTimeout: 5000 },
    region: "ap-south-1",
    accessKeyId: "AKIA3SABUUHKIXABJ5JV",
    secretAccessKey: "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",
});

s3 = new AWS.S3();

/// s3 upload
function s3Uploader(data, id, eancode, itemCode, itemName) {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: "trade-platform",
            Key: `ean-master/${id}/${data.originalname}`,
            Body: data.buffer,
            Metadata: {
                eancode: eancode || "",
                itemCode: itemCode || "",
                itemName: itemName || "",
            }
        };
        s3.upload(params, async function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location)
            }
        }
        )
    })
}

/// create eanMaster
const createEanMaster = async (req, res) => {
    try {
        let { itemDescription, itemName, eancode, itemCode, mrp, shelfLife, height, width, length, weight, unit, quantity } = req.body;
        const eanMaster = new EanMaster({
            itemDescription,
            itemName,
            eancode,
            itemCode,
            mrp,
            shelfLife,
            height,
            width,
            length,
            weight,
            unit,
            quantity,
        });
        const result = await eanMaster.save();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while creating eanMaster."
        });
    }
}


/// get all eanMasters list
const getAllEanMasters = async (req, res) => {
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 100;
        /// sort by updatedAt
        const result = await EanMaster.find().skip(page * limit).limit(limit).sort({ updatedAt: -1 });
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while retrieving eanMasters."
        });
    }
}

/// get eanMaster by id
const getEanMasterByID = async (req, res) => {
    try {
        let { id } = req.params;
        if (!isValid(id)) {
            return res.status(400).json({
                message: "you must provide valid data!"
            });
        }
        const result = await EanMaster.findById(id);
        if (!result) {
            console.log(`result: ${result}`);
            return res.status(404).json({
                message: "EanMaster is not found!"
            });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while retrieving eanMaster."
        });
    }
}

/// get eanMaster by eancode
const getEanMasterByEancode = async (req, res) => {
    try {
        let { eancode } = req.params;
        console.log(`eancode: ${eancode}`);
        /// console time stamp
        if (!isValid(eancode)) {
            return res.status(400).json({
                message: "Eancode is required!"
            });
        }
        const result = await EanMaster.findOne({ eancode: eancode });
        if (!result) {
            return res.status(400).json({
                message: "Eancode is not found!"
            });
        }
        console.log(`result: ${result}`);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while retrieving eanMaster."
        });
    }
}


/// update eanMaster
const updateEanMaster = async (req, res) => {
    try {
        let { id } = req.params;
        if (!isValid(id)) {
            return res.status(400).json({
                message: "you must provide valid data!"
            });
        }
        
        let { itemDescription, itemName, eancode, itemCode, mrp, shelfLife, height, width, length, weight, unit, quantity, updated, isVeg } = req.body;

        let updateMasterObj = {};

        if (itemDescription) {
            updateMasterObj.itemDescription = itemDescription;
        }
        if (itemName) {
            updateMasterObj.itemName = itemName;
        }
        if (eancode) {
            updateMasterObj.eancode = eancode;
        }
        if (itemCode) {
            updateMasterObj.itemCode = itemCode;
        }
        if (mrp) {
            updateMasterObj.mrp = mrp;
        }
        if (shelfLife) {
            updateMasterObj.shelfLife = shelfLife;
        }
        if (height) {
            updateMasterObj.height = height;
        }
        if (width) {
            updateMasterObj.width = width;
        }
        if (length) {
            updateMasterObj.length = length;
        }
        if (weight) {
            updateMasterObj.weight = weight;
        }
        if (unit) {
            updateMasterObj.unit = unit;
        }
        if (quantity) {
            updateMasterObj.quantity = quantity;
        }
        if (updated) {
            updateMasterObj.updated = updated;
        }
        if (isVeg) {
            updateMasterObj.isVeg = isVeg;
        }
        const imageFiles = req.files;
        console.log(`imageFiles: ${imageFiles}`);
        let uploadImages = [];
        if (imageFiles) {
            for (let i = 0; i < imageFiles.length; i++) {
                const data = imageFiles[i];
                const result = await s3Uploader(data, id, eancode, itemCode, itemName);
                uploadImages.push(result);
            }
        }
        let uploadResult = await Promise.all(uploadImages);

        console.log(`uploadResult: ${uploadResult}`);

        if (uploadResult.length > 0) {
            updateMasterObj.images = uploadResult;
        }

        console.log(`updateMasterObj`, updateMasterObj);

        let result = await EanMaster.findByIdAndUpdate(id, { $set: updateMasterObj }, { new: true });
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while updating the eanMaster."
        });
    }
}

/// history[where images is not empty and recent updated]
const getEanMasterHistory = async (req, res) => {
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 100;
        let result = await EanMaster.find({
            updatedAt: { $ne: null },
        }).skip(page * limit).limit(limit).sort({ updatedAt: -1 });
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while retrieving eanMasters."
        });
    }
}

/// full text search
const searchEanMasters = async (req, res) => {
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 100;
        const { key } = req.params;
        console.log(`key: ${key}`);
        if (!isValid(key)) {
            return res.status(400).json({
                message: "search key is required!"
            });
        }
        let result = await EanMaster.find({ itemName: { $regex: ".*" + key + ".*", $options: "i" } }
        ).skip(page * limit).limit(limit).sort({ updatedAt: -1 });
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "some error occurred while searching eanMasters."
        });
    }
}


// delete eanmaster 

const deleteEanMaster = async (req, res) => {
    try {
        let { id } = req.params;
        if (!isValid(id)) {
            return res.status(400).json({ message: "you must provide valid data!" })
        }
        const result = await EanMaster.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "EanMaster is not found!" })
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: error.message })
    }
}



/// export all functions
module.exports = {
    createEanMaster,
    getAllEanMasters,
    getEanMasterByID,
    getEanMasterByEancode,
    updateEanMaster,
    searchEanMasters,
    getEanMasterHistory,
    deleteEanMaster
}