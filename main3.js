var Devery = require('./index')


function main(){
  let erc721 = new Devery.DeveryERC721({networkId:3});
  // console.log(erc721.getProvider())
  erc721.getTransferHistory(() => {

    console.log('new event');
  },60000)
  // setInterval(() => console.log(erc721.getProvider()),2000)
  console.log("works")
}

main();
