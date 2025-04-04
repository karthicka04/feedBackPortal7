// migrate_likes.js
import mongoose from "mongoose";
import Feedback from "./models/feedback.js"; // Adjust path as needed
import dotenv from "dotenv";

dotenv.config();

const migrateData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, { // replace the value of the URI here
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database Connected!");
        // Get all Feedback documents
        const feedbacks = await Feedback.find();

        // Loop through each feedback
        for (const feedback of feedbacks) {
            console.log(`Processing feedback: ${feedback._id}`);

            // Check if 'likes' is an integer; if so, convert it to an array
            if (typeof feedback.likes === 'number') {
                console.log(`Converting likes for feedback: ${feedback._id}`);
                feedback.likes = []; // Initialize as an empty array
                await feedback.save(); // Save the changes
                console.log(`Successfully converted likes to array for feedback: ${feedback._id}`);
            }
        }

        console.log("Data migration completed successfully!");
    } catch (error) {
        console.error("Data migration failed:", error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log("Disconnected from database.");
    }
};

migrateData();