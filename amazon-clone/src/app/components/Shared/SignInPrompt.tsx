import Link from "next/link";
import AmazonButton from "./AmazonButton";

export default function SignInPrompt(props: { message: string }) {
  return (
    <div className="font-ember min-h-screen w-full bg-[var(--amazonGrey)] flex justify-center p-4">
      <div className="bg-white shadow-md p-6 h-fit mt-6 max-w-md w-full flex flex-col gap-3">
        <div className="text-xl font-emberThin font-bold">Sign in required</div>
        <div className="text-sm">{props.message}</div>
        <Link href="/sign-in">
          <AmazonButton type="standard" text="Sign in" full onClick={() => {}} />
        </Link>
      </div>
    </div>
  );
}
