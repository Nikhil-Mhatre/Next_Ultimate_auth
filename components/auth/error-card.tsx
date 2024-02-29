import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import { Header } from "./header";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something Went Wrong!" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to Login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
