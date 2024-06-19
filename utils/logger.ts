"use strict";

// Define the circular replacer function
const circularReplacer = () => {
  const seen = new WeakSet();

  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

// Define the logger function
const logger = (filename: string, message: string, data: object = {}): void => {
  try {
    console.log(
      JSON.stringify(
        {
          filename: filename,
          message: message,
          data: data,
        },
        circularReplacer()
      )
    );
    return;
  } catch (error) {
    console.log("Logger Error", error);
    return;
  }
};

export default logger