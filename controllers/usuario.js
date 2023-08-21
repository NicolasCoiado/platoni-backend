import db from "../config/db.js";

export const getUsuarios = (_, res) => {
  const sql = "SELECT * FROM usuario";
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(404).json(error);
    } else {
      return res.status(200).json(results);
    }
  });
};
