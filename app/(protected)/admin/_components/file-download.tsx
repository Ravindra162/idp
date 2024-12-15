"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Download } from "lucide-react";

const FileDownload = ({
  secure_url,
  fileName,
}: {
  secure_url: string;
  fileName: string;
}) => {
  const downloadFile = async () => {
    try {
      console.log("------------------start---------");
      const response = await fetch(secure_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log(`-----------url:-`, url);
      console.log("------------------end---------");
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
  return (
    <Button variant={"ghost"} onClick={downloadFile}>
      <p className="capitalize font-bold">
        {fileName.split(".")[0].length > 40
          ? `${fileName.split(".")[0].slice(0, 37)}...`
          : fileName.split(".")[0]}
      </p>
      <Download className="w-5 h-5 m-4" />
    </Button>
  );
};

export default FileDownload;
