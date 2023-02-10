import React from 'react'
import { Link } from 'react-router-dom';
import { Layout } from "antd";
import logo from "../logo.png";
import {
  EditOutlined,
  HomeOutlined,
  StockOutlined,
  SettingOutlined,
  SearchOutlined,
  TwitterOutlined,
  GithubOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

function Sidebar() {
  return (
    <>
      <Sider className="sideBar">
        <img src={logo} alt="nftLogo" className="logo" />
        <hr />
        <Link to={"/"} className="menuItem" style={{ marginTop: "40px" }} >
          <HomeOutlined className="menuIcon" />
          Home
        </Link>
        <div className="menuItem">
          <EditOutlined className="menuIcon" />
          Blog
        </div>
        <div className="menuItem">
          <StockOutlined className="menuIcon" />
          Statistics
        </div>
        <div className="menuItem" style={{ marginBottom: "40px" }}>
          <SettingOutlined className="menuIcon" />
          Settings
        </div>
        <hr />
        <div className="collectionSearchField">
          <SearchOutlined />
          Search collections
        </div>
        <hr />
        <div className="socials">
          <TwitterOutlined />
          <GithubOutlined />
          <InstagramOutlined />
        </div>
        <p style={{ textAlign: "center" }}>Terms Of Service</p>
        <p style={{ textAlign: "center" }}>Privacy Policy</p>
        <p style={{ textAlign: "center" }}>Cookies</p>
      </Sider>
    </>
  )
}

export default Sidebar