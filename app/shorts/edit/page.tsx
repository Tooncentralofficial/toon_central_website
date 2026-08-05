"use client";
import React from "react";
import ShortsForm from "../_components/ShortsForm";

function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const shortId = Array.isArray(searchParams?.shortId)
    ? searchParams.shortId[0]
    : searchParams?.shortId;

  return <ShortsForm mode="edit" shortUuid={shortId} />;
}

export default Page;
