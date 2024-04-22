// import app from './app.js';
// import connectDB from './utils/db.js';

// const PORT = process.env.PORT || 6969;

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
//   });
// });

// Assume server is imported from app.js which includes the HTTP and WebSocket setup
// import { server, io } from "./app.js";
// import connectDB from "./utils/db.js";

// const PORT = process.env.PORT || 6969;

// connectDB()
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);

//       // You can also initialize socket.io related functionality here if needed
//       // Server-side socket.io setup
//       io.on("connection", (socket) => {
//         socket.on("sendOffer", ({ tradeId, offerDetails }) => {
//           console.log(`Offer received for trade ${tradeId}:`, offerDetails);
//           // You could broadcast this offer to other interested clients
//           socket.broadcast.to(tradeId).emit("newOffer", offerDetails);
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to the database:", err);
//     process.exit(1); // Exit process if DB connection fails
//   });

// import { server, io } from "./app.js";
// import connectDB from "./utils/db.js";
// import Offer from "./models/Offer.js"; // Make sure to import the Offer model

// const PORT = process.env.PORT || 6969;

// connectDB()
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);

//       io.on("connection", (socket) => {
//         console.log("A user connected");

//         socket.on("sendOffer", async ({ tradeId, offerDetails }) => {
//           console.log(`Offer received for trade ${tradeId}:`, offerDetails);

//           // Save offer to database
//           try {
//             const newOffer = new Offer({
//               ...offerDetails,
//               tradeId  // Ensure tradeId is included if your model requires it
//             });
//             const savedOffer = await newOffer.save();

//             // After saving, you can emit this offer to all clients in the same room
//             io.to(tradeId).emit("newOffer", savedOffer);
//           } catch (error) {
//             console.error('Failed to save offer:', error);
//             // Optionally, notify the sender of the failure
//             socket.emit('errorSavingOffer', { message: "Failed to save offer." });
//           }
//         });

//         socket.on("disconnect", () => {
//           console.log("User disconnected");
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to the database:", err);
//     process.exit(1);
//   });

import { server, io } from "./app.js";
import connectDB from "./utils/db.js";
import Offer from "./models/Offer.js"; // Assuming this model is already defined
import Trade from "./models/Trade.js"; // Assuming this model is already defined

const PORT = process.env.PORT || 6969;

// connectDB()
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);

//       io.on("connection", (socket) => {
//         console.log("A user connected");
      
//         // Join a specific user's room
//         socket.on('joinRoom', (username) => {
//           socket.join(username);
//           console.log(`User ${username} joined room: ${username} `);
//         });
      
//         socket.on("sendOffer", async ({ tradeId, offerDetails }) => {
//           try {
//             const trade = await Trade.findById(tradeId);
//             if (!trade) {
//               console.log('Trade not found');
//               return;
//             }
      
//             // Save the new offer
//             const newOffer = new Offer({
//               ...offerDetails,
//               tradeId,
//               owner: trade.username // Assuming you store the owner's username in the trade model
//             });
      
//             const savedOffer = await newOffer.save();
      
//             // Emit the offer to the room corresponding to the trade owner's username
//             io.to(trade.tradeId).emit("newOffer", savedOffer);
//             console.log(`Offer sent to room of ${trade.username} ${savedOffer}`);
      
//           } catch (error) {
//             console.error('Failed to save offer:', error);
//             socket.emit('error', { message: "Failed to save offer." });
//           }
//         });
      
//         socket.on("disconnect", () => {
//           console.log("User disconnected");
//         });
//       });
      
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to the database:", err);
//     process.exit(1);
//   });

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);

      io.on("connection", (socket) => {
        console.log("A user connected");
      
        // Join a specific user's room
        socket.on('joinRoom', (username) => {
          socket.join(username);
          console.log(`User ${username} joined room: ${username} `);
        });
      
        socket.on("sendOffer", async ({ tradeId, offerDetails }) => {
          try {
            const trade = await Trade.findById(tradeId);
            if (!trade) {
              console.log('Trade not found');
              return;
            }
      
            // Save the new offer
            const newOffer = new Offer({
              ...offerDetails,
              tradeId,
              owner: trade.username // Assuming you store the owner's username in the trade model
            });
      
            const savedOffer = await newOffer.save();
      
            // Emit the offer to the room corresponding to the trade ID
            io.to(tradeId).emit("newOffer", savedOffer);
            console.log(`Offer sent to room of trade ID ${tradeId}:`, savedOffer);
      
          } catch (error) {
            console.error('Failed to save offer:', error);
            socket.emit('error', { message: "Failed to save offer." });
          }
        });
      
        socket.on("disconnect", () => {
          console.log("User disconnected");
        });
      });
      
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });
