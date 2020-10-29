import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) { // add props to get the onClick handler, active, and isRed
  console.log(title, active);
  return (
    <Card
      onClick={props.onClick} // catch the onClick handler passed by props here
      // conditionally render classes
      className={`infoBox 
                  ${active && "infoBox--selected"} 
                  ${isRed && "infoBox--red"}`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;