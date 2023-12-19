"use client"
import Link from "next/link";
import React, { createContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider"
import Pulldown from "./pulldown";
import Table from "./table";
import { SelectedUsersContextType, UserType, SelectUserType } from "../../../utilities/type";
import { supabase } from "@/app/supsbaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import ProtectedRoute from "@/app/protectedRoute";

export const SelectedUsersContext = createContext({} as SelectedUsersContextType);

export default function member() {
  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    register();
    alert("登録しました");
  };

  const register = async () => {
    let nextInitialSeletedUsers = initialSelectedUsers;

    const newSelectedUser = selectedUsers.map((selectedUser: UserType) => {
      for (let user of initialSelectedUsers) {
        if (selectedUser.userId === user.userId) {
          return undefined;
        }
      }
      nextInitialSeletedUsers.push(selectedUser);
      return selectedUser;
    }).filter((selectedUser: UserType | undefined) => {
      return selectedUser !== undefined;
    });

    const newUser = newSelectedUser.map((selectedUser: UserType | undefined) => {
      if (selectedUser) {
        return {
          user_id: selectedUser.userId,
          user_name: selectedUser.userName,
          company_name: selectedUser.companyName,
          mailaddress: selectedUser.mailAddress
        };
      }
    });

    const deleteSelectedUser = initialSelectedUsers.map((selectedUser: UserType) => {
      for (let user of selectedUsers) {
        if (user.userId === selectedUser.userId) {
          return undefined;
        }
      }
      nextInitialSeletedUsers = nextInitialSeletedUsers.filter(({ userId }) => {
        return userId !== selectedUser.userId;
      });
      return selectedUser;
    }).filter((selectedUser: UserType | undefined) => {
      return selectedUser !== undefined;
    });

    const deleteUserId = deleteSelectedUser.map((selectedUser: UserType | undefined) => {
      if (selectedUser) {
        return selectedUser.userId;
      }
    });

    if (deleteUserId.length > 0) {
      const deleteError = await supabase.from("user_selections_table").delete().in("user_id", deleteUserId);
    }
    if (newUser.length > 0) {
      const insertError = await supabase.from("user_selections_table").insert(newUser);
    }

    setSelectedUsers(nextInitialSeletedUsers);
    setInitialSelectedUsers(nextInitialSeletedUsers);
  };

  const fetchData = async () => {
    const users: UserType[] = [];
    const selectUsers: UserType[] = [];
    const { data }: PostgrestSingleResponse<SelectUserType[]> = await supabase.from("user_selections_table").select("id, user:user_id(userId:user_id, userName:user_name, companyName:company_name, mailAddress:mailaddress)");

    if (data) {
      for (let obj of data) {
        const user: UserType = {
          userId: obj.user.userId,
          userName: obj.user.userName,
          companyName: obj.user.companyName,
          mailAddress: obj.user.mailAddress
        };
        users.push(user);
        selectUsers.push(user);
      }
      setSelectedUsers(users);
      setInitialSelectedUsers(selectUsers);
    }
  };

  const isUpdate = (): boolean => {
    if (selectedUsers.length !== initialSelectedUsers.length) {
      return true;
    } else {
      for (let selectedUser of selectedUsers) {
        const duplicateUsers: UserType[] = initialSelectedUsers.filter(({ userId }) => {
          return userId === selectedUser.userId;
        });
        if (duplicateUsers.length === 1) {
          continue;
        } else if (duplicateUsers.length === 0) {
          return true;
        } else {
          alert("不明なエラーが発生しました。");
          return false;
        }
      }
      return false;
    }
  };

  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [initialSelectedUsers, setInitialSelectedUsers] = useState<UserType[]>([]);
  const [updateFlag, setUpdateFlag] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setUpdateFlag(!isUpdate());
  }, [selectedUsers, initialSelectedUsers]);

  return (
    <ProtectedRoute>
      <Divider>メンバー管理画面</Divider>
      <Divider>
        <SelectedUsersContext.Provider value={{ selectedUsers, setSelectedUsers }}>
          <Pulldown />
        </SelectedUsersContext.Provider>
      </Divider>
      <Divider>
        <SelectedUsersContext.Provider value={{ selectedUsers, setSelectedUsers }}>
          <Table />
        </SelectedUsersContext.Provider>
      </Divider>
      <Divider>
        <Link href="/calendar" >
          <Button >戻る</Button>
        </Link>
        <Button onClick={onClick} disabled={updateFlag}>登録</Button>
      </Divider>
    </ProtectedRoute>
  );
}