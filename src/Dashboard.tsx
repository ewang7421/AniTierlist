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
import { ListWebsite, TierlistModel, ListEntry } from "./types";
import { Tierlist } from "./Tierlist";
import { Inventory } from "./Inventory";

export const Dashboard = () => {
  const [username, setUsername] = useState("watermeloans");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [tierlistModel, setTierlistModel] = useState<TierlistModel>({
    models: [
      // the inventory is at index 0
      { entries: [], tierName: "Inventory", minScore: 0, maxScore: 10 },
      { entries: [], tierName: "A", minScore: 8, maxScore: 9 },
      { entries: [], tierName: "B", minScore: 6, maxScore: 7 },
      { entries: [], tierName: "C", minScore: 4, maxScore: 5 },
      { entries: [], tierName: "D", minScore: 2, maxScore: 3 },
      { entries: [], tierName: "F", minScore: 0, maxScore: 1 },
    ],
  });

  const handleDragStart = (entry: ListEntry, tierIndex: number) => {
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: {
        entry: { ...entry, isPreview: true },
        previewTierIndex: tierIndex
      },
    }));
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, tierIndex: number, entryIndex: number) => {
    event.preventDefault();
    event.stopPropagation();

    const { models, dragging } = tierlistModel;
    if (dragging === undefined) {
      return;
    }

    // Remove the preview from it's previous location
    let newModels = [
      ...models.slice(0, dragging.previewTierIndex),
      {
        ...models[dragging.previewTierIndex],
        entries: models[dragging.previewTierIndex].entries.filter((entry) => entry.id !== dragging.entry.id),
      },
      ...models.slice(dragging.previewTierIndex + 1),
    ];

    // Insert the entry into the destination tier
    newModels[tierIndex] = {
      ...newModels[tierIndex],
      entries: [
        ...newModels[tierIndex].entries.slice(0, entryIndex),
        dragging.entry,
        ...newModels[tierIndex].entries.slice(entryIndex),
      ]
    };

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: newModels,
      dragging: { ...dragging, previewTierIndex: tierIndex },
    }));
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    // Replace the preview with the actual entry
    const newEntries = tierlistModel.models[dragging.previewTierIndex].entries.map((entry) => {
      return { ...entry, isPreview: false };
    });

    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: [
        ...tierlistModel.models.slice(0, dragging.previewTierIndex),
        { ...tierlistModel.models[dragging.previewTierIndex], entries: newEntries },
        ...tierlistModel.models.slice(dragging.previewTierIndex + 1),
      ],
      dragging: undefined
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
                const newTierModel = { ...tierlistModel.models[0], entries };
                setTierlistModel((tierlistModel) => ({
                  ...tierlistModel,
                  models: [
                    newTierModel,
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

        <Tierlist tierModels={tierlistModel.models.slice(1)} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
        <Inventory entries={tierlistModel.models[0].entries} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />

      </VStack>
    </Box>
  );
};
