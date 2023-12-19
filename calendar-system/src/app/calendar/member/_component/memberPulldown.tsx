"use client"
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../utilities/supsbaseClient";
import { SelectedUsersContext } from "./page";
import { UserType } from "../../../utilities/type";

export default function MemberPulldown() {
  const fetchData = async () => {
    const users: UserType[] = [];
    const { data } = await supabase.from("user_table").select("*");

    if (data) {
      for (let obj of data) {
        const user: UserType = {
          userId: obj.user_id,
          userName: obj.user_name,
          companyName: obj.company_name,
          mailAddress: obj.mailaddress
        };
        users.push(user);
      }
      setUsers(users);
    }
  };

  const onChange = (e: SelectChangeEvent<string>) => {
    const value: string = e.target.value;
    let user: UserType | undefined;

    if (value.length > 0) {
      const [userId, userName, companyName, mailAddress]: string[] = value.split(",");
      user = {
        userId: parseInt(userId),
        userName,
        companyName,
        mailAddress
      };
    }
    setSelectUser(user);
  }

  const callback = ({ userId }: UserType): boolean => {
    return selectUser?.userId === userId;
  };

  const addUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (selectUser && selectedUsers.filter(callback).length <= 0) {
      setSelectedUsers(selectedUsers.concat([selectUser]));
    } else if (selectUser) {
      alert(`${selectUser?.userName}は追加済みです`)
    }
  }

  const { selectedUsers, setSelectedUsers } = useContext(SelectedUsersContext);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectUser, setSelectUser] = useState<UserType>();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Select defaultValue="" onChange={onChange}>
        <MenuItem value={""}></MenuItem>
        {users.map(({ userId, userName, companyName, mailAddress }: UserType) => {
          return <MenuItem value={`${userId},${userName},${companyName},${mailAddress}`} key={userId}>{userName}</MenuItem>;
        })}
      </Select>
      <Button onClick={addUser}>追加</Button>
    </>
  );
}