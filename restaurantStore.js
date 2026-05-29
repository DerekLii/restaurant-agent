import fs from "fs";

const DATA_FILE = "./restaurants.json";

export function loadRestaurants() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function saveRestaurants(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}