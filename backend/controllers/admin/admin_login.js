const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Hardcoded email and password
    const Email = "pinnukoushikp@gmail.com";
    const Password = "Koushik@2004";
    if (email === Email && password === Password) {
      return res.status(200).send({ message: "Login Successfully", admin: "admin_id_12345" });
    } else {
      return res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { login };
