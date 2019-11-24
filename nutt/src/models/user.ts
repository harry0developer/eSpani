export interface User {
    nickname: string;
    avatar: string;
    email?: string;
    cell?: string;
    password?: string;
    uid?: string;
    dateCreated: string;
    dob: string;
    gender: string;
    race: string;
    body: Body;
    userType: string;
    status: string;
    location: Location;
};

export interface Body {
    height: number;
    measure: string; // cm, m
    skinColor: string; // light, dark,
    type: string; // slim, slim-thick, bbw, thick
}

export interface Location {
    address: string;
    geo: {
        lat: number,
        lng: number;
    };
}