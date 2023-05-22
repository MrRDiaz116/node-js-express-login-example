exports.allAccess = (req, res) => {
  res.status(200).send("Contenido público.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Contenido de usuario.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Contenido de farmacia.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Contenido de gobierno.");
};

exports.dashboardBoard = (req, res) => {
  res.status(200).json("Dashboard funciona.");
};
