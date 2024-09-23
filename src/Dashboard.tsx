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
import { ListWebsite, TierlistModel, DraggedEntry } from "./types";
import { Tierlist } from "./Tierlist";
import { Inventory } from "./Inventory";

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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, dragEntry: DraggedEntry) => {
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: dragEntry,
    }));
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => {
    event.preventDefault();

    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    // TODO: show a preview of where the entry will be placed
    event.currentTarget.style.backgroundColor = "lightblue";

    if (dragging.removedFromSrc) {
      return;
    }

    // Remove the entry from the source tier
    if (dragging.srcTierIndex !== -1) {
      const srcTierModel = tierlistModel.models[dragging.srcTierIndex];
      const newEntries = srcTierModel.entries.filter((entry) => entry.id !== dragging.entry.id);
      const newTierModel = { ...srcTierModel, entries: newEntries };
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        models: [
          ...tierlistModel.models.slice(0, dragging.srcTierIndex),
          newTierModel,
          ...tierlistModel.models.slice(dragging.srcTierIndex + 1),
        ],
        dragging: { ...dragging, removedFromSrc: true },
      }));
    } else {
      const newEntries = tierlistModel.inventory.filter((entry) => entry.id !== dragging.entry.id);
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        inventory: newEntries,
        dragging: { ...dragging, removedFromSrc: true },
      }));
    }
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    // TODO: get rid of the preview
    event.currentTarget.style.backgroundColor = "";
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    // TODO: get rid of the preview
    event.currentTarget.style.backgroundColor = "";

    // Add the entry to the destination tier
    if (tierIndex !== -1) {
      const destTierModel = tierlistModel.models[tierIndex];
      const newEntries = [
        ...destTierModel.entries,
        dragging.entry,
      ];
      const newTierModel = { ...destTierModel, entries: newEntries };
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        models: [
          ...tierlistModel.models.slice(0, tierIndex),
          newTierModel,
          ...tierlistModel.models.slice(tierIndex + 1),
        ],
        dragging: undefined,
      }));
    } else {
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        inventory: [
          ...tierlistModel.inventory,
          dragging.entry,
        ],
        dragging: undefined,
      }));
    }
  }

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

        <Tierlist tierModels={tierlistModel.models} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop} />
        <Inventory entries={tierlistModel.inventory} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop} />

      </VStack>
    </Box>
  );
};
