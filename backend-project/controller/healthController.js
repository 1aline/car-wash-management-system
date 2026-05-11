function health(req, res) {
  res.json({ message: "CWSMS API is running" });
}

module.exports = { health };
