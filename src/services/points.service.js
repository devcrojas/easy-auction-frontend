const getPointsByUserId = async (id) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") },
    };
    var getPoints = await fetch("/api/points/"+id, requestOptions);
    resolve(await getPoints.json());
  });
}

const updatePointsByUserId = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") },
      body: JSON.stringify(body)
    };
    var getPoints = await fetch("/api/points/addPoints", requestOptions);
    resolve(await getPoints.json());
  });
}

const pointsService = {
  getPointsByUserId,
  updatePointsByUserId
}

export default pointsService;