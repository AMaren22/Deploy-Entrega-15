import moment from "moment";
import { Server } from "socket.io";
import { sqLiteDb } from "../classes/sqLiteDb.js";
import { ProductsModel } from "../models/product.model.js";

const initWsServer = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New connection established");

    socket.on("addProduct", async (product) => {
      try {
        const newProduct = {
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        };
        await ProductsModel.create(newProduct);
        io.emit("addTable", newProduct);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("newMessage", async (message) => {
      try {
        const newMessage = {
          email: message.email,
          msg: message.msg,
          time: moment().format("h:mm a"),
        };
        await sqLiteDb.insertData(newMessage);
        io.emit("renderMessage", newMessage);
      } catch (error) {
        console.log(error);
      }
    });
  });
  return io;
};
export default initWsServer;
