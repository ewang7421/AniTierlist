import { Image, Box, Text, Flex, Center } from "@chakra-ui/react";
import { ListEntry, TierModel } from "./types";

interface TierlistProps {
  tierModels: TierModel[];
  handleDragStart: (entry: ListEntry, tierIndex: number) => void;
  handleDragEnter: (tierIndex: number, entryIndex: number) => void;
  handleDragEnd: () => void;
}
const END_OF_TIER = -1;

export const Tierlist = ({
  tierModels,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: TierlistProps) => {
  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  return (
    <Flex w="100%" flexDirection="column">
      <Text>Tierlist</Text>
      {tierModels &&
        tierModels.map((model, tierIndex) => {
          if (tierIndex === 0) return null; // Skip rendering the 0th index
          return (
            <Flex borderWidth={1} key={tierIndex}>
              <Center w="100px" minH="100px">
                {model.tierName}
              </Center>
              <Flex
                flexWrap="wrap"
                flexGrow={1}
                onDragEnter={() => handleDragEnter(tierIndex, END_OF_TIER)}
                onDragOver={(e) => e.preventDefault()}
              >
                {model.entries &&
                  model.entries.map((entry, entryIndex) => (
                    <Box
                      id={entry.id.toString()}
                      key={entry.id}
                      draggable="true"
                      onDragEnter={(e) => {
                        e.stopPropagation();
                        handleDragEnter(tierIndex, entryIndex);
                      }}
                      onDragStart={() => handleDragStart(entry, tierIndex)}
                      opacity={entry.isPreview ? 0.5 : 1}
                    >
                      <Image src={entry.imageUrl} />
                    </Box>
                  ))}
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};
