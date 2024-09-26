import { Box, Flex, Image } from "@chakra-ui/react";
import { DraggedEntry, ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
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

const INVENTORY_TIER_INDEX = -1;

export const Inventory = ({
  entries,
  handleDragStart,
  handleDragOverEntry,
  handleDragLeaveEntry,
  handleDragOverTier,
  handleDrop,
}: InventoryProps) => {
  return (
    <Flex
      flexWrap="wrap"
      onDragOver={(e) => handleDragOverTier(e, INVENTORY_TIER_INDEX)}
    >
      {entries &&
        entries.map((entry, entryIndex) => (
          <Box
            id={entry.id.toString()}
            key={entry.id}
            draggable="true"
            onDragStart={() =>
              handleDragStart(entry, INVENTORY_TIER_INDEX, entryIndex)
            }
            onDragOver={(e) => handleDragOverEntry(e, entryIndex)}
            onDragLeave={handleDragLeaveEntry}
            onDrop={() => handleDrop(INVENTORY_TIER_INDEX, entryIndex)}
          >
            <Image src={entry.imageUrl} />
          </Box>
        ))}
    </Flex>
  );
};
