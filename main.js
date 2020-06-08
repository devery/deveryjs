import DeveryERC721 from './devery/DeveryERC721';

const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

async function main(){
  let erc721 = new DeveryERC721({networkId:3});
  let block = await erc721.getProvider().getBlockNumber()
  erc721.getProvider().resetEventsBlock(0);
  console.log(getMethods(erc721.getProvider()));
  erc721.getTransferHistory((from,to,tokenId,event) => {
    // console.log('event',event)
    console.log('new event',from,to,tokenId.toNumber(),event);
  })
  let interval = setInterval(async () => {
    const newBlock = await erc721.getProvider().getBlockNumber();
    if( newBlock >= block){
      console.log('terminou')
      erc721.setTransferEventListener(null);
      clearInterval(interval);
    }
    else{
      console.log(newBlock,block)

    }
  },5000)
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
