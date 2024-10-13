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

export default function AlertDialogDemo({ handleMarkpaid }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
          variant="outline"
        >
          I&apos;ve transferred the amount
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure that You&apos;ve paid ?</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm that you have transferred the amount to the seller.
            If you have not transferred the amount, please do not click the button, else it will be considered as a fraud.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Goto Pay</AlertDialogCancel>
          <AlertDialogAction onClick={handleMarkpaid}>
            I Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
