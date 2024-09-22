import { Box } from "@chakra-ui/react";
import { List, ListEntry } from "./types";

interface InventoryProps {
  dragging?: ListEntry;
  animeList?: List;
}
export const Inventory = ({ dragging, animeList }: InventoryProps) => {
  return <Box>Inventory</Box>;
};
