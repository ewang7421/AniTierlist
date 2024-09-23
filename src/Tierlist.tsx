import { Image, Box, Text, Flex } from "@chakra-ui/react";
import { DraggableEntry, TierModel } from "./types";

interface TierlistProps {
  tierModels: TierModel[];
  handleDragStart: (event: React.DragEvent<HTMLDivElement>, entry: DraggableEntry) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => void;
}

export const Tierlist = ({ tierModels, handleDragStart, handleDragOver, handleDragLeave, handleDrop }: TierlistProps) => {
  // TODO: Unsure if index is needed. Tiers will be organized by some value that we assign to it anyway
  interface TierProps {
    model: TierModel;
    index: number;
  }

  const Tier = ({ model, index }: TierProps) => {
    return (
      <Flex flexDirection="row" border="1px">
        <Box border="1px" w="100px" h="100px">
          {model.tierName}
        </Box>
        <Flex
          border="1px"
          flexWrap="wrap"
          flexGrow={1}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
        >
          {model.entries &&
            model.entries.map((entry) => (
              <Box id={entry.id.toString()}
                key={entry.id}
                draggable="true"
                onDragStart={(e) => {
                  handleDragStart(e, { entry, srcTierIndex: index, removed: false });
                }}
              >
                <Image src={entry.imageUrl} />
              </Box>
            ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex w="100%" flexDirection="column">
      <Text>Tierlist</Text>
      {tierModels &&
        tierModels.map((model, index) => <Tier model={model} index={index} key={index} />)}
    </Flex>
  );
};
