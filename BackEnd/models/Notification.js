// routes/admin.js
import User from "../models/User.js";

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});
