import { Box, Flex, Image } from "@chakra-ui/react";
import { DraggableEntry, ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (event: React.DragEvent<HTMLDivElement>, entry: DraggableEntry) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, tierIndex: number) => void;
}

export const Inventory = ({ entries, handleDragStart, handleDragOver, handleDrop }: InventoryProps) => {
  return <Flex flexWrap="wrap">
    {entries &&
      entries.map((entry) => (
        <Box id={entry.id.toString()}
          key={entry.id}
          draggable="true"
          onDragStart={(e) => {
            handleDragStart(e, { entry, srcTierIndex: -1 });
          }}
          onDrop={(e) => { handleDrop(e, -1); }}
          onDragOver={(e) => handleDragOver(e, -1)}
        >
          <Image src={entry.imageUrl} />
        </Box>
      ))}
  </Flex>
};
