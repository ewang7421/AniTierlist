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
import { useState } from "react";
import { getList } from "./anilist";
import { List, ListWebsite, ListEntry } from "./types";
import { title } from "process";
import { Tierlist } from "./Tierlist";

export const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [listWebsite, setListWebsite] = useState(ListWebsite.AniList);
  const [animeList, setAnimeList] = useState({} as List);
  const [dragging, setDragging] = useState({} as ListEntry);

  return (
    <Box>
      <VStack>
        <Text>Dashboard</Text>
        <Tierlist dragging={dragging} setDragging={setDragging} />
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
        <Flex flexWrap="wrap">
          {animeList.entries &&
            animeList.entries.map((entry) => (
              <Box
                draggable="true"
                onDragStart={() => {
                  setDragging(entry);
                }}
                onDragEnd={() => {
                  setDragging({} as ListEntry);
                }}
              >
                <Image src={entry.imageUrl} />
              </Box>
            ))}
        </Flex>
      </VStack>
    </Box>
  );
};
