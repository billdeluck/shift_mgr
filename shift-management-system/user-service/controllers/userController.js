import { getDb, saveData, setDb } from "../db.js";  // ✅ Fix missing imports
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    console.log("✅ Retrieved users:", db.users);
    res.status(200).json(db.users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const user = db.users.find((user) => user.id === parseInt(id));

    if (!user) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }
    console.log("✅ Retrieved user:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: `Failed to retrieve user with ID ${id}` });
  }
};

// ✅ Create User
export const createUser = async (req, res) => {
  const userData = req.body;
  try {
    const db = getDb();
    const newUser = { id: db.users.length + 1, ...userData };
    db.users.push(newUser);
    await saveData();

    console.log("✅ Created new user:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, role } = req.body;

  try {
    const db = getDb();
    const userIndex = db.users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Update user properties
    if (fullName) db.users[userIndex].fullName = fullName;
    if (role) db.users[userIndex].role = role;

    setDb(db);
    await saveData();

    const updatedUser = db.users[userIndex];

    // ✅ Sync with authentication-service
    try {
      const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/update/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: updatedUser.fullName, role: updatedUser.role }),
      });

      if (!response.ok) {
        console.error("❌ Error updating user in authentication-service:", await response.text());
      } else {
        console.log("✅ User update synced with authentication-service");
      }
    } catch (error) {
      console.error("❌ Failed to connect to authentication-service:", error);
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDb();
    const userIndex = db.users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = db.users[userIndex];
    db.users.splice(userIndex, 1);
    setDb(db);
    await saveData();

    // ✅ Sync deletion with authentication-service
    try {
      const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("❌ Error deleting user in authentication-service:", await response.text());
      } else {
        console.log("✅ User deleted from authentication-service");
      }
    } catch (error) {
      console.error("❌ Failed to connect to authentication-service:", error);
    }

    res.status(200).json({ message: "Successfully deleted user", user });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Error deleting user" });
  }
};


/* 
// user-service/controllers/userController.js
import User from "../models/User.js";
import fetch from "node-fetch";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    console.log('✅ Retrieved users:', users); // Log for debugging
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params; // Get ID from parameters
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }
    console.log('✅ Retrieved user:', user); // Log for debugging
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: `Failed to retrieve user with ID ${id}` });
  }
};

// Controller function for creating a user
export const createUser = async (req, res) => {
    const userData = req.body;  // Assuming req.body is an object with all User properties
    try {
        const newUser = await User.create(userData); // Create the new user
        console.log('✅ Created new user:', newUser);  // Log for debugging
        res.status(201).json(newUser);  // Return the new user with a 201 status
    } catch (error) {
        console.error("❌ Error creating user:", error);
        res.status(500).json({error: "Failed to create user"})
    }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, role, password } = req.body;  //Extract user data from parameters

  try {
    const db = getDb();
    const userIndex = db.users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
     // Update properties:
     if (fullName) db.users[userIndex].fullName = fullName;
    //  if (password) db.users[userIndex].password = password; Remove password updates for this test example
    if (role) db.users[userIndex].role = role;

    setDb(db)
    saveData()

    const updatedUser = db.users[userIndex];
    // ✅ Notify authentication-service to delete the user
    try {
        const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/update/${updatedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
           body: JSON.stringify({
              fullName: updatedUser.fullName,
             // password: updatedUser.password, Remove password updates for this test example
              role: updatedUser.role
          }),
        });

        if (!response.ok) {
          console.error("❌ Error updating user in authentication-service:", await response.text());
        } else {
          console.log("✅ User updated synced with authentication-service");
        }
      } catch (error) {
        console.error("❌ Failed to connect to authentication-service:", error);
      }
    res.status(200).json(updatedUser);
} catch (err) {
    console.log(err)
    res.status(500).json({error: "Error updating user"})
}
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDb();
    const userIndex = db.users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = db.users[userIndex];
    db.users.splice(userIndex, 1);
    setDb(db)
    saveData()
    // ✅ Notify authentication-service to delete the user
    try {
        const response = await fetch(`${process.env.AUTH_SERVICE_URL}/api/auth/delete/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          console.error("❌ Error deleting user in authentication-service:", await response.text());
        } else {
          console.log("✅ User updated synced with authentication-service");
        }
      } catch (error) {
        console.error("❌ Failed to connect to authentication-service:", error);
      }
    res.status(200).json({message: "Successfully Deleted User", user: user});
  } catch (err) {
    console.log(err)
    res.status(500).json({error: "Error Deleting user"})
}
};
*/