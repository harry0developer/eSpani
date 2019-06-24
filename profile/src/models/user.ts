export interface User {
    id?: string;
    uid: string;
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    race: string;
    location: {
        address: string;
        geo: {
            lat: number;
            lng: number;
        }
    },
    settings: {
        hide_dob: boolean,
        hide_email: boolean,
        hide_phone: boolean,
    }
    dateCreated: string;
}

export interface Activity {
    uid: string;
    oid: string;
    sid: string;
    date: string;
}

export interface Settings {
    hide_dob: boolean,
    hide_email: boolean,
    hide_phone: boolean,
}