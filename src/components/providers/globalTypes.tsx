export interface CommonObject {
    [key: string | number] : any
}

export interface AbuseType {
    id: number;
    sort: "" | "question" | "answer";
}

export const initialAbuseType: AbuseType = {
    id: 0, 
    sort: ""
}