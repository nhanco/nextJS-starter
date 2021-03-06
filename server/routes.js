import crypto from "crypto"

module.exports = (app, handle) => {
  /**
  * Frontend controllers
  */
  app.get("/index", (req, res) => app.render(req, res, "/index", { urlPath: "/" }))

  app.post("/register", (req, res) => {
    res.status(200).json({
      data: "alo",
    })
  })
  // Verify username and password, if passed, we return jwt token for client
  // We also include xsrfToken for client, which will be used to prevent CSRF attack
  // and, you should use random complicated key (JWT Secret) to make brute forcing token very hard
  app.post("/authenticate", (req, res) => {
    let { username, password } = req.body
    // if logged in
    if (username === "test" || password === "test") {
      // create token
      const token = jwt.sign({
        username,
        xsrfToken: crypto.createHash("md5").update(username).digest("hex"),
      }, "jwtSecret", {
        expiresIn: 60 * 60 * 24 * 30, // 30days
      })
      res.status(200).json({
        success: true,
        message: "Enjoy your token",
        token,
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Authentication failed",
      })
    }
  })

  // Api example to prevent CRSF attack
  app.post("/api/preventCRSF", (req, res, next) => {
    if (req.decoded.xsrfToken === req.get("X-XSRF-TOKEN")) {
      res.status(200).json({
        success: true,
        message: "Yes, this api is protected by CRSF attack",
      })
    } else {
      res.status(400).json({
        success: false,
        message: "CRSF attack is useless",
      })
    }
  })

  app.get("*", (req, res) => handle(req, res))
}

