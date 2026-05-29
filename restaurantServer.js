import express from "express";
import { loadRestaurants, saveRestaurants } from "./restaurantStore.js";

const app = express();
app.use(express.json());

let restaurants = loadRestaurants();

app.post("/restaurants", (req, res) => {
  const newRestaurant = {
    id: Date.now(),
    ...req.body
  };

  restaurants.push(newRestaurant);
  saveRestaurants(restaurants);

  res.json(newRestaurant);
});

app.delete("/restaurants/:id", (req, res) => {
  const id = Number(req.params.id);

  restaurants = restaurants.filter(r => r.id !== id);
  saveRestaurants(restaurants);

  res.json({ message: "deleted" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});