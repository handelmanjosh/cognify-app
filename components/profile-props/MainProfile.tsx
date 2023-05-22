

type MainUserImageProps = {
    src: string;
};

export default function MainUserImage({ src }: MainUserImageProps) {
    return (
        <img
            className="rounded-full w-32 h-32"
            src={"/default.png"}
            alt="User profile photo"
        />
    );
}