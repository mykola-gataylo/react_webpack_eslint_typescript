import React from "react";
import "./app.scss";
import "../../public/img/react.png";

export const App = (): JSX.Element => {
  return (
    <>
      <div className="app">
        <h1>React</h1>
        <img src="./public/img/react.png" alt="react" />
      </div>
    </>
  );
};
