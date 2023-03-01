// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios"

export const getList = (key, userId, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/${key}${search ? `title=${search}` : ""}${userId ? `userId=${userId}` : ''}`
            );
            const resdata = await res.json();
            resolve(resdata);
        } catch (err) {
            reject(err);
        }
    });
}
