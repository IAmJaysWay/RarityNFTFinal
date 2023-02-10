import React from 'react'
import { Layout, Card, Tag } from "antd";
import { collections } from "../collections.js";
import etherscan from "../images/etherscan.png";
import opensea from "../images/opensea.png";
import eth from "../images/eth.png";
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Meta } = Card;

function Home() {

  const navigate = useNavigate();

  return (
    <>
      <Content className="mainContent">
      <div className="homeHeader">
          <div className="homeHeaderOne">FIND YOUR NFT'S RARITY</div>
          <div className="homeHeaderTwo">
            Browse collections and uncover the most unique tokens
          </div>
      </div>
      <div className="homeTrending">TRENDING COLLECTIONS</div>
      <div className="homeList">

        {collections?.map((e,i)=>{
          return (
            <Card
              key={i}
              hoverable
              style={{ width: 250 }}
              onClick={()=>navigate(`/collection/${e.contract}`)}
              cover={
                <img
                  alt={e.name}
                  src={e.img}
                />
              }
            >
              <Meta
                  title={e.name}
                  description={`${e.contract.slice(0,4)}...${e.contract.slice(38)}`}
              />
              <div className="cardBottom">
                  <Tag className="chainTag">
                  <img src={eth} alt="eth" style={{height:"12px"}} />
                  {e.chain}
                  </Tag>
                  <div className="web3Links">
                    <img src={opensea} alt="opensea" className="web3Link"/>
                    <img src={etherscan} alt="etherscan" className="web3Link"/>
                  </div>
                </div>
            </Card>
          )
        })}    
      </div>
      </Content>
    </>
  )
}

export default Home