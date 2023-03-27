const app = require("./app")
const connectToDatabase = require("./db/Database")


// Handling uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`shutting down the server for handling uncaught execption`)
})


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "backend/config/.env",
    });
}

// connect To DB
connectToDatabase();


// create server
const PORT = process.env.PORT
const server  = app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);
  
    server.close(() => {
      process.exit(1);
    });
});