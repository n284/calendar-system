"use client";

import Divider from "@mui/material/Divider";
import UserTable from "./userTable";
import UserTablePagination from "./userTablePagenation";
import React, { ChangeEvent, useEffect, useState } from "react";

type Props = {
    children: React.ReactNode
};
export default function UserMasterBody({ children }: Props) {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const onChange = (event: ChangeEvent<unknown>, page: number) => {
        setPageNumber(page);
    };

    useEffect(() => {

    }, []);

    return (
        <Divider>
            <UserTable pageNumber={pageNumber} />
            <UserTablePagination onChange={onChange} />
        </Divider>
    );
}