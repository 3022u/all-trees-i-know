
export default function TextBlock({ text, columns, col_start, center, text_color }: any) {
  const colSpan = parseInt(columns?.value || '1');
  const start = parseInt(col_start?.value || '1');
  const isCentered = center?.value === 'true';
  const textStyle = text_color?.value ? { color: text_color.value } : {};

  return (
    <div className="dt:grid dt:gap-x-[2rem] dt:grid-cols-8 text-[3.2rem] leading-[3.2rem] tracking-normal px-[2rem] dt:px-[4rem]">
    <div className={`col-span-${colSpan} col-start-${start} ${isCentered ? 'text-center' : ''}`}>
      <p className="whitespace-pre-wrap text-[1.8rem] leading-[1.8rem] dt:text-[3.2rem] dt:leading-[3.2rem]" style={textStyle}>{text?.value}</p>
    </div>
    {/* <div className={`col-span-6 col-start-2 grid grid-cols-2 gap-[2rem] pt-[5rem] pb-[1rem]`}>
      <Link href="/collections/all" prefetch={true} className="text-[6rem] leading-[6rem] uppercase">
       New in
       </Link>
       <Link href="/collections/all" prefetch={true} className="text-[6rem] leading-[6rem] uppercase">
       A + SOFIKA
       </Link>
    </div> */}
    </div>
  );
}