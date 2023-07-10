import { atom } from "recoil";
import { UserType } from "../Types/userType";

export const userAtom = atom<UserType | null>({
    key:"user",
    default:null
})
