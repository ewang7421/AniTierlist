import {
  Input,
  Select,
  Button,
  Box,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getList } from "./anilist";
import { ListWebsite, TierlistModel, TierModel, ListEntry } from "./types";
import { Tierlist } from "./Tierlist";
import { Inventory } from "./Inventory";

export const Dashboard = () => {
  const [username, setUsername] = useState("watermeloans");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [tierlistModel, setTierlistModel] = useState<TierlistModel>({
    models: [
      { entries: [], tierName: "Inventory", minScore: 10, maxScore: 10 },
      { entries: [], tierName: "A", minScore: 8, maxScore: 10 },
      { entries: [], tierName: "C", minScore: 6, maxScore: 7 },
      { entries: [], tierName: "F", minScore: 0, maxScore: 5 },
    ],
  });

  const ultimateDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    entryIndex: number,
    tierIndex: number
  ) => {
    event.stopPropagation();
    console.log(
      "dragging from tier",
      tierlistModel.dragging?.tierIndex,
      ", entry",
      tierlistModel.dragging?.entryIndex,
      "to tier",
      tierIndex,
      ", entry",
      entryIndex
    );
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }
    let srcTierIndex = dragging.tierIndex;
    let destTierIndex = tierIndex;
    let resTierModels = tierlistModel.models;

    // first remove the entry from the source tier
    let srcTierModel = resTierModels[srcTierIndex];
    srcTierModel = {
      ...srcTierModel,
      entries: srcTierModel.entries.filter((e) => e.id !== dragging.entry.id),
    };

    resTierModels = [
      ...resTierModels.slice(0, srcTierIndex),
      srcTierModel,
      ...resTierModels.slice(srcTierIndex + 1),
    ];

    if (srcTierIndex === destTierIndex) {
      entryIndex = entryIndex === -1 ? srcTierModel.entries.length : entryIndex;
      srcTierModel = {
        ...srcTierModel,
        entries: [
          ...srcTierModel.entries.slice(0, entryIndex),
          dragging.entry,
          ...srcTierModel.entries.slice(entryIndex),
        ],
      };
      resTierModels = [
        ...resTierModels.slice(0, srcTierIndex),
        srcTierModel,
        ...resTierModels.slice(srcTierIndex + 1),
      ];
    } else {
      let destTierModel = resTierModels[destTierIndex];

      entryIndex =
        entryIndex === -1 ? destTierModel.entries.length : entryIndex;

      destTierModel = {
        ...destTierModel,
        entries: [
          ...destTierModel.entries.slice(0, entryIndex),
          dragging.entry,
          ...destTierModel.entries.slice(entryIndex),
        ],
      };

      resTierModels = [
        ...resTierModels.slice(0, srcTierIndex),
        srcTierModel,
        ...resTierModels.slice(srcTierIndex + 1),
      ];

      resTierModels = [
        ...resTierModels.slice(0, destTierIndex),
        destTierModel,
        ...resTierModels.slice(destTierIndex + 1),
      ];
    }

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: resTierModels,
      dragging: {
        ...tierlistModel.dragging!,
        tierIndex,
        entryIndex,
      },
    }));
  };

  const handleDragStart = (
    entry: ListEntry,
    entryIndex: number,
    tierIndex: number
  ) => {
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        entry: { ...entry, isPreview: true },
        tierIndex,
        entryIndex,
        draggingOverEntry: true,
      },
    }));
    console.log("started dragging entry at index", entryIndex);
  };
  const moveEntry = (
    srcTierIndex: number,
    destTierIndex: number,
    destEntryIndex: number,
    entry: ListEntry,
    tierModels: TierModel[]
  ): TierModel[] => {
    console.log("moving");
    let srcTierEntries = tierModels[srcTierIndex].entries;
    srcTierEntries = srcTierEntries.filter((e) => e.id !== entry.id);
    if (srcTierIndex === destTierIndex) {
      srcTierEntries =
        destEntryIndex === -1
          ? [...srcTierEntries, entry]
          : [
              ...srcTierEntries.slice(0, destEntryIndex),
              entry,
              ...srcTierEntries.slice(destEntryIndex),
            ];

      return [
        ...tierModels.slice(0, srcTierIndex),
        { ...tierModels[srcTierIndex], entries: srcTierEntries },
        ...tierModels.slice(srcTierIndex + 1),
      ];
    } else {
      let destTierEntries = tierModels[destTierIndex].entries;
      destTierEntries =
        destEntryIndex === -1
          ? [...destTierEntries, entry]
          : [
              ...destTierEntries.slice(0, destEntryIndex),
              entry,
              ...destTierEntries.slice(destEntryIndex),
            ];
      const firstIndex = Math.min(srcTierIndex, destTierIndex);
      const secondIndex = Math.max(srcTierIndex, destTierIndex);
      const firstEntries =
        srcTierIndex < destTierIndex ? srcTierEntries : destTierEntries;
      const secondEntries =
        srcTierIndex < destTierIndex ? destTierEntries : srcTierEntries;

      return [
        ...tierModels.slice(0, firstIndex),
        { ...tierModels[firstIndex], entries: firstEntries },
        ...tierModels.slice(firstIndex + 1, secondIndex),
        { ...tierModels[secondIndex], entries: secondEntries },
        ...tierModels.slice(secondIndex + 1),
      ];
    }
  };
  const handleDragEnterEntry = (
    event: React.DragEvent<HTMLDivElement>,
    entryIndex: number,
    tierIndex: number
  ) => {
    event.stopPropagation();
    console.log("entered entry", entryIndex);
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: moveEntry(
        dragging.tierIndex,
        tierIndex,
        entryIndex,
        dragging.entry,
        tierlistModel.models
      ),
      dragging: { ...tierlistModel.dragging!, draggingOverEntry: true },
    }));
  };
  const handleDragLeaveEntry = () => {
    console.log("left entry" + tierlistModel.dragging?.entryIndex);
    if (!tierlistModel.dragging) {
      return tierlistModel;
    }
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: { ...tierlistModel.dragging!, draggingOverEntry: false },
    }));
  };
  const handleDragEnterTier = (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => {
    console.log("old tier", tierlistModel.dragging?.tierIndex);
    console.log("entered tier", tierIndex);

    const { dragging } = tierlistModel;
    if (!dragging) {
      return tierlistModel;
    }

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: moveIntoTier(
        dragging.tierIndex,
        tierIndex,
        dragging.entry,
        tierlistModel.models
      ),
      dragging: { ...tierlistModel.dragging!, tierIndex },
    }));
  };

  const moveIntoTier = (
    srcTierIndex: number,
    destTierIndex: number,
    entry: ListEntry,
    oldTierModels: TierModel[]
  ): TierModel[] => {
    const srcTierEntries = oldTierModels[srcTierIndex].entries.filter(
      (e) => e.id !== entry.id
    );

    let destTierEntries = [...oldTierModels[destTierIndex].entries, entry];
    if (srcTierIndex === destTierIndex) {
      destTierEntries = [...srcTierEntries, entry];
    }

    return oldTierModels.map((tier, index) => {
      if (index === destTierIndex) {
        return { ...tier, entries: destTierEntries };
      } else if (index === srcTierIndex) {
        return { ...tier, entries: srcTierEntries };
      } else {
        return tier;
      }
    });
  };

  return (
    <Box>
      <VStack>
        <Text>Dashboard</Text>
        <HStack>
          <Select
            value={ListWebsite.AniList}
            onChange={(e) => {
              setListWebsite(e.target.value as ListWebsite);
            }}
          >
            <option value={ListWebsite.AniList}> AniList </option>
            <option value={ListWebsite.MyAnimeList}> MyAnimeList </option>
          </Select>
          <Input
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Input>
          <Button
            onClick={async () => {
              try {
                const entries = await getList(username); // Set the state with the fetched data
                // Set the tier list model's inventory to the fetched anime list
                setTierlistModel((tierlistModel) => ({
                  //set the 0th tier to the fetched list
                  ...tierlistModel,
                  models: [
                    {
                      ...tierlistModel.models[0],
                      entries: entries,
                    },
                    ...tierlistModel.models.slice(1),
                  ],
                }));
              } catch (error) {
                console.error("Error fetching anime list:", error);
              }
            }}
          >
            get
          </Button>
        </HStack>

        <Tierlist
          tierModels={tierlistModel.models}
          handleDragStart={handleDragStart}
          handleDragEnterEntry={handleDragEnterEntry}
          handleDragLeaveEntry={handleDragLeaveEntry}
          handleDragEnterTier={handleDragEnterTier}
          ultimateDragEnter={ultimateDragEnter}
        />
        <Inventory
          entries={tierlistModel.models[0].entries}
          handleDragStart={handleDragStart}
          handleDragEnterEntry={handleDragEnterEntry}
          handleDragLeaveEntry={handleDragLeaveEntry}
          handleDragEnterTier={handleDragEnterTier}
          ultimateDragEnter={ultimateDragEnter}
        />
      </VStack>
    </Box>
  );
};
