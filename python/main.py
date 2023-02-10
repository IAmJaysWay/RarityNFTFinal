import math
from moralis import evm_api
import pandas as pd
from pandas import json_normalize
import json
import time
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
pd.options.mode.chained_assignment = None

api_key = "Get From moralis.io"

nftContract = "0x3110ef5f612208724ca51f5761a69081809f03b7" ##impostors genesis aliens
cursor = ""
df = pd.DataFrame()

firstParams = {
    "address": nftContract,
    "chain": "eth",
    "disable_total": False
}

result = evm_api.nft.get_contract_nfts(
    api_key=api_key,
    params=firstParams
)

totalNFTs = result["total"]
numOfReqs = math.ceil(totalNFTs/100)

print("fetching NFTs")
for x in range(numOfReqs):

    result = evm_api.nft.get_contract_nfts(
        api_key=api_key,
        params={
            "address": nftContract,
            "chain": "eth",
            "cursor": cursor
        }
    )

    cursor = result["cursor"]
    df2 = json_normalize(result["result"])

    if df.empty:
        df = df2
    else:
        df = pd.concat([df, df2])

    print(x + 1, "/", numOfReqs)
    time.sleep(0.21)


df.index = list(range(totalNFTs))
numTraitsList = []
traitsDf = pd.DataFrame()

print("Finding Unique Traits")
for z in range(totalNFTs):
    traitsForSingleNFT = json_normalize(json.loads(df.iloc[z]["metadata"])["attributes"])
    numOfTraitsSingleNFT = len(traitsForSingleNFT.index)

    numTraitsList.append(numOfTraitsSingleNFT)

    if traitsDf.empty:
        traitsDf = traitsForSingleNFT
    else:
        traitsDf = pd.concat([traitsDf, traitsForSingleNFT])

    print(z + 1, "/", totalNFTs)

allTraits = traitsDf["trait_type"].unique()
allTraitsWithCountsDf = pd.DataFrame(columns=['trait_type', 'counts'])
allTraitsWithCountsDf["trait_type"] = allTraits


for traitNum in range(len(allTraits)):
    tempTraitDf = traitsDf[traitsDf['trait_type'] == allTraits[traitNum]]
    traitCounts = tempTraitDf["value"].value_counts()
    traitNonExsist = pd.Series([totalNFTs - len(tempTraitDf.index)], index=["null"])
    traitCounts = pd.concat([traitCounts, traitNonExsist])
    traitCounts = 1 / (traitCounts / totalNFTs)
    allTraitsWithCountsDf.at[traitNum, "counts"] = traitCounts


numOfTraitsSeries = pd.Series(numTraitsList).value_counts()
numOfTraitsSeries = 1 / (numOfTraitsSeries / totalNFTs)
numOfTraitsDf = pd.DataFrame(data={'trait_type': ["Number Of Traits"], 'counts': [numOfTraitsSeries]})
allTraitsWithCountsDf = pd.concat([allTraitsWithCountsDf, numOfTraitsDf], ignore_index=True)

df['rarity_scores'] = pd.Series(dtype="object")
df['total_rarity_score'] = pd.Series(dtype="int")



print("Calculating Rarity")
for j in range(totalNFTs):

    traitsForSingleNFT = json_normalize(json.loads(df.iloc[j]["metadata"])["attributes"])
    numOfTraitsSingleNFT = len(traitsForSingleNFT.index)

    numOfTraitsSingleNFTDf = pd.DataFrame(data={'trait_type': ["Number Of Traits"], 'value': [numOfTraitsSingleNFT]})
    traitsForSingleNFT = pd.concat([traitsForSingleNFT, numOfTraitsSingleNFTDf], ignore_index=True)

    for trait in allTraits:
        if trait not in traitsForSingleNFT["trait_type"].values:
            missingTraitDf = pd.DataFrame(data={'trait_type': [trait], 'value': ['null']})
            traitsForSingleNFT = pd.concat([traitsForSingleNFT, missingTraitDf], ignore_index=True)

    traitsForSingleNFT["rarity_score"] = pd.Series(dtype="int")

    for row in range(len(traitsForSingleNFT)):
        indexOfTrait = allTraitsWithCountsDf.index[allTraitsWithCountsDf["trait_type"] == traitsForSingleNFT["trait_type"][row]].tolist()[0]
        rarityScore = allTraitsWithCountsDf["counts"][indexOfTrait][traitsForSingleNFT["value"][row]]
        traitsForSingleNFT["rarity_score"][row] = rarityScore

        if row == (len(traitsForSingleNFT) - 1):
            sumOfRaritys = traitsForSingleNFT["rarity_score"].sum()
            traitsInJson = traitsForSingleNFT.to_json(orient="records")
            df["rarity_scores"][j] = traitsInJson
            df["total_rarity_score"][j] = sumOfRaritys

    print(j + 1, "/", totalNFTs)

df = df.sort_values(by="total_rarity_score", ascending=False)
df.index = list(range(totalNFTs))

df.to_json(r'path to your backend folder/impostors.json', orient="index")
