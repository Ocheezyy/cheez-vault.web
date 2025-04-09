import { useMutation } from "@tanstack/react-query";

type GetNoteResponse = {
  note_content: string;
}

const fetchNote = async (noteId: string, password: string | null): Promise<GetNoteResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/get_note/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note_id: noteId, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve note");
  }

  const responseJson = await response.json() as GetNoteResponse;
  return responseJson;
};

export const useGetNote = () => {
  return useMutation({
    mutationFn: async ({ noteId, password }: { noteId: string; password: string | null }) =>
      await fetchNote(noteId, password),
    retry: false,
  });
};
