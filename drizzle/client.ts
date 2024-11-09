import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// import { drizzle } from "drizzle-orm/neon-serverless";
// import { Pool, neonConfig } from "@neondatabase/serverless";
// import ws from "ws";

// // Configure WebSocket for Neon
// neonConfig.webSocketConstructor = ws;

// // Create the connection pool
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // Handle pool errors
// pool.on("error", (err) =>
//   console.error("Unexpected error on idle client", err)
// );

// // Export the pool for direct access when needed
// export { pool };

// // Export a function to get a drizzle instance with a client
// export async function getDb() {
//   const client = await pool.connect();
//   return { db: drizzle(client), client };
// }
