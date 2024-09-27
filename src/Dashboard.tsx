import {
  Input,
  Select,
  Button,
  Box,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
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
  };

  const handleDragEnter = (tierIndex: number, entryIndex: number) => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return tierlistModel;
    }
    const resTierModels = moveEntry(
      dragging.tierIndex,
      tierIndex,
      entryIndex,
      dragging.entry,
      tierlistModel.models
    );
    setTierlistModel((tierlistModel) => {
      return {
        ...tierlistModel,
        models: resTierModels,
        dragging: {
          ...tierlistModel.dragging!,
          tierIndex,
          entryIndex,
        },
      };
    });
  };

  const moveEntry = (
    srcTierIndex: number,
    destTierIndex: number,
    destEntryIndex: number,
    entry: ListEntry,
    models: TierModel[]
  ): TierModel[] => {
    let resTierModels = [
      ...models.slice(0, srcTierIndex),
      {
        ...models[srcTierIndex],
        entries: models[srcTierIndex].entries.filter(
          (oldEntry) => oldEntry.id !== entry.id
        ),
      },
      ...models.slice(srcTierIndex + 1),
    ];
    if (destEntryIndex === -1) {
      //add to end of tier
      resTierModels[destTierIndex] = {
        ...resTierModels[destTierIndex],
        entries: [...resTierModels[destTierIndex].entries, entry],
      };
    } else {
      resTierModels[destTierIndex] = {
        ...resTierModels[destTierIndex],
        entries: [
          ...resTierModels[destTierIndex].entries.slice(0, destEntryIndex),
          entry,
          ...resTierModels[destTierIndex].entries.slice(destEntryIndex),
        ],
      };
    }
    return resTierModels;
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
          handleDragEnter={handleDragEnter}
        />
        <Inventory
          entries={tierlistModel.models[0].entries}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
        />
      </VStack>
    </Box>
  );
};
