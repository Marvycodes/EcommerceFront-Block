import styled from "styled-components";
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
export default async function monto() {
  const response = await fetch(
    "http://localhost:5000/products/66cb1b18fdb73e262dfce33e"
  );
  const users = await response.json();
  console.log(users);
  return (
    <>
      <Title>name</Title>
      <Desc>description</Desc>
    </>
  );
}
