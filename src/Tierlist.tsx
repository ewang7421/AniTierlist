import { Image, Box, VStack, Text, HStack, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { ListEntry, TierModel } from "./types";

interface TierlistProps {
  dragging: ListEntry;
  setDragging: React.Dispatch<React.SetStateAction<ListEntry>>;
}

export const Tierlist = ({ dragging, setDragging }: TierlistProps) => {
  const [tierModels, setTierModels] = useState([
    { entries: [] as ListEntry[] },
  ] as TierModel[]);

  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  type TierProps = {
    index: number;
    model: TierModel;
  };

  const handleDrop = () => {};

  const Tier = ({ model, index }: TierProps) => {
    return (
      <Flex border="1px">
        <Box border="1px">Tier</Box>
        <Flex
          border="1px"
          flexGrow={1}
          flexWrap="wrap"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            model.entries.push(dragging);
            console.log(model.entries);
          }}
        >
          {model.entries.map((entry, index) => (
            <Image src={entry.imageUrl}></Image>
          ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <Box>
      <VStack>
        <Text>Tierlist</Text>
        {tierModels &&
          tierModels.map((model, index) => (
            <Tier model={model} index={index} />
          ))}
      </VStack>
    </Box>
  );
};
