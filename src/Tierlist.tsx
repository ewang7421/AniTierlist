import { Image, Box, Text, Flex, Center } from "@chakra-ui/react";
import { ListEntry, TierModel } from "./types";

interface TierlistProps {
  tierModels: TierModel[];
  handleDragStart: (
    entry: ListEntry,
    entryIndex: number,
    tierIndex: number
  ) => void;
  handleDragEnterEntry: (
    event: React.DragEvent<HTMLDivElement>,
    entryIndex: number,
    tierIndex: number
  ) => void;
  handleDragLeaveEntry: () => void;
  handleDragEnterTier: (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => void;
  ultimateDragEnter: (
    e: React.DragEvent<HTMLDivElement>,
    entryIndex: number,
    tierIndex: number
  ) => void;
}

export const Tierlist = ({
  tierModels,
  handleDragEnterEntry,
  handleDragLeaveEntry,
  handleDragEnterTier,
  handleDragStart,
  ultimateDragEnter,
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
                onDragEnter={(e) => ultimateDragEnter(e, -1, tierIndex)}
              >
                {model.entries &&
                  model.entries.map((entry, entryIndex) => (
                    <Box
                      id={entry.id.toString()}
                      key={entry.id}
                      draggable="true"
                      onDragEnter={(e) =>
                        ultimateDragEnter(e, entryIndex, tierIndex)
                      }
                      //onDragLeave={handleDragLeaveEntry}
                      onDragStart={() =>
                        handleDragStart(entry, entryIndex, tierIndex)
                      }
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
