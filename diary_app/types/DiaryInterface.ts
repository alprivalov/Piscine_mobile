export interface DiaryInterface {
    id?: string;
    email: string;
    date: string;
    title: string;
    feeling:
        | "emoticon-excited-outline"
        | "emoticon-happy-outline"
        | "emoticon-neutral-outline"
        | "emoticon-sad-outline"
        | "emoticon-cry-outline"
        | "emoticon-sick-outline",
    content: string,
}
