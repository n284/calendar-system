import { Divider } from "@mui/material";
import LinkButton from "./_component/linkButton";

export default function MasterPage() {
    return (
        <>
            <Divider>
                <LinkButton masterName={"user"} buttonName="ユーザー管理" />
                <LinkButton masterName={"company"} buttonName="会社管理" />
            </Divider>
        </>
    );
}