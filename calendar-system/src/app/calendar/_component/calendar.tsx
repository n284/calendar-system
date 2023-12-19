"use client"
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContailer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useContext, useEffect, useState } from "react";
import { CalendarTableContext } from "./page";
import { SelectUserType } from "../../utilities/type";
import { getStringOfFreeTime } from "../../utilities/functions";


export default function calendarTable() {
  const { usedTimes, selectUsers, startDateTime, endDateTime } = useContext(CalendarTableContext);
  const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
  const createFreeTimeRows = () => {
    const jsxArray: JSX.Element[] = [];
    if (startDateTime && endDateTime) {
      const diff: number = (endDateTime.getTime() - startDateTime.getTime()) / 86400000;
      let freeTime: number = 0;
      for (let i = 0; i < diff; i++) {
        startDateTime.setDate(startDateTime.getDate() + i);
        jsxArray.push(
          <TableRow key={startDateTime.toDateString()}>
            <TableCell>{startDateTime.toDateString()}</TableCell>
            {selectUsers.map((value: SelectUserType, index: number) => {
              freeTime |= usedTimes[index][i];
              return <TableCell key={value.id}>{getStringOfFreeTime(usedTimes[index][i]).map((freeTime: string) => { return <p key={freeTime}>{freeTime}</p> })}</TableCell>
            })}
            <TableCell>{getStringOfFreeTime(freeTime).map((freeTime: string) => { return <p key={freeTime}>{freeTime}</p> })}</TableCell>
          </TableRow>
        );
        freeTime = 0;
      }
    }
    return jsxArray;
  };

  useEffect(() => {
    setTableRows(createFreeTimeRows());
  }, [usedTimes, selectUsers])
  return (
    <TableContailer component={Paper} sx={{ maxWidth: 650 }} >
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>月日</TableCell>
            {/* <TableCell>個人の空いている時間</TableCell> */}
            <TableCell>名前</TableCell>
            {selectUsers.map((value: SelectUserType) => {
              return <TableCell key={value.id}></TableCell>
            })}
            <TableCell>結果</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            {selectUsers.map((value: SelectUserType) => {
              return <TableCell key={value.id}>{value.user.userName}</TableCell>
            })}
            <TableCell></TableCell>
          </TableRow>
          {tableRows}
        </TableBody>
      </Table>
    </TableContailer >
  );
}
