"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";
interface EditorProps {
    onChange: (value: string) => void;
    value: string;
};
//imported quill without server-side rendering, it runs on server and again on client side
export const Editor = ({
                           onChange,
                           value,
                       }: EditorProps) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
    const  toolbarOptions  = {
        toolbar: [
            [{ header: [1, 2, 3, 0] }],
            ["bold", "italic", "underline","strike"],
            [{ color: [] }, { background: [] }],
            [{ script:  "sub" }, { script:  "super" }],
            ["blockquote"],
            [{ list:  "ordered" }, { list:  "bullet" }],
            [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
            ["link", "image"],
        ],
    };
    return (
        <div className="bg-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={toolbarOptions}
            />
        </div>
    );
};