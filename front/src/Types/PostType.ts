export type PostFormType = {
    title: string,
    description: string,
    photos: [string],
}

export type PostData = {
    _id :string;
    author : string;
    title: string;
    description:string;
    photos:[string]
    createdAt: Date
    updatedAt:Date
}