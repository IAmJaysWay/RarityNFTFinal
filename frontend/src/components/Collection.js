import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collections } from "../collections.js";
import { getImage } from "../helpers/GetImage.js";
import { Breadcrumb, Input, Layout, Card, Button, Modal } from "antd";
import axios from "axios";

const { Search } = Input;
const { Content } = Layout;

function Collection() {
  const [currentCollection, setCurrentCollection] = useState(null);
  const [allTokens, setAllTokens] = useState(null);
  const [displayedTokenList, setDisplayedTokenList] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const {contract} = useParams();

  function onSearch(id){

    const i = allTokens.findIndex((e) => e.token_id === id)

    setSelectedToken(i)
  }

  async function getCollection(contract){

    const res = await axios.get(`http://localhost:3001/nftCollection`, {
      params: { contract: contract },
    });

    const rarityArray = Object.values(res.data);
    setAllTokens(rarityArray);
    console.log(rarityArray);
    setDisplayedTokenList(rarityArray.slice(0, 12));

  }


  useEffect(()=>{

    try {
      const col = collections.find((e) => e.contract === contract);
      setCurrentCollection(col);
      getCollection(contract)
    } catch (e) {
      setCurrentCollection(null);
    }

  },[contract])

  return (
    <>
      <Modal
        width={1000}
        open={selectedToken || selectedToken === 0}
        footer={null}
        onCancel={() => {
          setSelectedToken(null);
        }}
      >
        {(selectedToken || selectedToken === 0) &&
        
        (
          <>
            <div className="modalTitle">
              {`Rank ${selectedToken + 1} (#${allTokens[selectedToken].token_id})`}
            </div>
            <div className="modalContent">
              <img
                alt="modalImg"
                className="modalImg"
                src={getImage(allTokens[selectedToken].metadata)}
              ></img>
              <div className="tableOfScores">
                <div className="totalScore">
                  {`Total Rarity Score ${allTokens[selectedToken].total_rarity_score.toFixed(2)}`}
                </div>
                <div className="tableRow">
                  <div className="tableRowOne" style={{fontWeight:"bold"}}>TRAIT</div>
                  <div className="tableRowTwo" style={{fontWeight:"bold"}}>VALUE</div>
                  <div className="tableRowThree" style={{fontWeight:"bold"}}>SCORE</div>
                </div>
                {JSON.parse(allTokens[selectedToken].rarity_scores).map(
                  (e, i) => {
                    return (
                      <>
                        <div className="tableRow" key={`${i}row`}>
                          <div className="tableRowOne">{e.trait_type}</div>
                          <div className="tableRowTwo">{e.value}</div>
                          <div className="tableRowThree">
                            {e.rarity_score.toFixed(2)}
                          </div>
                        </div>
                      </>
                    );
                  }
                )}
              </div>
            </div>
          </>


        )}
      </Modal>
      <Content className="mainContent">
        {currentCollection && (
          <>
          <div className="collectionHeader">
            <div>
            <Breadcrumb>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>Collections</Breadcrumb.Item>
                  <Breadcrumb.Item>{currentCollection.name}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="collectionPageName">
                  {currentCollection.name}
            </div>
            <div className="collectionPageContract">
                  {currentCollection.contract}
            </div>
            <Search
                  onSearch={onSearch}
                  placeholder="Token ID"
                  allowClear
                  enterButton="Search"
                  size="large"
              />
            </div>
            <img
                className="collectionPageLogo"
                src={currentCollection.img}
                alt="collectionLogo"
            />
          </div>
          <div className="homeTrending">RANKING</div>
          <div className="listOfNFTs">
            {displayedTokenList?.map((e,i)=>{
              return(
                <Card
                    onClick={() => setSelectedToken(i)}
                    key={i}
                    hoverable
                    style={{ width: 180 }}
                    cover={<img alt={e.token_id} src={getImage(e.metadata)} />}
                  >
                    <div className="rankAndId">
                      <div className="rankSingle">{`RANK ${i + 1}`}</div>
                      <div className="idSingle">{`#${e.token_id}`}</div>
                    </div>
                </Card>
              )
            })}    
          </div>
          <Button
              type="primary"
              className="loadMore"
              onClick={(e) => {
                setDisplayedTokenList(
                  allTokens.slice(0, displayedTokenList.length + 6)
                );
              }}
            >
              Load More
          </Button>
          </>
        )}
      </Content>
    </>
  );
}

export default Collection;
