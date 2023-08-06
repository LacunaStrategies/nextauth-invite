import { InviteTokenRecord } from "@/types/InviteRecord"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ViewInvites() {

    // State Variables
    const [invites, setInvites] = useState<InviteTokenRecord[] | []>([])

    const acceptInvite = async (id: string) => {
        // Code to handle accepted invites
        // e.g., add team to user record in users collection and update invite record to indicate acceptance or delete
    }

    const rejectInvite = async (id: string) => {
        // Code to handle rejected invites
        // e.g., update invite record to indicate rejection or delete
    }

    // Set initial invite token records
    useEffect(() => {
        const initializeInvites = async () => {
            try {
                const resp = await fetch('/api/invites')
                const respJson = await resp.json()

                setInvites(respJson.inviteRecords)
            } catch (error) {
                alert('An unexpected error occurred')
                console.error(error)
            }

        }
        initializeInvites()
    }, [])

    return (
        <main className='relative flex min-h-screen flex-col items-center justify-center p-24 bg-slate-300'>
            <div className="bg-white p-20 shadow-black shadow-sm rounded-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    YOUR_LOGO
                </div>

                {/* Invites */}
                <div className="w-full max-w-sm">
                    <h1 className="font-bold text-3xl mb-6 text-center">View Invites</h1>

                    {
                        !invites.length ? (
                            <p>You have not received any new invites.</p>
                        ) : (
                            <div>
                                {invites.map((invite, i) => (
                                    <div
                                        className="bg-slate-300 p-8" 
                                        key={i}>
                                        <ul>
                                            <li>Team: {invite.invitedBy}</li>
                                            <li>Invited By: {invite.invitedBy}</li>
                                        </ul>

                                        <div className="flex items-center justify-center gap-4 mt-8">
                                            <button className="bg-cyan-500 text-white py-1.5 px-5 rounded-sm" onClick={() => acceptInvite(invite?.id)}>Accept</button>
                                            <button className="bg-slate-800 text-white py-1.5 px-5 rounded-sm" onClick={() => rejectInvite(invite?.id)}>Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }

                </div>
                <p className="text-center text-sm mt-4">
                    Return to the{' '}
                    <Link
                        href="/admin/dashboard"
                        className="inline-block text-cyan-600"
                    >Dashboard</Link>
                </p>
            </div>
        </main>
    )
}