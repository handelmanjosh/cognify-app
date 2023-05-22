import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { sessionId, query, history, orgId, id } = req.body;
        const response = await fetch(`${process.env.SERVER_URL}/gpt`,
            {
                method: req.method,
                body: JSON.stringify({
                    sessionId,
                    query,
                    history,
                    orgId,
                    id
                }),
                headers: { "Content-Type": "application/json" }
            }
        );
        if (response.status == 200) {
            const json = await response.json();
            res.status(200).json(json);
        } else {
            res.status(500).json({ response: ["An error occurred. Please try again.", "text"] });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ response: ["Internal server error", "text"] });
    }
}