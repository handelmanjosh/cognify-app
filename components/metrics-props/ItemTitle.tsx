
type ItemTitleProps = {
    text: string;
};
export default function ItemTitle({ text }: ItemTitleProps) {
    return (
        <div className="flex flex-row justify-start items-center w-full h-[15%]">
            <strong className="text-sm md:text-lg lg:text-xl xl:text-2xl text-center"> {text} </strong>
        </div>
    );
}