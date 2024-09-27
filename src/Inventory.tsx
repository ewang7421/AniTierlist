import { Flex } from "@chakra-ui/react";
import { Entry } from "./Entry";
import { ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (entry: ListEntry, tierIndex: number) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>, tierIndex: number, entryIndex: number) => void;
  handleDrop: () => void;
}

export const Inventory = ({ entries, handleDragStart, handleDragOver, handleDrop }: InventoryProps) => {
  return <Flex flexWrap="wrap"
    onDragOver={(e) => { handleDragOver(e, 0, entries.length); }}
    onDrop={handleDrop}
  >
    {entries &&
      entries.map((entry, entryIndex) => (
        <Entry key={entry.id} entry={entry} tierIndex={0} entryIndex={entryIndex}
          handleDragStart={handleDragStart} handleDragOver={handleDragOver} />))}
  </Flex>
};
