const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyJWT } = require("../middleware/jwtTOken");
const { verifyAdmin } = require("../middleware/verifyAdmin");

router.get("/admin-stats", verifyJWT, verifyAdmin, adminController.adminStatus);
router.get("/get-instructor", adminController.getInstructorDetails);
router.get("/get-enrolledClasses", adminController.getEnrolledClasses);
router.post(
  "/post-applied-instructor/:email",
  adminController.postAppliedInstructor
);
router.get("/get-applied-instructor", adminController.getAppliedInstructor);

module.exports = router;
