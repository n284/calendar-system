"use client";
import NextError from "next/error";

type Props = {
    statusCode: number,
    errorMessage: string
}

export default function Error({ statusCode, errorMessage }: Props) {
    return (
        <NextError statusCode={statusCode} title={errorMessage} />
    );
}