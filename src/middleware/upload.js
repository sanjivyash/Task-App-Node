const multer = require('multer');

const upload = multer({
	limit: { fileSize: 2000000 },
	fileFilter(req, file, cb) {
		if(file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			cb(undefined, true);
		} else {
			cb(new Error('Please upload image type file'));
		}
	}	
});

module.exports = upload;
