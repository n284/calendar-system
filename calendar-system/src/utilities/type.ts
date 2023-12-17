import { PostgrestError } from "@supabase/supabase-js"
import { Dispatch, SetStateAction } from "react"

// export type UserType = {
//     userId: number,
//     userName: string,
//     companyName: string,
//     mailAddress: string
// }

export type SelectUserType = {
    id: number,
    user: UserType
}

export type SelectedUsersContextType = {
    selectedUsers: UserType[],
    setSelectedUsers: Dispatch<SetStateAction<UserType[]>>
}

export type EventType = {
    startTime: string,
    endTime: string
};
export type SortedEventType = {
    date: Date,
    event: EventType[]
};
export type DataType = {
    userName: string,
    sortedEvent: SortedEventType[]
};

export type PermissionType = {
    permissionId: number,
    permissionName: string
}

export type CompanyType = {
    companyId: number,
    companyName: string
}
export type UserType = {
    userId: number,
    userName: string,
    mailAddress: string,
    company: CompanyType,
    permission: PermissionType
}

export type UserTableType = {
    data: UserType[] | null,
    error: PostgrestError | null
}