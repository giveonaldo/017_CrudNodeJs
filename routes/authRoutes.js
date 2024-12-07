const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const router = express.Router();

// Route Signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send("Error hashing password");

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      (err, result) => {
        if (err) return res.status(500).send("Error registering user");
        res.redirect("/login");
      }
    );
  });
});

// router.post("/signup", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // 1. Check for username uniqueness:
//     const existingUser = await db.query("SELECT * FROM users WHERE username = ?", [username]);

//     if (existingUser.length) {
//       // Username already exists, send error message with a redirect
//       return res.status(400).render("signup", {
//         layout: "layouts/main",
//         title: "Sign Up",
//         auth: false,
//         message: "Username already exists. Please choose a different one.",
//       });
//     }

//     // 2. Hash password using bcrypt:
//     const hash = await bcrypt.hash(password, 10);

//     // 3. Insert user into database:
//     await db.query(
//       "INSERT INTO users (username, password) VALUES (?, ?)",
//       [username, hash]
//     );

//     // 4. Redirect to login page after successful signup:
//     res.redirect("/login"); // Or display a success message on signup page
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Error during signup");
//   }
// });

// Route untuk menampilkan form signup
router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "layouts/main",
    title: "Sign Up",
    auth: false,
    message: false,
  });
});

// Route Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.session.userId);

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      console.log(results.length);
      if (err) return res.status(500).send("Error fetching user");
      if (results.length === 0) {
        return res.status(400).render("login", {
          layout: "layouts/main",
          title: "Login",
          message: "User not found!",
        });
      }

      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) return res.status(500).send("Error checking password");
        if (!isMatch) return res.status(401).send("Incorrect password");

        // Simpan userId dalam sesi setelah login berhasil
        req.session.userId = results[0].id;
        res.redirect("/"); // Arahkan ke halaman utama setelah login
      });
    }
  );
});

// Route untuk menampilkan form login
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/main",
    title: "Login",
    message: false,
    auth: false,
  });
});

// Route Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("/login"); // Arahkan ke halaman login setelah logout
  });
});

module.exports = router;
