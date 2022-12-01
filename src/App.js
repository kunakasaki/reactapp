import "./App.css";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Profile from "./components/Profile";
import Loading from "./components/Loading";
import Webcam from "react-webcam";
import axio from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useCallback, useRef, useState } from "react";
import { Buffer } from "buffer";

function App() {
  const AWS = require("aws-sdk");

  const [name, setName] = useState("");
  const webcamRef = useRef(null);
  const [account, setAccount] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Config aws rekognition with the secret keys included on .env.local
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESSKEYID,
    secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
    region: "us-east-1",
  });

  var rekognition = new AWS.Rekognition();

  //const ig_name = "clothmythbrasil"; //"francosebben87"; //"basement_the_shizzle"; //

  // config instagram API with the keys included on .env.local
  const ig_id = process.env.REACT_APP_IGID;
  const token = process.env.REACT_APP_TOKEN;

  //function that generates all the charts from a single object
  const makeCharts = (item) => {
    let profileName = item.name;
    let totalFollowers = item.followers_count;
    let totalPosts = item.media_count;

    //data for barchart
    let newBarData = [];
    let totalComments = 0;
    let totalLikes = 0;

    //data for piechart
    let totalPhoto = 0;
    let totalVideo = 0;
    let totalCarouselAlbum = 0;

    //data for linechart
    let lineChart = [];
    let monthlyPost = 1;
    let prvMonth = null;

    item.media.data.map((el, i) => {
      let curMonth = el.timestamp.slice(0, 7);

      if (curMonth === prvMonth) {
        monthlyPost += 1;
        lineChart.pop();
        lineChart.push({
          year: el.timestamp,
          monthlyPost: monthlyPost,
        });
      } else {
        lineChart.push({
          year: el.timestamp,
          monthlyPost: monthlyPost,
        });
        monthlyPost = 1;
      }

      //adding missing property
      let updatePictureData = {
        ...el,
      };

      if (!el.like_count) {
        updatePictureData["like_count"] = 0;
      }
      if (!el.comments_count) {
        updatePictureData["comments_count"] = 0;
      }
      if (i < 6) {
        newBarData.push(updatePictureData);
      }

      if (el.media_type === "IMAGE") {
        totalPhoto += 1;
      }

      if (el.media_type === "VIDEO") {
        totalVideo += 1;
      }
      if (el.media_type === "CAROUSEL_ALBUM") {
        totalCarouselAlbum += 1;
      }

      if (el.comments_count) {
        totalComments += el.comments_count;
      }
      if (el.like_count) {
        totalLikes += el.like_count;
      }

      prvMonth = curMonth;
      return null;
    });

    setAccount({
      profile: {
        profileName,
        totalFollowers,
        totalPosts,
        totalComments,
        totalLikes,
      },
      barChart: {
        name: profileName,
        barData: newBarData,
      },
      pieChart: { totalPhoto, totalVideo, totalCarouselAlbum },
      lineChart: lineChart,
    });
  };

  // function that retrieve json from a GET command call from instagram API
  function getAccount(nname) {
    const command = "https://graph.facebook.com/" + ig_id + "?fields=business_discovery.username(" + nname + "){name,username,website,followers_count,media_count,media.limit(999999){timestamp,comments_count,like_count,media_type,permalink,caption,media_url}}&access_token=" + token;

    console.log("nome achado :" + nname);

    axio
      .get(command)
      .then((response) => {
        // console.log(response.data.business_discovery);

        // uses the response to make the charts
        makeCharts(response.data.business_discovery);

        console.log("setando is open");
        setisLoading(!isLoading);
        setIsOpen(!isOpen);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // function that, using a GET call from instagram API, checks if the account entered on the input fields exists and procced with data indexing
  function checkAccountExist() {
    setisLoading(true);

    const commandCheck = "https://graph.facebook.com/" + ig_id + "?fields=business_discovery.username(" + name + ")&access_token=" + token;

    axio
      .get(commandCheck)
      .then((response) => {
        // console.log(response.data);
        console.log("existe");

        // call the function that index the metadata from picture and instagram account name/
        indexFace();
      })
      .catch((error) => {
        console.log(error);
        console.log("NAO existe");

        setisLoading(false);
        alert("This account doesn't exist or it is not a business/creator account.");
      });
  }

  // function that gets a picture from webcam and compare the face with a AWS collection faces previoulsy indexed
  const searchFace = useCallback(async () => {
    setisLoading(!isLoading);
    try {
    } catch (e) {
      console.error(e);
      //  setisLoading(!isLoading);
      throw new Error({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to index face",
      });
    }

    // take a picture and convert to usable buffer
    const imageSrc = webcamRef?.current?.getScreenshot();
    const base64Img = imageSrc.replace("data:image/jpeg;base64,", "");
    const imgBuffer = Buffer.from(base64Img, "base64");

    if (imageSrc) {
      var params = {
        CollectionId: "classmates",
        Image: {
          Bytes: imgBuffer,
        },
      };

      // function that runs the rekognition feature
      const res = await rekognition.searchFacesByImage(params, function (err, data) {
        if (err) {
          alert("There is no face");
          setisLoading(false);
          console.log(err, err.stack);
        } else {
          console.log(data);
          console.log("cuidadoooo::");

          //check if didnt find any face in the picture or too many
          if (data.FaceMatches.length === 0) {
            alert("Face not registered, no faces or too many faces found.");
            setisLoading(false);
          } else {
            console.log(data.FaceMatches[0].Face.ExternalImageId);
            console.log("chamando get face");

            //from the json, find the externalimgageid that contains the instagram account registered to the face found
            getAccount(data.FaceMatches[0].Face.ExternalImageId);
          }
        }
      });
    }
  }, [webcamRef]);

  // function that gets a picture from webcam and get face atrributes with a AWS rekogntion
  const detectFace = useCallback(async () => {
    setisLoading(!isLoading);
    try {
    } catch (e) {
      console.error(e);
      //  setisLoading(!isLoading);
      throw new Error({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to index face",
      });
    }

    // take a picture and convert to usable buffer
    const imageSrc = webcamRef?.current?.getScreenshot();
    const base64Img = imageSrc.replace("data:image/jpeg;base64,", "");
    const imgBuffer = Buffer.from(base64Img, "base64");

    if (imageSrc) {
      var params = {
        Image: {
          Bytes: imgBuffer,
        },
        Attributes: ["ALL"],
      };

      // function that runs the rekognition feature
      const res = await rekognition.detectFaces(params, function (err, data) {
        if (err) {
          // alert("There is no face");
          setisLoading(false);
          console.log(err, err.stack);
        } else {
          console.log(data);
          setisLoading(false);
        }
      });
    }
  }, [webcamRef]);

  //function that index the face from the picture taken from webcam
  const indexFace = useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    const base64Img = imageSrc.replace("data:image/jpeg;base64,", "");
    const imgBuffer = Buffer.from(base64Img, "base64");
    const imageId = name;

    console.log("nome setado :" + name);

    if (imageSrc) {
      var params = {
        CollectionId: "classmates",
        DetectionAttributes: [],
        ExternalImageId: imageId,
        Image: {
          Bytes: imgBuffer,
        },
      };

      // run the indexing function from aws rekognition and store the metadata in the desired collection
      rekognition.indexFaces(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
          //FaceRecords

          console.log(data);
          console.log(data.FaceRecords.length);
          setisLoading(false);

          //check if didnt find any face in the picture or too many
          if (data.FaceRecords.length === 1) {
            alert("Face successfully linked with @" + name + " account!");
            setName("");
          } else alert("There is no face or too many faces");
        }
      });
    }
  }, [webcamRef, name]);

  // function that toggle modal and loading pages
  function toggle() {
    setIsOpen(!isOpen);
    setisLoading(!isLoading);
  }

  return (
    <div>
      <h3>Instagram stats ver 0.1</h3>

      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <></>
      )}
      <div className="wrapper">
        <Webcam ref={webcamRef} audio={false} mirrored={true} screenshotFormat="image/jpeg" onClick={detectFace} />
      </div>

      <div className="wrapper">
        <Button onClick={searchFace}>Search Face</Button>
      </div>
      <div className="wrapper">
        @
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <Button disabled={!name} onClick={checkAccountExist}>
          Index Face
        </Button>
      </div>

      {isOpen ? (
        <Modal isOpen={isOpen}>
          <ModalHeader toggle={toggle}>{account.profile.profileName}</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-4 mb-5">
                <Profile person={account.profile} />
              </div>
              <div className="col-md-8 mb-5">
                <BarChart barData={account.barChart} />
              </div>
              <div className="col-md-4">
                <PieChart pieData={account.pieChart} name={account.profile.profileName} />
              </div>
              <div className="col-md-8">
                <LineChart lineChartData={account.lineChart} name={account.profile.profileName} />
              </div>
            </div>
          </ModalBody>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
