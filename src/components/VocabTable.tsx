import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { CardStatus, Flashcard, Order } from '@type-schema/common';
import { getComparator } from '@utils/getComparator';
import { Trash2 } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface VocabTableProps {
  data: Flashcard[];
  onDeleteCard: (id: string) => void;
  isLoading: boolean;
}

const VocabTable: FC<VocabTableProps> = ({ data, onDeleteCard, isLoading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>();
  const [orderBy, setOrderBy] = useState<keyof Flashcard>();
  console.log('render');

  const visibleRows = useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const createSortHandler = (property: keyof Flashcard) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      onDeleteCard(cardId);
    }
  };

  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15, 20]}
        rowsPerPage={rowsPerPage}
      />
      <TableContainer
        sx={{
          maxHeight: { xs: '300px', md: '400px', lg: '500px' },
        }}
      >
        <Table stickyHeader>
          <TableHead className="bg-slate-50 border-y border-slate-200">
            <TableRow>
              <TableCell sortDirection={orderBy === 'word' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'word'}
                  direction={orderBy === 'word' ? order : undefined}
                  onClick={createSortHandler('word')}
                >
                  Word
                </TableSortLabel>
              </TableCell>
              <TableCell>Translation</TableCell>
              <TableCell
                sx={{
                  paddingLeft: 4.5,
                }}
                sortDirection={orderBy === 'status' ? order : false}
              >
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : undefined}
                  onClick={createSortHandler('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              skeletonRows.map((index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            ) : visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No words found. Try adding some!
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((card) => (
                <TableRow>
                  <TableCell>
                    <div className="font-bold text-slate-800 text-[16px]">{card.word}</div>
                    {card.phonetic && (
                      <div className="text-xs text-slate-500 font-mono">{card.phonetic}</div>
                    )}
                  </TableCell>
                  <TableCell>{card.translation}</TableCell>
                  <TableCell
                    sx={{
                      paddingLeft: 4,
                    }}
                  >
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                          ${
                            card.status === CardStatus.Mastered
                              ? 'bg-green-100 text-green-700'
                              : card.status === CardStatus.Learning
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                    >
                      {card.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default VocabTable;
