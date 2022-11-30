import { Background, LoadingText } from "./Styles";
import Spinner from "./assets/loading-gif.gif";

const Loading = () => {
  return (
    <Background>
      <LoadingText>Loading...</LoadingText>
      <img src={Spinner} alt="Loading" width="7%" />
    </Background>
  );
};

export default Loading;
