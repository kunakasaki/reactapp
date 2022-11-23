import { Background, LoadingText } from "./Styles";
import Spinner from "./assets/Spinner.gif";

const Loading = () => {
  return (
    <Background>
      <LoadingText>Loading.</LoadingText>
      <img src={Spinner} alt="Loading" width="5%" />
    </Background>
  );
};

export default Loading;
