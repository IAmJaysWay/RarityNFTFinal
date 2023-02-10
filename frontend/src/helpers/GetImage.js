export const getImage = function(metadata){

    const data = JSON.parse(metadata);
    
    if(data.image.includes("ipfs://")){
        return(`https://ipfs.moralis.io:2053/ipfs/${data.image.replace("ipfs://", "")}`);
    }else{
        return(data.image)
    }
}