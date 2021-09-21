import type { NextPage } from "next";
import { Wallet } from "../components/Wallet";

const Home: NextPage = () => {
  return (
    <div data-theme="light" className="bg-base-200">
      <Wallet />
    </div>
  );
};

export default Home;
