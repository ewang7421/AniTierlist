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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, dragEntry: DraggedEntry) => {
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      dragging: dragEntry,
    }));
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, tierIndex: number, entryIndex: number) => {
    event.preventDefault();
    event.stopPropagation();

    const { dragging } = tierlistModel;
    if (dragging === undefined) {
      return;
    }

    // Remove the preview from it's previous location
    let newModels = tierlistModel.models;
    if (dragging.previewTierIndex !== undefined && dragging.previewTierIndex !== tierIndex) {
      const prvTierModel = tierlistModel.models[dragging.previewTierIndex];
      const newEntries = prvTierModel.entries.filter((entry) => entry.id !== dragging.entry.id);
      const newTierModel = { ...prvTierModel, entries: newEntries };
      newModels = [
        ...tierlistModel.models.slice(0, dragging.previewTierIndex),
        newTierModel,
        ...tierlistModel.models.slice(dragging.previewTierIndex + 1),
      ];
    }

    // Check if the preview is already in the destination tier
    const destTierModel = tierlistModel.models[tierIndex];
    let newEntries = destTierModel.entries;
    if (dragging.previewTierIndex === tierIndex || destTierModel.entries.find((entry) => entry.id === dragging.entry.id) !== undefined) {
      // get rid of the preview
      newEntries = newEntries.filter((entry) => entry.id !== dragging.entry.id);
    }

    // Insert the entry into the destination tier
    const previewEntry = { ...dragging.entry, isPreview: true };
    newEntries = [
      ...newEntries.slice(0, entryIndex),
      previewEntry,
      ...newEntries.slice(entryIndex),
    ];

    const newTierModel = { ...destTierModel, entries: newEntries };
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: [
        ...newModels.slice(0, tierIndex),
        newTierModel,
        ...newModels.slice(tierIndex + 1),
      ],
      dragging: { ...dragging, previewTierIndex: tierIndex },
    }));
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const { dragging } = tierlistModel;
    if (!dragging) {
      return;
    }

    if (dragging.previewTierIndex === undefined) {
      return;
    }

    const tierIndex = dragging.previewTierIndex;
    const prevTierModel = tierlistModel.models[tierIndex];

    // Replace the preview with the actual entry
    let newEntries = prevTierModel.entries.map((entry) => {
      return { ...entry, isPreview: false };
    });


    const newTierModel = { ...prevTierModel, entries: newEntries };
    setTierlistModel((tierlistModel) => ({
      ...tierlistModel,
      models: [
        ...tierlistModel.models.slice(0, tierIndex),
        newTierModel,
        ...tierlistModel.models.slice(tierIndex + 1),
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
