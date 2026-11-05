export default function TitleRowBlock({ title_row, left_right }: any) {
  const titleValue = title_row?.value || "";
  const isRightAligned = left_right?.value === "true";

  // Debug log to see the actual data structure
  console.log("TitleRowBlock title_row:", title_row);
  console.log(
    "TitleRowBlock titleValue:",
    titleValue,
    "Type:",
    typeof titleValue,
  );

  // Handle different possible formats
  let leftTitle = "";
  let rightTitle = "";

  let parsedValue = titleValue;

  // Try to parse if it's a JSON string
  if (typeof titleValue === "string" && titleValue.startsWith("[")) {
    try {
      parsedValue = JSON.parse(titleValue);
    } catch (e) {
      parsedValue = titleValue;
    }
  }

  if (Array.isArray(parsedValue)) {
    leftTitle = !parsedValue[1] && isRightAligned ? "" : parsedValue[0] || "";
    rightTitle =
      !parsedValue[1] && isRightAligned ? parsedValue[0] : parsedValue[1] || "";
  } else {
    // If it's a string, use it for left column
    leftTitle = parsedValue;
    rightTitle = parsedValue;
  }

  return (
    <div className="dt:grid dt:gap-x-[2rem] dt:grid-cols-8 text-[3.2rem] leading-[3.2rem] tracking-normal px-[2rem] dt:px-[4rem]">
      <div
        className={`col-span-6 col-start-2 dt:grid grid-cols-2 gap-[2rem] pt-[0] dt:pt-[5rem] dt:pb-[1rem]`}
      >
        {/* Left column - first item from array */}
        <div className="text-[2.4rem] dt:text-[6rem] leading-[2.4rem] dt:leading-[6rem] uppercase">
          {leftTitle}
        </div>

        {/* Right column - second item from array or conditional display */}
        <div className="text-[2.4rem] mt-[2rem] dt:mt-0 dt:text-[6rem] leading-[2.4rem] dt:leading-[6rem] uppercase">
          {Array.isArray(parsedValue)
            ? rightTitle
            : isRightAligned
              ? leftTitle
              : ""}
        </div>
      </div>
    </div>
  );
}
