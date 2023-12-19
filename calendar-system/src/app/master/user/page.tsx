import { Divider } from "@mui/material";
import { Suspense } from "react";
import UserTable from "./_component/userTable";
import UserTablePagination from "./_component/userTablePagenation";

export default function UserMasterPage() {
    return (
        <>
            <Divider>
                <h1>ユーザー管理</h1>
            </Divider>
            <Suspense fallback={<h1>Loading...</h1>}>
                <UserTable pageNumber={1} />
                <UserTablePagination />
            </Suspense >
        </>
    );
}