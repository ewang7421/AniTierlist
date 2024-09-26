import { Flex } from "@chakra-ui/react";
import { Entry } from "./Entry";
import { DraggedEntry, ListEntry } from "./types";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (event: React.DragEvent<HTMLDivElement>, entry: DraggedEntry) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>, tierIndex: number, entryIndex: number) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
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
