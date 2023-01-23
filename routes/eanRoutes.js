const router = require('express').Router();

const { createEanMaster,
    getAllEanMasters,
    getEanMasterByID,
    getEanMasterByEancode,
    updateEanMaster,
    searchEanMasters,
    getEanMasterHistory,
    deleteEanMaster
} = require('../controllers/eanController');

var multer = require('multer');
const AWS = require("aws-sdk");

/// aws s3 config
AWS.config.update({
    maxRetries: 3,
    httpOptions: { timeout: 30000, connectTimeout: 5000 },
    region: "ap-south-1",
    accessKeyId: "AKIA3SABUUHKIXABJ5JV",
    secretAccessKey: "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",
});


s3 = new AWS.S3();

/// multer config
var storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, `./upload ${file.originalname}`);
    }
});

var uploadImages = multer({ storage: storage }).array('images', maxCount = 9);

/// create eanMaster
router.post('/create', createEanMaster);
/// get all eanMasters
router.get('/items', getAllEanMasters);
/// get eanMaster by id
router.get('/item/:id', getEanMasterByID);
/// get eanMaster by eancode
router.get('/eancode/:eancode', getEanMasterByEancode);
/// update eanMaster by id
router.put('/item/:id', uploadImages, updateEanMaster);
/// search eanMasters
router.get('/search/:key', searchEanMasters);
/// history
router.get('/history', getEanMasterHistory);
/// delete eanMaster by id
router.delete('/item/:id', deleteEanMaster);
/// export router
module.exports = router;

