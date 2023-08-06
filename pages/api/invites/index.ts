import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from '@/lib/mongodb/client'
import { InviteToken } from "@/models/InviteToken"
import { ObjectId } from "mongodb"
const database = process.env.MONGODB_DB

export default async function inviteHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req
    const session = await getServerSession(req, res, authOptions)

    // If no session exists, return an error response and appropriate message
    if (!session?.user?.email)
        return res.status(401).json({ ok: false, message: 'Valid session not found.' })

    switch (method) {
        case 'POST':
            const { email } = JSON.parse(req.body)

            try {
                // Connect to MongoDB
                const client = await clientPromise
                const db = client.db(database)

                // Set expiration date
                const expirationDate = new Date()
                expirationDate.setDate(expirationDate.getDate() + 7)

                // Insert a new document into the invite_tokens collection
                const insert = await db.collection<InviteToken>('invite_tokens').insertOne({
                    expires: expirationDate,
                    team: session.user.email,
                    invitedBy: session.user.email,
                    invited: email,
                })

                // If insert acknowledgement is false, something went wrong and we should return an error response
                if (!insert.acknowledged)
                    return res.status(500).json({ ok: false, message: 'An error occurred during insert', insert })

                res.status(200).json({ ok: true, message: 'Invite posted successfully', insert })

            } catch (error) {
                return res.status(500).json({ ok: false, message: 'An unexpected error occurred', error })
            }

            break

        case 'GET':

            try {
                // Connect to MongoDB
                const client = await clientPromise
                const db = client.db(database)

                // Query session user's invite records from the invite_tokens collection
                const inviteRecords = await db.collection<InviteToken>('invite_tokens').find({ invited: session.user.email }).toArray()

                res.status(200).json({ ok: true, message: 'Invite records queried successfully', inviteRecords })

            } catch (error) {
                return res.status(500).json({ ok: false, message: 'An unexpected error occurred', error })
            }

            break

        case 'DELETE':

            const { inviteIdBody } = req.body
            const { inviteIdQuery } = req.query

            console.log(inviteIdBody, inviteIdQuery)
            try {
                // Connect to MongoDB
                const client = await clientPromise
                const db = client.db(database)

                // Delete user's invite record based on supplied data
                // const deletedRecord = await db.collection('invite_tokens').deleteOne({ id: new ObjectId(inviteId), invited: session.user.email })
                // console.log(deletedRecord)

                console.log('Delete')
                res.status(200).json({ ok: true, message: 'Invite record removed' })

            } catch (error) {
                return res.status(500).json({ ok: false, message: 'An unexpected error occurred', error })
            }

            break

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}