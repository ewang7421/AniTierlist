export type List = {
  userId: number;
  entries: ListEntry[];
};
export type ListEntry = {
  // media id numberF
  id: number;
  idMal: number;
  title: string;
  imageUrl: string;
  score: number;
  tier: number;
};
