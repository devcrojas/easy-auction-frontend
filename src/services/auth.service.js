import jwt_decode from "jwt-decode";
const login = (body) => {
    return new Promise(async (resolve, reject) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };
            var loginCheck = await fetch("/api/login", requestOptions);
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

const getUserByEmail = async (body) => {
    return new Promise(async (resolve, reject) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        var getUser = await fetch("/api/auth/resetPassword/getUserById", requestOptions);
        resolve(await getUser.json());
    });
}

const  getProducts = async () => {
    return new Promise (async (resolve, reject) =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
      let productsQuery = await fetch("/api/products", requestOptions);
      resolve(await productsQuery.json());
    })
  } 

const AuthService = {
    login,
    logout,
    getCurrentUser,
    getUserByEmail,
    getProducts
}

export default AuthService;