
type BasicButtonProps = {
    text: string;
    click: () => any;
};
export default function BasicButton({ text, click }: BasicButtonProps) {
    return (
        <button
            onClick={click}
            className=" bg-primary hover:brightness-90 ring-primary focus:ring-2 ring-offset-black focus:ring-offset-[3px] rounded-md py-2 px-4 outline-none "
        >
            <p className="md:text-base text-xs">{text}</p>
        </button>
    );
}