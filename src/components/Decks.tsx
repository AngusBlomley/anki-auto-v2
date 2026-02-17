// Decks Component, this is a child of the app component
// -----------------
// Sets the state of the storage to a specified Deck,
// which synced connected with supabase and local storage
// -------------------------------------------------------
// Operations include: Setting, updating and 


import { useState } from "react"

export default function Decks() {
    const [Decks, setDecks] = useState<Deck[]>([]);

    return (
        <>
            {Decks.map((Deck) => {
                
            })}
        </>
    )
}