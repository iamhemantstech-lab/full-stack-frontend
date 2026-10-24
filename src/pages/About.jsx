import React, { useState } from "react";

export default function About() {
  const [multiplier, setMultiplier] = useState(1);
  let productValue = multiplier * 5;

  const [count, setCount] = useState(1);
  let test = 1;

  const handleClick = () => {
    setCount(count + 1);
    test = test + 1;
    console.log("test", test);
  };

  // console.log("count = ", count);
  // console.log("test = ", test);

  return (
    <section
      style={{
        maxWidth: "680px",
        margin: "3rem auto",
        textAlign: "center",
        padding: "0 1rem",
      }}
    >
      <h2>About Us</h2>
      <div>Multiplicand: 5</div>
      <div>Multiplier: {multiplier}</div>
      <div>Product value: {productValue}</div>
      <div>
        <button onClick={handleClick}>click me</button>
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            setMultiplier(multiplier + 1);
            console.log("multiplier", multiplier);

            // to get updated value in log
            // const newVal = multiplier + 1;
            // setMultiplier(newVal);
            // console.log("multiplier", newVal);
          }}
        >
          Muliply with 5{" "}
        </button>
      </div>

      <p style={{ color: "var(--text)", marginTop: "1rem", lineHeight: "1.6" }}>
        Welcome to our modern React application! This section demonstrates route
        handling inside the App Layout with the Navbar enabled.
      </p>
    </section>
  );
}
