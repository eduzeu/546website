import mongoose from "mongoose";
import bcrypt from "bcrypt";

const URL = "mongodb://localhost:27017/CS546-FP-WiFly";

const seedDatabase = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB.");

    const usersCollection = mongoose.connection.db.collection("users");
    const reviewsCollection = mongoose.connection.db.collection("reviews");

    const hashedPassword1 = await bcrypt.hash("password123A#", 16);
    const hashedPassword2 = await bcrypt.hash("password456A#", 16);
    const hashedPassword3 = await bcrypt.hash("password789A#", 16);
    const hashedPassword4 = await bcrypt.hash("password781H#", 16);
    const hashedPassword5 = await bcrypt.hash("password789C#", 16);
    const hashedPassword6 = await bcrypt.hash("password780B#", 16);

    await usersCollection.deleteMany({});
    console.log("Cleared existing users.");

    await reviewsCollection.deleteMany({});
    console.log("Cleared existing reviews.");

    const reviews = [
       {
        rating: [5],
        text: ["Great coffee, loved the flavor and ambiance!"],
        id: 418520887,
        type: "coffee",
      },
      {
        rating: [4],
        text: ["Nice place, good coffee, but a bit too crowded."],
        id: 746176794,
        type: "coffee",
      },
      {
        rating: [3],
        text: ["Average coffee, needs improvement in taste."],
        id: 883235940,
        type: "coffee",
      },
      {
        rating: [5],
        text: ["Best coffee ever, will definitely come back!"],
        id: 1383942697,
        type: "coffee",
      },
      {
        rating: [5],
        text: ["Amazing wifi, perfect for remote work!"],
        id: 21,
        type: "wifi",
      },
      {
        rating: [3],
        text: ["Wifi was decent, could be faster."],
        id: 28,
        type: "wifi",
      },
      {
        rating: [5],
        text: ["Wifi was fantastic, never had any issues!"],
        id: 1,
        type: "wifi",
      },
      {
        rating: [1],
        text: ["I did not like this place and would not recommend at all."],
        id: 7,
        type: "wifi",
      },
      {
        rating: [3],
        text: ["It was an okay location. Weather was bad when I went."],
        id: 15,
        type: "wifi",
      },
      {
        rating: [5],
        text: ["Very good place and good wifi for the speed"],
        id: 30,
        type: "wifi",
      },
    ];

    await reviewsCollection.insertMany(reviews);
    console.log("Seeded reviews successfully.");

    const users = [
      {
        username: "user123",
        email: "email@gmail.com",
        password: hashedPassword1,
        reviews: [418520887, 1, 28],
        friends: [],
      },
      {
        username: "user456",
        email: "email1l@gmail.com",
        password: hashedPassword2,
        reviews: [ 21,],
        friends: ["user1", "randomuser"],
      },
      {
        username: "user1",
        email: "email2@gmail.com",
        password: hashedPassword3,
        reviews: [ 7, 1383942697],
        friends: [],
      },
      {
        username: "randomuser",
        email: "randomuser@gmail.com",
        password: hashedPassword4,
        reviews: [ 883235940],
        friends: [],
      },
      {
        username: "user",
        email: "email_user@gmail.com",
        password: hashedPassword5,
        reviews: [30],
        friends: ["user32", "user123"],
      },
      {
        username: "user32",
        email: "email32@gmail.com",
        password: hashedPassword6,
        reviews: [15, 746176794],
        friends: ["randomuser", "user456"],
      },
    ];

    await usersCollection.insertMany(users);
    console.log("Seeded users successfully.");

  } catch (e) {
    console.error("Error:", e);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
