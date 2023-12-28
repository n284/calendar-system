import { Divider } from "@mui/material";
import { Suspense } from "react";
import UserMasterBody from "./_component/userMasterBody";

export default function UserMasterPage() {
    return (
        <>
            <Divider>
                <h1>ユーザー管理</h1>
            </Divider>
            <Suspense fallback={<h1>Loading...</h1>}>
                <UserMasterBody>
                    <UserTable pageNumber={pageNumber} />
                    <UserTablePagination onChange={onChange} />
                </UserMasterBody>
            </Suspense >
        </>
    );
}