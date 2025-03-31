"use client";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const router = useRouter();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  async function handleRedirect(user: any) {
    const tipo = user?.signInDetails?.attributes["custom:tipo"];
    if (tipo === "admin") {
      router.push("/admin");
    } else {
      router.push("/estudiante");
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => {
        if (user) {
          handleRedirect(user);
          return <p>Redirigiendo...</p>;
        }
        return (
          <main>
            <h1>My todos</h1>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>{todo.content}</li>
              ))}
            </ul>
            <button onClick={signOut}>Cerrar Sesión</button>
          </main>
        );
      }}
    </Authenticator>
  );
}
