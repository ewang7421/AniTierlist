import { Box, Image } from '@chakra-ui/react';
import { ListEntry } from './types';

interface EntryProps {
  entry: ListEntry;
  tierIndex: number;
  entryIndex: number;
  handleDragStart: (entry: ListEntry, tierIndex: number) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>, tierIndex: number, entryIndex: number) => void;
}

export const Entry = ({ entry, tierIndex, entryIndex, handleDragStart, handleDragOver }: EntryProps) => {
  return <Box id={entry.id.toString()}
    draggable="true"
    onDragStart={() => { handleDragStart(entry, tierIndex); }}
    onDragOver={(e) => { handleDragOver(e, tierIndex, entryIndex); }}
  >
    <Image src={entry.imageUrl} w="100px" h="100px" opacity={entry.isPreview ? 0.5 : 1} />
  </Box>
}
