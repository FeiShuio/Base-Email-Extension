const Sendcloud = require('sendcloud');
export default async function handler(req, res) {
    let { SENDER_NAME, API_USER, API_KEY, SENDER_ADDRESS, TO, SUBJECT, CONTENT } = req.body;
    let client = new Sendcloud(API_USER, API_KEY, SENDER_ADDRESS, SENDER_NAME);
    try {
        let data = await client.send(TO, SUBJECT, CONTENT);
        res.status(200).json({
            code: 0,
            ...data
        })
    } catch (error) {
        res.status(500).json({
            code: 1,
            ...error
        })
    }
}