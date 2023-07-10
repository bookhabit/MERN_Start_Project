import { atom } from "recoil";

export const validateModeAtom = atom<boolean>({
    key:"validate",
    default:false
})
