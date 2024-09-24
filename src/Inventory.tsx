import { Box, Flex, Image } from "@chakra-ui/react";
import { DraggedEntry, ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
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

export const Inventory = ({
  entries,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}: InventoryProps) => {
  return (
    <Flex
      flexWrap="wrap"
      onDragOver={(e) => handleDragOver(e, -1)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        handleDrop(e, -1);
      }}
    >
      {entries &&
        entries.map((entry, index) => (
          <Box
            id={entry.id.toString()}
            key={entry.id}
            draggable="true"
            onDragStart={(e) => {
              handleDragStart(e, {
                entry,
                entryIndex: index,
                tierIndex: -1,
              });
            }}
          >
            <Image src={entry.imageUrl} />
          </Box>
        ))}
    </Flex>
  );
};
