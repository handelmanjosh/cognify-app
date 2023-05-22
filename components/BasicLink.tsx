import Link from "next/link";

type BasicLinkProps = {
    text: string;
    target: string;
};
export default function BasicLink({ text, target }: BasicLinkProps) {
    return (
        <Link legacyBehavior href={target} passHref>
            <a className="font-bold md:text-base text-xxs hover:underline">
                {text}
            </a>
        </Link>

    );
}