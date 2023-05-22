type SubmitButtonProps = {
    text: string;
};

export default function SubmitButton({ text }: SubmitButtonProps) {
    return (
        <button className="w-full rounded-xl font-bold transition-all hover:scale-102 bg-primary py-2 md:py-4" type="submit">
            {text}
        </button>
    );
}