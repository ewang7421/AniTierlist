export type ListEntry = {
  // id number for the show on anilist/mal
  id: number;
  idMal: number;
  title: string;
  imageUrl: string;
  score: number;
  tier: number;
};

export const enum ListWebsite {
  AniList = "ANILIST",
  MyAnimeList = "MYANIMELIST",
}

export type TierModel = {
  entries: ListEntry[];
  tierName: string;
  minScore: number;
  maxScore: number;
};

export type DraggableEntry = {
  entry: ListEntry;
  srcTierIndex: number; // -1 if from inventory
};

export type TierlistModel = {
  inventory: ListEntry[];
  models: TierModel[];
  dragging?: DraggableEntry;
};
