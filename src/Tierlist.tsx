import { Image, Box, Text, Flex, Center } from "@chakra-ui/react";
import { DraggedEntry, ListEntry, TierModel } from "./types";

interface TierlistProps {
  tierModels: TierModel[];
  handleDragStart: (
    entry: ListEntry,
    tierIndex: number,
    entryIndex: number
  ) => void;
  handleDragOverEntry: (
    event: React.DragEvent<HTMLDivElement>,
    entryIndex: number
  ) => void;
  handleDragLeaveEntry: () => void;
  handleDragOverTier: (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => void;
  handleDrop: (tierIndex: number, entryIndex: number) => void;
}

export const Tierlist = ({
  tierModels,
  handleDragStart,
  handleDragOverEntry,
  handleDragLeaveEntry,
  handleDragOverTier,
  handleDrop,
}: TierlistProps) => {
  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  return (
    <Flex w="100%" flexDirection="column">
      <Text>Tierlist</Text>
      {tierModels &&
        tierModels.map((model, tierIndex) => (
          <Flex border="1px">
            <Center border="1px" w="100px" minH="100px">
              {model.tierName}
            </Center>
            <Flex
              border="1px"
              flexWrap="wrap"
              flexGrow={1}
              onDragOver={(e) => handleDragOverTier(e, tierIndex)}
            >
              {model.entries &&
                model.entries.map((entry, entryIndex) => (
                  <Box
                    id={entry.id.toString()}
                    key={entry.id}
                    draggable="true"
                    onDragStart={() =>
                      handleDragStart(entry, tierIndex, entryIndex)
                    }
                    onDragOver={(e) => handleDragOverEntry(e, entryIndex)}
                    onDragLeave={handleDragLeaveEntry}
                    onDrop={() => handleDrop(tierIndex, entryIndex)}
                  >
                    <Image src={entry.imageUrl} />
                  </Box>
                ))}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
