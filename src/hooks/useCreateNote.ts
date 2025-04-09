import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

const createNote = async ({
  content,
  password,
  ttl,
}: {
  content: string;
  password: string | null;
  ttl: number | null; // Expiration in seconds
}) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/create_note/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, password, ttl }),
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return response.json();
};

export const useCreateNote = (navigateFn:  UseNavigateResult<"/share/$noteId">) => {
  return useMutation({
    mutationFn: createNote,
    onSuccess: async (data) => {
      await navigateFn({ to: "/share/$noteId", params: { noteId: data.note_id } })
    }
  });
};
