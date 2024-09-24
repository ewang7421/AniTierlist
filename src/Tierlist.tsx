import { Image, Box, Text, Flex, Center } from "@chakra-ui/react";
import { DraggedEntry, TierModel } from "./types";

interface TierlistProps {
  tierModels: TierModel[];
  handleDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    entry: DraggedEntry
  ) => void;
  handleDragOver: (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (
    event: React.DragEvent<HTMLDivElement>,
    tierIndex: number
  ) => void;
}

export const Tierlist = ({
  tierModels,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}: TierlistProps) => {
  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  interface TierProps {
    model: TierModel;
    index: number;
  }

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
              onDragOver={(e) => handleDragOver(e, tierIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tierIndex)}
            >
              {model.entries &&
                model.entries.map((entry, entryIndex) => (
                  <Box
                    id={entry.id.toString()}
                    key={entry.id}
                    draggable="true"
                    onDragStart={(e) => {
                      handleDragStart(e, {
                        entry,
                        entryIndex: entryIndex,
                        tierIndex: tierIndex,
                      });
                    }}
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
