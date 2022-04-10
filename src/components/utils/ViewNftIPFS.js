import { toGatewayURL } from "nft.storage";

const VisualizeNft = async (metadata) => {
  var dataUrl = toGatewayURL(metadata);
  let { image } = await (await fetch(dataUrl)).json();
  return toGatewayURL(image).href
};

export default VisualizeNft;
