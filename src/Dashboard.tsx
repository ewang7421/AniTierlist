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
import { ListWebsite, TierlistModel, DraggedEntry, ListEntry } from "./types";
import { Tierlist } from "./Tierlist";
import { Inventory } from "./Inventory";
import { assert } from "console";

export const Dashboard = () => {
  const [username, setUsername] = useState("watermeloans");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [tierlistModel, setTierlistModel] = useState<TierlistModel>({
    inventory: [],
    models: [
      { entries: [], tierName: "A", minScore: 8, maxScore: 10 },
      { entries: [], tierName: "C", minScore: 6, maxScore: 7 },
      { entries: [], tierName: "F", minScore: 0, maxScore: 5 },
    ],
  });

  const handleDragStart = (
    entry: ListEntry,
    tierIndex: number,
    entryIndex: number
  ) => {
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        entry: { ...entry, isPreview: true },
        tierIndex,
        entryIndex,
        draggingOverEntry: false,
      },
    }));
  };

  const handleDragOverEntry = (
    event: React.DragEvent<HTMLDivElement>,
    entryIndex: number
  ) => {
    event.preventDefault();
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        ...dragging,
        entryIndex: entryIndex,
        draggingOverEntry: true,
      },
    }));
  };

  const handleDragLeaveEntry = () => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        ...dragging,
        draggingOverEntry: false,
      },
    }));
  };

  const handleDragOverTier = (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => {
    event.preventDefault();
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        ...dragging,
        tierIndex: tierIndex,
      },
    }));
    if (dragging.draggingOverEntry) {
      return;
    }
  };

  const handleDrop = (tierIndex: number, entryIndex: number) => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }
    console.assert(
      dragging.tierIndex === tierIndex || dragging.entryIndex === entryIndex
    );
    if (dragging.tierIndex === -1) {
      console.assert(
        tierlistModel.inventory[dragging.entryIndex].isPreview === true
      );

      // From inventory
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        inventory: [
          ...tierlistModel.inventory.slice(0, dragging.entryIndex),
          { ...dragging.entry, isPreview: false },
          ...tierlistModel.inventory.slice(dragging.entryIndex + 1),
        ],
        dragging: undefined,
      }));
    }
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
                  ...tierlistModel,
                  inventory: entries,
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
          handleDragOverEntry={handleDragOverEntry}
          handleDragLeaveEntry={handleDragLeaveEntry}
          handleDragOverTier={handleDragOverTier}
          handleDrop={handleDrop}
        />
        <Inventory
          entries={tierlistModel.inventory}
          handleDragStart={handleDragStart}
          handleDragOverEntry={handleDragOverEntry}
          handleDragLeaveEntry={handleDragLeaveEntry}
          handleDragOverTier={handleDragOverTier}
          handleDrop={handleDrop}
        />
      </VStack>
    </Box>
  );
};
