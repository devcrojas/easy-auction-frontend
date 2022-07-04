const getUserByEmail = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    var getUser = await fetch("/getUserByEmail", requestOptions);
    resolve(await getUser.json());
  });
}

const validateToken = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    var getUser = await fetch("/auth/resetPassword/validateJWToken", requestOptions);
    resolve(await getUser.json());
  });
}

const applyResetPassword = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    var result = await fetch("/auth/resetPassword/Apply", requestOptions);
    resolve(await result.json());
  });
};

const userService = {
  getUserByEmail,
  validateToken,
  applyResetPassword
}

export default userService;