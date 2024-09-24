export type List = {
  userId: number;
  entries: ListEntry[];
};

export type ListEntry = {
  // id number for the show on anilist/mal
  id: number;
  idMal: number;
  title: string;
  imageUrl: string;
  score: number;
  tier: number;
};

export type draggedEntry = {
  entry: ListEntry;
  index: number;
};

export const enum ListWebsite {
  AniList = "ANILIST",
  MyAnimeList = "MYANIMELIST",
}

export type TierModel = {
  entries: ListEntry[];
};
