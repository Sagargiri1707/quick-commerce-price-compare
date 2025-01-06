import styled from "styled-components";

const Card = styled.div`
  width: 300px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Platform = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  height: 24px;
  width: 60px;
  background: white;
  padding: 4px;
  border-radius: 4px;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px 12px 0 0;
  overflow: hidden;

  img,
  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2ecc71;
  margin-bottom: 8px;
`;

const Weight = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const Time = styled.div`
  font-size: 14px;
  color: #666;
  font-style: italic;
`;

const ProductCard = ({
  product,
}: {
  product: {
    dlUrl: string;
    platform: string;
    imgUrl: string;
    name: string;
    display_name: string;
    price: number;
    weight?: string;
    time: string;
  };
}) => {
  const handleClick = () => {
    window.location.href = product.dlUrl;
  };
  const PlatformLogo = product.platform;
  return (
    <Card onClick={handleClick}>
      <Platform>
        <PlatformLogo />
      </Platform>
      <ProductImage>
        {typeof product.imgUrl === "string" ? (
          <img src={product.imgUrl} alt={product.name} />
        ) : (
          product.imgUrl
        )}
      </ProductImage>
      <Content>
        <ProductName>{product.display_name}</ProductName>
        <Price>₹{product.price}</Price>
        {product.weight && <Weight> {product.weight}</Weight>}
        <Time>Delivery in {product.time}</Time>
      </Content>
    </Card>
  );
};

export default ProductCard;
