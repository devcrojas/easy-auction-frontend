const offerApply = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") },
      body: JSON.stringify(body)
    };
    var result = await fetch("/api/offers/apply", requestOptions);
    resolve(await result.json());
  });
}

const auctionClose = async (body) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") },
      body: JSON.stringify(body)
    };
    var result = await fetch("/api/products/closeAuction", requestOptions);
    resolve(await result.json());
  });
}



const offersService = {
  offerApply,
  auctionClose
}

export default offersService;