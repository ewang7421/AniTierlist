// A single entry in the list
export type ListEntry = {
  // id number for the show on anilist/mal
  id: number;
  idMal: number;
  title: string;
  imageUrl: string;
  score: number;
  tier: number;
  isPreview: boolean;
};

export const enum ListWebsite {
  AniList = "ANILIST",
  MyAnimeList = "MYANIMELIST",
}

// Represents a single tier in the tierlist
export type TierModel = {
  entries: ListEntry[];
  tierName: string;
  minScore: number;
  maxScore: number;
};

// The entry that is being dragged
export type DraggedEntry = {
  entry: ListEntry;
  tierIndex: number; // -1 if from inventory
  entryIndex: number;
  draggingOverEntry: boolean;
};

// The model for the tierlist
export type TierlistModel = {
  inventory: ListEntry[];
  models: TierModel[];
  dragging?: DraggedEntry;
};
