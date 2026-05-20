



import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    // Si pas de token, on renvoie juste success false
    if (!token) {
        return res.json({ success: false });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id;
            next();
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false });
    }
}

export default authUser;