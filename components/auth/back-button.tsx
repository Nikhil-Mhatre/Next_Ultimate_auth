"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackBtnProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackBtnProps) => {
  return (
    <Button variant={"link"} className="font-normal w-full" size={"sm"} asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
