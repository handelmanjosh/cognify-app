import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { username, password } = req.body;
            //needs to be a fetch request to backend
            const response = await fetch(`${process.env.SERVER_URL!}/login`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            );
            const { sessionId } = await response.json();
            // res.setHeader('Set-Cookie',
            //     cookie.serialize("cognify-session", sessionId, {
            //         httpOnly: true,
            //         maxAge: 60 * 60 * 24 * 7, // 1 week
            //         path: '/',
            //         sameSite: 'strict',
            //         secure: process.env.NODE_ENV === 'production'
            //     })
            // );
            res.status(200).json(sessionId);

        } else {
            res.status(404).send("Internal server error");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }

}