import { Image, Box, VStack, Text, HStack, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { draggedEntry, ListEntry, TierModel } from "./types";

interface TierlistProps {
  dragging: draggedEntry;
  setDragging: React.Dispatch<React.SetStateAction<draggedEntry>>;
}

export const Tierlist = ({ dragging, setDragging }: TierlistProps) => {
  const [tierModels, setTierModels] = useState([
    { entries: [] as ListEntry[] },
  ] as TierModel[]);

  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  interface TierProps {
    model: TierModel;
    index: number;
  }

  const handleDrop = (model: TierModel) => {
    model.entries.push(dragging.entry);
    console.log(model.entries);
  };

  const Tier = ({ model, index }: TierProps) => {
    return (
      <Flex border="1px" w="100%">
        <Box border="1px" w="100px" h="100px">
          S Tier
        </Box>
        <Flex
          border="1px"
          flexWrap="wrap"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(model)}
        >
          {model.entries.map((entry, index) => (
            <Image src={entry.imageUrl}></Image>
          ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex w="100%">
      <VStack w="100%">
        <Text>Tierlist</Text>
        {tierModels &&
          tierModels.map((model, index) => (
            <Tier model={model} index={index} />
          ))}
      </VStack>
    </Flex>
  );
};
