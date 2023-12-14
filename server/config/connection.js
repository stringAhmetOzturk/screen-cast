import mysql from "mysql"
import dotenv from "dotenv"

dotenv.config()
let db = null
try {
 db = mysql.createConnection({
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
})
}catch (e) {
	console.log(e);
}




export default db












// let db = null


// try {
//   db = mysql.createConnection({
//     // host:"localhost",
//     // user:"roboticapp123",
//     // password:"g8fv07B@0",
//     // database:"roboticapp"
//     host:"localhost",
//     user:"root",
//     password:"root",
//     database:"roboticapp"
// })

// }catch (e) {
// 	console.log(e);
// }

// export {db}
