import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  TableSortLabel,
  TableCell,
  TablePagination,
} from "@material-ui/core";
import { ModalDetail } from "../components/SharedComponent";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    color: "#c4c4c4",
    borderBottom: "1px solid gray",
  },
  tableHead: {
    color: "#FFEDC9",
    "&:hover": {
      color: "white",
    },
    "&.MuiTableSortLabel-active": {
      color: "white !important",
    },
    "& .MuiTableSortLabel-icon": {
      color: "white !important",
    },
  },
  paginationColor: {
    color: "gray",
  },
}));

const COLUMNS = [
  { field: "name", headerName: "Name" },
  { field: "number_of_episodes", headerName: "Episodes" },
  { field: "airDate", headerName: "Next Episode Airing" },
  { field: "status", headerName: "Status" },
];

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const CustomTableHead = ({ classes, order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.customTableHeader}>
        {COLUMNS.map((col) => (
          <TableCell
            key={col.id}
            align="left"
            sortDirection={orderBy === col.field ? order : false}
          >
            <TableSortLabel
              className={classes.tableHead}
              active={orderBy === col.field}
              direction={orderBy === col.field ? order : "asc"}
              onClick={createSortHandler(col.field)}
            >
              {col.headerName}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

const DataTableRow = ({ row, user }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <ModalDetail option={row} user={user} open={open} setOpen={setOpen} />

      <TableRow style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
        {COLUMNS.map((col) => (
          <TableCell className={classes.tableCell}>{row[col.field]}</TableCell>
        ))}
        <TableCell className={classes.tableCell}></TableCell>
      </TableRow>
    </>
  );
};

const DataTable = ({ shows, user }) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("airDate");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRequestSort = (event, property) => {
    const propIndexName = COLUMNS.find((e) => e.field === property)["field"];
    const isAsc = orderBy === propIndexName && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(propIndexName);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div style={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "4%" }} />
          </colgroup>
          <CustomTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(shows.flat(), getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <DataTableRow row={row} user={user} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={classes.paginationColor}
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={shows.flat.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export { DataTable };
