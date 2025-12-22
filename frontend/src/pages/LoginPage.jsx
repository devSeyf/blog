
import React, { useState } from "react";

export default function LoginPage() {
      const [email, setEmail] = useState("");      
  const [password, setPassword] = useState("");  

  const handleSubmit = (e) => {
    e.preventDefault();  
  };
    return (
 <form onSubmit={handleSubmit}  className ="max-w-sm mx-auto space-y-4">
      <div>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
          />
        </label>
      </div>

      <div>
        <label>
          Password:
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  
          />
        </label>
      </div>

      <button type="submit">Login</button>  
    </form>
    )
}