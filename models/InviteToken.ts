import { ObjectId } from "mongodb"

export interface InviteToken {
    id?: ObjectId
    expires: Date
    team: string
    invitedBy: string
    invited: string
}