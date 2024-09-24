import {
  Image,
  Input,
  Select,
  Button,
  Box,
  HStack,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getList } from "./anilist";
import { List, ListWebsite, ListEntry, draggedEntry } from "./types";
import { title } from "process";
import { Tierlist } from "./Tierlist";

export const Dashboard = () => {
  const [username, setUsername] = useState("watermeloans");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [animeList, setAnimeList] = useState({} as List);
  const [dragging, setDragging] = useState({} as draggedEntry);

  const handleDragStart = (newDragging: draggedEntry) => {
    setDragging(newDragging);
    console.log(newDragging);
  };

  useEffect(() => {}, [animeList]);

  const handleDragOverTier = () => {
    let newEntries = animeList.entries.filter(
      (entry) => entry.id !== dragging.entry.id
    );

    newEntries = [
      ...newEntries.slice(0, dragging.index),
      dragging.entry,
      ...newEntries.slice(dragging.index),
    ];

    setAnimeList({
      ...animeList,
      entries: newEntries,
    });

    console.log(animeList.entries);
  };

  const handleDragOverEntry = () => {
    setAnimeList({
      ...animeList,
      entries: animeList.entries.filter(
        (entry) => entry.id !== dragging.entry.id
      ),
    });

    setAnimeList({
      ...animeList,
      entries: animeList.entries.splice(0),
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
                getList(username, setAnimeList); // Set the state with the fetched data
                console.log(animeList);
              } catch (error) {
                console.error("Error fetching anime list:", error);
              }
            }}
          >
            get
          </Button>
        </HStack>

        <Tierlist dragging={dragging} setDragging={setDragging} />
        <Box onDragOver={handleDragOverTier}>
          <Flex flexWrap="wrap">
            {animeList.entries &&
              animeList.entries.map((entry, index) => (
                <Box
                  draggable="true"
                  onDragStart={() => {
                    handleDragStart({ entry: entry, index: index });
                  }}
                  onDragOver={() => {
                    setDragging({ ...dragging, index: index });
                  }}
                  onDragEnd={() => {
                    setDragging({} as draggedEntry);
                  }}
                >
                  <Image src={entry.imageUrl} />
                </Box>
              ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};
