const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const cartController = require("../controllers/cartController");
const paymentController = require("../controllers/paymentController");
const userController = require("../controllers/userController");
const { generateToken, verifyJWT } = require("../middleware/jwtTOken");
const { verifyAdmin } = require("../middleware/verifyAdmin");
const { verifyInstructor } = require("../middleware/verifyInstructor");

//Routes For Class Operations
router.get("/classes", classController.getallCLasses);

router.get("/classes/:email", verifyJWT, classController.getinstructorMail);

router.post(
  "/new-class",
  verifyJWT,
  verifyInstructor,
  classController.postNewClass
);

router.get("/manage-classes", classController.manageClasses);
router.patch(
  "/update-classStatus/:id",
  verifyJWT,
  verifyAdmin,
  classController.updateClassStatus
);
router.get("/single-class/:id", classController.singleClassDetails);
router.get("/approved-classes", classController.approvedClasses);
router.put(
  "/update-classdetails/:id",
  verifyJWT,
  verifyInstructor,
  classController.updateClassDetails
);

//Routes For Cart Operations
router.post("/add-to-cart", verifyJWT, cartController.addToCart);
router.get("/get-cart-Item/:id", verifyJWT, cartController.getCartItemsbyId);
router.get("/get-cart-info/:email", verifyJWT, cartController.cartinfobyID);
router.delete(
  "/delete-cart-item/:id",
  verifyJWT,
  cartController.deleteCartbyID
);

//Routes for Payment
router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/payment-info", verifyJWT, paymentController.postPaymentIntent);
router.get("/payment-history/:email", paymentController.getPaymentHistory);
router.get(
  "/payment-history-length/:email",
  paymentController.PaymentHistoryLength
);

//Routes for Enrollment
router.get("/popular-classes");
router.get("/popular-instructors");

//Routes for User
router.post("/user-signup", userController.postNewUser);
router.get("/get-all-user", userController.getAllUsers);
router.get("/get-user/:id", userController.getUsersByID);

router.post("/get-useremail/:email", verifyJWT, userController.getUsersByEmail);

router.put("/user-update", verifyJWT, verifyAdmin, userController.updateUser);

router.put(
  "/deleteuser/:id",
  verifyJWT,
  verifyAdmin,
  userController.deleteUser
);
router.post("/generate-token", generateToken);

module.exports = router;
