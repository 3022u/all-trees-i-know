import Price from './price';

const Label = ({
  title,
  minAmount,
  handle,
  currencyCode,
  maxAmount,
  smells,
  position = 'bottom'
}: {
  title: string;
  minAmount: string;
  maxAmount?: string;
  smells?: { value: string };
  handle?: string;
  currencyCode: string;
  position?: 'bottom' | 'center';
}) => {
  // Parse the JSON string to get the actual array
  let smellsArray: string[] = [];
  if (smells && smells.value) {
    try {
      smellsArray = JSON.parse(smells.value);
    } catch (error) {
      console.error('Error parsing smells.value:', error);
    }
  }

  return (
    <div className="flex w-full items-start flex-col  text-[1rem] !tracking-widest dt:text-[1.4rem] uppercase leading-[1rem] dt:leading-[2.2rem] pt-[1rem] gap-x-[.8rem]">
        <h3 className="mr-[2rem]">{title}</h3>

        {smellsArray.length > 0 ? (
          <div className="flex flex-row gap-x-[.4rem]">
            {smellsArray.map((smell, index) => (
              <span key={index} className="text-[1rem] dt:text-[1.4rem] leading-[1rem] dt:leading-[2.2rem]">
                {smell}
                {/* Add comma on desktop, but not for the last item */}
                {index < smellsArray.length - 1 && <span className="inline">,</span>}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-row items-start justify-center mt-[1rem] dt:mt-[1.4rem]"><Price
          className=""
          amount={minAmount}
          currencyCode={currencyCode}
          hideCurrency={true}
        />
        {maxAmount && maxAmount !== minAmount ? (
          <span className="flex flex-row items-start justify-center"><span>/</span><Price
            className=""
            amount={maxAmount}
            currencyCode={currencyCode}
          /></span>
        ) : null}</div>
    </div>
  );
};

export default Label;
