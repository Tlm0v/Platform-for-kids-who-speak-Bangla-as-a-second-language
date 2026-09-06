"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        level,
        status,
        data: {
          description,
        },
      }),
    });

    if (response.ok) {
      router.push("/admin/content");
      router.refresh();
    }
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>Add Educational Content</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 15,
          maxWidth: 600,
          marginTop: 20,
        }}
      >
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 5,
            }}
          />
        </label>

        <label>
          Level
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 5,
            }}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 5,
            }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 5,
            }}
          />
        </label>

        <button type="submit">
          Add Content
        </button>
      </form>
    </main>
  );
}
