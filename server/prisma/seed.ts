import { auth } from "../src/lib/auth";
import { Role } from "@prisma/client";

async function main() {
  console.log("Seeding database...");

  // Temporarily bypass the signup block for this specific script
  process.env.ALLOW_SEED_SIGNUP = "true";

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables");
  }

  try {
    // Attempt to register the user via the robust Better Auth system (which handles proper bcrypt hashing and Account linking)
    const res = await auth.api.signUpEmail({
      // We pass req implicitly empty since this is a script, Better Auth handles it.
      body: {
        email,
        password,
        name: "Admin User",
        role: Role.admin,
      },
    });
    
    console.log(`Successfully seeded admin: ${res.user.email} (Role: ${res.user.role})`);
    
  } catch (error: any) {
    // If the error is 'USER_ALREADY_EXISTS' or similar, we should log it but not panic.
    if (error?.message?.includes("already exists")) {
      console.log(`Admin user ${email} already exists. Skipping.`);
    } else {
      console.error("Error creating admin user:", error?.message || error);
    }
  }
}

main()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
