"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Flex, Spin } from "antd";
import "./dashboard.css";
import DasbaordHeader from "./header";
import { Props } from "../../models/props";
import DataCartProvider from "@credi/components/DataCartProvider";
import useLocalStorage from "@credi/hooks/useLocalStorage";
import { LoadingOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const App: React.FC<Props> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const userId = useLocalStorage();
  if (!userId)
    return (
      <Spin
        delay={500}
        wrapperClassName="loadingApp"
        fullscreen
        tip="Cargando"
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      />
    );

  return (
    <DataCartProvider userId={userId}>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DasbaordHeader userId={userId} />
        </Header>
        <Content style={{ padding: "20px 48px 0 48px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 380,
              marginBottom: 15,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </DataCartProvider>
  );
};

export default App;
