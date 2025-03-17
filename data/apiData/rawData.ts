
import { FakerData } from '../../helpers/fakerUtils';
import dotenv from 'dotenv';
dotenv.config({ path: './data/apiData/oauthData.env' });



export const oauthData = {
    grant_type: 'password',
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    username: process.env.SFUSERNAME!,
    password: process.env.SFPASSWORD!,
}
export const createLeaddata = {
    "FirstName": FakerData.getFirstName(),
    "LastName": FakerData.getLastName(),
    "Company": "Qeagle"
};

export const updateLeadData = {

    "FirstName": FakerData.getFirstName(),
    "Title": "SDET",
    "Street": FakerData.getStreet(),
    "City": FakerData.getCity(),
    "State": FakerData.getState(),
    "PostalCode": FakerData.getPinCode(),
    "Country": FakerData.getCountry(),
    "MobilePhone": FakerData.getMobileNumber(),
    "Email": FakerData.getEmail(),
    "Website": FakerData.getWebsite(),
}