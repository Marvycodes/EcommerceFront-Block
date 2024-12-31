"use client";
import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

export default async function NewProducts() {
  const response = await fetch("http://localhost:5000/products/");
  const users2 = await response.json();
  console.log(users2);
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid>
        {users2.map((product) => (
          <ProductBox {...product} />
        ))}
      </ProductsGrid>
    </Center>
  );
}
