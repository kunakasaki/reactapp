import { Background, LoadingText } from "./Styles";
import Spinner from "./assets/loading.gif";

const Loading = () => {
  return (
    <Background>
      <LoadingText>Loading...</LoadingText>
      <img src={Spinner} alt="Loading" width="15%" />
    </Background>
  );
};

export default Loading;
