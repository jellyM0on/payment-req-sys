import { PageTitle, HStack, MaterialIcon } from "@freee_jp/vibes";
import { MdInfo } from "react-icons/md";

function NotFound() {
  return (
    <HStack>
      <MaterialIcon IconComponent={MdInfo} error></MaterialIcon>
      <PageTitle>Page Not Found</PageTitle>
    </HStack>
  );
}

function NotFoundContainer() {
  return <NotFound />;
}

export default NotFoundContainer;
