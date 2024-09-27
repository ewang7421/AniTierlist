import { Box, Flex, Image } from "@chakra-ui/react";
import { ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (
    entry: ListEntry,
    entryIndex: number,
    tierIndex: number
  ) => void;
  handleDragEnter: (tierIndex: number, entryIndex: number) => void;
}

const INVENTORY_TIER_INDEX = 0;
const END_OF_TIER = -1;

export const Inventory = ({
  entries,
  handleDragStart,
  handleDragEnter,
}: InventoryProps) => {
  return (
    <Flex
      flexWrap="wrap"
      onDragEnter={() => handleDragEnter(INVENTORY_TIER_INDEX, END_OF_TIER)}
    >
      {entries &&
        entries.map((entry, entryIndex) => (
          <Box
            id={entry.id.toString()}
            key={entry.id}
            draggable="true"
            onDragStart={() =>
              handleDragStart(entry, entryIndex, INVENTORY_TIER_INDEX)
            }
            onDragOver={(e) => e.preventDefault()}
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
