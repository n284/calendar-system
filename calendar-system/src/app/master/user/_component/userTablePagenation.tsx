import Pagination from "@mui/material/Pagination";
import Error from "@/components/error";
import { supabase } from "@/utilities/supabaseClient";

export default async function UserTablePagination() {
    const count: number | null = (await supabase
        .from("user_master")
        .select("*", {
            count: 'exact',
            head: true
        })).count;

    if (!count) {
        return (
            <Error statusCode={500} errorMessage={"データ数が取得できませんでした。"} />
        );
    }

    return (
        <Pagination count={count / 10} showFirstButton showLastButton />
    );
}