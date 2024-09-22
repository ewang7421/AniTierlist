import {
  Image,
  Input,
  Select,
  Button,
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { getList } from "./anilist";
import { List, ListEntry } from "./types";
import { title } from "process";
import { Tierlist } from "./Tierlist";
export const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [listWebsite, setListWebsite] = useState("anilist");
  const [animeList, setAnimeList] = useState({} as List);

  return (
    <Box>
      <VStack>
        <p> Dashboard </p>
        <Tierlist />
        <HStack>
          <Select
            value="anilist"
            onChange={(e) => {
              setListWebsite(e.target.value);
            }}
          >
            <option value="anilist"> Anilist </option>
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
                setAnimeList(await getList(username)); // Set the state with the fetched data
                console.log(animeList);
              } catch (error) {
                console.error("Error fetching anime list:", error);
              }
            }}
          >
            get
          </Button>
        </HStack>
        <Box>
          {animeList.entries &&
            animeList.entries.map((entry) => {
              return <Image src={entry.imageUrl} />;
            })}
        </Box>
      </VStack>
    </Box>
  );
};
