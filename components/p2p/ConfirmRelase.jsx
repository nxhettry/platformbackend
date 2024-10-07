import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  
  export default function ReleaseCrypto({ releaseCrypto }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
            variant="outline"
          >
            Release Crypto
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure that You&apos;ve received the payment ?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you have received the right amount.
              Else you may loose your crypto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>I&apos;ve not received</AlertDialogCancel>
            <AlertDialogAction onClick={releaseCrypto}>
              Payment Received
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  