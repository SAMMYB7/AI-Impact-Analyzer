const express = require("express");
const router = express.Router();
const { getUserRepos, getRepoPulls, getPullFiles } = require("../controllers/githubController");
const { protect } = require("../middleware/auth");

// All routes protected
router.get("/repos", protect, getUserRepos);
router.get("/repos/:owner/:repo/pulls", protect, getRepoPulls);
router.get("/repos/:owner/:repo/pulls/:number/files", protect, getPullFiles);

module.exports = router;
