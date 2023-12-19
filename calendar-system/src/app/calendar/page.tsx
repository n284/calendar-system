"use client"
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import Link from "next/link";
import { createContext, useEffect, useState } from "react";
import { getIntegerOfUsedTime } from "../../utilities/functions";
import { supabase } from "../../utilities/supsbaseClient";
import { SelectUserType } from "../../utilities/type";
import CalendarTable from "./calendar";
import ProtectedRoute from "../../utilities/protectedRoute";

export const CalendarTableContext = createContext({} as { usedTimes: number[][], selectUsers: SelectUserType[], startDateTime: Date | undefined, endDateTime: Date | undefined })

export default function homePage() {
  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: "923083694343-lef2m19k0bcn38p4p07pkh6tq32oe1so.apps.googleusercontent.com",
    redirect_uri: "http://localhost:3000/calendar/authorization",
    scope: "https://www.googleapis.com/auth/calendar",
    access_type: "offline",
  });

  const onClick = async () => {
    const refreshToken: string | null = localStorage.getItem("refresh_token");
    const accessToken: string | null = localStorage.getItem("access_token");
    if (!startDateTime || !endDateTime) {
      alert("時刻を設定してください");
      return;
    }
    if (refreshToken && accessToken) {
      const params = new URLSearchParams({
        timeMin: `${startDateTime.toLocaleDateString().replace(/\//g, "-")}T00:00:00Z`,
        timeMax: `${endDateTime.toLocaleDateString().replace(/\//g, "-")}T23:59:59Z`,
        maxResults: "250",
        singleEvents: "True",
        orderBy: "startTime"
      });
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
      const optinos = {
        method: "GET",
        headers: headers,
      }
      const results = [];
      for (let user of selectUsers) {
        results.push(await (await fetch(`https://www.googleapis.com/calendar/v3/calendars/${user.user.mailAddress}/events?${params}`, optinos)).json());
      }
      // await Promise.all(results);

      const calculateResults: number[][] = [];

      for (let result of results) {
        const { items } = result;
        const pipot: Date = new Date(startDateTime);
        let value: number = 0;
        const usedTimes: number[] = [];
        for (let event of items) {
          const targetStartDateTime: Date = new Date(event.start.dateTime);
          const targetEndDateTime: Date = new Date(event.end.dateTime);
          if (targetStartDateTime.toDateString() !== pipot.toDateString()) {
            usedTimes.push(value);
            value = 0;
            pipot.setDate(pipot.getDate() + 1);
          }
          value |= getIntegerOfUsedTime(targetStartDateTime, targetEndDateTime);
        }
        calculateResults.push(usedTimes);
      }
      setUsedTimes(calculateResults);

    } else {
      window.open(`https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`, "OAuth", "width=800, height=600, noopener");
    }
  };

  const [selectUsers, setSelectUsers] = useState<SelectUserType[]>([]);
  const [startDateTime, setStartDateTime] = useState<Date>();
  const [endDateTime, setEndDateTime] = useState<Date>();
  const [usedTimes, setUsedTimes] = useState<number[][]>([[]]);

  useEffect(() => {
    const fetchData = async () => {
      const { data }: PostgrestSingleResponse<SelectUserType[]> = await supabase.from("user_selections_table").select("id, user:user_id(userId:user_id, userName:user_name, companyName:company_name, mailAddress:mailaddress)");
      if (data) {
        setSelectUsers(data);
      } else {
        alert("不明なエラーが発生しました。");
      }
    };
    fetchData();
  }, [])

  return (
    <ProtectedRoute>
      <Divider>空き時間抽出システム</Divider>
      <Divider>
        <Divider>抽出日：
          <Input type="date" onChange={(e) => {
            const dateTime = new Date(e.target.value);
            if (dateTime > endDateTime!) {
              alert("開始時刻は終了時刻より前にしてください。");
              e.target.value = "";
            } else {
              setStartDateTime(dateTime);
            }
          }}></Input>
          <Input type="date" onChange={(e) => {
            const dateTime = new Date(e.target.value);
            if (dateTime < startDateTime!) {
              alert("終了時刻は開始時刻より後にしてください。");
              e.target.value = "";
            } else {
              setEndDateTime(dateTime)
            }
          }}></Input>
        </Divider>
        <Divider>
          <Button onClick={async () => {
            await supabase.auth.signOut();
          }}>ログアウト</Button>
          <Button onClick={onClick}>抽出</Button>
          <Button onClick={() => {
            localStorage.clear();
            alert(`アクセストークンをクリアしました`);
          }}>トークン確認</Button>
        </Divider>
        <Divider>
          <Link href="/calendar/member">
            <Button>メンバー管理</Button>
          </Link>
        </Divider>
      </Divider>
      <Divider>
        <CalendarTableContext.Provider value={{ usedTimes, selectUsers, startDateTime, endDateTime }}>
          <CalendarTable />
        </CalendarTableContext.Provider>
      </Divider >
    </ProtectedRoute>
  );
}