import { server, io } from "./app.js";
import connectDB from "./utils/db.js";
import Offer from "./models/Offer.js";
import Trade from "./models/Trade.js";

const PORT = process.env.PORT || 6969;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);

      io.on("connection", (socket) => {
        console.log(" user connected");

        socket.on("joinRoom", (username) => {
          socket.join(username);
          console.log(`User ${username} joined room: ${username} `);
        });

        socket.on("sendOffer", async ({ tradeId, offerDetails }) => {
          try {
            const trade = await Trade.findById(tradeId);
            if (!trade) {
              console.log("Trade not found");
              return;
            }
            const newOffer = new Offer({
              ...offerDetails,
              tradeId,
              owner: trade.username,
            });

            const savedOffer = await newOffer.save();

            io.to(tradeId).emit("newOffer", savedOffer);
            console.log(
              `Offer sent to room of trade ID ${tradeId}:`,
              savedOffer
            );
          } catch (error) {
            console.error("Failed to save offer:", error);
            socket.emit("error", { message: "Failed to save offer." });
          }
        });

        socket.on("disconnect", () => {
          console.log("User disconnected");
        });
      });
    });
  })
  .catch((err) => {
    console.error("failed to connect to the db:", err);
    process.exit(1);
  });
