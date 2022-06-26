import jwt_decode from "jwt-decode";
const login = (body) => {
    return new Promise(async (resolve, reject) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };
            var loginCheck = await fetch("/login", requestOptions);
            resolve(loginCheck);
    });
};

const logout = (navigate) => {
    localStorage.removeItem("token");
    navigate("/");
};

const getCurrentUser = () => {
    let token = localStorage.getItem("token");
    var decoded = (token) ? jwt_decode(token) : false;
    return decoded;
};

const AuthService = {
    login,
    logout,
    getCurrentUser
}

export default AuthService;