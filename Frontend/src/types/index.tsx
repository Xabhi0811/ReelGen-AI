 import type React from "react";
export interface uploadZoneProps{
    label: string;
    file:File| null;
    onClear: ()=> void;
    onChange:(e: React.ChangeEvent<HTMLInputElement>)=> void;
}