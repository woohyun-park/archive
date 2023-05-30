type Props = {
  children?: React.ReactNode;
};

export default function WrapFullScreen({ children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-[480px] bg-white fixed">
      {children}
    </div>
  );
}
