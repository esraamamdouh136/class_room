import { sheet } from "./sheet";

export interface SheetsList {
    message?: string;
    next_token?: string;
    files?: sheet[]
}
