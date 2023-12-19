import Error from "@/components/error";
import { supabase } from "@/utilities/supabaseClient";
import { UserType } from "@/utilities/type";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Props = {
    pageNumber: number
}

export default async function UserTable({ pageNumber }: Props) {
    // const pro = await new Promise((resolve) => setTimeout(resolve, 5000));
    const data: PostgrestSingleResponse<UserType[]> = await supabase
        .from("user_master")
        .select(`
            userId:user_id,
            userName:user_name,
            mailAddress:mail_address,
            company:company_id(
                companyId:company_id, 
                companyName:company_name
            ),
            permission:permission_id(
                permissionId:permission_id,
                permissionName:permission_name
            )`)
        .neq("user_id", "1")
        .returns<UserType[]>()
        .range(10 * (pageNumber - 1), 10 * pageNumber - 1);

    if (!data.data || data.error) {
        return (
            <Error statusCode={500} errorMessage={"データが取得できませんでした。"} />
        );
    }

    return (
        <>
            <Divider>
                <Button >新規追加</Button>
            </Divider>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>名前</TableCell>
                            <TableCell>会社名</TableCell>
                            <TableCell>権限</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.data.map((user: UserType, index: number) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Button value={user.userId}>{user.userName}</Button>
                                    </TableCell>
                                    <TableCell>{user.company.companyName}</TableCell>
                                    <TableCell>{user.permission.permissionName}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table >
            </TableContainer >
        </>
    );
}