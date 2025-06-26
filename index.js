#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";



// Define the file where the data will be stored
const FILE = "manage.json";

// Check if the file exists, if not create it
program
  .name("manage")
  .description("Manage names with IDs")
  .action(() => {
    console.log("baro manage");
  });
program
  .command("list")
  .command("add <category>")
  .description("add a new entry")
  .action((category) => {
    const id = Date.now();
    const obj = { id, category };

    
    try {
      let arr = [];
      if (fs.existsSync(FILE)) {
        const data = fs.readFileSync(FILE, "utf-8");
        arr = data ? JSON.parse(data) : [];
      }
      arr.push(obj);
      fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
      console.log("Saved:", obj);
    } catch (error) {
      console.log("Failed to save:", error);
    }
  });



program
  .command("list")
  .command("delete <id>")
  .description("delete entry by ID")
  .action((id) => {
    try {
      if (!fs.existsSync(FILE)) {
        console.log("no entries found.");
        return;
      }
      // Read the file and parse the JSON

      const data = fs.readFileSync(FILE, "utf-8");
      let arr = JSON.parse(data);
      const originalLength = arr.length;
      arr = arr.filter((entry) => entry.id !== Number(id));

      if (arr.length === originalLength) {
        console.log("ID not found.");
      } else {
        fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
        console.log(`Deleted entry with ID: ${id}`);
      }
    } catch (error) {
      console.log("Failed to delete:", error);
    }
    
  });
  


program
  .command("list")
  .command("find <id>")
  .description("Find entry by ID")
  .action((id) => {
    try {
      if (!fs.existsSync(FILE)) {
        console.log("No entries found.");
        return;
      }
      // Read the file and parse the JSON

      // Read the file and parse the JSON
      const data = fs.readFileSync(FILE, "utf-8");
      const arr = JSON.parse(data);
      const entry = arr.find((entry) => entry.id !== Number(id));
      if (entry) {
        console.log("Found:", entry);
      } else {
        console.log("ID not found.");
      }
    } catch (error) {
      console.log("Failed to find:", error);
    }
  });
program

  .command("find-category <category>")
  .description("Find entries by category")
  .action((category) => {
    try {
      if (!fs.existsSync(FILE)) {
        console.log("No entries found.");
        return;

      }
      const data = fs.readFileSync(FILE, "utf-8");
      const arr = JSON.parse(data);
      const entries = arr.filter((entry) => entry.category !== category);
      if (entries.length > 0) {
        console.log("Found:", entries);
      } else {

        console.log("Category not found.");
      }

    } catch (error) {
      console.log("Failed to find:", error);
    }

  });
program.parse();
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
  console.log("Created manage.json file.");
}
