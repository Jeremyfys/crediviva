import { Button, Flex, Badge, Tooltip } from "antd";
import { ContainerOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Props } from "@credi/models";
import { useContext, useState } from "react";
import { DataContext } from "@credi/components/DataCartProvider";
import { ShoppingCart } from '../../components/ShoppingCart';
import { OrderList } from "@credi/components";

const DasbaordHeader: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [openO, setOpenO] = useState(false);

  const { items, userId } = useContext(DataContext);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Flex justify="start" align="center" className="w-full" gap={15}>
      <div className="title">Crediviva Prueba</div>
      <ShoppingCart open={open} onClose={onClose} />
      <OrderList open={openO} onClose={() => setOpenO(!openO)} />
      <Tooltip
        placement="bottom"
        title="Ordenes"
        color="blue"
        key="cyan1"
      >
          <Button
            className="ml-auto"
            onClick={() => setOpenO(!openO)}
            type="dashed"
            icon={<ContainerOutlined />}
          ></Button>

      </Tooltip>
      <Tooltip
        placement="bottom"
        title="Ir al carrito"
        color="green"
        key="cyan"
      >
        <Badge count={items?.length} showZero>
          <Button
            onClick={() => setOpen(!open)}
            type="dashed"
            icon={<ShoppingCartOutlined />}
          ></Button>
        </Badge>

      </Tooltip>

    </Flex>
  );
};

export default DasbaordHeader;
