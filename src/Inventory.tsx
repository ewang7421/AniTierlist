import { Box, Flex, Image } from "@chakra-ui/react";
import { ListEntry } from "./types";
import React from "react";
import { SSL_OP_NO_TLSv1_1 } from "constants";

interface InventoryProps {
  entries: ListEntry[];
  handleDragStart: (
    entry: ListEntry,
    tierIndex: number,
    entryIndex: number
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

const INVENTORY_TIER_INDEX = 0;

export const Inventory = ({
  entries,
  handleDragStart,
  handleDragEnterEntry,
  handleDragLeaveEntry,
  handleDragEnterTier,
  ultimateDragEnter,
}: InventoryProps) => {
  return (
    <Flex
      flexWrap="wrap"
      onDragEnter={(e) => ultimateDragEnter(e, -1, INVENTORY_TIER_INDEX)}
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
            onDragEnter={(e) =>
              ultimateDragEnter(e, entryIndex, INVENTORY_TIER_INDEX)
            }
            //onDragLeave={handleDragLeaveEntry}
            opacity={entry.isPreview ? 0.5 : 1}
          >
            <Image src={entry.imageUrl} />
          </Box>
        ))}
    </Flex>
  );
};
