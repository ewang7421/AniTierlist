import { Box, Flex, Image } from "@chakra-ui/react";
import { ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (entry: ListEntry, tierIndex: number) => void;
  handleDragEnter: (tierIndex: number, entryIndex: number) => void;
  handleDragEnd: () => void;
}

const INVENTORY_TIER_INDEX = 0;
const END_OF_TIER = -1;

export const Inventory = ({
  entries,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: InventoryProps) => {
  return (
    <Flex
      flexWrap="wrap"
      onDragEnter={() => handleDragEnter(INVENTORY_TIER_INDEX, END_OF_TIER)}
      onDragOver={(e) => e.preventDefault()}
    >
      {entries &&
        entries.map((entry, entryIndex) => (
          <Box
            id={entry.id.toString()}
            key={entry.id}
            draggable="true"
            onDragStart={() => handleDragStart(entry, INVENTORY_TIER_INDEX)}
            onDragEnter={(e) => {
              e.stopPropagation();
              handleDragEnter(INVENTORY_TIER_INDEX, entryIndex);
            }}
            opacity={entry.isPreview ? 0.5 : 1}
          >
            <Image src={entry.imageUrl} />
          </Box>
        ))}
    </Flex>
  );
};
