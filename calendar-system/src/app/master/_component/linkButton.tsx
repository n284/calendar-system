import { Button } from "@mui/material";
import Link from "next/link";

type Props = {
    masterName: string,
    buttonName: string
};

export default function LinkButton({ masterName, buttonName }: Props) {
    return (
        <Link href={`http://localhost:3000/master/${masterName}`}>
            <Button>{buttonName}</Button>
        </Link>
    );
}