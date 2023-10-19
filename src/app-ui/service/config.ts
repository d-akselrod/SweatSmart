// @ts-ignore
import {API_URL_LOCAL, API_URL_DEPLOY, API_JWT} from '@env';

const isLocalDev = false;

export const API_URL = isLocalDev ? API_URL_LOCAL : API_URL_DEPLOY;
export const API_AUTH = `Bearer ${API_JWT}`;

export enum CRUD{
    create = "post",
    read = "get",
    update = "put",
    delete = "delete"
}

export const request = async (endpoint: string, method: CRUD, body?: any, responseAction? : Function, errorAction? : Function) => {
    return fetch(`http://192.168.1.10:5042/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_AUTH
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
        .then(responseAction ? data => responseAction(data) : () => {})
        .then(errorAction ? error => errorAction(error) : () => {});
}