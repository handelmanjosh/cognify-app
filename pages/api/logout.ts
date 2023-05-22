import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { sessionId } = req.body;
            const response = fetch(`${process.env.SERVER_URL}/logout`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        sessionId,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            );
            // res.setHeader('Set-Cookie',
            //     cookie.serialize("cognify-session", '', {
            //         maxAge: -1,
            //         path: '/',
            //     }),
            // );
            res.status(200).json(response);
        } else {
            res.status(400).send("Internal server error");
        }
    } catch (e) {
        res.status(500).send("Internal server error");
    }
}