/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useRouter } from "next/navigation";
import {
  List,
  Skeleton,
  Card,
  Grid,
  message,
  Flex,
  Typography,
  Button,
  Image,
  InputNumber,
  Result,
} from "antd";
import { fetcher } from "@credi/utils";
import { CartItem, Paginate, Product, Props } from "@credi/models";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import useDebounce from "./../hooks/useDobounce";

import { DataContext } from "./DataCartProvider";
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const cardStyle: React.CSSProperties = {
  width: "100%",
  marginBottom: "10px",
};

const skeletonImg: React.CSSProperties = {
  width: "200px",
  height: "200px",
};

export const ProductList: React.FC<Props> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm || screens.md;
  const router = useRouter();
  const { items, userId } = useContext(DataContext);

  const [keys, setKeys] = useState(new Map<string, CartItem>());

  const [pageIndex, setPageIndex] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const onChangeInputNumber = useDebounce(
    async (value: number, product: Product) => {
      console.log(value);
      
      setQuantity(value);
      if (value === 0) {
        await removeItemFromCart(product._id);
      } else {
        await addItemToCart(product, value);
      }
    },
    500
  );

  const onChangePagination = (page: number) => {
    setPageIndex(page);
  };

  const addItemToCart = async (
    product: Product,
    quantity: number,
    add = false
  ) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/add`,
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          item: {
            productId: product._id,
            quantity: quantity,
            name: product.name,
            price: product.price,
            image: product.image,
          },
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (response.status === 500) {
      message.success("El producto no pudo ser agregado");
      return;
    }

    if (response.status === 409) {
      message.success("El producto no tiene suficientes unidades");
      return;
    }

    response = await response.json();
    message.success(add ? "Producto agregado" : "Cantidad actualizada");
  };

  const removeItemFromCart = async (productId: string) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/remove?userId=${userId}&productId=${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    response = await response.json();
    message.success("Producto eliminado");
  };

  useEffect(() => {
    setKeys((_) =>
      items?.reduce((map, item) => {
        map.set(item.productId, item);
        return map;
      }, new Map())
    );
  }, [items]);

  const {
    data: paginate,
    error,
    isLoading,
  } = useSWR<Paginate<Product>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/list?limit=10&page=${pageIndex}`,
    fetcher
  );

  if (error)
    return (
      <Result
        status="500"
        title="500"
        subTitle="Ha ocurrido un problema, recargue la pagina"
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        }
      />
    );

  if (isLoading) {
    return (
      <List
        itemLayout="vertical"
        size="large"
        grid={{
          gutter: 10,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        dataSource={Array.from({ length: 10 }, (_, i) => i)}
        renderItem={(_, index) => (
          <List.Item>
            <Card
              key={index}
              style={cardStyle}
              styles={{ body: { padding: 0, overflow: "hidden" } }}
            >
              <Flex vertical justify="space-between" className="w-full">
                <Skeleton.Image active rootClassName="skel-image" />
                <Flex
                  vertical
                  align="flex-start"
                  justify="space-between"
                  style={{ padding: 16 }}
                >
                  <Skeleton.Input
                    active
                    size="large"
                    block
                    style={{ marginBottom: 10 }}
                  />
                  <Skeleton.Input active block style={{ marginBottom: 10 }} />
                  <Skeleton.Button active block style={{ marginBottom: 10 }} />
                </Flex>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    );
  }

  const { data, limit, page, total } = paginate!;

  return (
    <>
      {contextHolder}
      <List
        itemLayout="vertical"
        size="large"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        pagination={{
          onChange: onChangePagination,
          pageSize: limit,
          responsive: true,
          total: total,
          current: page,
          align: "center",
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={cardStyle}
              styles={{ body: { padding: 0, overflow: "hidden" } }}
            >
              <Flex vertical={isMobile} justify="space-between">
                <Image
                  className={isMobile ? "" : "w-[200px] h-[200px]"}
                  src="error"
                  fallback="data:image/png;base64,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"
                />
                <Flex
                  vertical
                  align="flex-end"
                  justify="space-between"
                  style={{
                    padding: 16,
                    width: isMobile ? "100%" : "calc(100% - 200px)",
                  }}
                >
                  <Typography>
                    <Title level={2} style={{ marginBottom: 5 }}>
                      {item.name}
                    </Title>
                    <Title style={{ marginTop: 0 }} level={3}>
                      ${item.price}{" "}
                      <span style={{ fontSize: 15 }}>
                        {item.quantity > 1
                          ? `(${item.quantity} disponibles)`
                          : "Agotado"}
                      </span>
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 10 }}
                    >
                      {item.description}
                    </Paragraph>
                  </Typography>

                  <Flex
                    className="w-full"
                    align="center"
                    justify="center"
                    gap={15}
                  >

                    {keys?.has(item._id) ? (
                      <>
                        <strong>En el carrito:</strong>
                        <InputNumber
                          min={0}
                          max={item.quantity}
                          value={keys?.get(item._id)?.quantity}
                          defaultValue={keys?.get(item._id)?.quantity}
                          onChange={(e: number | null) =>
                            onChangeInputNumber(e!, item)
                          }
                          disabled={item.quantity === 0}
                        />
                      </>
                    ) : (
                      <Button
                        disabled={
                          item.quantity === 0 ||
                          (keys?.get(item._id)?.quantity ?? 0) === item.quantity
                        }
                        type="primary"
                        onClick={() => addItemToCart(item, 1, true)}
                      >
                        {item.quantity === 0 ? "Agotado" : "Agregar"}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
