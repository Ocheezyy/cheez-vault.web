import { useMutation } from "@tanstack/react-query";

type GetNoteResponse = {
  note_content: string;
}

const fetchNote = async (noteId: string, password?: string): Promise<GetNoteResponse> => {
  const response = await fetch("/get_note/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note_id: noteId, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve note");
  }

  return response.json();
};

export const useGetNote = () => {
  return useMutation({
    mutationFn: ({ noteId, password }: { noteId: string; password?: string }) =>
      fetchNote(noteId, password),
  });
};
