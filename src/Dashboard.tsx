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
import { ListWebsite, TierlistModel, DraggableEntry } from "./types";
import { Tierlist } from "./Tierlist";
import { Inventory } from "./Inventory";

export const Dashboard = () => {
  const [username, setUsername] = useState("watermeloans");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [tierlistModel, setTierlistModel] = useState<TierlistModel>({
    inventory: [],
    models: [
      { entries: [], tierName: "F", minScore: 0, maxScore: 5 },
      { entries: [], tierName: "C", minScore: 5, maxScore: 7 },
      { entries: [], tierName: "A", minScore: 7, maxScore: 10 },
    ],
  });

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, dragEntry: DraggableEntry) => {
    event.stopPropagation();

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: dragEntry,
    }));

    event.dataTransfer.effectAllowed = "move";
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => {
    event.stopPropagation();
    event.preventDefault();

    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    event.dataTransfer.dropEffect = "move";

    console.log("dragging:", dragging.entry.id, "tierIndex:", tierIndex);
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => {
    event.stopPropagation();

    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    // Dropping into inventory
    if (tierIndex === -1) {
      setTierlistModel((tierlistModel) => ({
        ...tierlistModel,
        inventory: [
          ...tierlistModel.inventory,
          dragging.entry,
        ],
        dragging: undefined,
      }));
      console.log("dropped into inventory, id:", dragging.entry.id);
      return;
    }

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

        <Tierlist tierModels={tierlistModel.models} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
        <Inventory entries={tierlistModel.inventory} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />

      </VStack>
    </Box>
  );
};
