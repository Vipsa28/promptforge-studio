import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "Check your email to verify your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Logged in successfully!");
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">
        {type === "signup" ? "Create Account" : "Login"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
        {type === "signup" ? "Sign Up" : "Login"}
      </button>

      {message && <p className="text-center text-gray-600 text-sm">{message}</p>}

<div className="text-center text-sm text-gray-500 mt-2">
  {type === "signup" ? (
    <>
      Already have an account?{" "}
      <a href="/" className="text-indigo-600 hover:underline">
        Login
      </a>
    </>
  ) : (
    <>
      Don’t have an account?{" "}
      <a href="/signup" className="text-indigo-600 hover:underline">
        Sign up
      </a>
    </>
  )}
</div>
    </form>
  );
}
