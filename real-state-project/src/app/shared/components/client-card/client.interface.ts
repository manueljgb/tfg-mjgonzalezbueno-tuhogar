export interface ClientInterface {
    id?: number,
    phone: string,
    name: string,
    mail: string,
    other_mails: string[],
    messages: string[],
    favs_appartments: number[],
    status?: string,
    notes?: string[],
    last_contact?: string,
    assigned_agent?: string,
    requests?: { apartment_id: number, type: string, date: string }[]
}
