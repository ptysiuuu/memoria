const RightOverlayContent = ({ isAnimated, setIsAnimated }) => {
  return (
    <div className="p-8 text-center font-primary">
      <h1 className="text-4xl font-bold text-white mb-4">
        Don't have an account?
      </h1>

      <h5 className="text-xl text-white">Start your journey in one click</h5>
      <div className="mt-16">
        <button
          className="py-3 px-6 bg-transparent hover:bg-stone-700 cursor-pointer rounded-full text-center text-white text-xl  ring-2 ring-white active:scale-110 transition-transform ease-in"
          onClick={(e) => {
            setIsAnimated(!isAnimated);
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default RightOverlayContent;