import { Location } from "./location";

export interface Service {
    id?: string;
    uid: string;
    title: string;
    description: string;
    category: string;
    services: string[];
    company: string;
    dateCreated: string;
    location: Location;
    distance?: string;
    postedBy?: string;
}

