"use client"
import { useContext } from "react";
import { SelectedUsersContext } from "./page";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContailer from "@mui/material/TableContainer";
import Hidden from "@mui/material/Hidden";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper"
import { UserType } from "../../../utilities/type";

export default function MemberTable() {
    const { selectedUsers, setSelectedUsers } = useContext(SelectedUsersContext);

    const deleteUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const value: string | null | undefined = e.currentTarget.parentNode?.parentNode?.childNodes[0].textContent;
        if (value) {
            const userId: number = parseInt(value);
            setSelectedUsers(selectedUsers.filter((user: UserType) => {
                return !(user.userId === userId);
            }));
        } else {
            alert("不明なエラーが発生しました。");
        }
    };

    return (
        <TableContailer component={Paper} sx={{ maxWidth: 650 }}>
            <Table sx={{ maxWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>会社名</TableCell>
                        <TableCell>名前</TableCell>
                        <TableCell>削除</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{
                    selectedUsers.map(({ userId, userName, companyName }, index) => {
                        return (
                            <TableRow key={userId}>
                                <td hidden={true}>{userId}</td>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{companyName}</TableCell>
                                <TableCell>{userName}</TableCell>
                                <TableCell><Button onClick={deleteUser}>削除</Button></TableCell>
                            </TableRow>
                        );
                    })
                }</TableBody>
            </Table>
        </TableContailer>
    );
}

