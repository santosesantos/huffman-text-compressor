import * as fs from "fs";
import * as url from "url";

console.info("Creating lorem.txt file...")

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Create an assets directory
fs.mkdirSync(__dirname + "assets", { recursive: true });

// Write the lorem.txt
const txt = "Reprehenderit sunt proident deserunt et.";

fs.writeFileSync(__dirname + "assets/lorem.txt", txt);

console.info("lorem.txt created successfully.");