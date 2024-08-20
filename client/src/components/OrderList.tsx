/* eslint-disable jsx-a11y/alt-text */
"use client";
import {
  Drawer,
  Flex,
  Button,
  Spin,
  Result,
  Card,
  Modal,
  Typography,
  Tooltip,
} from "antd";
import { OrderWithMongoId, Props } from "@credi/models";
import { useContext, useState } from "react";

import { DataContext } from "./DataCartProvider";
import { EyeOutlined } from "@ant-design/icons";
import { fetcher } from "@credi/utils";
import useSWR from "swr";

const { Title, Paragraph } = Typography;

export const OrderList: React.FC<Props> = ({ children, open, onClose }) => {
  const { userId } = useContext(DataContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState<OrderWithMongoId | null>(null);

  const showOrder = (order: OrderWithMongoId) => {
    setOrder(order);
    setIsModalOpen(true);
  };

  const { data, error, isLoading } = useSWR<OrderWithMongoId[]>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/list/${userId}`,
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
    return <Spin fullscreen></Spin>;
  }

  return (
    <Drawer width={320} title="Ordenes" onClose={onClose} open={open}>
      <>
        {data?.map((order, index: number) => {
          return (
            <Flex justify="space-between" key={order._id} className="mb-4">
              <Card
                size="small"
                actions={[
                  <Tooltip
                    placement="bottom"
                    title="Ver detalle"
                    color="blue"
                    key="cyan21"
                  >
                    <EyeOutlined key="show" onClick={() => showOrder(order)} />
                  </Tooltip>,
                ]}
                className="w-full"
              >
                <Card.Meta
                  title={
                    <span>
                      Orden: <b>{order._id.slice(-4).toUpperCase()}</b>
                    </span>
                  }
                  description={
                    <>
                      <p>
                        Total: <b>${order.total}</b>
                      </p>
                      <p>
                        Articulos:{" "}
                        <b>
                          {order.items.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        </b>
                      </p>
                    </>
                  }
                />
              </Card>
            </Flex>
          );
        })}
        <Modal
          title={
            <Typography.Title level={1}>
              {" "}
              Orden: <b>{order?._id.slice(-4).toUpperCase()}</b>
            </Typography.Title>
          }
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <OkBtn />
            </>
          )}
        >
          <>
            <Typography>
              <Title level={2}>Productos</Title>

              <Paragraph>
                {order?.items.map((item, i) => {
                  return (
                    <p key={`p-${item.productId}`}>
                      <b>{item.name}:</b> {item.quantity} x ${item.price} = $
                      {item.quantity * item.price}
                    </p>
                  );
                  <br />;
                })}
                <p>
                  <b>Total: </b>${order?.total}
                </p>
              </Paragraph>
            </Typography>
          </>
        </Modal>
      </>
    </Drawer>
  );
};
