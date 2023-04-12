const router = require("express").Router();
const userController = require("../../controllers/userController.js");
const {
  verifyToken,
  verifyTokenAdmin,
} = require("../../middlewares/verifyToken.js");

router.put("/update/:userId", verifyToken, userController.updateUser);
router.put(
  "/change_password/:userId",
  verifyToken,
  userController.changePassword
);
router.delete("/delete/:userId", verifyTokenAdmin, userController.deleteUser);

router.get("/:userId", userController.getDetailUser);

router.get("/", userController.getAllUser);

//////////////////////////////////////////////////////

router.post("/test", (req, res, next) => {
  console.log(req.query);
  res.send("Hello");
});

// path params  va query params là lại 2 tham số được truyền vào qua web

/* 
 path params là tham số được truyền vào qua url req và dc đătj vào path url và sau "/"
 -ví dụ: "users/:id"

 -nếu đã khai báo trên url thì không được bỏ trống
 -trả về cho 1 obj gồm các path bằng req.params
   + key của 1 element sẽ là tên của path params
   + và value là giá trị truyền vào
*/

/*
    QUERY PARAMS

  - là tham số được truyền vào qua url req và dc đătj vào path url và sau "?" và được phân tách bằng dấu "&"
   -ví dụ: "users?name=hoang&"

   -nó không bắt buộc phải khai báo trên url 


*/

module.exports = router;
