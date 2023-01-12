import React, { useState } from "react";

import { OpenCvProvider, useOpenCv } from "opencv-react";

function MyComponent() {
  const { loaded, cv } = useOpenCv();
  console.log("loaded >> ", loaded);
  console.log("opencv details >> ", cv);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageStatus, setImageStatus] = useState(null);
  const [grayScale, setGrayScale] = useState(true);
  const [edge, setEdge] = useState(true);
  const [rotate, setRotate] = useState(true);
  const [erosion, setErosion] = useState(true);
  const [dilation, setDialation] = useState(true);
  const [src, setSrc] = useState(null);
  const [dst, setDst] = useState(null);

  const onImageChange = (e) => {
    console.log("e >> ", e.target.files[0]);
    let imgElement = document.getElementById("imageSrc");
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    setImageStatus(imgElement);
    //imgElement.onload = function () {
    //};
  };

  const onGrayScaleChange = () => {
    setGrayScale(!grayScale);
    if (grayScale) {
      let s = cv.imread(imageStatus);
      let d = new cv.Mat();
      setSrc(s);
      setDst(d);
      // You can try more different parameters
      console.log(src);
      console.log(dst);
      cv.cvtColor(s, d, cv.COLOR_RGBA2GRAY, 0);
      cv.imshow("canvasOutput", d);
      //setImageStatus(dst);
      //src.delete();
      //dst.delete();
    }
  };

  const onEdgeChange = () => {
    setEdge(!edge);
    if (edge) {
      if (dst === null) {
        src = cv.imread(imageStatus);
        dst = new cv.Mat();
      }
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
      // You can try more different parameters
      cv.Canny(src, dst, 50, 100, 3, false);
      cv.imshow("canvasOutput", dst);
      src.delete();
      dst.delete();
    }
  };

  const onRotateChange = () => {
    setRotate(!rotate);
    if (rotate) {
      if (dst === null) {
        src = cv.imread(imageStatus);
        dst = new cv.Mat();
      }
      let dsize = new cv.Size(src.rows, src.cols);
      let center = new cv.Point(src.cols / 2, src.rows / 2);
      // You can try more different parameters
      let M = cv.getRotationMatrix2D(center, 45, 1);
      cv.warpAffine(
        src,
        dst,
        M,
        dsize,
        cv.INTER_LINEAR,
        cv.BORDER_CONSTANT,
        new cv.Scalar()
      );
      cv.imshow("canvasOutput", dst);
      //src.delete();
      //dst.delete();
      M.delete();
    }
  };

  const onErosionChange = () => {
    setErosion(!erosion);
    if (erosion) {
      if (dst === null) {
        src = cv.imread(imageStatus);
        dst = new cv.Mat();
      }
      let M = cv.Mat.ones(5, 5, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.erode(
        src,
        dst,
        M,
        anchor,
        1,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue()
      );
      cv.imshow("canvasOutput", dst);
      src.delete();
      dst.delete();
      M.delete();
    }
  };

  const onDilationChange = () => {
    setDialation(!dilation);
    if (dilation) {
      if (dst === null) {
        src = cv.imread(imageStatus);
        dst = new cv.Mat();
      }
      let M = cv.Mat.ones(5, 5, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.dilate(
        src,
        dst,
        M,
        anchor,
        1,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue()
      );
      cv.imshow("canvasOutput", dst);
      src.delete();
      dst.delete();
      M.delete();
    }
  };

  if (loaded) {
    return (
      <>
        <div className="inputoutput">
          <div className="processing">
            Apply Grayscale
            <input
              type="checkbox"
              id="RGB2Gray"
              name="RGB2Gray"
              value="Grayscale Conversion"
              onChange={onGrayScaleChange}
            />
            <br></br>
            Detect Edges
            <input
              type="checkbox"
              id="edgeDetection"
              name="edgeDetection"
              value="Edge Detection"
              onChange={onEdgeChange}
            />
            <br></br>
            Rotate Image
            <input
              type="checkbox"
              id="rotateImage"
              name="rotateImage"
              value="Rotate Image"
              onChange={onRotateChange}
            />
            <br></br>
            Image Erosion
            <input
              type="checkbox"
              id="erosion"
              name="erosion"
              value="Image Erosion"
              onChange={onErosionChange}
            />
            <br></br>
            Image Dilation
            <input
              type="checkbox"
              id="dilation"
              name="dilation"
              value="Image Dilation"
              onChange={onDilationChange}
            />
          </div>
          <img id="imageSrc" alt="No Image" />
          <div className="caption">
            imageSrc{" "}
            <input
              type="file"
              id="fileInput"
              name="file"
              onChange={(e) => onImageChange(e)}
            />
          </div>
        </div>
        <div className="inputoutput">
          <canvas id="canvasOutput"></canvas>
          <div className="caption">canvasOutput</div>
        </div>
      </>
    );
    // return <p>opencv loaded</p>;
  } else {
    return (
      <div>
        <h1>Testing Opencv-React Lib </h1>
        {selectedImage && (
          <div>
            <img
              alt="not fount"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
              id="img"
            />
            <br />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
            <canvas id="output"></canvas>
          </div>
        )}
        <br />

        <br />
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>
    );
  }
}

const App = () => {
  const onLoaded = (cv) => {
    console.log("opencv loaded, cv");
  };

  return (
    <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js">
      <MyComponent />
    </OpenCvProvider>
  );
};

export default App;
