


var Devery = require('./dist/index')


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

async function main2(){
  const provider = new providers.JsonRpcProvider('http...')
  const event = (new Interface(StandardToken.abi)).events.Transfer
  const topics = [event.topics[0]]
  let logs = await provider.getLogs({
    fromBlock: 1,
    toBlock: 'latest',
    topics: topics
  })

  logs =  logs.map(log => event.parse(log.topics, log.data))
}
