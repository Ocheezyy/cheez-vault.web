import { useQuery } from "@tanstack/react-query";

type CheckNoteResponse = {
  requires_password: boolean;
}

const fetchNoteStatus = async (noteId: string): Promise<CheckNoteResponse> => {
  const response = await fetch(`/check_note/${noteId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch note status");
  }
  return response.json();
};

export const useCheckNote = (noteId: string) => {
  return useQuery({
    queryKey: ["checkNote", noteId],
    queryFn: () => fetchNoteStatus(noteId),
    enabled: !!noteId, // Ensures query runs only when noteId is provided
  });
};