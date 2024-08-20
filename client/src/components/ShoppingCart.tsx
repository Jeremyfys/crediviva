/* eslint-disable jsx-a11y/alt-text */
"use client";
import {
  Drawer,
  Flex,
  message,
  Image,
  InputNumber,
  Button,
  Divider,
} from "antd";
import { CartItem, Product, Props } from "@credi/models";
import { useContext, useState } from "react";
import useDebounce from "./../hooks/useDobounce";

import { DataContext } from "./DataCartProvider";
import { DeleteOutlined } from "@ant-design/icons";

export const ShoppingCart: React.FC<Props> = ({
  children,
  open,
  onClose,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { items, userId } = useContext(DataContext);

  const [quantity, setQuantity] = useState(1);

  const onChangeInputNumber = useDebounce(
    async (value: number, item: CartItem) => {
      setQuantity(value);
      if (value === 0) {
        await removeItemFromCart(item.productId);
      } else {
        await addItemToCart(item, value);
      }
    },
    500
  );

  const createOrder = async () => {
    let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (response.status === 500) {
      message.success("La orden no pudo ser creada");
      return;
    }

    if (response.status === 409) {
      const msg = await response.json();
      message.success(msg.message);
      return;
    }
    response = await response.json();

    onClose();
    message.success("Orden creada");
  };

  const addItemToCart = async (item: CartItem, quantity: number) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/add`,
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          item: {
            productId: item.productId,
            quantity: quantity,
            name: item.name,
            price: item.price,
            image: item.image,
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

    if (response.status === 400) {
      const msg = await response.json();
      message.success(msg.message);
      return;
    }

    if (response.status === 409) {
      const msg = await response.json();
      message.success(msg.message);
      return;
    }
    response = await response.json();

    message.success("Cantidad actualizada");
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

  return (
    <Drawer
      width={320}
      title="Carrito"
      onClose={onClose}
      open={open}
      footer={
        <Flex vertical>
          <Flex justify="start" gap={5}>
            <span>
              {items?.length} {items?.length === 1 ? "aritculo" : "artículos"}
            </span>
            <b className="ml-auto">Total:</b>
            <span>
              ${" "}
              {items?.reduce(
                (acc: number, item: CartItem) =>
                  acc + item.quantity * item.price,
                0
              )}
            </span>
          </Flex>
          <Divider style={{ marginTop: 10 }} />
          <Button onClick={() => createOrder()} type="primary" size="large" block>
            Realizar Orden
          </Button>
        </Flex>
      }
    >
      <>
        {items?.map((item: CartItem, index: number) => {
          return (
            <Flex justify="space-between" key={item.productId} className="mb-4">
              <Image
                width={70}
                height={70}
                src="error"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
              />

              <Flex
                vertical
                align="start"
                gap={10}
                style={{ paddingLeft: 10, width: "calc(100% - 80px)" }}
              >
                <b>{item.name}</b>
                <Flex gap={5} justify="center" align="center">
                  <InputNumber
                    key={`input-${item.productId}`}
                    min={0}
                    value={item.quantity}
                    defaultValue={item.quantity}
                    onChange={(e: number | null) =>
                      onChangeInputNumber(e!, item)
                    }
                  />
                  <span>X</span>
                  <span>${item.price}</span>
                </Flex>
              </Flex>

              <Button
                onClick={() => removeItemFromCart(item.productId)}
                style={{ alignSelf: "center" }}
                icon={<DeleteOutlined />}
                type="text"
              ></Button>
            </Flex>
          );
        })}
      </>
    </Drawer>
  );
};
