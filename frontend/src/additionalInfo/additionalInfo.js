import React from "react";

export default function AdditionalInfo(props) {
  return (
    <>
      <label style={{ color: 'red', fontSize: '12px' }}>
        {props.text}
      </label>
    </>
  )
}